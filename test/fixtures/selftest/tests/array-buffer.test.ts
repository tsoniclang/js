import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class ArrayBufferTests {
  constructor_and_byte_length_work(): void {
    const buffer = new ArrayBuffer(8);
    Assert.Equal(8, buffer.byteLength);
  }

  slice_respects_range_and_negative_offsets(): void {
    const buffer = new ArrayBuffer(10);

    Assert.Equal(4, buffer.slice(2, 6).byteLength);
    Assert.Equal(3, buffer.slice(-3).byteLength);
    Assert.Equal(0, buffer.slice(7, 2).byteLength);
  }
}

A<ArrayBufferTests>().method((t) => t.constructor_and_byte_length_work).add(FactAttribute);
A<ArrayBufferTests>().method((t) => t.slice_respects_range_and_negative_offsets).add(FactAttribute);
