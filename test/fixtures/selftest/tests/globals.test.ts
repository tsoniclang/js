import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class GlobalsTests {
  numeric_and_string_conversions_match_js_surface(): void {
    Assert.Equal(42, parseInt("42"));
    Assert.Equal(16, parseInt("0x10"));
    Assert.Equal(42.5, parseFloat("42.5"));
    Assert.True(Number.isNaN(NaN));
    Assert.True(!Number.isFinite(Infinity));
    Assert.Equal(42, Number("42"));
    Assert.Equal(1024, Number(BigInt(1024)));
    Assert.Equal("123", String(123));
    Assert.Equal("123", String(BigInt(123)));
    Assert.True(Boolean(1));
    Assert.False(Boolean(0));
    Assert.True(Boolean(BigInt(1)));
    Assert.False(Boolean(BigInt(0)));
  }

  predicates_and_uri_helpers_cover_global_functions(): void {
    Assert.True(isFinite(42.5));
    Assert.True(isNaN(parseFloat("bad")));
    Assert.Equal("a%20b%2Bc", encodeURIComponent("a b+c"));
    Assert.Equal("a b+c", decodeURIComponent("a%20b%2Bc"));

    const encoded = encodeURI("https://example.com/a path?q=a b#x");
    Assert.True(encoded.includes("https://example.com/a%20path?q=a%20b#x"));
    Assert.Equal("https://example.com/a path?q=a b#x", decodeURI(encoded));
  }

  text_encoder_emits_utf8_bytes(): void {
    const bytes = new TextEncoder().encode("Hi😀");
    Assert.Equal(6, bytes.length);
    Assert.Equal(72, bytes[0]);
    Assert.Equal(105, bytes[1]);
    Assert.Equal(240, bytes[2]);
    Assert.Equal(159, bytes[3]);
    Assert.Equal(152, bytes[4]);
    Assert.Equal(128, bytes[5]);
  }
}

A<GlobalsTests>().method((t) => t.numeric_and_string_conversions_match_js_surface).add(FactAttribute);
A<GlobalsTests>().method((t) => t.predicates_and_uri_helpers_cover_global_functions).add(FactAttribute);
A<GlobalsTests>().method((t) => t.text_encoder_emits_utf8_bytes).add(FactAttribute);
