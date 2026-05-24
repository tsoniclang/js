import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class ObjectTests {
  object_is_follows_javascript_same_value_semantics(): void {
    Assert.True(Object.is(Number.NaN, Number.NaN));
    Assert.True(Object.is("same", "same"));
    Assert.True(Object.is(null, null));
    Assert.True(Object.is(BigInt(7), BigInt(7)));
    Assert.False(Object.is(0, -0));
    Assert.False(Object.is("1", 1));
  }
}

A<ObjectTests>().method((t) => t.object_is_follows_javascript_same_value_semantics).add(FactAttribute);
