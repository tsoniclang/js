---
title: JavaScript Surface
---

# `@tsonic/js`

`@tsonic/js` is the JavaScript ambient surface for Tsonic.

## What it is

- a first-party `tsonic-source-package`
- the JS ambient world for Tsonic workspaces
- the package that provides `console`, `JSON`, `Date`, `Map`, `Set`, typed
  arrays, timers, and related JS APIs

## Why it matters

`@tsonic/js` is both:

- the selected ambient surface for JS-style authoring
- a real package with exports, ambient files, and package metadata

That dual role is intentional and is part of the source-package model.

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

## JSON contract

`JSON.parse<T>()` and `JSON.stringify<T>()` are typed, compiler-lowered APIs.
Payloads should use closed compile-time types:

```ts
type Settings = { theme: string; compact: boolean };

const settings = JSON.parse<Settings>('{"theme":"dark","compact":true}');
```

Broad JS values use `unknown` and explicit narrowing. `JsValue` is reserved for
first-party runtime declarations, not application-level JSON modeling.

## Pages

- [Getting Started](getting-started.md)
- [Imports](imports.md)
- [Modules](modules/)
- [Runtime Model](runtime-model.md)

## Package model

Treat `@tsonic/js` as the canonical package users author against. The site does
not present the JS surface as a separate CLR companion package.
