import type { byte, int } from "@tsonic/core/types.js";
import {
  numericIdentity,
  normalizeUint8Clamped,
  TypedArrayBase,
} from "./typed-array-core.js";
import type { TypedArrayConstructorInput } from "./typed-array-core.js";

function wrapUint8ClampedArray(values: byte[]): Uint8ClampedArray {
  return new Uint8ClampedArray(values);
}

export class Uint8ClampedArray extends TypedArrayBase<byte, Uint8ClampedArray> {
  public static readonly BYTES_PER_ELEMENT: int = 1 as int;

  public constructor(
    lengthOrValues: TypedArrayConstructorInput<byte>
  ) {
    super(
      lengthOrValues,
      Uint8ClampedArray.BYTES_PER_ELEMENT,
      0 as byte,
      normalizeUint8Clamped,
      numericIdentity,
      wrapUint8ClampedArray
    );
  }
}
