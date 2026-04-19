import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class JSONTests {
  public stringify_and_parse_round_trip_plain_values(): void {
    const text = JSON.stringify({ answer: 42, ok: true });
    const parsed = JSON.parse<{ answer: number; ok: boolean }>(text);

    Assert.Equal(42, parsed.answer);
    Assert.True(parsed.ok);
  }

  public parse_untyped_supports_arrays(): void {
    const parsed = JSON.parse("[1,2,3]") as number[];

    Assert.Equal(3, parsed.length);
    Assert.Equal("1,2,3", parsed.join(","));
  }
}

A<JSONTests>().method((t) => t.stringify_and_parse_round_trip_plain_values).add(FactAttribute);
A<JSONTests>().method((t) => t.parse_untyped_supports_arrays).add(FactAttribute);
