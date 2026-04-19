import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

import {
  at,
  charAt,
  concat,
  includes,
  indexOf,
  match,
  normalize,
  padStart,
  repeat,
  replaceAll,
  toUpperCase,
  trim,
} from "@tsonic/js/String.js";

export class StringTests {
  public module_helpers_cover_core_string_operations(): void {
    Assert.Equal("s", at("tsonic", 1));
    Assert.Equal("t", charAt("tsonic", 0));
    Assert.Equal("tsonic!", concat("tsonic", "!"));
    Assert.True(includes("tsonic", "son"));
    Assert.Equal(1, indexOf("tsonic", "s"));
    Assert.Equal("TS", toUpperCase("ts"));
    Assert.Equal("0007", padStart("7", 4, "0"));
    Assert.Equal("hahaha", repeat("ha", 3));
  }

  public matching_replacing_normalizing_and_trimming_cover_remaining_string_surface(): void {
    Assert.Equal("trimmed", trim("  trimmed  "));
    Assert.Equal("a-b-c", replaceAll("a,b,c", ",", "-"));
    Assert.Equal("é", normalize("é", "NFC"));

    const matched = match("hello 123", "\\d+");
    Assert.NotNull(matched);
    Assert.Equal("123", matched![0]);
  }
}

A<StringTests>().method((t) => t.module_helpers_cover_core_string_operations).add(FactAttribute);
A<StringTests>().method((t) => t.matching_replacing_normalizing_and_trimming_cover_remaining_string_surface).add(FactAttribute);
