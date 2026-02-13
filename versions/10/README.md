# @tsonic/js

JavaScript-style APIs for **Tsonic** (TypeScript → .NET).

Use `@tsonic/js` when you want a JS-like standard library (`console`, `JSON`, `Map`, `Set`, `Date`, timers, etc.) while still compiling to a native binary with `tsonic`.

## Quick Start

### New project

```bash
mkdir my-app && cd my-app
tsonic init --js
npm run dev
```

### Existing project

```bash
tsonic add js
```

## Versioning

This repo is versioned by **.NET major**:

- **.NET 10** → `versions/10/` → npm: `@tsonic/js@10.x`

When publishing, run: `npm publish versions/10 --access public`

## Core APIs (what you get)

- `console` (JS-style console)
- `JSON` (`parse` / `stringify`)
- `Map`, `Set`, `WeakMap`, `WeakSet`
- `Date`, `Math`, `RegExp`, `Number`, `String`
- Timers via `Timers.setTimeout` / `Timers.setInterval`
- JS-style `Array` via `JSArray<T>`
- Common globals (e.g. `parseInt`, `parseFloat`, `encodeURI`, …)

## Usage

### `console` + JSON

```typescript
import { console, JSON } from "@tsonic/js/index.js";

export function main(): void {
  const value = JSON.parse<{ x: number }>('{"x": 1}');
  console.log(JSON.stringify(value));
}
```

### Timers

```typescript
import { Timers, console } from "@tsonic/js/index.js";

export function main(): void {
  Timers.setTimeout(() => console.log("later"), 250);
}
```

### Collections (`Map` / `Set`)

```typescript
import { Map, Set } from "@tsonic/js/index.js";

const map = new Map<string, number>();
map.set("key", 42);

const set = new Set<string>();
set.add("value");
```

### JSArray

```typescript
import { JSArray } from "@tsonic/js/index.js";

const arr = new JSArray<number>();
arr.push(1, 2, 3);
const mapped = arr.map((x) => x * 2);
void mapped;
```

## Relationship to `@tsonic/nodejs`

If you want Node-style modules (`fs`, `path`, `crypto`, `http`, …), use `@tsonic/nodejs`.

## Naming Conventions

- `@tsonic/js` intentionally uses **JavaScript-style naming** (camelCase members).

## Development

### Regenerating Types

To regenerate TypeScript declarations:

```bash
./__build/scripts/generate.sh
```

**Prerequisites:**
- .NET 10 SDK installed
- `tsbindgen` repository at `../tsbindgen`
- `js-runtime` repository at `../js-runtime` (built with `dotnet build -c Release`)

**Environment variables:**
- `DOTNET_VERSION` - .NET runtime version (default: `10.0.0`)
- `DOTNET_HOME` - .NET installation directory (default: `$HOME/.dotnet`)

## License

MIT
