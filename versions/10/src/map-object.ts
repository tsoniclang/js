import type { int } from "@tsonic/core/types.js";
import { List } from "@tsonic/dotnet/System.Collections.Generic.js";
import { sameValueZero } from "./same-value-zero.js";

type MapEntry<K, V> = {
  readonly key: K;
  value: V;
};

export class MapObject<K, V> {
  private readonly entriesStore: List<MapEntry<K, V>> = new List<
    MapEntry<K, V>
  >();

  public constructor(entries?: readonly (readonly [K, V])[] | null) {
    if (!entries) {
      return;
    }

    for (const [key, value] of entries) {
      this.set(key, value);
    }
  }

  public get size(): int {
    return this.entriesStore.Count;
  }

  private findIndex(key: K): int {
    for (let i = 0 as int; i < this.entriesStore.Count; i = (i + 1) as int) {
      if (sameValueZero(this.entriesStore[i]!.key, key)) {
        return i;
      }
    }
    return -1 as int;
  }

  public clear(): void {
    this.entriesStore.Clear();
  }

  public delete(key: K): boolean {
    const index = this.findIndex(key);
    if (index < 0) {
      return false;
    }
    this.entriesStore.RemoveAt(index);
    return true;
  }

  public *entries(): IterableIterator<[K, V]> {
    for (let i = 0 as int; i < this.entriesStore.Count; i = (i + 1) as int) {
      const entry = this.entriesStore[i]!;
      yield [entry.key, entry.value];
    }
  }

  public forEach(callback: (value: V, key: K, map: Map<K, V>) => void): void {
    for (let i = 0 as int; i < this.entriesStore.Count; i = (i + 1) as int) {
      const entry = this.entriesStore[i]!;
      callback(entry.value, entry.key, this);
    }
  }

  public get(key: K): V | undefined {
    const index = this.findIndex(key);
    return index < 0 ? undefined : this.entriesStore[index]!.value;
  }

  public has(key: K): boolean {
    return this.findIndex(key) >= 0;
  }

  public *keys(): IterableIterator<K> {
    for (let i = 0 as int; i < this.entriesStore.Count; i = (i + 1) as int) {
      yield this.entriesStore[i]!.key;
    }
  }

  public set(key: K, value: V): this {
    const index = this.findIndex(key);
    if (index >= 0) {
      this.entriesStore[index]!.value = value;
      return this;
    }

    this.entriesStore.Add({ key, value });
    return this;
  }

  public *values(): IterableIterator<V> {
    for (let i = 0 as int; i < this.entriesStore.Count; i = (i + 1) as int) {
      yield this.entriesStore[i]!.value;
    }
  }

  public [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }
}
