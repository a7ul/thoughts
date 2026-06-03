---
title: "Part 2/3 - Beginners guide to Custom React Renderers. How to build your own renderer from scratch?"
date: 2018-10-22
description: Implementing all the HostConfig methods needed for the initial render phase of a custom React renderer.
---

This is Part 2 of a 3-part series. Be sure to read [Part 1](/react-custom-renderer-1.html) before proceeding.

This installment covers **the initial render phase of the renderer**. Part 3 will cover the update phase.

## HostConfig

Renderers must implement platform-specific functions within the **HostConfig**. The reconciler calls different functions during initial render versus update phases triggered by `setState`.

The example application we'll be rendering:

```javascript
const Text = (props) => {
  return <p className={props.className}>{props.content}</p>
}

const App = () => {
  return (
    <div>
      <Text className="hello-class" content="Hello" />
      <span style="color:blue;">World</span>
    </div>
  )
}
```

## Essential HostConfig Methods

### now()

Used by the reconciler to calculate the current time:

```javascript
now: Date.now,
```

### getRootHostContext(nextRootInstance)

Returns a context object passed to immediate children. The `nextRootInstance` is the root DOM node specified during render.

```javascript
getRootHostContext: function (nextRootInstance) {
  let rootContext = {}
  return rootContext
}
```

### getChildHostContext(parentContext, fiberType, rootInstance)

Provides access to parent context and enables passing context to immediate children.

```javascript
getChildHostContext: function (parentContext, fiberType, rootInstance) {
  let context = { type: fiberType }
  return context
}
```

### shouldSetTextContent(type, nextProps)

Returns a boolean determining whether text is created inside the host element or separately. When returning `true`, no separate text element is created and child traversal stops.

```javascript
shouldSetTextContent: function (type, nextProps) {
  return false
}
```

### createTextInstance(newText, rootContainerInstance, currentHostContext, workInProgress)

Creates an actual text node:

```javascript
createTextInstance: function(
  newText,
  rootContainerInstance,
  currentHostContext,
  workInProgress
) {
  return document.createTextNode(newText)
}
```

### createInstance(type, newProps, rootContainerInstance, currentHostContext, workInProgress)

Called on all host nodes except leaf text nodes. Creates the appropriate DOM element and handles props:

```javascript
createInstance: function(
  type,
  newProps,
  rootContainerInstance,
  currentHostContext,
  workInProgress
) {
  const element = document.createElement(type)
  element.className = newProps.className || ''
  element.style = newProps.style
  return element
}
```

### appendInitialChild(parent, child)

Attaches child DOM nodes to parents during initial render, called for each child of the current node:

```javascript
appendInitialChild: (parent, child) => {
  parent.appendChild(child)
}
```

### finalizeInitialChildren(instance, type, newProps, rootContainerInstance, currentHostContext)

Returns a boolean determining whether **commitMount** should be called for the element. Used for operations like autofocus that occur after rendering completes:

```javascript
finalizeInitialChildren: (
  instance,
  type,
  newProps,
  rootContainerInstance,
  currentHostContext
) => {
  return newProps.autofocus
}
```

### prepareForCommit(rootContainerInstance)

Called when the in-memory render tree is complete but before attachment to the actual DOM:

```javascript
prepareForCommit: function (rootContainerInstance) {}
```

### resetAfterCommit(rootContainerInstance)

Executes after the in-memory tree attaches to the root DOM element:

```javascript
resetAfterCommit: function (rootContainerInstance) {}
```

### appendChildToContainer(parent, child)

Attaches the in-memory tree to the root host div. Requires `supportsMutation: true`:

```javascript
appendChildToContainer: (parent, child) => {
  parent.appendChild(child)
},
supportsMutation: true,
```

### commitMount(domElement, type, newProps, fiberNode)

Called for elements where `finalizeInitialChildren` returned `true`, after all tree attachment completes. Primarily used for autofocus:

```javascript
commitMount: (domElement, type, newProps, fiberNode) => {
  domElement.focus()
}
```

## Complete HostConfig Implementation

```javascript
const HostConfig = {
  now: Date.now,
  getRootHostContext: function (nextRootInstance) {
    let rootContext = {}
    return rootContext
  },
  getChildHostContext: function (parentContext, fiberType, rootInstance) {
    let context = { type: fiberType }
    return context
  },
  shouldSetTextContent: function (type, nextProps) {
    return false
  },
  createTextInstance: function (
    newText,
    rootContainerInstance,
    currentHostContext,
    workInProgress
  ) {
    return document.createTextNode(newText)
  },
  createInstance: function (
    type,
    newProps,
    rootContainerInstance,
    currentHostContext,
    workInProgress
  ) {
    const element = document.createElement(type)
    element.className = newProps.className || ''
    element.style = newProps.style
    return element
  },
  appendInitialChild: (parent, child) => {
    parent.appendChild(child)
  },
  finalizeInitialChildren: (
    instance,
    type,
    newProps,
    rootContainerInstance,
    currentHostContext
  ) => {
    return newProps.autofocus
  },
  prepareForCommit: function (rootContainerInstance) {},
  resetAfterCommit: function (rootContainerInstance) {},
  commitMount: (domElement, type, newProps, fiberNode) => {
    domElement.focus()
  },
  appendChildToContainer: (parent, child) => {
    parent.appendChild(child)
  },
  supportsMutation: true,
}
```

With these implementations, a functional custom React renderer capable of rendering JSX to the DOM is achieved.

Continue to [Part 3/3](/react-custom-renderer-3.html) where we handle the update phase.

## References

- React DOM source code
- React Reconciler documentation
