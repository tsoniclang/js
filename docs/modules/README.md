# Modules

`@tsonic/js` provides the JavaScript ambient surface APIs most Tsonic
JS-surface projects expect.

## Major families

- console and process-keepalive helpers
- `JSON`
- `Date`, `Math`, `Number`, `String`, `Boolean`
- `Map`, `Set`
- typed arrays and array buffers
- reflection/object helpers
- timers
- error types such as `RangeError`

## Important framing

This section is not trying to be a full browser or Node reference manual. The
package is documented here as a curated first-party JS surface for Tsonic.

## Relationship to the manifest

The exported module/subpath set comes from the package manifest, not from a
hand-waved “JS mode” concept.
