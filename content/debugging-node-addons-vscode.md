---
title: Debugging NodeJS C++ Addons using VS Code
date: 2018-07-04
description: How to set up VS Code with LLDB to debug NodeJS native C++ addons with proper breakpoints and variable inspection.
---

Programming in a new language or domain seems hard until you know how to debug properly. While working on a NodeJS addon using C++ and N-API, I initially relied on basic logging statements but found this approach time-consuming. Here's how to set up proper debugging in VS Code.

This guide is for macOS, but similar steps apply to Windows and Linux.

## Prerequisites

A basic NodeJS addon project. You can clone the example at [https://github.com/master-atul/basic-node-addon](https://github.com/master-atul/basic-node-addon) and run `npm install`.

## Setting Up

### 1. Add debug build scripts to package.json

```json
"scripts": {
   "start": "node index.js",
   "build:dev": "node-gyp -j 16 build --debug",
   "build": "node-gyp -j 16 build",
   "rebuild:dev": "node-gyp -j 16 rebuild --debug",
   "rebuild": "node-gyp -j 16 rebuild",
   "clean": "node-gyp clean"
}
```

**Important:** Debug builds output to `build/Debug/yournode.node`, while release builds output to `build/Release/yournode.node`. Make sure your `require()` path matches.

### 2. Install the LLDB extension

Install [vscode-lldb](https://github.com/vadimcn/vscode-lldb) by Vadim Chugunov from the VS Code marketplace.

### 3. Configure launch.json

Press `Cmd+Shift+P` and type "open launch.json". Set it up as follows:

```json
{
  "version": "0.2.0",
  "configurations": [{
     "type": "lldb",
     "request": "launch",
     "name": "Launch Program",
     "preLaunchTask": "npm: build:dev",
     "program": "/absolute/path/to/node",
     "args": [
        "/absolute/path/to/your/index.js"
     ]
  }]
}
```

The `type: "lldb"` setting requires the extension from step 2.

### 4. Configure the pre-launch task

Press `Cmd+Shift+P` and type "configure task". Select `npm: build:dev` from the list. VS Code will automatically create a `tasks.json` file in `.vscode`.

Sample config files are at [https://github.com/master-atul/basic-node-addon/tree/master/.vscode](https://github.com/master-atul/basic-node-addon/tree/master/.vscode).

## Running the Debugger

1. Open your C++ file (e.g., `cppsrc/test.cpp`)
2. Set breakpoints by clicking in the editor margin
3. Click the debugging icon in the left sidebar
4. Click "Launch Program" or "Debug"

The debugger shows variables, call stacks, and all the information you'd expect — no more printf debugging.
