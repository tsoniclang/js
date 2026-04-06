import type { double, int } from "@tsonic/core/types.js";
import {
  numericIdentity,
  normalizeFloat64,
  TypedArrayBase,
} from "./typed-array-core.js";
import type { TypedArrayConstructorInput } from "./typed-array-core.js";

function wrapFloat64Array(values: double[]): Float64Array {
  return new Float64Array(values);
}

export class Float64Array extends TypedArrayBase<double, Float64Array> {
  public static readonly BYTES_PER_ELEMENT: int = 8 as int;

  public constructor(
    lengthOrValues: TypedArrayConstructorInput<double>
  ) {
    super(
      lengthOrValues,
      Float64Array.BYTES_PER_ELEMENT,
      0 as double,
      normalizeFloat64,
      numericIdentity,
      wrapFloat64Array
    );
  }
}
