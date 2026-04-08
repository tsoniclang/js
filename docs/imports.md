# Imports

`@tsonic/js` is normally used through the ambient surface, but direct imports
remain available.

## Example

```ts
import { Date } from "@tsonic/js/index.js";
import { Math } from "@tsonic/js/index.js";
```

Use direct imports when you want an explicit package-root reference rather than
the ambient surface view.

## Typical cases for direct imports

- explicit package ownership in a library surface
- importing non-ambient helpers
- documentation and examples where you want to show the package boundary clearly
