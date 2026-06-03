---
title: Using React hooks for functional components with perfect fallback for class components
date: 2019-06-12
description: How to write logic once as a React hook and expose it to class components via an HOC wrapper, without duplicating code.
---

This is a brief post on a pattern I recently needed. I had to abstract some functionality for use across multiple React components and chose to implement it using React hooks. However, the codebase contained many legacy class components requiring the same functionality, presenting a dilemma:

1. Rewrite all components to functional components — not ideal
2. Duplicate logic in both hooks and HOC formats — against DRY principles

The solution: write the logic as a hook and wrap it in an HOC for class component compatibility.

## Example Implementation

**Hook for functional components:**

```javascript
import React, { useState } from 'react'

export const useCountry = () => {
  const [country] = useState('IN')
  return country
}
```

**HOC for class components:**

```javascript
import React, { useState } from 'react'

export const useCountry = () => {
  const [country] = useState('IN')
  return country
}

export const withCountry = (Component) => {
  return (props) => {
    const country = useCountry()
    return <Component {...props} country={country} />
  }
}
```

## Usage

**Functional component:**

```javascript
const MyComponent = (props) => {
  const country = useCountry()
  return (
    <div>
      <div> Hi, I am from </div>
      <div>{country}</div>
    </div>
  )
}
export default MyComponent
```

**Class component:**

```javascript
class MyComponent extends React.Component {
  render() {
    const { country } = this.props
    return (
      <div>
        <div> Hi, I am from </div>
        <div>{country}</div>
      </div>
    )
  }
}

export default withCountry(MyComponent)
```

This technique enables using the same hook with class components through an HOC pattern, maintaining code consistency across mixed component architectures.
