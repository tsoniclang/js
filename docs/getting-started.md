---
title: Getting Started
---

# Getting Started

Use the JS surface when you want ambient JavaScript-style authoring.

```bash
tsonic init --surface @tsonic/js
```

```ts
export function main(): void {
  console.log("hello".toUpperCase());
}
```

Then build or run normally:

```bash
tsonic run
```

## What `init --surface @tsonic/js` changes

It sets the workspace surface and bootstraps the required type roots so the
ambient JS world is available immediately.

In practice that means:

- the workspace selects `surface: "@tsonic/js"`
- `@tsonic/js` is installed if needed
- the starter project is still authored as a normal source package

## Existing workspace

If you already have a workspace and want to switch it:

```bash
tsonic add npm @tsonic/js
```

Then set:

```json
{
  "surface": "@tsonic/js"
}
```

in `tsonic.workspace.json`.

## What you get immediately

- `console`
- `JSON`
- `Date`
- `Map`, `Set`
- typed arrays
- receiver-style string and array methods
- timers

You usually do not import those directly; the surface makes them ambient.

## When to add more packages

- add `@tsonic/nodejs` when you want Node-style modules
- add `@tsonic/express` when you want Express-style routing
