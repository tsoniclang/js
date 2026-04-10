import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class WeakMapTests {
  public weak_map_supports_set_get_has_and_delete(): void {
    const map = new WeakMap<object, string>();
    const key = { name: "key" };

    map.set(key, "value");

    Assert.True(map.has(key));
    Assert.Equal("value", map.get(key) as string);
    Assert.True(map.delete(key));
    Assert.False(map.has(key));
  }
}

A<WeakMapTests>().method((t) => t.weak_map_supports_set_get_has_and_delete).add(FactAttribute);
