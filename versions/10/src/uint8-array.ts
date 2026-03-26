import type { int } from "@tsonic/core/types.js";
import { IndexIterator } from "./index-iterator.js";
import { toInt } from "./int32.js";

const normalizeByte = (value: number): number => {
  const truncated = Math.trunc(value) & 0xff;
  return truncated < 0 ? truncated + 256 : truncated;
};

const normalizeIndex = (
  value: int | undefined,
  length: int,
  fallback: int
): int => {
  if (value === undefined) {
    return fallback;
  }

  const truncated = toInt(Math.trunc(value));
  if (truncated < 0) {
    const fromEnd = toInt(length + truncated);
    return fromEnd < (0 as int) ? (0 as int) : fromEnd;
  }
  if (truncated > length) {
    return length;
  }
  return truncated;
};

const toArrayLike = (source: ArrayLike<number>): number[] => {
  const result: number[] = [];
  for (let index = 0 as int; index < source.length; index = (index + 1) as int) {
    result.push(normalizeByte(source[index]!));
  }
  return result;
};

const toIterableArray = (source: Iterable<number>): number[] => {
  const result: number[] = [];
  for (const value of source) {
    result.push(normalizeByte(value));
  }
  return result;
};

const toArray = (
  source: Iterable<number> | ArrayLike<number>
): number[] => {
  if (Array.isArray(source)) {
    return toArrayLike(source as readonly number[]);
  }

  return toIterableArray(source as Iterable<number>);
};

const createZeroFilled = (length: int): number[] => {
  const result: number[] = [];
  for (let index = 0 as int; index < length; index = (index + 1) as int) {
    result.push(0);
  }
  return result;
};

export class Uint8Array {
  [index: number]: number;

  public static readonly BYTES_PER_ELEMENT: number = 1;

  private readonly data: number[];

  public constructor(length: int);
  public constructor(values: Iterable<number> | ArrayLike<number>);
  public constructor(lengthOrValues: int | Iterable<number> | ArrayLike<number>) {
    if (typeof lengthOrValues === "number") {
      this.data = createZeroFilled(
        lengthOrValues <= (0 as int) ? (0 as int) : lengthOrValues
      );
      return;
    }

    this.data = toArray(lengthOrValues);
  }

  public get byteLength(): int {
    return this.data.length as int;
  }

  public get length(): int {
    return this.data.length as int;
  }

  public at(index: int): number | undefined {
    return this.data[index];
  }

  public entries(): IterableIterator<[int, number]> {
    return new IndexIterator(
      () => this.length,
      (index) => [index, this.data[index]!] as [int, number]
    );
  }

  public fill(value: number, start?: int, end?: int): Uint8Array {
    const from = normalizeIndex(start, this.length, 0 as int);
    const to = normalizeIndex(end, this.length, this.length);
    const normalized = normalizeByte(value);
    for (let index = from; index < to; index = (index + 1) as int) {
      this.data[index] = normalized;
    }
    return this;
  }

  public includes(value: number, fromIndex: int = 0 as int): boolean {
    return this.indexOf(value, fromIndex) >= 0;
  }

  public indexOf(value: number, fromIndex: int = 0 as int): int {
    const normalized = normalizeByte(value);
    const start = normalizeIndex(fromIndex, this.length, 0 as int);
    for (let index = start; index < this.length; index = (index + 1) as int) {
      if ((this.data[index] ?? -1) === normalized) {
        return index;
      }
    }
    return -1 as int;
  }

  public join(separator: string = ","): string {
    return this.data.join(separator);
  }

  public keys(): IterableIterator<int> {
    return new IndexIterator(
      () => this.length,
      (index) => index
    );
  }

  public reverse(): Uint8Array {
    this.data.reverse();
    return this;
  }

  public set(
    source: Iterable<number> | ArrayLike<number>,
    offset: int = 0 as int
  ): void {
    const items = toArray(source);
    const start = offset < (0 as int) ? (0 as int) : offset;
    for (let index = 0 as int; index < items.length; index = (index + 1) as int) {
      const targetIndex = toInt(start + index);
      if (targetIndex >= this.length) {
        break;
      }
      this.data[targetIndex] = items[index]!;
    }
  }

  public slice(begin?: int, end?: int): Uint8Array {
    const start = normalizeIndex(begin, this.length, 0 as int);
    const finish = normalizeIndex(end, this.length, this.length);
    const result: number[] = [];
    for (let index = start; index < finish; index = (index + 1) as int) {
      result.push(this.data[index]!);
    }
    return new Uint8Array(result);
  }

  public sort(compareFn?: (left: number, right: number) => number): Uint8Array {
    this.data.sort((left, right) =>
      compareFn ? compareFn(left, right) : left - right
    );
    return this;
  }

  public subarray(begin?: int, end?: int): Uint8Array {
    return this.slice(begin, end);
  }

  public values(): IterableIterator<number> {
    return new IndexIterator(
      () => this.length,
      (index) => this.data[index]!
    );
  }

  public [Symbol.iterator](): IterableIterator<number> {
    return this.values();
  }
}
