import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class TypedArrayTests {
  constructors_and_lengths_cover_all_first_party_typed_arrays(): void {
    Assert.Equal(3, new Int8Array([1, 2, 3]).length);
    Assert.Equal(3, new Uint8Array([1, 2, 3]).length);
    Assert.Equal(3, new Uint8ClampedArray([1, 2, 3]).length);
    Assert.Equal(3, new Int16Array([1, 2, 3]).length);
    Assert.Equal(3, new Uint16Array([1, 2, 3]).length);
    Assert.Equal(3, new Int32Array([1, 2, 3]).length);
    Assert.Equal(3, new Uint32Array([1, 2, 3]).length);
    Assert.Equal(3, new Float32Array([1, 2, 3]).length);
    Assert.Equal(3, new Float64Array([1, 2, 3]).length);
  }

  set_join_slice_and_subarray_cover_typed_array_surface(): void {
    const values = new Uint8Array(4);
    values.set([4, 5], 1);
    values.set(0, 9);

    Assert.Equal("9,4,5,0", values.join(","));
    Assert.True(values.includes(5));
    Assert.Equal(2, values.indexOf(5));
    Assert.Equal("4,5", values.slice(1, 3).join(","));
    Assert.Equal("4,5,0", values.subarray(1).join(","));
  }

  numeric_normalization_behaves_like_js_typed_arrays(): void {
    const signed = new Int8Array(new Float64Array([257, -129]));
    const clamped = new Uint8ClampedArray(new Float64Array([-10, 12.6, 999]));

    Assert.Equal("1,127", signed.join(","));
    Assert.Equal("0,13,255", clamped.join(","));
  }
}

A<TypedArrayTests>().method((t) => t.constructors_and_lengths_cover_all_first_party_typed_arrays).add(FactAttribute);
A<TypedArrayTests>().method((t) => t.set_join_slice_and_subarray_cover_typed_array_surface).add(FactAttribute);
A<TypedArrayTests>().method((t) => t.numeric_normalization_behaves_like_js_typed_arrays).add(FactAttribute);
