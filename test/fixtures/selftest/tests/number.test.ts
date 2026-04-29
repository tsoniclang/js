import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class NumberTests {
  number_function_and_helpers_cover_numeric_surface(): void {
    Assert.Equal(42, Number("42"));
    Assert.Equal(7, Number("7"));
    Assert.Equal(0, Number(""));
  }

  number_conversion_handles_special_cases(): void {
    Assert.True(isNaN(Number("not-a-number")));
    Assert.True(isFinite(Number("42.5")));
    Assert.True(Number("42.5") > 42);
  }
}

A<NumberTests>().method((t) => t.number_function_and_helpers_cover_numeric_surface).add(FactAttribute);
A<NumberTests>().method((t) => t.number_conversion_handles_special_cases).add(FactAttribute);
