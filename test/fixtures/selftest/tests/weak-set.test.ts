import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class WeakSetTests {
  public weak_set_supports_add_has_and_delete(): void {
    const set = new WeakSet<object>();
    const value = { id: 1 };

    set.add(value);

    Assert.True(set.has(value));
    Assert.True(set.delete(value));
    Assert.False(set.has(value));
  }
}

A<WeakSetTests>().method((t) => t.weak_set_supports_add_has_and_delete).add(FactAttribute);
