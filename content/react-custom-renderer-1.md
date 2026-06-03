---
title: "Part 1/3 - Beginners guide to Custom React Renderers. How to build your own renderer from scratch?"
date: 2018-10-21
description: An introduction to React's architecture — Core, Reconciler, and Renderer — and the first steps toward building a custom renderer using react-reconciler.
---

This is a 3-part series. Prior familiarity with React APIs and JSX is recommended but not required.

- [React API documentation](https://reactjs.org/docs/react-api.html)
- [JSX in depth guide](https://reactjs.org/docs/jsx-in-depth.html)

## React Core, Reconciler and Renderer

The React codebase divides into three major components.

### React Core

"React core only includes the APIs necessary to define components." It contains top-level APIs such as:

- `React.createElement()`
- `React.createClass()`
- `React.Component`
- `React.Children`
- `React.PropTypes`

It excludes the diffing algorithm and platform-specific code.

### Renderer

"React was originally created for the DOM but it was later adapted to also support native platforms with React Native." Renderers manage how React component trees convert into platform-specific calls:

- React-Dom renders to DOM elements
- React Native renders to native platform views

### Reconciler

The reconciler implements the diffing algorithm determining which elements require updates during state changes. It's shared across multiple platform renderers.

**Stack Reconciler:** Powers React 15 and earlier — maintains an internal tree of component instances processed synchronously in a single pass.

**Fiber Reconciler:** Default since React 16:
- Interruptible work chunking
- Work prioritization and reuse
- Efficient main thread management
- Multiple element return support from `render()`
- Enhanced error boundary support

Additional resources:
- [Cartoon Intro to Fiber by Lin Clark](https://www.youtube.com/watch?v=ZCuYPiUIONs)
- [Time Slicing & Suspense by Dan Abramov](https://www.youtube.com/watch?v=nLF0n9SACd4)

## Components, Instances, Elements and Fiber

### Components

Two types exist for renderers:

**Host Components:** Platform-specific elements like `<div>` or `<View>` handling mounting, updates, and unmounting.

**Composite Components:** User-defined elements like `<MyButton>` behaving consistently across all renderers.

### Instances

"For components declared as a class, the instances are the in memory initialized version of the components." They store local state and react to lifecycle events. Functional components lack instances entirely.

### Elements

"An element is an immutable plain object describing a component instance or DOM node and its desired properties."

For a `Content` component like this:

```jsx
const Content = (props) => {
  return <p style={props.style}>{props.text}</p>
}
```

Used as: `<Content style="background:blue;" text="hello world" />`

The resulting element:

```json
{
  "type": "p",
  "props": {
    "style": "background:blue;",
    "children": "hello world"
  }
}
```

With composite components, types become function references requiring recursive resolution until all types become strings (DOM elements).

Further reading: [Dan Abramov's detailed explanation](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)

### Fiber

Introduced in Fiber Reconciler, "a fiber is a JavaScript object that contains information about a component, its input and output." Each instance has at most two associated fibers: current (rendered) and work-in-progress.

Fiber node structure:

```javascript
{
  child, stateNode, siblings, alternate, return, type, key
}
```

[Additional fiber details](https://giamir.com/what-is-react-fiber)

## Let's build a custom renderer

### Boilerplate Setup

Initialize a create-react-app project:

```bash
npx create-react-app renderer
cd renderer
```

Create directory structure:

```
.
├── README.md
├── package.json
├── node_modules
├── public
├── src
│   ├── index.js
│   └── renderer
│       └── index.js
└── yarn.lock
```

`src/index.js`:

```jsx
import React from 'react'
import ReactDOM from 'react-dom'

const Text = (props) => {
  return <p className={props.className}>{props.content}</p>
}

const App = () => {
  return (
    <div>
      <Text className="hello-class" content="Hello" />
      <span style={{ color: 'blue' }}>World</span>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
```

Run with `npm start` to verify at [http://localhost:3000/](http://localhost:3000/).

### Creating the Custom Renderer

Replace `ReactDOM` with a custom renderer in `src/index.js`:

```jsx
import React from 'react'
import CustomRenderer from './renderer'

const Text = (props) => {
  return <p className={props.className}>{props.content}</p>
}

const App = () => {
  return (
    <div>
      <Text className="hello-class" content="Hello" />
      <span style={{ color: 'blue' }}>World</span>
    </div>
  )
}

CustomRenderer.render(<App />, document.getElementById('root'))
```

Initial `src/renderer/index.js`:

```javascript
const CustomRenderer = {
  render(element, renderDom, callback) {
    // element: React element for App component
    // renderDom: Host root element for attachment
    // callback: Optional callback after render completion
    console.log('render called', element, renderDom, callback)
  },
}

module.exports = CustomRenderer
```

Running shows a blank screen but the console shows the render call.

### Understanding the Architecture

The React team exported an experimental **react-reconciler** npm package. All platform renderers require:

1. A platform-specific **hostConfig** implementation
2. The **react-reconciler** module itself

The reconciler calls platform-specific functions via the supplied hostConfig to perform DOM changes or view updates.

Install the package:

```bash
yarn add react-reconciler
```

Update `src/renderer/index.js`:

```javascript
const Reconciler = require('react-reconciler')

const HostConfig = {
  //TODO: Specify all required methods here
}

const reconcilerInstance = Reconciler(HostConfig)

const CustomRenderer = {
  render(element, renderDom, callback) {
    const isAsync = false // Disables async rendering
    const container = reconcilerInstance.createContainer(renderDom, isAsync)

    const parentComponent = null
    reconcilerInstance.updateContainer(
      element,
      container,
      parentComponent,
      callback
    )
  },
}

module.exports = CustomRenderer
```

### Process Explanation

1. Create reconciler instance with the hostConfig parameter
2. Call `reconcilerInstance.createContainer` to create the root fiber node corresponding to `renderDom`
3. Call `reconcilerInstance.updateContainer` to initiate reconciliation and rendering

The `isAsync` parameter controls fiber node mode. Currently all released renderers operate in synchronous mode.

Running `yarn start` will produce errors about unimplemented HostConfig methods — which we cover in Part 2.

---

Continue to [Part 2/3](/react-custom-renderer-2.html) where we implement all the initial render HostConfig methods.

## References

- [Building React From Scratch by Paul O Shannessy](https://www.youtube.com/watch?v=_MAD4Oly9yg)
- [React API Documentation](https://reactjs.org/docs/react-api.html)
- [React Components, Elements, and Instances](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)
- [What is React Fiber](https://giamir.com/what-is-react-fiber)
- [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)
- [Codebase Overview](https://reactjs.org/docs/codebase-overview.html)
