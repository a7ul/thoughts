---
title: Announcing Packer for NodeGUI and React NodeGUI
date: 2019-09-04
originalUrl: https://medium.com/nodegui/announcing-packer-for-nodegui-and-react-nodegui-1bfc635da402
description: Packer is a new npm tool that packages NodeGUI and React NodeGUI apps into standalone executables for Mac, Windows, and Linux.
---

**Packer** is an npm module enabling developers to package applications built with NodeGUI or React NodeGUI into standalone executables. The tool works across Mac, Windows, and Linux.

Repository: [https://github.com/nodegui/packer](https://github.com/nodegui/packer)

This is an initial MVP release. Platform-specific outputs:

- **macOS**  -  generates a `.dmg` file
- **Linux**  -  produces an AppImage (comparable to macOS `.app`)
- **Windows**  -  outputs a folder containing the executable and necessary DLLs

Cross-platform builds are not supported in this initial release; run packer in the target OS environment.

## Usage

Install as a dev dependency:

```bash
npm install --save-dev @nodegui/packer
```

Initialize the project:

```bash
npx nodegui-packer --init MyApp
```

This creates a `deploy` directory template for customization with icons, metadata, and native features.

Package the application:

```bash
npx nodegui-packer --pack <path to dist>
```

This processes the dist folder and generates standalone executables in the `build` directory.

## Technical Implementation

Packer leverages Qt's official deployment tools:

- **Mac**: [macdeployqt](https://doc.qt.io/qt-5.9/osx-deployment.html#macdeploy)
- **Windows**: [windeployqt](https://doc.qt.io/qt-5/windows-deployment.html)
- **Linux**: [linuxdeployqt](https://github.com/probonopd/linuxdeployqt)

## Requirements

- Qode v1.0.4+ (NodeGUI v0.1.7+)

## Planned Enhancements

1. Cross-platform build support
2. Improved documentation
3. Reduced unnecessary dynamic libraries
4. Smaller qode binary size

Community contributions are welcome!
