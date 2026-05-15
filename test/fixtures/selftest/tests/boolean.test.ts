import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

import { toString as booleanToString, valueOf as booleanValueOf } from "@tsonic/js/Boolean.js";

export class BooleanTests {
  boolean_function_matches_js_truthiness(): void {
    Assert.True(Boolean("x"));
    Assert.True(Boolean(1));
    Assert.False(Boolean(""));
    Assert.False(Boolean(0));
    Assert.False(Boolean(null));
  }

  boolean_module_helpers_round_trip_values(): void {
    Assert.Equal("true", booleanToString(true));
    Assert.Equal("false", booleanToString(false));
    Assert.True(booleanValueOf(true));
    Assert.False(booleanValueOf(false));
  }
}

A<BooleanTests>().method((t) => t.boolean_function_matches_js_truthiness).add(FactAttribute);
A<BooleanTests>().method((t) => t.boolean_module_helpers_round_trip_values).add(FactAttribute);
