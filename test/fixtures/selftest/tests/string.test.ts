import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

import {
  at,
  charAt,
  charCodeAt,
  concat,
  includes,
  indexOf,
  match,
  normalize,
  padStart,
  repeat,
  replace,
  replaceAll,
  slice,
  substr,
  substring,
  toUpperCase,
  trim,
} from "@tsonic/js/String.js";

export class StringTests {
  module_helpers_cover_core_string_operations(): void {
    Assert.Equal("s", at("tsonic", 1));
    Assert.Equal("t", charAt("tsonic", 0));
    Assert.Equal("tsonic!", concat("tsonic", "!"));
    Assert.True(includes("tsonic", "son"));
    Assert.Equal(1, indexOf("tsonic", "s"));
    Assert.Equal("TS", toUpperCase("ts"));
    Assert.Equal("0007", padStart("7", 4, "0"));
    Assert.Equal("hahaha", repeat("ha", 3));
  }

  number_offsets_follow_javascript_string_semantics(): void {
    const start: number = 1;
    const end: number = 4;
    Assert.Equal("son", slice("tsonic", start, end));
    Assert.Equal("sonic", slice("tsonic", start));
    Assert.Equal("oni", slice("tsonic", -4, -1));
    Assert.Equal("so", substring("tsonic", start, 3.8));
    Assert.Equal("son", substr("tsonic", start, 3.9));
    Assert.Equal("t", at("tsonic", -6));
    Assert.Equal("t", charAt("tsonic", Number.NaN));
    Assert.Equal(116, charCodeAt("tsonic", Number.NaN));
  }

  matching_replacing_normalizing_and_trimming_cover_remaining_string_surface(): void {
    Assert.Equal("trimmed", trim("  trimmed  "));
    Assert.Equal("a-b,b", replace("a,b,b", ",", "-"));
    Assert.Equal("a-b,b", replace("a,b,b", /,/, "-"));
    Assert.Equal("a-b-b", replace("a,b,b", new RegExp(",", "g"), "-"));
    Assert.Equal("a-b-c", replaceAll("a,b,c", ",", "-"));
    Assert.Equal("é", normalize("é", "NFC"));

    const matched = match("hello 123", "\\d+");
    Assert.NotNull(matched);
    Assert.Equal("123", matched![0]);
  }
}

A<StringTests>().method((t) => t.module_helpers_cover_core_string_operations).add(FactAttribute);
A<StringTests>().method((t) => t.number_offsets_follow_javascript_string_semantics).add(FactAttribute);
A<StringTests>().method((t) => t.matching_replacing_normalizing_and_trimming_cover_remaining_string_surface).add(FactAttribute);
