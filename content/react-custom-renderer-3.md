---
title: "Part 3/3 - Beginners guide to Custom React Renderers. How to build your own renderer from scratch?"
date: 2019-01-08
originalUrl: https://blog.atulr.com/react-custom-renderer-3
description: Completing the custom React renderer by implementing the update phase  -  prepareUpdate, commitUpdate, commitTextUpdate, and all the mutation methods.
---

This is the final part of a 3-part series. Be sure to read [Part 1](/react-custom-renderer-1.html) and [Part 2](/react-custom-renderer-2.html) before proceeding.

This installment covers specifically **the update phase of the renderer**.

## Overview of Current Progress

At this stage, the renderer successfully renders React applications into the DOM tree. The existing `HostConfig` includes methods for initial rendering: `now`, `getRootHostContext`, `getChildHostContext`, `shouldSetTextContent`, `createTextInstance`, `createInstance`, `appendInitialChild`, `finalizeInitialChildren`, `prepareForCommit`, `resetAfterCommit`, `commitMount`, `appendChildToContainer`, and `supportsMutation`.

## Adding Interactivity

Let's add state management with a button that updates the current timestamp when clicked:

```javascript
import React from 'react'
import CustomRenderer from './renderer'

const Text = (props) => {
  return <p className={props.className}>{props.content}</p>
}

class App extends React.Component {
  state = {
    text: Date.now(),
  }
  onButtonClick = () => {
    this.setState(() => ({ text: Date.now() }))
  }
  render() {
    return (
      <div>
        <Text className="hello-class" content={this.state.text} />
        <span style="color:blue;" autofocus>
          World
        </span>
        <button onClick={this.onButtonClick}>Get current time</button>
      </div>
    )
  }
}

CustomRenderer.render(<App />, document.getElementById('root'))
```

Initially, clicking the button produces no visible effect. The renderer lacks handling for the `onClick` prop. Add event listener support to `createInstance`:

```javascript
createInstance: function(
    type,
    newProps,
    rootContainerInstance,
    currentHostContext,
    workInProgress
  ) {
    const element = document.createElement(type);
    element.className = newProps.className || "";
    element.style = newProps.style;
    if (newProps.onClick) {
      element.addEventListener("click", newProps.onClick);
    }
    return element;
  }
```

This triggers errors about missing `prepareUpdate` and `commitTextUpdate` methods  -  which we implement next.

## Key Update Methods

### prepareUpdate

```javascript
function prepareUpdate(
  instance,
  type,
  oldProps,
  newProps,
  rootContainerInstance,
  currentHostContext
) {
  return { /* update payload */ }
}
```

Called during the **render phase** to signal whether updates are needed. No DOM changes should occur here  -  those belong in the commit phase. Returns a payload object indicating what needs to change.

```javascript
prepareUpdate: function (
  instance,
  type,
  oldProps,
  newProps,
  rootContainerInstance,
  currentHostContext
) {
  return; // return nothing
}
```

### commitUpdate

```javascript
function commitUpdate(
  instance,
  updatePayload,
  type,
  oldProps,
  newProps,
  finishedWork
) {}
```

Executes all updates queued in `prepareUpdate`. This is where actual DOM manipulation occurs during the **commit phase**.

```javascript
commitUpdate: function(
    instance,
    updatePayload,
    type,
    oldProps,
    newProps,
    finishedWork
  ) {
    return; // return nothing
  }
```

### commitTextUpdate

```javascript
function commitTextUpdate(textInstance, oldText, newText) {
  /** perform dom update on textInstance **/
}
```

Performs DOM updates on text nodes:

```javascript
commitTextUpdate: function(textInstance, oldText, newText) {
    textInstance.nodeValue = newText;
}
```

After implementing `commitTextUpdate`, the button becomes functional and state updates are reflected in the UI.

## Edge Case Methods

### appendChild

Appends a new child element to the end of a parent. Triggered when conditionally rendered elements become visible:

```javascript
appendChild: function(parentInstance, child) {
    parentInstance.appendChild(child);
}
```

### insertBefore

Inserts a child before an existing sibling element:

```javascript
insertBefore: (parentInstance, child, beforeChild) => {
  parentInstance.insertBefore(child, beforeChild)
}
```

### removeChild

Removes a child element from its parent:

```javascript
removeChild: function(parentInstance, child) {
 parentInstance.removeChild(child);
}
```

### insertInContainerBefore

Inserts an element before another at the top-level component tree. Useful for Fragment components or multiple root elements:

```javascript
insertInContainerBefore: function(container, child, beforeChild) {
  container.insertBefore(child, beforeChild);
}
```

### removeChildFromContainer

Removes a top-level element from the root container:

```javascript
removeChildFromContainer: function(container, child) {
  container.removeChild(child);
}
```

### resetTextContent

Resets text content of an element. Leave as a no-op:

```javascript
resetTextContent: function(domElement) {

}
```

### shouldDeprioritizeSubtree

Enables performance optimization by deprioritizing rendering of hidden or offscreen subtrees:

```javascript
shouldDeprioritizeSubtree: function(type, nextProps) {
  return !!nextProps.hidden
}
```

## Complete HostConfig

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
    if (newProps.onClick) {
      element.addEventListener('click', newProps.onClick)
    }
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
  prepareUpdate: function (
    instance,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
    currentHostContext
  ) {
    return
  },
  commitUpdate: function (
    instance,
    updatePayload,
    type,
    oldProps,
    newProps,
    finishedWork
  ) {
    return
  },
  commitTextUpdate: function (textInstance, oldText, newText) {
    textInstance.nodeValue = newText
  },
  appendChild: function (parentInstance, child) {
    parentInstance.appendChild(child)
  },
  insertBefore: (parentInstance, child, beforeChild) => {
    parentInstance.insertBefore(child, beforeChild)
  },
  removeChild: function (parentInstance, child) {
    parentInstance.removeChild(child)
  },
  insertInContainerBefore: function (container, child, beforeChild) {
    container.insertBefore(child, beforeChild)
  },
  removeChildFromContainer: function (container, child) {
    container.removeChild(child)
  },
  resetTextContent: function (domElement) {},
  shouldDeprioritizeSubtree: function (type, nextProps) {
    return !!nextProps.hidden
  },
}
```

The complete source code is available on [GitHub](https://github.com/a7ul/blog-custom-renderer).
