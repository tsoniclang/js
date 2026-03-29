import type { float, int } from "@tsonic/core/types.js";
import {
  numericIdentity,
  normalizeFloat32,
  TypedArrayConstructorInput,
  TypedArrayBase,
} from "./typed-array-core.js";

function wrapFloat32Array(values: float[]): Float32Array {
  return new Float32Array(values);
}

export class Float32Array extends TypedArrayBase<float, Float32Array> {
  public static readonly BYTES_PER_ELEMENT: int = 4 as int;

  public constructor(
    lengthOrValues: TypedArrayConstructorInput<float>
  ) {
    super(
      lengthOrValues,
      Float32Array.BYTES_PER_ELEMENT,
      0 as float,
      normalizeFloat32,
      numericIdentity,
      wrapFloat32Array
    );
  }
}
