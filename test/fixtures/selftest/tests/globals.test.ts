import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class GlobalsTests {
  public numeric_and_string_conversions_match_js_surface(): void {
    Assert.Equal(42, parseInt("42"));
    Assert.Equal(16, parseInt("0x10"));
    Assert.Equal(42.5, parseFloat("42.5"));
    Assert.Equal(42, Number("42"));
    Assert.Equal("123", String(123));
    Assert.True(Boolean(1));
    Assert.False(Boolean(0));
  }

  public predicates_and_uri_helpers_cover_global_functions(): void {
    Assert.True(isFinite(42.5));
    Assert.True(isNaN(parseFloat("bad")));
    Assert.Equal("a%20b%2Bc", encodeURIComponent("a b+c"));
    Assert.Equal("a b+c", decodeURIComponent("a%20b%2Bc"));

    const encoded = encodeURI("https://example.com/a path?q=a b#x");
    Assert.True(encoded.includes("https://example.com/a%20path?q=a%20b#x"));
    Assert.Equal("https://example.com/a path?q=a b#x", decodeURI(encoded));
  }
}

A<GlobalsTests>().method((t) => t.numeric_and_string_conversions_match_js_surface).add(FactAttribute);
A<GlobalsTests>().method((t) => t.predicates_and_uri_helpers_cover_global_functions).add(FactAttribute);
