import type { int } from "@tsonic/core/types.js";
import { List } from "@tsonic/dotnet/System.Collections.Generic.js";
import { sameValueZero } from "./same-value-zero.js";

type WeakMapEntry<K extends object, V> = {
  readonly key: K;
  value: V;
};

export class WeakMap<K extends object, V> {
  private readonly entriesStore: List<WeakMapEntry<K, V>> = new List<
    WeakMapEntry<K, V>
  >();

  public constructor(entries?: readonly (readonly [K, V])[] | null) {
    if (!entries) {
      return;
    }

    for (const [key, value] of entries) {
      this.set(key, value);
    }
  }

  private findIndex(key: K): int {
    for (let index = 0 as int; index < this.entriesStore.Count; index = (index + 1) as int) {
      if (sameValueZero(this.entriesStore[index]!.key, key)) {
        return index;
      }
    }

    return -1 as int;
  }

  public delete(key: K): boolean {
    const index = this.findIndex(key);
    if (index < 0) {
      return false;
    }

    this.entriesStore.RemoveAt(index);
    return true;
  }

  public get(key: K): V | undefined {
    const index = this.findIndex(key);
    return index < 0 ? undefined : this.entriesStore[index]!.value;
  }

  public has(key: K): boolean {
    return this.findIndex(key) >= 0;
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
}
