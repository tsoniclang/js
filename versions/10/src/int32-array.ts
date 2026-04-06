import type { int } from "@tsonic/core/types.js";
import {
  numericIdentity,
  normalizeInt32,
  TypedArrayBase,
} from "./typed-array-core.js";
import type { TypedArrayConstructorInput } from "./typed-array-core.js";

function wrapInt32Array(values: int[]): Int32Array {
  return new Int32Array(values);
}

export class Int32Array extends TypedArrayBase<int, Int32Array> {
  public static readonly BYTES_PER_ELEMENT: int = 4 as int;

  public constructor(
    lengthOrValues: TypedArrayConstructorInput<int>
  ) {
    super(
      lengthOrValues,
      Int32Array.BYTES_PER_ELEMENT,
      0 as int,
      normalizeInt32,
      numericIdentity,
      wrapInt32Array
    );
  }
}
