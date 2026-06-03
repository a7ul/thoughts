---
title: HTTPS certificate generation explained! Now setup HTTPS for local development environment (without sudo)
date: 2018-08-06
description: How to generate self-signed SSL certificates and set up HTTPS for local development without requiring sudo — covering the full CSR, Root CA, and domain cert flow.
---

Beginning in July 2018 with the release of Chrome 68, Chrome marks all HTTP sites as "not secure." On top of that, HTTPS is a search ranking factor. Developing locally with HTTPS prevents mixed-content issues and ensures parity with production environments.

This post explains how to set up HTTPS for local development without requiring administrator privileges.

## Overview

The process involves three steps:

1. **Certificate Signing Request (CSR)** — Generate a private/public key pair and a CSR containing domain information
2. **Root CA Certificate** — Create a self-signed Certificate Authority
3. **Domain Certificate** — Use the CA to sign the CSR and produce a domain-specific certificate

## Step 1: Generate a Root CA

A Certificate Authority (CA) is used to sign your development certificates. The browser trusts your CA, and therefore trusts anything signed by it.

```bash
# Generate CA private key
openssl genrsa -des3 -out rootCA.key 4096

# Generate root CA certificate (valid 3650 days = 10 years)
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 3650 -out rootCA.pem
```

When prompted, fill in the fields (Country, Organization, etc.) — these are only for your local CA and don't need to match anything real.

## Step 2: Generate a Server Certificate

```bash
# Generate server private key (no passphrase — important for servers)
openssl genrsa -out myserver.key 2048

# Generate a Certificate Signing Request
openssl req -new -key myserver.key -out myserver.csr
```

When filling in the CSR details, set `Common Name` to `localhost` (or your local domain).

## Step 3: Sign the Certificate with your CA

```bash
# Sign the CSR with the root CA — valid 500 days
openssl x509 -req \
  -in myserver.csr \
  -CA rootCA.pem \
  -CAkey rootCA.key \
  -CAcreateserial \
  -out myserver.crt \
  -days 500 \
  -sha256
```

Now you have:

- `rootCA.key` + `rootCA.pem` — your local CA (keep the key safe)
- `myserver.key` + `myserver.crt` — your server certificate and key

## Using Certificates in Node.js

```javascript
const https = require('https')
const fs = require('fs')

const options = {
  key: fs.readFileSync('myserver.key'),
  cert: fs.readFileSync('myserver.crt'),
}

https.createServer(options, (req, res) => {
  res.writeHead(200)
  res.end('Hello HTTPS World\n')
}).listen(443)
```

## Using with http-server (frontend dev)

```bash
npm install -g http-server
http-server -S -C myserver.crt -K myserver.key -p 8443
```

## Making your browser trust the CA

For your browser to accept these certificates without warnings, you need to import `rootCA.pem` as a trusted Certificate Authority.

**Chrome:**

1. Go to `Settings → Privacy and security → Security → Manage certificates`
2. Open the `Authorities` tab
3. Click `Import` and select `rootCA.pem`
4. Check "Trust this certificate for identifying websites"

**Firefox:**

1. Go to `Preferences → Privacy & Security → Certificates → View Certificates`
2. Open the `Authorities` tab
3. Click `Import` and select `rootCA.pem`
4. Check "Trust this CA to identify websites"

After importing, restart your browser and reload your local HTTPS site — no more security warnings.

> **Important:** These certificates are for development only. Self-signed certificates won't be trusted by your users' browsers in production. Use a proper CA (like Let's Encrypt) for production.
