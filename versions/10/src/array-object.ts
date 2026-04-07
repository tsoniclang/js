import type { double, int, JsValue } from "@tsonic/core/types.js";
import { overloads as O } from "@tsonic/core/lang.js";
import { List } from "@tsonic/dotnet/System.Collections.Generic.js";
import { sameValueZero } from "./same-value-zero.js";

type JsRuntimeValue = JsValue | undefined;

const mapString = (source: string): string[] => {
  const values = new List<string>();
  for (let i = 0 as int; i < source.length; i = (i + 1) as int) {
    values.Add(source[i]!);
  }
  return values.ToArray();
};

const mapStringMapped = <TResult>(
  source: string,
  mapfn: (value: string, index: int) => TResult
): TResult[] => {
  const mapped = new List<TResult>();
  for (let i = 0 as int; i < source.length; i = (i + 1) as int) {
    mapped.Add(mapfn(source[i]!, i));
  }
  return mapped.ToArray();
};

const mapIterable = <T>(source: Iterable<T>): T[] => {
  const values = new List<T>();
  for (const value of source) {
    values.Add(value);
  }
  return values.ToArray();
};

const mapIterableMapped = <T, TResult>(
  source: Iterable<T>,
  mapfn: (value: T, index: int) => TResult
): TResult[] => {
  const mapped = new List<TResult>();
  let index = 0 as int;
  for (const value of source) {
    mapped.Add(mapfn(value, index));
    index = (index + 1) as int;
  }
  return mapped.ToArray();
};

const wrapArray = <T>(values: readonly T[] | T[]): Array<T> => {
  const array = new Array<T>();
  for (const value of values) {
    array.push(value);
  }
  return array;
};

const cloneList = <T>(source: List<T>): List<T> => {
  const clone = new List<T>();
  for (let i = 0 as int; i < source.Count; i = (i + 1) as int) {
    clone.Add(source[i]!);
  }
  return clone;
};

const normalizeRelativeIndex = (index: int, length: int): int => {
  if (index < 0) {
    const normalized = (length + index) as int;
    return normalized < 0 ? (0 as int) : normalized;
  }

  return index > length ? length : index;
};

const normalizeElementIndex = (index: int, length: int): int => {
  if (index < 0) {
    const normalized = (length + index) as int;
    return normalized < 0 ? (-1 as int) : normalized;
  }

  return index >= length ? (-1 as int) : index;
};

const appendList = <T>(target: List<T>, source: List<T>): void => {
  for (let i = 0 as int; i < source.Count; i = (i + 1) as int) {
    target.Add(source[i]!);
  }
};

const appendFlattened = (
  target: List<JsRuntimeValue>,
  value: JsRuntimeValue,
  depth: int
): void => {
  if (depth > 0 && isIterableObject(value)) {
    for (const item of value as Iterable<JsRuntimeValue>) {
      appendFlattened(target, item, (depth - 1) as int);
    }
    return;
  }

  target.Add(value);
};

const isIterableObject = (value: JsRuntimeValue): value is Iterable<JsRuntimeValue> => {
  if (value === null || value === undefined || typeof value !== "object") {
    return false;
  }

  const iterator = (value as { readonly [Symbol.iterator]?: JsRuntimeValue })[
    Symbol.iterator
  ];
  return typeof iterator === "function";
};

export class Array<T = JsValue> {
  private readonly valuesStore: List<T> = new List<T>();

  public constructor(
    lengthOrFirstItem?: int | T,
    ...items: T[]
  ) {
    if (items.length > 0) {
      for (const item of [lengthOrFirstItem as T, ...items]) {
        this.valuesStore.Add(item);
      }
      return;
    }

    if (lengthOrFirstItem === undefined) {
      return;
    }

    if (typeof lengthOrFirstItem === "number") {
      for (let i = 0 as int; i < lengthOrFirstItem; i = (i + 1) as int) {
        this.valuesStore.Add(undefined as T);
      }
      return;
    }

    this.valuesStore.Add(lengthOrFirstItem as T);
  }

  public static isArray(
    _value: JsRuntimeValue
  ): _value is readonly JsRuntimeValue[] | JsRuntimeValue[] {
    throw new Error("Array.isArray must be lowered by the compiler.");
  }

  public static from(source: string): string[];
  public static from<TResult>(
    source: string,
    mapfn: (value: string, index: int) => TResult
  ): TResult[];
  public static from<T>(source: Iterable<T>): T[];
  public static from<T, TResult>(
    source: Iterable<T>,
    mapfn: (value: T, index: int) => TResult
  ): TResult[];
  public static from(_source: any, _mapfn?: any): any {
    throw new Error("stub");
  }

  public static from_string(source: string): string[] {
    return mapString(source);
  }

  public static from_stringMapped<TResult>(
    source: string,
    mapfn: (value: string, index: int) => TResult
  ): TResult[] {
    return mapStringMapped(source, mapfn);
  }

  public static from_iterable<T>(source: Iterable<T>): T[] {
    return mapIterable(source);
  }

  public static from_iterableMapped<T, TResult>(
    source: Iterable<T>,
    mapfn: (value: T, index: int) => TResult
  ): TResult[] {
    return mapIterableMapped(source, mapfn);
  }

  public static of<T>(...items: T[]): T[] {
    return items;
  }

  public get length(): int {
    return this.valuesStore.Count;
  }

  public toArray(): T[] {
    return this.valuesStore.ToArray();
  }

  private createWrapped<TResult>(values: readonly TResult[] | TResult[]): Array<TResult> {
    return wrapArray(values);
  }

  public at(index: int): T {
    const normalized = normalizeElementIndex(index, this.valuesStore.Count);
    return normalized < 0 ? (undefined as T) : this.valuesStore[normalized]!;
  }

  public concat(...items: JsValue[]): Array<T> {
    const merged = cloneList(this.valuesStore);
    for (const item of items) {
      if (isIterableObject(item)) {
        for (const value of item as Iterable<T>) {
          merged.Add(value);
        }
        continue;
      }

      merged.Add(item as T);
    }
    return this.createWrapped(merged.ToArray());
  }

  public copyWithin(target: int, start?: int, end?: int): this {
    const values = this.toArray();
    const length = values.length as int;
    const to = normalizeRelativeIndex(target, length);
    const from = normalizeRelativeIndex(start ?? (0 as int), length);
    const final = normalizeRelativeIndex(end ?? length, length);
    const copied = values.slice(from, final);
    for (let i = 0 as int; i < copied.length; i = (i + 1) as int) {
      const destination = (to + i) as int;
      if (destination >= length) {
        break;
      }
      values[destination] = copied[i]!;
    }
    this.valuesStore.Clear();
    for (const value of values) {
      this.valuesStore.Add(value);
    }
    return this;
  }

  public entries(): IterableIterator<[int, T], undefined, undefined> {
    return (function* (self: Array<T>): Generator<[int, T], undefined, undefined> {
      for (let i = 0 as int; i < self.length; i = (i + 1) as int) {
        yield [i, self.valuesStore[i]!];
      }
    })(this);
  }

  public every(callback: (value: T) => boolean): boolean;
  public every(callback: (value: T, index: int, array: T[]) => boolean): boolean;
  public every(_callback: any): any {
    throw new Error("stub");
  }

  public every_value(callback: (value: T) => boolean): boolean {
    return this.every_full((value, _index, _array) => callback(value));
  }

  public every_full(
    callback: (value: T, index: int, array: T[]) => boolean
  ): boolean {
    for (let i = 0 as int; i < this.valuesStore.Count; i = (i + 1) as int) {
      if (!callback(this.valuesStore[i]!, i, this.toArray())) {
        return false;
      }
    }
    return true;
  }

  public fill(value: T, start?: int, end?: int): this {
    const length = this.valuesStore.Count;
    const from = normalizeRelativeIndex(start ?? (0 as int), length);
    const to = normalizeRelativeIndex(end ?? length, length);
    for (let i = from; i < to; i = (i + 1) as int) {
      this.valuesStore[i] = value;
    }
    return this;
  }

  public filter(callback: (value: T) => boolean): Array<T>;
  public filter(callback: (value: T, index: int) => boolean): Array<T>;
  public filter(
    callback: (value: T, index: int, array: readonly T[]) => boolean
  ): Array<T>;
  public filter(_callback: any): any {
    throw new Error("stub");
  }

  public filter_value(callback: (value: T) => boolean): Array<T> {
    return this.filter_full((value, _index, _array) => callback(value));
  }

  public filter_valueIndex(callback: (value: T, index: int) => boolean): Array<T> {
    return this.filter_full((value, index, _array) => callback(value, index));
  }

  public filter_full(
    callback: (value: T, index: int, array: readonly T[]) => boolean
  ): Array<T> {
    const filtered = new List<T>();
    for (let i = 0 as int; i < this.valuesStore.Count; i = (i + 1) as int) {
      const value = this.valuesStore[i]!;
      if (callback(value, i, this.toArray())) {
        filtered.Add(value);
      }
    }
    return this.createWrapped(filtered.ToArray());
  }

  public find(callback: (value: T) => boolean): T | undefined;
  public find(callback: (value: T, index: int) => boolean): T | undefined;
  public find(
    callback: (value: T, index: int, array: readonly T[]) => boolean
  ): T | undefined;
  public find(_callback: any): any {
    throw new Error("stub");
  }

  public find_value(callback: (value: T) => boolean): T | undefined {
    return this.find_full((value, _index, _array) => callback(value));
  }

  public find_valueIndex(callback: (value: T, index: int) => boolean): T | undefined {
    return this.find_full((value, index, _array) => callback(value, index));
  }

  public find_full(
    callback: (value: T, index: int, array: readonly T[]) => boolean
  ): T | undefined {
    for (let i = 0 as int; i < this.valuesStore.Count; i = (i + 1) as int) {
      const value = this.valuesStore[i]!;
      if (callback(value, i, this.toArray())) {
        return value;
      }
    }
    return undefined;
  }

  public findIndex(callback: (value: T) => boolean): int;
  public findIndex(callback: (value: T, index: int) => boolean): int;
  public findIndex(
    callback: (value: T, index: int, array: readonly T[]) => boolean
  ): int;
  public findIndex(_callback: any): any {
    throw new Error("stub");
  }

  public findIndex_value(callback: (value: T) => boolean): int {
    return this.findIndex_full((value, _index, _array) => callback(value));
  }

  public findIndex_valueIndex(callback: (value: T, index: int) => boolean): int {
    return this.findIndex_full((value, index, _array) => callback(value, index));
  }

  public findIndex_full(
    callback: (value: T, index: int, array: readonly T[]) => boolean
  ): int {
    for (let i = 0 as int; i < this.valuesStore.Count; i = (i + 1) as int) {
      if (callback(this.valuesStore[i]!, i, this.toArray())) {
        return i;
      }
    }
    return -1 as int;
  }

  public findLast(callback: (value: T) => boolean): T | undefined;
  public findLast(callback: (value: T, index: int) => boolean): T | undefined;
  public findLast(
    callback: (value: T, index: int, array: readonly T[]) => boolean
  ): T | undefined;
  public findLast(_callback: any): any {
    throw new Error("stub");
  }

  public findLast_value(callback: (value: T) => boolean): T | undefined {
    return this.findLast_full((value, _index, _array) => callback(value));
  }

  public findLast_valueIndex(callback: (value: T, index: int) => boolean): T | undefined {
    return this.findLast_full((value, index, _array) => callback(value, index));
  }

  public findLast_full(
    callback: (value: T, index: int, array: readonly T[]) => boolean
  ): T | undefined {
    for (let i = (this.valuesStore.Count - 1) as int; i >= 0; i = (i - 1) as int) {
      const value = this.valuesStore[i]!;
      if (callback(value, i, this.toArray())) {
        return value;
      }
    }
    return undefined;
  }

  public findLastIndex(callback: (value: T) => boolean): int;
  public findLastIndex(callback: (value: T, index: int) => boolean): int;
  public findLastIndex(
    callback: (value: T, index: int, array: readonly T[]) => boolean
  ): int;
  public findLastIndex(_callback: any): any {
    throw new Error("stub");
  }

  public findLastIndex_value(callback: (value: T) => boolean): int {
    return this.findLastIndex_full((value, _index, _array) => callback(value));
  }

  public findLastIndex_valueIndex(
    callback: (value: T, index: int) => boolean
  ): int {
    return this.findLastIndex_full((value, index, _array) =>
      callback(value, index)
    );
  }

  public findLastIndex_full(
    callback: (value: T, index: int, array: readonly T[]) => boolean
  ): int {
    for (let i = (this.valuesStore.Count - 1) as int; i >= 0; i = (i - 1) as int) {
      if (callback(this.valuesStore[i]!, i, this.toArray())) {
        return i;
      }
    }
    return -1 as int;
  }

  public flat(depth: int = 1 as int): Array<JsRuntimeValue> {
    const flattened = new List<JsRuntimeValue>();
    for (let i = 0 as int; i < this.valuesStore.Count; i = (i + 1) as int) {
      appendFlattened(flattened, this.valuesStore[i] as JsRuntimeValue, depth);
    }
    return this.createWrapped(flattened.ToArray());
  }

  public flatMap<TResult>(
    callback: (value: T, index: int, array: T[]) => JsRuntimeValue
  ): Array<TResult> {
    const flattened = new List<JsRuntimeValue>();
    for (let i = 0 as int; i < this.valuesStore.Count; i = (i + 1) as int) {
      appendFlattened(flattened, callback(this.valuesStore[i]!, i, this.toArray()), 1 as int);
    }
    return this.createWrapped(flattened.ToArray() as TResult[]);
  }

  public forEach(callback: (value: T) => void): void;
  public forEach(callback: (value: T, index: int) => void): void;
  public forEach(callback: (value: T, index: int, array: T[]) => void): void;
  public forEach(_callback: any): any {
    throw new Error("stub");
  }

  public forEach_value(callback: (value: T) => void): void {
    this.forEach_full((value, _index, _array) => callback(value));
  }

  public forEach_valueIndex(callback: (value: T, index: int) => void): void {
    this.forEach_full((value, index, _array) => callback(value, index));
  }

  public forEach_full(callback: (value: T, index: int, array: T[]) => void): void {
    for (let i = 0 as int; i < this.valuesStore.Count; i = (i + 1) as int) {
      callback(this.valuesStore[i]!, i, this.toArray());
    }
  }

  public includes(searchElement: T): boolean {
    return this.indexOf(searchElement) >= 0;
  }

  public indexOf(searchElement: T, fromIndex: int = 0 as int): int {
    const start = normalizeRelativeIndex(fromIndex, this.valuesStore.Count);
    for (let i = start; i < this.valuesStore.Count; i = (i + 1) as int) {
      if (sameValueZero(this.valuesStore[i], searchElement)) {
        return i;
      }
    }
    return -1 as int;
  }

  public join(separator: string = ","): string {
    let text = "";
    for (let i = 0 as int; i < this.valuesStore.Count; i = (i + 1) as int) {
      if (i > 0) {
        text += separator;
      }
      text += String((this.valuesStore[i] as JsRuntimeValue) ?? "");
    }
    return text;
  }

  public keys(): IterableIterator<int, undefined, undefined> {
    return (function* (self: Array<T>): Generator<int, undefined, undefined> {
      for (let i = 0 as int; i < self.length; i = (i + 1) as int) {
        yield i;
      }
    })(this);
  }

  public lastIndexOf(searchElement: T, fromIndex?: int): int {
    const start =
      fromIndex === undefined
        ? (this.valuesStore.Count - 1) as int
        : normalizeElementIndex(fromIndex, this.valuesStore.Count);
    for (let i = start; i >= 0; i = (i - 1) as int) {
      if (sameValueZero(this.valuesStore[i], searchElement)) {
        return i;
      }
    }
    return -1 as int;
  }

  public map<TResult>(callback: (value: T) => TResult): Array<TResult>;
  public map<TResult>(callback: (value: T, index: int) => TResult): Array<TResult>;
  public map<TResult>(callback: (value: T, index: int, array: T[]) => TResult): Array<TResult>;
  public map(_callback: any): any {
    throw new Error("stub");
  }

  public map_value<TResult>(callback: (value: T) => TResult): Array<TResult> {
    return this.map_full((value, _index, _array) => callback(value));
  }

  public map_valueIndex<TResult>(
    callback: (value: T, index: int) => TResult
  ): Array<TResult> {
    return this.map_full((value, index, _array) => callback(value, index));
  }

  public map_full<TResult>(
    callback: (value: T, index: int, array: T[]) => TResult
  ): Array<TResult> {
    const mapped = new List<TResult>();
    for (let i = 0 as int; i < this.valuesStore.Count; i = (i + 1) as int) {
      mapped.Add(callback(this.valuesStore[i]!, i, this.toArray()));
    }
    return this.createWrapped(mapped.ToArray());
  }

  public pop(): T {
    if (this.valuesStore.Count === 0) {
      return undefined as T;
    }
    const index = (this.valuesStore.Count - 1) as int;
    const value = this.valuesStore[index]!;
    this.valuesStore.RemoveAt(index);
    return value;
  }

  public push(...items: T[]): int {
    for (const item of items) {
      this.valuesStore.Add(item);
    }
    return this.valuesStore.Count;
  }

  public reduce(callback: (previousValue: T, currentValue: T) => T): T;
  public reduce(
    callback: (previousValue: T, currentValue: T, index: int) => T
  ): T;
  public reduce(
    callback: (
      previousValue: T,
      currentValue: T,
      index: int,
      array: T[]
    ) => T
  ): T;
  public reduce(
    callback: (previousValue: T, currentValue: T) => T,
    initialValue: T
  ): T;
  public reduce(
    callback: (previousValue: T, currentValue: T, index: int) => T,
    initialValue: T
  ): T;
  public reduce(
    callback: (
      previousValue: T,
      currentValue: T,
      index: int,
      array: T[]
    ) => T,
    initialValue: T
  ): T;
  public reduce<TResult>(
    callback: (previousValue: TResult, currentValue: T) => TResult,
    initialValue: TResult
  ): TResult;
  public reduce<TResult>(
    callback: (previousValue: TResult, currentValue: T, index: int) => TResult,
    initialValue: TResult
  ): TResult;
  public reduce<TResult>(
    callback: (
      previousValue: TResult,
      currentValue: T,
      index: int,
      array: T[]
    ) => TResult,
    initialValue: TResult
  ): TResult;
  public reduce(_callback: any, _initialValue?: any): any {
    throw new Error("stub");
  }

  public reduce_pair_noInitial(
    callback: (previousValue: T, currentValue: T) => T
  ): T {
    return this.reduce_full_noInitial((previousValue, currentValue, _index, _array) =>
      callback(previousValue, currentValue)
    );
  }

  public reduce_pairIndex_noInitial(
    callback: (previousValue: T, currentValue: T, index: int) => T
  ): T {
    return this.reduce_full_noInitial((previousValue, currentValue, index, _array) =>
      callback(previousValue, currentValue, index)
    );
  }

  public reduce_full_noInitial(
    callback: (
      previousValue: T,
      currentValue: T,
      index: int,
      array: T[]
    ) => T
  ): T {
    if (this.valuesStore.Count === 0) {
      throw new Error("Reduce of empty array with no initial value.");
    }

    let accumulator: T = this.valuesStore[0]!;
    for (
      let index = 1 as int;
      index < this.valuesStore.Count;
      index = (index + 1) as int
    ) {
      accumulator = callback(
        accumulator,
        this.valuesStore[index]!,
        index,
        this.toArray()
      );
    }

    return accumulator;
  }

  public reduce_pair_sameInitial(
    callback: (previousValue: T, currentValue: T) => T,
    initialValue: T
  ): T {
    return this.reduce_full_sameInitial((previousValue, currentValue, _index, _array) =>
      callback(previousValue, currentValue), initialValue);
  }

  public reduce_pairIndex_sameInitial(
    callback: (previousValue: T, currentValue: T, index: int) => T,
    initialValue: T
  ): T {
    return this.reduce_full_sameInitial((previousValue, currentValue, index, _array) =>
      callback(previousValue, currentValue, index), initialValue);
  }

  public reduce_full_sameInitial(
    callback: (
      previousValue: T,
      currentValue: T,
      index: int,
      array: T[]
    ) => T,
    initialValue: T
  ): T {
    let accumulator = initialValue;
    for (
      let index = 0 as int;
      index < this.valuesStore.Count;
      index = (index + 1) as int
    ) {
      accumulator = callback(
        accumulator,
        this.valuesStore[index]!,
        index,
        this.toArray()
      );
    }

    return accumulator;
  }

  public reduce_pair_withInitial<TResult>(
    callback: (previousValue: TResult, currentValue: T) => TResult,
    initialValue: TResult
  ): TResult {
    return this.reduce_full_withInitial((previousValue, currentValue, _index, _array) =>
      callback(previousValue, currentValue), initialValue);
  }

  public reduce_pairIndex_withInitial<TResult>(
    callback: (previousValue: TResult, currentValue: T, index: int) => TResult,
    initialValue: TResult
  ): TResult {
    return this.reduce_full_withInitial((previousValue, currentValue, index, _array) =>
      callback(previousValue, currentValue, index), initialValue);
  }

  public reduce_full_withInitial<TResult>(
    callback: (
      previousValue: TResult,
      currentValue: T,
      index: int,
      array: T[]
    ) => TResult,
    initialValue: TResult
  ): TResult {
    let accumulator = initialValue;
    for (
      let index = 0 as int;
      index < this.valuesStore.Count;
      index = (index + 1) as int
    ) {
      accumulator = callback(
        accumulator,
        this.valuesStore[index]!,
        index,
        this.toArray()
      );
    }

    return accumulator;
  }

  public reduceRight(callback: (previousValue: T, currentValue: T) => T): T;
  public reduceRight(
    callback: (previousValue: T, currentValue: T, index: int) => T
  ): T;
  public reduceRight(
    callback: (
      previousValue: T,
      currentValue: T,
      index: int,
      array: T[]
    ) => T
  ): T;
  public reduceRight(
    callback: (previousValue: T, currentValue: T) => T,
    initialValue: T
  ): T;
  public reduceRight(
    callback: (previousValue: T, currentValue: T, index: int) => T,
    initialValue: T
  ): T;
  public reduceRight(
    callback: (
      previousValue: T,
      currentValue: T,
      index: int,
      array: T[]
    ) => T,
    initialValue: T
  ): T;
  public reduceRight<TResult>(
    callback: (previousValue: TResult, currentValue: T) => TResult,
    initialValue: TResult
  ): TResult;
  public reduceRight<TResult>(
    callback: (previousValue: TResult, currentValue: T, index: int) => TResult,
    initialValue: TResult
  ): TResult;
  public reduceRight<TResult>(
    callback: (
      previousValue: TResult,
      currentValue: T,
      index: int,
      array: T[]
    ) => TResult,
    initialValue: TResult
  ): TResult;
  public reduceRight(_callback: any, _initialValue?: any): any {
    throw new Error("stub");
  }

  public reduceRight_pair_noInitial(
    callback: (previousValue: T, currentValue: T) => T
  ): T {
    return this.reduceRight_full_noInitial((previousValue, currentValue, _index, _array) =>
      callback(previousValue, currentValue)
    );
  }

  public reduceRight_pairIndex_noInitial(
    callback: (previousValue: T, currentValue: T, index: int) => T
  ): T {
    return this.reduceRight_full_noInitial((previousValue, currentValue, index, _array) =>
      callback(previousValue, currentValue, index)
    );
  }

  public reduceRight_full_noInitial(
    callback: (
      previousValue: T,
      currentValue: T,
      index: int,
      array: T[]
    ) => T
  ): T {
    if (this.valuesStore.Count === 0) {
      throw new Error("Reduce of empty array with no initial value.");
    }

    let accumulator: T = this.valuesStore[(this.valuesStore.Count - 1) as int]!;
    for (
      let index = (this.valuesStore.Count - 2) as int;
      index >= 0;
      index = (index - 1) as int
    ) {
      accumulator = callback(
        accumulator,
        this.valuesStore[index]!,
        index,
        this.toArray()
      );
    }

    return accumulator;
  }

  public reduceRight_pair_sameInitial(
    callback: (previousValue: T, currentValue: T) => T,
    initialValue: T
  ): T {
    return this.reduceRight_full_sameInitial((previousValue, currentValue, _index, _array) =>
      callback(previousValue, currentValue), initialValue);
  }

  public reduceRight_pairIndex_sameInitial(
    callback: (previousValue: T, currentValue: T, index: int) => T,
    initialValue: T
  ): T {
    return this.reduceRight_full_sameInitial((previousValue, currentValue, index, _array) =>
      callback(previousValue, currentValue, index), initialValue);
  }

  public reduceRight_full_sameInitial(
    callback: (
      previousValue: T,
      currentValue: T,
      index: int,
      array: T[]
    ) => T,
    initialValue: T
  ): T {
    let accumulator = initialValue;
    for (
      let index = (this.valuesStore.Count - 1) as int;
      index >= 0;
      index = (index - 1) as int
    ) {
      accumulator = callback(
        accumulator,
        this.valuesStore[index]!,
        index,
        this.toArray()
      );
    }

    return accumulator;
  }

  public reduceRight_pair_withInitial<TResult>(
    callback: (previousValue: TResult, currentValue: T) => TResult,
    initialValue: TResult
  ): TResult {
    return this.reduceRight_full_withInitial((previousValue, currentValue, _index, _array) =>
      callback(previousValue, currentValue), initialValue);
  }

  public reduceRight_pairIndex_withInitial<TResult>(
    callback: (previousValue: TResult, currentValue: T, index: int) => TResult,
    initialValue: TResult
  ): TResult {
    return this.reduceRight_full_withInitial((previousValue, currentValue, index, _array) =>
      callback(previousValue, currentValue, index), initialValue);
  }

  public reduceRight_full_withInitial<TResult>(
    callback: (
      previousValue: TResult,
      currentValue: T,
      index: int,
      array: T[]
    ) => TResult,
    initialValue: TResult
  ): TResult {
    let accumulator = initialValue;
    for (
      let index = (this.valuesStore.Count - 1) as int;
      index >= 0;
      index = (index - 1) as int
    ) {
      accumulator = callback(
        accumulator,
        this.valuesStore[index]!,
        index,
        this.toArray()
      );
    }

    return accumulator;
  }

  public reverse(): this {
    const reversed = cloneList(this.valuesStore);
    reversed.Reverse();
    this.valuesStore.Clear();
    appendList(this.valuesStore, reversed);
    return this;
  }

  public shift(): T {
    if (this.valuesStore.Count === 0) {
      return undefined as T;
    }
    const value = this.valuesStore[0]!;
    this.valuesStore.RemoveAt(0 as int);
    return value;
  }

  public slice(start?: int, end?: int): Array<T> {
    const length = this.valuesStore.Count;
    const from = normalizeRelativeIndex(start ?? (0 as int), length);
    const to = normalizeRelativeIndex(end ?? length, length);
    const values = new List<T>();
    for (let i = from; i < to; i = (i + 1) as int) {
      values.Add(this.valuesStore[i]!);
    }
    return this.createWrapped(values.ToArray());
  }

  public some(callback: (value: T) => boolean): boolean;
  public some(callback: (value: T, index: int, array: readonly T[]) => boolean): boolean;
  public some(_callback: any): any {
    throw new Error("stub");
  }

  public some_value(callback: (value: T) => boolean): boolean {
    return this.some_full((value, _index, _array) => callback(value));
  }

  public some_full(
    callback: (value: T, index: int, array: readonly T[]) => boolean
  ): boolean {
    for (let i = 0 as int; i < this.valuesStore.Count; i = (i + 1) as int) {
      if (callback(this.valuesStore[i]!, i, this.toArray())) {
        return true;
      }
    }
    return false;
  }

  public sort(compareFunc?: (left: T, right: T) => double): this {
    const values = this.toArray();
    for (let left = 0 as int; left < values.length; left = (left + 1) as int) {
      for (let right = (left + 1) as int; right < values.length; right = (right + 1) as int) {
        const leftValue = values[left]!;
        const rightValue = values[right]!;
        const comparison =
          compareFunc?.(leftValue, rightValue) ??
          (String(leftValue as JsRuntimeValue) < String(rightValue as JsRuntimeValue)
            ? (-1 as double)
            : String(leftValue as JsRuntimeValue) > String(rightValue as JsRuntimeValue)
              ? (1 as double)
              : (0 as double));
        if (comparison > 0) {
          values[left] = rightValue;
          values[right] = leftValue;
        }
      }
    }
    this.valuesStore.Clear();
    for (const value of values) {
      this.valuesStore.Add(value);
    }
    return this;
  }

  public splice(start: int, deleteCount: int = (this.valuesStore.Count - start) as int, ...items: T[]): Array<T> {
    const length = this.valuesStore.Count;
    const from = normalizeRelativeIndex(start, length);
    const removeCount = deleteCount < 0 ? (0 as int) : deleteCount;
    const removed = new List<T>();
    for (let i = 0 as int; i < removeCount && from < this.valuesStore.Count; i = (i + 1) as int) {
      removed.Add(this.valuesStore[from]!);
      this.valuesStore.RemoveAt(from);
    }
    for (let i = (items.length - 1) as int; i >= 0; i = (i - 1) as int) {
      this.valuesStore.Insert(from, items[i]!);
    }
    return this.createWrapped(removed.ToArray());
  }

  public toLocaleString(): string {
    return this.join(",");
  }

  public toReversed(): Array<T> {
    return this.createWrapped(this.toArray()).reverse();
  }

  public toSorted(compareFunc?: (left: T, right: T) => double): Array<T> {
    return this.createWrapped(this.toArray()).sort(compareFunc);
  }

  public toSpliced(start: int, deleteCount?: int, ...items: T[]): Array<T> {
    const clone = this.createWrapped(this.toArray());
    clone.splice(start, deleteCount, ...items);
    return clone;
  }

  public toString(): string {
    return this.join(",");
  }

  public unshift(...items: T[]): int {
    for (let i = (items.length - 1) as int; i >= 0; i = (i - 1) as int) {
      this.valuesStore.Insert(0 as int, items[i]!);
    }
    return this.valuesStore.Count;
  }

  public values(): IterableIterator<T, undefined, undefined> {
    return (function* (self: Array<T>): Generator<T, undefined, undefined> {
      for (let i = 0 as int; i < self.length; i = (i + 1) as int) {
        yield self.valuesStore[i]!;
      }
    })(this);
  }

  public with(index: int, value: T): Array<T> {
    const clone = this.createWrapped(this.toArray());
    const normalized = normalizeElementIndex(index, clone.length);
    if (normalized >= 0) {
      clone.valuesStore[normalized] = value;
    }
    return clone;
  }

  public [Symbol.iterator](): IterableIterator<T, undefined, undefined> {
    return this.values();
  }
}

O<Array>().method(x => x.map_value).family(x => x.map);
O<Array>().method(x => x.map_valueIndex).family(x => x.map);
O<Array>().method(x => x.map_full).family(x => x.map);
O<Array>().method(x => x.every_value).family(x => x.every);
O<Array>().method(x => x.every_full).family(x => x.every);
O<Array>().method(x => x.filter_value).family(x => x.filter);
O<Array>().method(x => x.filter_valueIndex).family(x => x.filter);
O<Array>().method(x => x.filter_full).family(x => x.filter);
O<Array>().method(x => x.find_value).family(x => x.find);
O<Array>().method(x => x.find_valueIndex).family(x => x.find);
O<Array>().method(x => x.find_full).family(x => x.find);
O<Array>().method(x => x.findIndex_value).family(x => x.findIndex);
O<Array>().method(x => x.findIndex_valueIndex).family(x => x.findIndex);
O<Array>().method(x => x.findIndex_full).family(x => x.findIndex);
O<Array>().method(x => x.findLast_value).family(x => x.findLast);
O<Array>().method(x => x.findLast_valueIndex).family(x => x.findLast);
O<Array>().method(x => x.findLast_full).family(x => x.findLast);
O<Array>().method(x => x.findLastIndex_value).family(x => x.findLastIndex);
O<Array>().method(x => x.findLastIndex_valueIndex).family(x => x.findLastIndex);
O<Array>().method(x => x.findLastIndex_full).family(x => x.findLastIndex);
O<Array>().method(x => x.forEach_value).family(x => x.forEach);
O<Array>().method(x => x.forEach_valueIndex).family(x => x.forEach);
O<Array>().method(x => x.forEach_full).family(x => x.forEach);
O<Array>().method(x => x.some_value).family(x => x.some);
O<Array>().method(x => x.some_full).family(x => x.some);

O<typeof Array>().method(x => x.from_string).family(x => x.from);
O<typeof Array>().method(x => x.from_stringMapped).family(x => x.from);
O<typeof Array>().method(x => x.from_iterable).family(x => x.from);
O<typeof Array>().method(x => x.from_iterableMapped).family(x => x.from);

O<Array>().method(x => x.reduce_pair_noInitial).family(x => x.reduce);
O<Array>().method(x => x.reduce_pairIndex_noInitial).family(x => x.reduce);
O<Array>().method(x => x.reduce_full_noInitial).family(x => x.reduce);
O<Array>().method(x => x.reduce_pair_sameInitial).family(x => x.reduce);
O<Array>().method(x => x.reduce_pairIndex_sameInitial).family(x => x.reduce);
O<Array>().method(x => x.reduce_full_sameInitial).family(x => x.reduce);
O<Array>().method(x => x.reduce_pair_withInitial).family(x => x.reduce);
O<Array>().method(x => x.reduce_pairIndex_withInitial).family(x => x.reduce);
O<Array>().method(x => x.reduce_full_withInitial).family(x => x.reduce);

O<Array>().method(x => x.reduceRight_pair_noInitial).family(x => x.reduceRight);
O<Array>().method(x => x.reduceRight_pairIndex_noInitial).family(x => x.reduceRight);
O<Array>().method(x => x.reduceRight_full_noInitial).family(x => x.reduceRight);
O<Array>().method(x => x.reduceRight_pair_sameInitial).family(x => x.reduceRight);
O<Array>().method(x => x.reduceRight_pairIndex_sameInitial).family(x => x.reduceRight);
O<Array>().method(x => x.reduceRight_full_sameInitial).family(x => x.reduceRight);
O<Array>().method(x => x.reduceRight_pair_withInitial).family(x => x.reduceRight);
O<Array>().method(x => x.reduceRight_pairIndex_withInitial).family(x => x.reduceRight);
O<Array>().method(x => x.reduceRight_full_withInitial).family(x => x.reduceRight);
