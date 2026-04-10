import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class RegExpTests {
  public test_covers_matching_surface(): void {
    const regex = new RegExp("t(s)onic", "i");

    Assert.True(regex.test("TSonic"));
    Assert.True(regex.test("tsonic"));
    Assert.False(regex.test("hello"));
  }

  public tostring_preserves_pattern_and_flags(): void {
    const regex = new RegExp("abc", "im");
    Assert.Equal("/abc/im", regex.toString());
  }
}

A<RegExpTests>().method((t) => t.test_covers_matching_surface).add(FactAttribute);
A<RegExpTests>().method((t) => t.tostring_preserves_pattern_and_flags).add(FactAttribute);
