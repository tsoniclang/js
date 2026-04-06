import type { int, uint } from "@tsonic/core/types.js";
import {
  numericIdentity,
  normalizeUint32,
  TypedArrayBase,
} from "./typed-array-core.js";
import type { TypedArrayConstructorInput } from "./typed-array-core.js";

function wrapUint32Array(values: uint[]): Uint32Array {
  return new Uint32Array(values);
}

export class Uint32Array extends TypedArrayBase<uint, Uint32Array> {
  public static readonly BYTES_PER_ELEMENT: int = 4 as int;

  public constructor(
    lengthOrValues: TypedArrayConstructorInput<uint>
  ) {
    super(
      lengthOrValues,
      Uint32Array.BYTES_PER_ELEMENT,
      0 as uint,
      normalizeUint32,
      numericIdentity,
      wrapUint32Array
    );
  }
}
