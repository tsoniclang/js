# @tsonic/js

TypeScript type definitions for the JavaScript Runtime (JSRuntime) library.

## Versioning

This repo is versioned by **.NET major**:

- **.NET 10** → `versions/10/` → npm: `@tsonic/js@10.x`

When publishing, run: `npm publish versions/10 --access public`

## Features

- **JavaScript-like APIs for .NET** - Array, Map, Set, Date, Math, JSON, and more
- **Global functions** - `parseInt`, `parseFloat`, `encodeURI`, etc. as top-level exports
- **camelCase members** - TypeScript-friendly naming conventions
- **Primitive aliases** - `int`, `long`, etc. via `@tsonic/core`
- **Full type safety** - Complete TypeScript declarations

## Installation

```bash
npm install @tsonic/js @tsonic/dotnet @tsonic/core
```

## Usage

### Global Functions

```typescript
import { parseInt, parseFloat, isNaN, encodeURIComponent } from "@tsonic/js";

const num = parseInt("42", 10);
const float = parseFloat("3.14");
const encoded = encodeURIComponent("hello world");
```

### Array Operations

```typescript
import { JSArray } from "@tsonic/js";

const arr = new JSArray<number>();
arr.push(1, 2, 3);
const mapped = arr.map(x => x * 2);
```

### Map and Set

```typescript
import { Map, Set } from "@tsonic/js";

const map = new Map<string, number>();
map.set("key", 42);

const set = new Set<string>();
set.add("value");
```

### Date and Math

```typescript
import { Date, Math } from "@tsonic/js";

const now = new Date();
const random = Math.random();
const max = Math.max(1, 2, 3);
```

### JSON

```typescript
import { JSON } from "@tsonic/js";

const obj = JSON.parse('{"key": "value"}');
const str = JSON.stringify(obj);
```

## Naming Conventions

- **Types**: PascalCase (matches .NET)
- **Members**: camelCase (TypeScript convention)
- **Global functions**: camelCase (JavaScript convention)

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
