---
title: NodeGui v0.13.0
date: 2020-01-24
originalUrl: https://medium.com/nodegui/nodegui-v0-13-0-4fdffc833c59
description: Major NodeGui release featuring prebuilt binaries, Windows plugin support, and an updated documentation site.
---

There has been significant progress in NodeGui since the v0.2.0 announcement in September 2019. This post highlights the major improvements.

## Lots of Core Qt Widgets and Features

The release includes many native widgets and core functionality enhancements to expand NodeGui's capabilities.

## Prebuilt Binaries Included

Previously, users needed to compile the C++ native addon during installation, requiring cmake and compilation tools. Starting with v0.13.0, the core library ships with prebuilt binaries. This eliminates compilation steps for most users.

Try the [nodegui-starter](https://github.com/nodegui/nodegui-starter) or [react-nodegui-starter](https://github.com/nodegui/react-nodegui-starter) projects to experience this immediately.

## Native Windows Plugin Support

While v0.2.0 added plugin support for Unix platforms, this release extends that capability across all platforms. This architecture allows third-party developers to create native plugins without waiting for core library updates  -  inspired by React Native's approach.

Plugin development documentation will be released soon. Examples are available at the [nodegui-example-plugin](https://github.com/nodegui/nodegui-example-plugin) repository.

## Quick Master Release Installation

Users can now install the latest development build using:

```bash
npm i http://master-release.nodegui.org
```

This auto-release is generated via GitHub Actions following PR merges.

## Updated Documentation Website

The documentation site now uses Docusaurus v2, featuring improved design and automatic documentation generation through TypeScript and Typedoc.

New site: [https://docs.nodegui.org/](https://docs.nodegui.org/)

---

Thank you to all contributors and backers of NodeGui. The project is open source and community contributions are always welcome.
