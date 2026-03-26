import type { int } from "@tsonic/core/types.js";
import { List } from "@tsonic/dotnet/System.Collections.Generic.js";
import { sameValueZero } from "./same-value-zero.js";

export class SetObject<T> {
  private readonly valuesStore: List<T> = new List<T>();

  public constructor(values?: readonly T[] | null) {
    if (!values) {
      return;
    }

    for (const value of values) {
      this.add(value);
    }
  }

  public get size(): int {
    return this.valuesStore.Count;
  }

  private findIndex(value: T): int {
    for (let i = 0 as int; i < this.valuesStore.Count; i = (i + 1) as int) {
      if (sameValueZero(this.valuesStore[i], value)) {
        return i;
      }
    }
    return -1 as int;
  }

  public add(value: T): this {
    if (!this.has(value)) {
      this.valuesStore.Add(value);
    }
    return this;
  }

  public clear(): void {
    this.valuesStore.Clear();
  }

  public delete(value: T): boolean {
    const index = this.findIndex(value);
    if (index < 0) {
      return false;
    }
    this.valuesStore.RemoveAt(index);
    return true;
  }

  public *entries(): IterableIterator<[T, T]> {
    for (let i = 0 as int; i < this.valuesStore.Count; i = (i + 1) as int) {
      const value = this.valuesStore[i]!;
      yield [value, value];
    }
  }

  public forEach(callback: (value: T, key: T, set: Set<T>) => void): void {
    for (let i = 0 as int; i < this.valuesStore.Count; i = (i + 1) as int) {
      const value = this.valuesStore[i]!;
      callback(value, value, this);
    }
  }

  public has(value: T): boolean {
    return this.findIndex(value) >= 0;
  }

  public keys(): IterableIterator<T> {
    return this.values();
  }

  public *values(): IterableIterator<T> {
    for (let i = 0 as int; i < this.valuesStore.Count; i = (i + 1) as int) {
      yield this.valuesStore[i]!;
    }
  }

  public [Symbol.iterator](): IterableIterator<T> {
    return this.values();
  }
}
