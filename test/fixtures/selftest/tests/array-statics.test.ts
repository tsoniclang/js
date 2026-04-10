import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class ArrayStaticsTests {
  public array_from_supports_strings_and_iterables(): void {
    const fromString = Array.from("abc");
    const fromIterable = Array.from([1, 2, 3], (value, index) => value + index);

    Assert.Equal("abc", fromString.join(""));
    Assert.Equal("1,3,5", fromIterable.join(","));
  }

  public array_of_and_isarray_cover_static_surface(): void {
    const values = Array.of(4, 5, 6);

    Assert.Equal("4,5,6", values.join(","));
    Assert.True(Array.isArray(values));
    Assert.True(Array.isArray(new Array<number>(1, 2, 3)));
    Assert.False(Array.isArray("abc"));
  }
}

A<ArrayStaticsTests>().method((t) => t.array_from_supports_strings_and_iterables).add(FactAttribute);
A<ArrayStaticsTests>().method((t) => t.array_of_and_isarray_cover_static_surface).add(FactAttribute);
