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

## JSON

The public JSON API is typed:

```ts
type Message = { text: string };

const message = JSON.parse<Message>('{"text":"hello"}');
console.log(JSON.stringify(message));
```

Open-ended JSON object traversal is not the authoring model. Use concrete
payload types, or receive broad values as `unknown` and narrow them explicitly.

## Important framing

This section is not trying to be a full browser or Node reference manual. The
package is documented here as a curated first-party JS surface for Tsonic.

## Relationship to the manifest

The exported module/subpath set comes from the package manifest, not from a
hand-waved “JS mode” concept.
