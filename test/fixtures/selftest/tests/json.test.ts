import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class JSONTests {
  stringify_and_parse_round_trip_plain_values(): void {
    const text = JSON.stringify({ answer: 42, ok: true });
    const parsed = JSON.parse<{ answer: number; ok: boolean }>(text);

    Assert.Equal(42, parsed.answer);
    Assert.True(parsed.ok);
  }

  parse_typed_supports_arrays(): void {
    const parsed = JSON.parse<number[]>("[1,2,3]");

    Assert.Equal(3, parsed.length);
    Assert.Equal("1,2,3", parsed.join(","));
  }
}

A<JSONTests>().method((t) => t.stringify_and_parse_round_trip_plain_values).add(FactAttribute);
A<JSONTests>().method((t) => t.parse_typed_supports_arrays).add(FactAttribute);
