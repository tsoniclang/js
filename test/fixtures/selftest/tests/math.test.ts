import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class MathTests {
  constants_and_core_operations_cover_math_surface(): void {
    Assert.True(Math.PI > 3);
    Assert.Equal(3, Math.abs(-3));
    Assert.Equal(5, Math.max(1, 5, 3));
    Assert.Equal(1, Math.min(1, 5, 3));
    Assert.Equal(8, Math.pow(2, 3));
    Assert.Equal(4, Math.round(3.6));
    Assert.Equal(3, Math.trunc(3.9));
    Assert.Equal(4, Math.sqrt(16));
  }

  trigonometric_and_random_functions_return_valid_values(): void {
    Assert.Equal(0, Math.sign(0));
    Assert.Equal(1, Math.sign(5));
    Assert.True(Math.random() >= 0);
    Assert.True(Math.random() < 1);
    Assert.True(Math.sin(0) === 0);
    Assert.True(Math.cos(0) === 1);
  }
}

A<MathTests>().method((t) => t.constants_and_core_operations_cover_math_surface).add(FactAttribute);
A<MathTests>().method((t) => t.trigonometric_and_random_functions_return_valid_values).add(FactAttribute);
