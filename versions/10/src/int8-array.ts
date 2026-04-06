import type { int, sbyte } from "@tsonic/core/types.js";
import {
  normalizeInt8,
  numericIdentity,
  TypedArrayBase,
} from "./typed-array-core.js";
import type { TypedArrayConstructorInput } from "./typed-array-core.js";

function wrapInt8Array(values: sbyte[]): Int8Array {
  return new Int8Array(values);
}

export class Int8Array extends TypedArrayBase<sbyte, Int8Array> {
  public static readonly BYTES_PER_ELEMENT: int = 1 as int;

  public constructor(
    lengthOrValues: TypedArrayConstructorInput<sbyte>
  ) {
    super(
      lengthOrValues,
      Int8Array.BYTES_PER_ELEMENT,
      0 as sbyte,
      normalizeInt8,
      numericIdentity,
      wrapInt8Array
    );
  }
}
