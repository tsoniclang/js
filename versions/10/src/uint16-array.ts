import type { int, ushort } from "@tsonic/core/types.js";
import {
  numericIdentity,
  normalizeUint16,
  TypedArrayBase,
} from "./typed-array-core.js";
import type { TypedArrayConstructorInput } from "./typed-array-core.js";

function wrapUint16Array(values: ushort[]): Uint16Array {
  return new Uint16Array(values);
}

export class Uint16Array extends TypedArrayBase<ushort, Uint16Array> {
  public static readonly BYTES_PER_ELEMENT: int = 2 as int;

  public constructor(
    lengthOrValues: TypedArrayConstructorInput<ushort>
  ) {
    super(
      lengthOrValues,
      Uint16Array.BYTES_PER_ELEMENT,
      0 as ushort,
      normalizeUint16,
      numericIdentity,
      wrapUint16Array
    );
  }
}
