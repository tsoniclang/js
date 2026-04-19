import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class RangeErrorTests {
  public range_error_uses_specialized_name_and_message(): void {
    const error = new RangeError("out of range");

    Assert.Equal("RangeError", error.name);
    Assert.Equal("out of range", error.message);
    Assert.Equal("RangeError: out of range", error.toString());
  }
}

A<RangeErrorTests>().method((t) => t.range_error_uses_specialized_name_and_message).add(FactAttribute);
