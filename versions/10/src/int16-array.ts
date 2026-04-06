import type { int, short } from "@tsonic/core/types.js";
import {
  numericIdentity,
  normalizeInt16,
  TypedArrayBase,
} from "./typed-array-core.js";
import type { TypedArrayConstructorInput } from "./typed-array-core.js";

function wrapInt16Array(values: short[]): Int16Array {
  return new Int16Array(values);
}

export class Int16Array extends TypedArrayBase<short, Int16Array> {
  public static readonly BYTES_PER_ELEMENT: int = 2 as int;

  public constructor(
    lengthOrValues: TypedArrayConstructorInput<short>
  ) {
    super(
      lengthOrValues,
      Int16Array.BYTES_PER_ELEMENT,
      0 as short,
      normalizeInt16,
      numericIdentity,
      wrapInt16Array
    );
  }
}
