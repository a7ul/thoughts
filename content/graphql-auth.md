---
title: Deep dive on authentication, authorization and RBAC for GraphQL Servers
date: 2022-06-14
description: How to design a declarative, flexible, deny-first RBAC system for GraphQL servers using schema directives.
---

GraphQL is a powerful tool for building strongly typed, self-documenting applications. A key strength is that the server provides a single endpoint exposing all data in a graph structure that clients can request. However, this requires controlling who (authentication) can access and interact with what parts (authorization) of the exposed data.

This article designs a GraphQL security approach with three core characteristics:

1. **Declarative** — Access control rules are defined in the schema itself, making them easier to maintain and understand
2. **Flexible Role-Based Access Control** — Different user types access different graph parts based on their role
3. **Deny-First with Explicit Authorization** — Following least privilege principles, all access is denied unless explicitly authorized

## Authentication

Authentication determines if a user is logged in and establishes their identity. In GraphQL servers, requests flow through several layers:

- **Schema**: Parses GraphQL queries and validates them
- **Context**: Sets up an object passed to all resolvers; created fresh for each request
- **Resolvers**: Contains application business logic

Authentication can be implemented at different stages, though earlier implementation is preferable.

### Apollo Server Implementation

For standalone Apollo Server:

```javascript
import { ApolloServer } from 'apollo-server';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    const user = getUser(token);
    return { user };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```

### Apollo Server with Express

When using Apollo Server with Express, authentication can occur even earlier via middleware:

```javascript
import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import { expressjwt } from 'express-jwt';

async function startApolloServer(typeDefs, resolvers) {
  const app = express();

  app.use(
    expressjwt({
      secret: 'jwt-secret',
      credentialsRequired: false,
      algorithms: ['HS256'],
    })
  );

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      user: req.auth,
    }),
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 3000 }, () =>
    console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
  );
}

await startApolloServer(typeDefs, resolvers);
```

## Authorization

Authorization determines what an authenticated user can access or see.

### Basic All-or-Nothing Approach

For initial development stages, a basic approach blocks unauthorized users from executing any queries:

```javascript
context: ({ req }) => {
  const user = getUser(req);

  if (!user) {
    throw new AuthenticationError('you must be logged in');
  }

  if (!user.roles.includes('admin')) {
    throw new ForbiddenError('you must be an admin');
  }

  return { user };
};
```

### Role-Based Access Control (RBAC)

As applications grow, users with different roles need different access levels. RBAC introduces **roles** and **permissions** concepts.

**Roles** are identifiers assigned to user groups. JWTs can include roles in their payload:

```json
{
  "username": "hawkeye",
  "type": "employee",
  "roles": ["employee", "roles-editor"],
  "iat": 1654104898,
  "exp": 1656696898
}
```

**Permissions** are identifiers for data groups. Fields are annotated with an `@auth` directive specifying required permissions:

```graphql
directive @auth(permissions: [String!]) on FIELD_DEFINITION

type Query {
  customers: [Customer] @auth(permissions: ["customer:read"])
  me: Customer @auth(permissions: ["self:customer"])
}

type Mutation {
  login(username: String!): AccessToken!
  updateCustomer(customerId: ID!, name: String): Customer
    @auth(permissions: ["customer:write"])
  updateEmployeeRole(employeeId: ID!, role: String): Boolean
    @auth(permissions: ["iam:write"])
}

type AccessToken {
  token: String
}

type Customer {
  id: ID
  username: String
  internalNote: String @auth(permissions: ["notes:read"])
}
```

Roles map to permissions:

```json
{
  "anonymous": { "permissions": [] },
  "customer": { "permissions": ["self:customer"] },
  "employee": { "permissions": ["customer:read", "customer:write", "notes:read"] },
  "employee-readonly": { "permissions": ["customer:read", "notes:read"] },
  "roles-editor": { "permissions": ["iam:write"] },
  "profile-service": { "permissions": ["customer:read"] }
}
```

## Field-Level Authorization Implementation

The `@auth` directive is a GraphQL schema directive that decorates parts of the schema with custom configuration. To implement it:

1. Parse the schema and walk through each field
2. For fields with `@auth` directives, replace the resolver with a custom one
3. The custom resolver checks if the user has required permissions, then calls the original resolver or throws an error

**Installation:**

```bash
npm install @graphql-tools/schema @graphql-tools/utils
```

**src/graphql/directives.js:**

```javascript
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';

export function getAuthorizedSchema(schema) {
  const authorizedSchema = mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const fieldAuthDirective = getDirective(schema, fieldConfig, 'auth')?.[0];

      if (fieldAuthDirective) {
        const originalResolver = fieldConfig.resolve ?? defaultFieldResolver;
        fieldConfig.resolve = (source, args, context, info) => {
          const user = context.user;
          const fieldPermissions = fieldAuthDirective.permissions;
          if (!isAuthorized(fieldPermissions, user)) {
            throw new ForbiddenError('Unauthorized');
          }
          return originalResolver(source, args, context, info);
        };
      }
      return fieldConfig;
    },
  });
  return authorizedSchema;
}

function isAuthorized(fieldPermissions, user) {
  const userRoles = user?.roles ?? [];
  const userPermissions = new Set();
  userRoles.forEach((roleKey) => {
    const role = RolePermissions[roleKey] ?? RolePermissions.anonymous;
    role.permissions?.forEach((permission) => userPermissions.add(permission));
  });

  for (const permission of fieldPermissions) {
    if (userPermissions.has(permission)) {
      return true;
    }
  }
  return false;
}
```

**Using the schema:**

```javascript
async function startApolloServer(typeDefs, resolvers) {
  let schema = makeExecutableSchema({ typeDefs, resolvers });
  schema = getAuthorizedSchema(schema);

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      user: req.auth,
    }),
  });

  await server.start();
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}

await startApolloServer(typeDefs, resolvers);
```

## Type-Level Authorization

Field-level authorization alone is insufficient because GraphQL's tree structure allows accessing the same information via multiple paths.

Consider this schema:

```graphql
type Query {
  customers: [Customer] @auth(permissions: ["customer:read"])
  me: Customer @auth(permissions: ["self:customer"])
  getCustomerInvoices(customerId: ID!): [Invoice]
    @auth(permissions: ["invoice:read"])
}

type Customer {
  id: ID
  username: String
  name: String
  invoices: [Invoice]
  internalNote: String @auth(permissions: ["notes:read"])
}

type Invoice {
  id: ID!
  customerId: ID!
  amount: Float!
}
```

A user with only `customer:read` could access invoices through the `Customer.invoices` field, bypassing the `invoice:read` requirement.

The solution is adding `@auth` at the type level:

```graphql
directive @auth(permissions: [String!]) on FIELD_DEFINITION | OBJECT

type Invoice @auth(permissions: ["invoice:read"]) {
  id: ID!
  customerId: ID!
  amount: Float!
}
```

**Implementation:**

```javascript
function gatherTypePermissions(schema) {
  const typePermissionMapping = new Map();
  mapSchema(schema, {
    [MapperKind.OBJECT_TYPE]: (typeConfig) => {
      const typeAuthDirective = getDirective(schema, typeConfig, 'auth')?.[0];
      const typeLevelPermissions = typeAuthDirective?.permissions ?? [];
      typePermissionMapping.set(typeConfig.name, typeLevelPermissions);
      return typeConfig;
    },
  });
  return typePermissionMapping;
}

export function getAuthorizedSchema(schema) {
  const typePermissionMapping = gatherTypePermissions(schema);

  const authorizedSchema = mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
      const fieldAuthDirective = getDirective(schema, fieldConfig, "auth")?.[0];
      const fieldPermissions = fieldAuthDirective?.permissions ?? [];
      const typePermissions = typePermissionMapping.get(typeName) ?? [];

      if (fieldPermissions.length > 0 || typePermissions.length > 0) {
        const originalResolver = fieldConfig.resolve ?? defaultFieldResolver;
        fieldConfig.resolve = (source, args, context, info) => {
          const user = context.user;
          if (!isAuthorized(fieldPermissions, typePermissions, user)) {
            throw new ForbiddenError("Unauthorized");
          }
          return originalResolver(source, args, context, info);
        };
      }
      return fieldConfig;
    },
  });
  return authorizedSchema;
}

function isAuthorized(fieldPermissions, typePermissions, user) {
  const userRoles = user?.roles ?? [];
  const userPermissions = new Set();
  userRoles.forEach((roleKey) => {
    const role = RolePermissions[roleKey] ?? RolePermissions.anonymous;
    role.permissions?.forEach((permission) => userPermissions.add(permission));
  });

  for (const permission of fieldPermissions) {
    if (userPermissions.has(permission)) return true;
  }

  if (fieldPermissions.length === 0) {
    for (const typePermission of typePermissions) {
      if (userPermissions.has(typePermission)) return true;
    }
  }
  return false;
}
```

Type-level `@auth` provides defaults, but field-level directives override them:

```graphql
type Invoice @auth(permissions: ["invoice:read"]) {
  id: ID!
  customerId: ID!
  amount: Float!
  signedBy: Admin @auth(permissions: ["admin:read"])
}
```

## Deny-First and Explicit Authorization

Current approaches treat fields without `@auth` as publicly accessible. Following the principle of least privilege, access should be denied by default and only opened via explicit `@auth` directives.

**Without deny-first** ❌

```graphql
type Query {
  # Accidentally missing @auth; now publicly exposed
  customers: [Customer]
  health: String
  me: Customer @auth(permissions: ["self:customer"])
}
```

**With deny-first** ✅

```graphql
type Query {
  # Missing @auth; denied by default; prevents accidental leak
  customers: [Customer]
  # Explicitly marked public via self:anyone
  health: String @auth(permissions: ["self:anyone"])
  me: Customer @auth(permissions: ["self:customer"])
}
```

**Implementation:**

```javascript
function shouldDenyFieldByDefault(fieldPermissions, typePermissions, fieldName, typeName) {
  if (fieldName.startsWith("_") || typeName.startsWith("_")) {
    return false;
  }
  return fieldPermissions.length === 0 && typePermissions.length === 0;
}

export function getAuthorizedSchema(schema) {
  const typePermissionMapping = gatherTypePermissions(schema);

  const authorizedSchema = mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
      const fieldAuthDirective = getDirective(schema, fieldConfig, "auth")?.[0];
      const fieldPermissions = fieldAuthDirective?.permissions ?? [];
      const typePermissions = typePermissionMapping.get(typeName) ?? [];

      if (shouldDenyFieldByDefault(fieldPermissions, typePermissions, fieldName, typeName)) {
        fieldConfig.resolve = () => {
          throw new ForbiddenError(
            `No access control specified for ${typeName}.${fieldName}. Deny by default`
          );
        };
        return fieldConfig;
      }

      if (fieldPermissions.length > 0 || typePermissions.length > 0) {
        const originalResolver = fieldConfig.resolve ?? defaultFieldResolver;
        fieldConfig.resolve = (source, args, context, info) => {
          const user = context.user;
          if (!isAuthorized(fieldPermissions, typePermissions, user)) {
            throw new ForbiddenError("Unauthorized");
          }
          return originalResolver(source, args, context, info);
        };
      }
      return fieldConfig;
    },
  });
  return authorizedSchema;
}

function isAuthorized(fieldPermissions, typePermissions, user) {
  const userRoles = user?.roles ?? [];
  const userPermissions = new Set(["self:anyone"]);
  userRoles.forEach((roleKey) => {
    const role = RolePermissions[roleKey] ?? RolePermissions.anonymous;
    role.permissions?.forEach((permission) => userPermissions.add(permission));
  });

  for (const permission of fieldPermissions) {
    if (userPermissions.has(permission)) return true;
  }

  if (fieldPermissions.length === 0) {
    for (const typePermission of typePermissions) {
      if (userPermissions.has(typePermission)) return true;
    }
  }
  return false;
}
```

**Important caveats:**

The deny-by-default approach applies to all types and fields. Returned types must also have explicit permissions:

```graphql
type Mutation {
  login(username: String!): AccessToken! @auth(permissions: ["self:anyone"])
}

type AccessToken @auth(permissions: ["self:anyone"]) {
  token: String
}
```

## Summary

The `@auth` schema directive enables secure GraphQL schema design with these characteristics:

- **Declarative** — The schema documents authorization rules and serves as the source of truth
- **Flexible** — Role + type/field-level permissions enable RBAC without sacrificing developer experience
- **Deny-first** — Follows least privilege by denying unauthorized access, preventing accidental exposure

Complete working code is available at the [blog-graphql-auth-example](https://github.com/a7ul/blog-graphql-auth-example) repository under tags: `field-auth`, `type-auth`, and `deny-by-default`.

## References

- [Apollo Server Security Documentation](https://www.apollographql.com/docs/apollo-server/security/authentication/)
- [Apollo Server Directives](https://www.apollographql.com/docs/apollo-server/schema/creating-directives)
