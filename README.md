# @tsonic/js

JavaScript runtime bindings for **Tsonic**.

This package is part of Tsonic: https://tsonic.org.

`@tsonic/js` provides JS runtime APIs (`JSON`, `console`, `Map`, `Set`, `Date`, timers, etc.) for Tsonic projects.

## Prerequisites

- Install the .NET 10 SDK: https://dotnet.microsoft.com/download
- Verify: `dotnet --version`

## Quick Start (surface-first, no `@tsonic/js` imports required)

```bash
mkdir my-app && cd my-app
npx --yes tsonic@latest init --surface @tsonic/js
```

```ts
export function main(): void {
  const value = JSON.parse<{ x: number }>('{"x": 1}');
  console.log(JSON.stringify(value));
}
```

Build/run:

```bash
npm run dev
```

## Existing project

```bash
npx --yes tsonic@latest add npm @tsonic/js
```

If the workspace is not already JS surface, set `surface` in
`tsonic.workspace.json` to `@tsonic/js`:

```json
{
  "surface": "@tsonic/js"
}
```

## Optional direct imports

Surface mode enables natural JS authoring, but direct package imports remain supported:

```ts
import { Timers, JSArray } from "@tsonic/js/index.js";
```

## Core APIs

- `console`
- `JSON`
- `Map`, `Set`, `WeakMap`, `WeakSet`
- `Date`, `Math`, `RegExp`, `Number`, `String`
- `Timers`
- `JSArray<T>`
- globals like `parseInt`, `parseFloat`, `encodeURI`

## Relationship to `@tsonic/nodejs`

- `@tsonic/js` = JS runtime surface
- `@tsonic/nodejs` = Node-style modules (`node:fs`, `node:path`, `node:crypto`, ...)

## Versioning

- `10` → `versions/10/` → npm: `@tsonic/js@10.x`

Publish:

```bash
npm publish versions/10 --access public
```

## Development

See `__build/`.

## License

MIT
