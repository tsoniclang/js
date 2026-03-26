import type { int } from "@tsonic/core/types.js";
import { toInt } from "./int32.js";

const clampIndex = (
  value: int | undefined,
  length: int,
  fallback: int
): int => {
  if (value === undefined) {
    return fallback;
  }

  const normalized = toInt(Math.trunc(value));
  if (normalized < 0) {
    const fromEnd = toInt(length + normalized);
    return fromEnd < (0 as int) ? (0 as int) : fromEnd;
  }
  if (normalized > length) {
    return length;
  }
  return normalized;
};

const zeroBytes = (length: int): number[] => {
  const result: number[] = [];
  for (let index = 0 as int; index < length; index = (index + 1) as int) {
    result.push(0);
  }
  return result;
};

export class ArrayBufferObject {
  private readonly bytes: number[];

  public constructor(byteLength: int) {
    this.bytes = zeroBytes(byteLength < (0 as int) ? (0 as int) : byteLength);
  }

  public get byteLength(): int {
    return this.bytes.length as int;
  }

  public slice(begin?: int, end?: int): ArrayBuffer {
    const start = clampIndex(begin, this.byteLength, 0 as int);
    const finish = clampIndex(end, this.byteLength, this.byteLength);
    const length = finish > start ? toInt(finish - start) : (0 as int);
    return new ArrayBufferObject(length);
  }
}
