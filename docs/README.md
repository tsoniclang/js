---
title: JavaScript Surface
---

# `@tsonic/js`

`@tsonic/js` is the active JavaScript ambient surface for Tsonic.

## What it is

- a first-party `tsonic-source-package`
- the JS ambient world for Tsonic workspaces
- the package that provides `console`, `JSON`, `Date`, `Map`, `Set`, typed
  arrays, timers, and related JS APIs

## Why it matters

`@tsonic/js` is both:

- the selected ambient surface for JS-style authoring
- a real package with exports, ambient files, and package metadata

That dual role is intentional and is part of the current source-first model.

## Quick start

```bash
tsonic init --surface @tsonic/js
```

```ts
export function main(): void {
  const value = JSON.parse<{ x: number }>('{"x": 1}');
  console.log(JSON.stringify(value));
}
```

## Key point

You do not usually import `@tsonic/js` directly. The normal model is
surface-first:

- set the workspace surface to `@tsonic/js`
- use JS globals and receiver methods naturally

Direct imports remain available when you want them:

```ts
import { Date } from "@tsonic/js/index.js";
import { Math } from "@tsonic/js/index.js";
```

## Pages

- [Getting Started](getting-started.md)
- [Imports](imports.md)
- [Modules](modules/)
- [Runtime Model](runtime-model.md)

## Current mental model

Treat `@tsonic/js` as the canonical package users author against. The site does
not explain the JS surface through an older multi-repo companion story.
