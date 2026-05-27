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

  data_view_writes_shared_uint8_array_buffer(): void {
    const bytes = new Uint8Array(4);
    const view = new DataView(bytes.buffer);

    view.setUint32(0, 0x12345678, true);

    Assert.Equal(0x78, bytes[0]);
    Assert.Equal(0x56, bytes[1]);
    Assert.Equal(0x34, bytes[2]);
    Assert.Equal(0x12, bytes[3]);
    Assert.Equal(0x12345678, view.getUint32(0, true));
  }
}

A<ArrayBufferTests>().method((t) => t.constructor_and_byte_length_work).add(FactAttribute);
A<ArrayBufferTests>().method((t) => t.slice_respects_range_and_negative_offsets).add(FactAttribute);
A<ArrayBufferTests>().method((t) => t.data_view_writes_shared_uint8_array_buffer).add(FactAttribute);
