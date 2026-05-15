# Runtime Model

`@tsonic/js` is both:

- the ambient surface selected by the workspace
- a first-party source package with explicit exports and ambient files

The public model is surface-first authoring backed by a real source package.

## Surface behavior

When `surface` is `@tsonic/js`, you get natural JS-style authoring:

- `"abc".trim()`
- `[1, 2, 3].map(...)`
- `console.log(...)`
- `JSON.parse(...)`
- `new Date()`
- `new Uint8Array(...)`

## Source package behavior

The package is still a real `tsonic-source-package`. Its manifest defines:

- ambient globals
- exported subpaths
- required type roots
- source namespace

The package exports include:

- `./JSON.js`
- `./Date.js`
- `./Math.js`
- `./Map.js`
- `./Set.js`
- `./timers.js`
- typed-array subpaths

## Runtime value boundary

The JS surface exposes natural JavaScript-style APIs, but Tsonic still lowers to
closed NativeAOT-safe carriers. Deliberately broad values are typed as
`unknown`; user code narrows them before property access, method calls, or
storage into a narrower carrier.

`JSON.parse<T>()` and `JSON.stringify<T>()` require closed compile-time payload
types. The compiler uses those types to generate and root serialization
metadata.

The authored manifest is the authoritative package contract. It defines:

- `kind: "tsonic-source-package"`
- `surfaces: ["@tsonic/js"]`
- `requiredTypeRoots: ["."]`
- ambient globals through `globals.ts`
- concrete exports under `versions/10/src/...`

That is why the site describes it as both a surface and a package, depending on
which layer you are talking about.

## Relationship to `@tsonic/nodejs`

- `@tsonic/js` = ambient JavaScript world
- `@tsonic/nodejs` = Node-style modules layered on top

## Practical takeaway

If you want JS-style authoring, start by selecting the surface. Only reach for
direct imports when you specifically need an explicit package boundary.
