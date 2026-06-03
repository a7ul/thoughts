---
title: NodeGUI v0.2.0
date: 2019-09-22
originalUrl: https://medium.com/nodegui/nodegui-v0-2-0-a8521fecfe1b
description: NodeGUI v0.2.0 brings a new CMake build system, native plugin support, and several component additions.
---

NodeGUI v0.2.0 represents a significant architectural evolution from its predecessor. The release introduces transformative improvements across multiple dimensions.

## New Build System

NodeGUI although is a nodejs addon, it no longer uses node-gyp as its build system. The team migrated to CMake to enable enhanced flexibility and stability. The detailed rationale for this transition is available in [pull request #103](https://github.com/nodegui/nodegui/pull/103).

## Native Plugin Support

Starting with v0.2.0, third-party developers can create native plugins for NodeGUI. This architecture draws inspiration from React Native's plugin ecosystem, allowing the core library to remain lightweight while facilitating community contributions.

An example plugin implementation is available at the [nodegui-example-plugin](https://github.com/nodegui/nodegui-example-plugin) repository.

## Additional Updates

- `QTabWidget` component added
- `QCheckBoxEvents.toggled` functionality
- `QIcon.pixmap` support
- `qtnode` addon renamed to `nodegui_core`
