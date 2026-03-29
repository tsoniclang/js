import type {
  byte,
  double,
  float,
  int,
  sbyte,
  short,
  uint,
  ushort,
} from "@tsonic/core/types.js";
import { Convert } from "@tsonic/dotnet/System.js";
import { round, trunc } from "./math-intrinsics.js";
import { isInt32, toInt } from "./int32.js";

export type TypedArrayInput<
  TElement extends number,
> =
  | TElement[]
  | Iterable<number>;

export type TypedArrayConstructorInput<
  TElement extends number,
> =
  | int
  | TypedArrayInput<TElement>;

export const numericIdentity = <TNumeric extends number>(value: TNumeric): number =>
  value;

const normalizeIndex = (
  value: int | undefined,
  length: int,
  fallback: int
): int => {
  if (value === undefined) {
    return fallback;
  }

  const truncated = toInt(trunc(value));
  if (truncated < 0) {
    const fromEnd = toInt(length + truncated);
    return fromEnd < (0 as int) ? (0 as int) : fromEnd;
  }

  return truncated > length ? length : truncated;
};

const wrapUnsigned = (value: number, modulus: number): number => {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }

  const truncated = trunc(value);
  const wrapped = truncated % modulus;
  return wrapped < 0 ? wrapped + modulus : wrapped;
};

const wrapSigned = (value: number, modulus: number): number => {
  const wrapped = wrapUnsigned(value, modulus);
  const midpoint = modulus / 2;
  return wrapped >= midpoint ? wrapped - modulus : wrapped;
};

const clamp = (value: number, min: number, max: number): number =>
  value < min ? min : value > max ? max : value;

export const normalizeInt8 = (value: number): sbyte =>
  Convert.ToSByte(wrapSigned(value, 256));

export const normalizeUint8 = (value: number): byte =>
  Convert.ToByte(wrapUnsigned(value, 256));

export const normalizeUint8Clamped = (value: number): byte => {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 0 as byte;
  }

  return Convert.ToByte(clamp(round(value), 0, 255));
};

export const normalizeInt16 = (value: number): short =>
  Convert.ToInt16(wrapSigned(value, 65536));

export const normalizeUint16 = (value: number): ushort =>
  Convert.ToUInt16(wrapUnsigned(value, 65536));

export const normalizeInt32 = (value: number): int =>
  toInt(trunc(value));

export const normalizeUint32 = (value: number): uint =>
  Convert.ToUInt32(wrapUnsigned(value, 4294967296));

export const normalizeFloat32 = (value: number): float =>
  Convert.ToSingle(value);

export const normalizeFloat64 = (value: number): double =>
  Convert.ToDouble(value);

export class TypedArrayBase<
  TElement extends number,
  TSelf extends TypedArrayBase<TElement, TSelf>,
> {
  [index: number]: TElement;

  protected readonly data: TElement[];
  private readonly bytesPerElementValue: int;
  private readonly zeroElementValue: TElement;
  private readonly normalizeElementFn: (value: number) => TElement;
  private readonly toNumericValueFn: (value: TElement) => number;
  private readonly wrapFn: (values: TElement[]) => TSelf;

  protected constructor(
    lengthOrValues: int | TypedArrayInput<TElement>,
    bytesPerElement: int,
    zeroValue: TElement,
    normalizeElement: (value: number) => TElement,
    toNumericValue: (value: TElement) => number,
    wrap: (values: TElement[]) => TSelf
  ) {
    this.bytesPerElementValue = bytesPerElement;
    this.zeroElementValue = zeroValue;
    this.normalizeElementFn = normalizeElement;
    this.toNumericValueFn = toNumericValue;
    this.wrapFn = wrap;
    if (typeof lengthOrValues === "number") {
      const length =
        lengthOrValues <= (0 as int) ? (0 as int) : toInt(lengthOrValues);
      this.data = this.createZeroFilled(length);
      return;
    }

    this.data = this.materializeInput(lengthOrValues);
  }

  private createZeroFilled(length: int): TElement[] {
    const result: TElement[] = [];
    for (let index = 0 as int; index < length; index = (index + 1) as int) {
      result.push(this.zeroElementValue);
    }
    return result;
  }

  protected toElementArray(source: Iterable<number>): TElement[] {
    const result: TElement[] = [];
    for (const value of source) {
      result.push(this.normalizeElementFn(value));
    }
    return result;
  }

  protected cloneElements(source: readonly TElement[]): TElement[] {
    const result: TElement[] = [];
    for (let index = 0 as int; index < source.length; index = (index + 1) as int) {
      result.push(this.normalizeElementFn(this.toNumericValueFn(source[index]!)));
    }
    return result;
  }

  protected materializeInput(source: TypedArrayInput<TElement>): TElement[] {
    if (Array.isArray(source)) {
      return this.cloneElements(source);
    }

    return this.toElementArray(source);
  }

  public get byteLength(): int {
    return toInt(this.length * this.bytesPerElementValue);
  }

  public get length(): int {
    return this.data.length as int;
  }

  public at(index: int): TElement | undefined {
    return this.data[index];
  }

  public *entries(): Generator<[int, TElement], undefined, undefined> {
    for (let index = 0 as int; index < this.length; index = (index + 1) as int) {
      yield [index, this.data[index]!];
    }
  }

  public fill(value: number, start?: int, end?: int): TSelf {
    const from = normalizeIndex(start, this.length, 0 as int);
    const to = normalizeIndex(end, this.length, this.length);
    const normalized = this.normalizeElementFn(value);
    for (let index = from; index < to; index = (index + 1) as int) {
      this.data[index] = normalized;
    }
    return this.wrapFn(this.data);
  }

  public includes(value: TElement, fromIndex: int = 0 as int): boolean {
    return this.indexOf(value, fromIndex) >= 0;
  }

  public indexOf(value: TElement, fromIndex: int = 0 as int): int {
    const normalized = this.normalizeElementFn(this.toNumericValueFn(value));
    const normalizedNumeric = this.toNumericValueFn(normalized);
    const start = normalizeIndex(fromIndex, this.length, 0 as int);
    for (let index = start; index < this.length; index = (index + 1) as int) {
      if (
        this.toNumericValueFn(this.data[index] ?? this.zeroElementValue) ===
        normalizedNumeric
      ) {
        return index;
      }
    }
    return -1 as int;
  }

  public join(separator: string = ","): string {
    return this.data.join(separator);
  }

  public reverse(): TSelf {
    this.data.reverse();
    return this.wrapFn(this.data);
  }

  public set(index: int, value: number): void;
  public set(
    source: TypedArrayInput<TElement>,
    offset?: int
  ): void;
  public set(
    sourceOrIndex: int | TypedArrayInput<TElement>,
    offsetOrValue: int | number = 0 as int
  ): void {
    if (typeof sourceOrIndex === "number") {
      let targetIndex: int;
      if (isInt32(sourceOrIndex)) {
        targetIndex = sourceOrIndex;
      } else {
        targetIndex = toInt(sourceOrIndex);
      }
      if (targetIndex < (0 as int) || targetIndex >= this.length) {
        return;
      }
      this.data[targetIndex] = this.normalizeElementFn(offsetOrValue);
      return;
    }

    const items = this.materializeInput(sourceOrIndex);
    const normalizedOffset = isInt32(offsetOrValue)
      ? offsetOrValue
      : toInt(offsetOrValue);
    const start =
      normalizedOffset < (0 as int) ? (0 as int) : normalizedOffset;
    for (let index = 0 as int; index < items.length; index = (index + 1) as int) {
      const targetIndex = toInt(start + index);
      if (targetIndex >= this.length) {
        break;
      }
      this.data[targetIndex] = items[index]!;
    }
  }

  public slice(begin?: int, end?: int): TSelf {
    const start = normalizeIndex(begin, this.length, 0 as int);
    const finish = normalizeIndex(end, this.length, this.length);
    const result: TElement[] = [];
    for (let index = start; index < finish; index = (index + 1) as int) {
      result.push(this.data[index]!);
    }
    return this.wrapFn(result);
  }

  public sort(compareFn?: (left: TElement, right: TElement) => number): TSelf {
    this.data.sort((left, right) =>
      compareFn
        ? compareFn(left, right)
        : this.toNumericValueFn(left) - this.toNumericValueFn(right)
    );
    return this.wrapFn(this.data);
  }

  public subarray(begin?: int, end?: int): TSelf {
    return this.slice(begin, end);
  }

  public *keys(): Generator<int, undefined, undefined> {
    for (let index = 0 as int; index < this.length; index = (index + 1) as int) {
      yield index;
    }
  }

  public *values(): Generator<TElement, undefined, undefined> {
    for (let index = 0 as int; index < this.length; index = (index + 1) as int) {
      yield this.data[index]!;
    }
  }

  public [Symbol.iterator](): Generator<TElement, undefined, undefined> {
    return this.values();
  }
}
