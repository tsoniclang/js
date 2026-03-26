import type { double, int, long } from "@tsonic/core/types.js";
import type { ArrayBuffer as JSImportArrayBuffer } from "./src/array-buffer-object.js";
import type { Date as JSImportDate } from "./src/date-object.js";
import type { Error as JSImportError } from "./src/error-object.js";
import type { Map as JSImportMap } from "./src/map-object.js";
import type { RegExp as JSImportRegExp } from "./src/regexp-object.js";
import type { Set as JSImportSet } from "./src/set-object.js";
import type { Uint8Array as JSImportUint8Array } from "./src/uint8-array.js";

declare global {
  interface Error extends JSImportError {
    name: string;
    message: string;
    stack?: string;
  }

  interface ErrorConstructor {
    readonly prototype: Error;
    new(message?: string): Error;
  }

  interface RangeErrorConstructor extends ErrorConstructor {
    readonly prototype: RangeError;
    new(message?: string): RangeError;
  }

  interface RangeError extends Error {
  }

  interface Function {
    prototype: unknown;
  }

  interface CallableFunction extends Function {
  }

  interface NewableFunction extends Function {
  }

  interface IArguments {
    readonly length: int;
    readonly [index: number]: unknown;
  }

  interface Object {
    constructor: Function;
  }

  interface SymbolConstructor {
    readonly iterator: unique symbol;
    readonly asyncIterator: unique symbol;
    readonly hasInstance: unique symbol;
    readonly isConcatSpreadable: unique symbol;
    readonly species: unique symbol;
    readonly toPrimitive: unique symbol;
    readonly toStringTag: unique symbol;
  }

  type PropertyKey = string | number | symbol;

  interface Promise<T> {
    then(): Promise<T>;
    then<TResult1>(
      onfulfilled: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null
    ): Promise<TResult1>;
    then<TResult1, TResult2>(
      onfulfilled: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): Promise<TResult1 | TResult2>;
    catch(): Promise<T>;
    catch<TResult>(
      onrejected: ((reason: unknown) => TResult | PromiseLike<TResult>) | undefined | null
    ): Promise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  interface PromiseLike<T> {
    then(): PromiseLike<T>;
    then<TResult1>(
      onfulfilled: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null
    ): PromiseLike<TResult1>;
    then<TResult1, TResult2>(
      onfulfilled: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): PromiseLike<TResult1 | TResult2>;
  }

  interface PromiseConstructor {
    new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: unknown) => void) => void): Promise<T>;
    resolve(): Promise<void>;
    resolve<T>(value: T | PromiseLike<T>): Promise<T>;
    reject<T>(reason?: unknown): Promise<T>;
    reject(reason?: unknown): Promise<unknown>;
    all<T>(values: readonly (T | PromiseLike<T>)[]): Promise<T[]>;
    race<T>(values: readonly (T | PromiseLike<T>)[]): Promise<T>;
  }

  interface IteratorYieldResult<T> {
    done?: false;
    value: T;
  }

  interface IteratorReturnResult<TReturn> {
    done: true;
    value: TReturn;
  }

  type IteratorResult<T, TReturn = unknown> =
    | IteratorYieldResult<T>
    | IteratorReturnResult<TReturn>;

  interface Iterator<T, TReturn = unknown, TNext = unknown> {
    next(...[value]: [] | [TNext]): IteratorResult<T, TReturn>;
    return?(value?: TReturn): IteratorResult<T, TReturn>;
    throw?(e?: unknown): IteratorResult<T, TReturn>;
  }

  interface Iterable<T, TReturn = unknown, TNext = unknown> {
    [Symbol.iterator](): Iterator<T, TReturn, TNext>;
  }

  interface IterableIterator<T, TReturn = unknown, TNext = unknown>
    extends Generator<T, TReturn, TNext> {
    [Symbol.iterator](): IterableIterator<T, TReturn, TNext>;
  }

  interface IteratorObject<T, TReturn = unknown, TNext = unknown>
    extends Iterator<T, TReturn, TNext> {
    [Symbol.iterator](): IteratorObject<T, TReturn, TNext>;
  }

  interface AsyncIterator<T, TReturn = unknown, TNext = unknown> {
    next(...[value]: [] | [TNext]): Promise<IteratorResult<T, TReturn>>;
    return?(value?: TReturn | PromiseLike<TReturn>): Promise<IteratorResult<T, TReturn>>;
    throw?(e?: unknown): Promise<IteratorResult<T, TReturn>>;
  }

  interface AsyncIterable<T, TReturn = unknown, TNext = unknown> {
    [Symbol.asyncIterator](): AsyncIterator<T, TReturn, TNext>;
  }

  interface AsyncIterableIterator<T, TReturn = unknown, TNext = unknown>
    extends AsyncIterator<T, TReturn, TNext> {
    [Symbol.asyncIterator](): AsyncIterableIterator<T, TReturn, TNext>;
  }

  interface Generator<T = unknown, TReturn = unknown, TNext = unknown>
    extends IteratorObject<T, TReturn, TNext> {
    next(...[value]: [] | [TNext]): IteratorResult<T, TReturn>;
    return(value: TReturn): IteratorResult<T, TReturn>;
    throw(e: unknown): IteratorResult<T, TReturn>;
    [Symbol.iterator](): Generator<T, TReturn, TNext>;
  }

  interface AsyncGenerator<T = unknown, TReturn = unknown, TNext = unknown>
    extends AsyncIterator<T, TReturn, TNext> {
    next(...[value]: [] | [TNext]): Promise<IteratorResult<T, TReturn>>;
    return(value: TReturn | PromiseLike<TReturn>): Promise<IteratorResult<T, TReturn>>;
    throw(e: unknown): Promise<IteratorResult<T, TReturn>>;
    [Symbol.asyncIterator](): AsyncGenerator<T, TReturn, TNext>;
  }

  interface TemplateStringsArray extends ReadonlyArray<string> {
    readonly raw: readonly string[];
  }

  type Partial<T> = { [P in keyof T]?: T[P] };
  type Required<T> = { [P in keyof T]-?: T[P] };
  type Readonly<T> = { readonly [P in keyof T]: T[P] };
  type Pick<T, K extends keyof T> = { [P in K]: T[P] };
  type Record<K extends PropertyKey, T> = { [P in K]: T };
  type Exclude<T, U> = T extends U ? never : T;
  type Extract<T, U> = T extends U ? T : never;
  type Omit<T, K extends PropertyKey> = Pick<T, Exclude<keyof T, K>>;
  type NonNullable<T> = T extends null | undefined ? never : T;
  type Parameters<T extends (...args: never[]) => unknown> = T extends (...args: infer P) => unknown ? P : never;
  type ConstructorParameters<T extends new (...args: never[]) => unknown> = T extends new (...args: infer P) => unknown ? P : never;
  type ReturnType<T extends (...args: never[]) => unknown> = T extends (...args: never[]) => infer R ? R : never;
  type InstanceType<T extends new (...args: never[]) => unknown> = T extends new (...args: never[]) => infer R ? R : never;
  type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

  interface ArrayLike<T> {
    readonly length: int;
    readonly [n: number]: T;
  }

  interface String {
    readonly [n: number]: string;
    readonly length: int;
    at(index: int): string;
    charAt(index: int): string;
    charCodeAt(index: int): int;
    codePointAt(index: int): int;
    concat(...strings: string[]): string;
    endsWith(searchString: string): boolean;
    includes(searchString: string): boolean;
    indexOf(searchString: string, position?: int): int;
    isWellFormed(): boolean;
    lastIndexOf(searchString: string, position?: int): int;
    localeCompare(compareString: string): int;
    match(pattern: string): string[] | undefined;
    matchAll(pattern: string): string[][];
    normalize(form?: string): string;
    padEnd(targetLength: int, padString?: string): string;
    padStart(targetLength: int, padString?: string): string;
    repeat(count: int): string;
    replace(searchValue: string, replaceValue: string): string;
    replaceAll(searchValue: string, replaceValue: string): string;
    search(pattern: string): int;
    slice(start?: int, end?: int): string;
    split(separator: string, limit?: int): string[];
    startsWith(searchString: string): boolean;
    substr(start: int, length?: int): string;
    substring(start: int, end?: int): string;
    toLocaleLowerCase(): string;
    toLocaleUpperCase(): string;
    toLowerCase(): string;
    toString(): string;
    trim(): string;
    trimLeft(): string;
    trimRight(): string;
    trimStart(): string;
    trimEnd(): string;
    toUpperCase(): string;
    toWellFormed(): string;
    valueOf(): string;
    [Symbol.iterator](): IterableIterator<string, undefined, unknown>;
  }

  interface StringConstructor {
    (value?: unknown): string;
    fromCharCode(...codes: int[]): string;
    fromCodePoint(...codePoints: int[]): string;
  }

  interface Number {
    toString(): string;
    valueOf(): number;
  }

  interface Boolean {
    toString(): string;
    valueOf(): boolean;
  }

  interface BooleanConstructor {
    (value?: unknown): boolean;
  }

  interface ImportMeta {
    readonly url: string;
    readonly filename: string;
    readonly dirname: string;
  }

  interface NumberConstructor {
    (value?: unknown): number;
    readonly EPSILON: number;
    readonly MAX_SAFE_INTEGER: number;
    readonly MAX_VALUE: number;
    readonly MIN_SAFE_INTEGER: number;
    readonly MIN_VALUE: number;
    readonly NEGATIVE_INFINITY: number;
    readonly POSITIVE_INFINITY: number;
    readonly NaN: number;
    isFinite(value: number): boolean;
    isInteger(value: number): boolean;
    isNaN(value: number): boolean;
    isSafeInteger(value: number): boolean;
    parseFloat(str: string): number;
    parseInt(str: string, radix?: number): number;
  }

  interface Array<T> {
    length: int;
    [n: number]: T;
    at(index: int): T;
    concat(...items: unknown[]): T[];
    copyWithin(target: int, start?: int, end?: int): T[];
    entries(): IterableIterator<[int, T]>;
    every(callback: (value: T) => boolean): boolean;
    every(callback: (value: T, index: int, array: T[]) => boolean): boolean;
    fill(value: T, start?: int, end?: int): T[];
    filter(callback: (value: T) => boolean): T[];
    filter(callback: (value: T, index: int) => boolean): T[];
    filter(callback: (value: T, index: int, array: T[]) => boolean): T[];
    find(callback: (value: T) => boolean): T | undefined;
    find(callback: (value: T, index: int) => boolean): T | undefined;
    find(callback: (value: T, index: int, array: T[]) => boolean): T | undefined;
    findIndex(callback: (value: T) => boolean): int;
    findIndex(callback: (value: T, index: int) => boolean): int;
    findIndex(callback: (value: T, index: int, array: T[]) => boolean): int;
    findLast(callback: (value: T) => boolean): T | undefined;
    findLast(callback: (value: T, index: int) => boolean): T | undefined;
    findLast(callback: (value: T, index: int, array: T[]) => boolean): T | undefined;
    findLastIndex(callback: (value: T) => boolean): int;
    findLastIndex(callback: (value: T, index: int) => boolean): int;
    findLastIndex(callback: (value: T, index: int, array: T[]) => boolean): int;
    flat(depth?: int): unknown[];
    flatMap<TResult>(callback: (value: T, index: int, array: T[]) => unknown): TResult[];
    forEach(callback: (value: T) => void): void;
    forEach(callback: (value: T, index: int) => void): void;
    forEach(callback: (value: T, index: int, array: T[]) => void): void;
    includes(searchElement: T): boolean;
    indexOf(searchElement: T, fromIndex?: int): int;
    join(separator?: string): string;
    keys(): IterableIterator<int>;
    lastIndexOf(searchElement: T, fromIndex?: int): int;
    map<TResult>(callback: (value: T) => TResult): TResult[];
    map<TResult>(callback: (value: T, index: int) => TResult): TResult[];
    map<TResult>(callback: (value: T, index: int, array: T[]) => TResult): TResult[];
    pop(): T;
    push(...items: T[]): int;
    reduce(callback: (previousValue: T, currentValue: T) => T): T;
    reduce<TResult>(callback: (previousValue: TResult, currentValue: T) => TResult, initialValue: TResult): TResult;
    reduce<TResult>(callback: (previousValue: TResult, currentValue: T, index: int) => TResult, initialValue: TResult): TResult;
    reduce<TResult>(callback: (
        previousValue: TResult,
        currentValue: T,
        index: int,
        array: T[]
      ) => TResult, initialValue: TResult): TResult;
    reduceRight<TResult>(callback: (previousValue: TResult, currentValue: T) => TResult, initialValue: TResult): TResult;
    reduceRight<TResult>(callback: (previousValue: TResult, currentValue: T, index: int) => TResult, initialValue: TResult): TResult;
    reduceRight<TResult>(callback: (
        previousValue: TResult,
        currentValue: T,
        index: int,
        array: T[]
      ) => TResult, initialValue: TResult): TResult;
    reverse(): T[];
    shift(): T;
    slice(start?: int, end?: int): T[];
    some(callback: (value: T) => boolean): boolean;
    some(callback: (value: T, index: int, array: T[]) => boolean): boolean;
    sort(compareFunc?: (left: T, right: T) => double): T[];
    splice(start: int, deleteCount?: int, ...items: T[]): T[];
    toLocaleString(): string;
    toReversed(): T[];
    toSorted(compareFunc?: (left: T, right: T) => double): T[];
    toSpliced(start: int, deleteCount?: int, ...items: T[]): T[];
    toString(): string;
    unshift(...items: T[]): int;
    values(): IterableIterator<T>;
    with(index: int, value: T): T[];
    [Symbol.iterator](): IterableIterator<T>;
  }

  interface ReadonlyArray<T> {
    readonly length: int;
    readonly [n: number]: T;
    at(index: int): T;
    concat(...items: unknown[]): T[];
    entries(): IterableIterator<[int, T]>;
    every(callback: (value: T) => boolean): boolean;
    every(callback: (value: T, index: int, array: readonly T[]) => boolean): boolean;
    filter(callback: (value: T) => boolean): T[];
    filter(callback: (value: T, index: int) => boolean): T[];
    filter(callback: (value: T, index: int, array: readonly T[]) => boolean): T[];
    find(callback: (value: T) => boolean): T | undefined;
    find(callback: (value: T, index: int) => boolean): T | undefined;
    find(callback: (value: T, index: int, array: readonly T[]) => boolean): T | undefined;
    findIndex(callback: (value: T) => boolean): int;
    findIndex(callback: (value: T, index: int) => boolean): int;
    findIndex(callback: (value: T, index: int, array: readonly T[]) => boolean): int;
    findLast(callback: (value: T) => boolean): T | undefined;
    findLast(callback: (value: T, index: int) => boolean): T | undefined;
    findLast(callback: (value: T, index: int, array: readonly T[]) => boolean): T | undefined;
    findLastIndex(callback: (value: T) => boolean): int;
    findLastIndex(callback: (value: T, index: int) => boolean): int;
    findLastIndex(callback: (value: T, index: int, array: readonly T[]) => boolean): int;
    flat(depth?: int): unknown[];
    flatMap<TResult>(callback: (value: T, index: int, array: readonly T[]) => unknown): TResult[];
    forEach(callback: (value: T) => void): void;
    forEach(callback: (value: T, index: int) => void): void;
    forEach(callback: (value: T, index: int, array: readonly T[]) => void): void;
    includes(searchElement: T): boolean;
    indexOf(searchElement: T, fromIndex?: int): int;
    join(separator?: string): string;
    keys(): IterableIterator<int>;
    lastIndexOf(searchElement: T, fromIndex?: int): int;
    map<TResult>(callback: (value: T) => TResult): TResult[];
    map<TResult>(callback: (value: T, index: int) => TResult): TResult[];
    map<TResult>(callback: (value: T, index: int, array: readonly T[]) => TResult): TResult[];
    reduce(callback: (previousValue: T, currentValue: T) => T): T;
    reduce<TResult>(callback: (previousValue: TResult, currentValue: T) => TResult, initialValue: TResult): TResult;
    reduce<TResult>(callback: (previousValue: TResult, currentValue: T, index: int) => TResult, initialValue: TResult): TResult;
    reduce<TResult>(callback: (
        previousValue: TResult,
        currentValue: T,
        index: int,
        array: readonly T[]
      ) => TResult, initialValue: TResult): TResult;
    reduceRight<TResult>(callback: (previousValue: TResult, currentValue: T) => TResult, initialValue: TResult): TResult;
    reduceRight<TResult>(callback: (previousValue: TResult, currentValue: T, index: int) => TResult, initialValue: TResult): TResult;
    reduceRight<TResult>(callback: (
        previousValue: TResult,
        currentValue: T,
        index: int,
        array: readonly T[]
      ) => TResult, initialValue: TResult): TResult;
    slice(start?: int, end?: int): T[];
    some(callback: (value: T) => boolean): boolean;
    some(callback: (value: T, index: int, array: readonly T[]) => boolean): boolean;
    toLocaleString(): string;
    toReversed(): T[];
    toSorted(compareFunc?: (left: T, right: T) => double): T[];
    toString(): string;
    values(): IterableIterator<T>;
    with(index: int, value: T): T[];
    [Symbol.iterator](): IterableIterator<T>;
  }

  interface Console {
    log(...data: unknown[]): void;
    error(...data: unknown[]): void;
    warn(...data: unknown[]): void;
    info(...data: unknown[]): void;
    debug(...data: unknown[]): void;
  }

  interface ArrayConstructor {
    readonly prototype: unknown[];
    new(arrayLength: int): unknown[];
    new(...items: unknown[]): unknown[];
    new<T>(arrayLength: int): T[];
    new<T>(...items: T[]): T[];
    isArray(value: unknown): value is readonly unknown[] | unknown[];
    from(source: string): string[];
    from<TResult>(source: string, mapfn: (value: string, index: int) => TResult): TResult[];
    from<T>(source: Iterable<T> | ArrayLike<T>): T[];
    from<T, TResult>(source: Iterable<T> | ArrayLike<T>, mapfn: (value: T, index: int) => TResult): TResult[];
    of<T>(...items: T[]): T[];
  }

  interface Date extends JSImportDate {
    getDate(): int;
    getDay(): int;
    getFullYear(): int;
    getHours(): int;
    getMilliseconds(): int;
    getMinutes(): int;
    getMonth(): int;
    getSeconds(): int;
    getTime(): long;
    getTimezoneOffset(): int;
    getUTCDate(): int;
    getUTCDay(): int;
    getUTCFullYear(): int;
    getUTCHours(): int;
    getUTCMilliseconds(): int;
    getUTCMinutes(): int;
    getUTCMonth(): int;
    getUTCSeconds(): int;
    setDate(day: int): number;
    setFullYear(year: int, month?: int, day?: int): number;
    setHours(hour: int, min?: int, sec?: int, ms?: int): number;
    setMilliseconds(ms: int): number;
    setMinutes(min: int, sec?: int, ms?: int): number;
    setMonth(month: int, day?: int): number;
    setSeconds(sec: int, ms?: int): number;
    setTime(milliseconds: number): number;
    setUTCDate(day: int): number;
    setUTCFullYear(year: int, month?: int, day?: int): number;
    setUTCHours(hour: int, min?: int, sec?: int, ms?: int): number;
    setUTCMilliseconds(ms: int): number;
    setUTCMinutes(min: int, sec?: int, ms?: int): number;
    setUTCMonth(month: int, day?: int): number;
    setUTCSeconds(sec: int, ms?: int): number;
    toDateString(): string;
    toISOString(): string;
    toJSON(): string;
    toLocaleDateString(): string;
    toLocaleString(): string;
    toLocaleTimeString(): string;
    toString(): string;
    toTimeString(): string;
    toUTCString(): string;
    valueOf(): long;
  }

  interface ArrayBuffer extends JSImportArrayBuffer {
    readonly byteLength: int;
    slice(begin?: int, end?: int): ArrayBuffer;
  }

  interface TypedArrayLike<T, TSelf> extends ArrayLike<T>, Iterable<T> {
    readonly byteLength: int;
    readonly length: int;
    at(index: int): T | undefined;
    entries(): IterableIterator<[int, T]>;
    fill(value: T, start?: int, end?: int): TSelf;
    includes(value: T, fromIndex?: int): boolean;
    indexOf(value: T, fromIndex?: int): int;
    join(separator?: string): string;
    keys(): IterableIterator<int>;
    reverse(): TSelf;
    set(array: Iterable<T> | ArrayLike<T>, offset?: int): void;
    slice(begin?: int, end?: int): TSelf;
    sort(compareFn?: (left: T, right: T) => double): TSelf;
    subarray(begin?: int, end?: int): TSelf;
    values(): IterableIterator<T>;
    [index: number]: T;
    [Symbol.iterator](): IterableIterator<T>;
  }

  interface Int8Array extends TypedArrayLike<number, Int8Array> {
  }

  interface Uint8Array extends TypedArrayLike<number, Uint8Array>, JSImportUint8Array {
  }

  interface Uint8ClampedArray extends TypedArrayLike<number, Uint8ClampedArray> {
  }

  interface Int16Array extends TypedArrayLike<number, Int16Array> {
  }

  interface Uint16Array extends TypedArrayLike<number, Uint16Array> {
  }

  interface Int32Array extends TypedArrayLike<number, Int32Array> {
  }

  interface Uint32Array extends TypedArrayLike<number, Uint32Array> {
  }

  interface Float32Array extends TypedArrayLike<number, Float32Array> {
  }

  interface Float64Array extends TypedArrayLike<number, Float64Array> {
  }

  interface DateConstructor {
    readonly prototype: Date;
    new(): Date;
    new(value: string | number | long): Date;
    now(): long;
    parse(s: string): number;
  }

  interface Uint8ArrayConstructor {
    readonly prototype: Uint8Array;
    new(length: int): Uint8Array;
    new(values: Iterable<number> | ArrayLike<number>): Uint8Array;
  }

  interface ArrayBufferConstructor {
    readonly prototype: ArrayBuffer;
    new(byteLength: int): ArrayBuffer;
  }

  interface Int8ArrayConstructor {
    readonly prototype: Int8Array;
    new(length: int): Int8Array;
    new(values: Iterable<number> | ArrayLike<number>): Int8Array;
    readonly BYTES_PER_ELEMENT: number;
  }

  interface Uint8ClampedArrayConstructor {
    readonly prototype: Uint8ClampedArray;
    new(length: int): Uint8ClampedArray;
    new(values: Iterable<number> | ArrayLike<number>): Uint8ClampedArray;
    readonly BYTES_PER_ELEMENT: number;
  }

  interface Int16ArrayConstructor {
    readonly prototype: Int16Array;
    new(length: int): Int16Array;
    new(values: Iterable<number> | ArrayLike<number>): Int16Array;
    readonly BYTES_PER_ELEMENT: number;
  }

  interface Uint16ArrayConstructor {
    readonly prototype: Uint16Array;
    new(length: int): Uint16Array;
    new(values: Iterable<number> | ArrayLike<number>): Uint16Array;
    readonly BYTES_PER_ELEMENT: number;
  }

  interface Int32ArrayConstructor {
    readonly prototype: Int32Array;
    new(length: int): Int32Array;
    new(values: Iterable<number> | ArrayLike<number>): Int32Array;
    readonly BYTES_PER_ELEMENT: number;
  }

  interface Uint32ArrayConstructor {
    readonly prototype: Uint32Array;
    new(length: int): Uint32Array;
    new(values: Iterable<number> | ArrayLike<number>): Uint32Array;
    readonly BYTES_PER_ELEMENT: number;
  }

  interface Float32ArrayConstructor {
    readonly prototype: Float32Array;
    new(length: int): Float32Array;
    new(values: Iterable<number> | ArrayLike<number>): Float32Array;
    readonly BYTES_PER_ELEMENT: number;
  }

  interface Float64ArrayConstructor {
    readonly prototype: Float64Array;
    new(length: int): Float64Array;
    new(values: Iterable<number> | ArrayLike<number>): Float64Array;
    readonly BYTES_PER_ELEMENT: number;
  }

  interface JSON {
    parse<T = unknown>(text: string): T;
    stringify(value: unknown, replacer?: unknown, space?: string | number | int): string;
  }

  interface Math {
    abs(x: number): number;
    acos(x: number): number;
    acosh(x: number): number;
    asin(x: number): number;
    asinh(x: number): number;
    atan(x: number): number;
    atan2(y: number, x: number): number;
    atanh(x: number): number;
    cbrt(x: number): number;
    ceil(x: number): number;
    clz32(x: number): number;
    cos(x: number): number;
    cosh(x: number): number;
    exp(x: number): number;
    expm1(x: number): number;
    f16round(x: number): number;
    floor(x: number): number;
    fround(x: number): number;
    hypot(...values: number[]): number;
    imul(a: number, b: number): number;
    log(x: number): number;
    log10(x: number): number;
    log1p(x: number): number;
    log2(x: number): number;
    pow(x: number, y: number): number;
    round(x: number): number;
    sign(x: number): number;
    sin(x: number): number;
    sinh(x: number): number;
    sqrt(x: number): number;
    tan(x: number): number;
    tanh(x: number): number;
    trunc(x: number): number;
    max(...values: number[]): number;
    min(...values: number[]): number;
    random(): number;
  }

  interface RegExpMatchArray extends Array<string> {
    index?: int;
    input?: string;
  }

  interface RegExp extends JSImportRegExp {
    readonly source: string;
    readonly flags: string;
    exec(string: string): RegExpMatchArray | null;
    test(string: string): boolean;
    toString(): string;
  }

  interface RegExpConstructor {
    readonly prototype: RegExp;
    new(pattern: string | RegExp, flags?: string): RegExp;
    (pattern: string | RegExp, flags?: string): RegExp;
  }

  interface Map<K, V> extends JSImportMap<K, V> {
    readonly size: int;
    clear(): void;
    delete(key: K): boolean;
    entries(): IterableIterator<[K, V]>;
    forEach(callback: (value: V) => void): void;
    forEach(callback: (value: V, key: K) => void): void;
    forEach(callback: (value: V, key: K, map: Map<K, V>) => void): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    keys(): IterableIterator<K>;
    set(key: K, value: V): this;
    values(): IterableIterator<V>;
    [Symbol.iterator](): IterableIterator<[K, V]>;
  }

  interface MapConstructor {
    readonly prototype: Map<unknown, unknown>;
    new<K, V>(entries?: readonly (readonly [K, V])[] | null): Map<K, V>;
  }

  interface Set<T> extends JSImportSet<T> {
    readonly size: int;
    add(value: T): this;
    clear(): void;
    delete(value: T): boolean;
    entries(): IterableIterator<[T, T]>;
    forEach(callback: (value: T) => void): void;
    forEach(callback: (value: T, key: T) => void): void;
    forEach(callback: (value: T, key: T, set: Set<T>) => void): void;
    has(value: T): boolean;
    keys(): IterableIterator<T>;
    values(): IterableIterator<T>;
    [Symbol.iterator](): IterableIterator<T>;
  }

  interface SetConstructor {
    readonly prototype: Set<unknown>;
    new<T = unknown>(values?: readonly T[] | null): Set<T>;
  }

  interface WeakMap<K extends object, V> {
    delete(key: K): boolean;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
  }

  interface WeakMapConstructor {
    readonly prototype: WeakMap<object, unknown>;
    new<K extends object, V>(entries?: readonly (readonly [K, V])[] | null): WeakMap<K, V>;
  }

  interface WeakSet<T extends object> {
    add(value: T): this;
    delete(value: T): boolean;
    has(value: T): boolean;
  }

  interface WeakSetConstructor {
    readonly prototype: WeakSet<object>;
    new<T extends object = object>(values?: readonly T[] | null): WeakSet<T>;
  }

  interface ObjectConstructor {
    readonly prototype: object;
    entries(obj: unknown): [string, unknown][];
    keys(obj: unknown): string[];
    values(obj: unknown): unknown[];
  }

  const Error: ErrorConstructor;

  const String: StringConstructor;

  const Number: NumberConstructor;

  const Boolean: BooleanConstructor;

  const console: Console;

  const Date: DateConstructor;

  const Array: ArrayConstructor;

  const ArrayBuffer: ArrayBufferConstructor;

  const Int8Array: Int8ArrayConstructor;

  const Uint8Array: Uint8ArrayConstructor;

  const Uint8ClampedArray: Uint8ClampedArrayConstructor;

  const Int16Array: Int16ArrayConstructor;

  const Uint16Array: Uint16ArrayConstructor;

  const Int32Array: Int32ArrayConstructor;

  const Uint32Array: Uint32ArrayConstructor;

  const Float32Array: Float32ArrayConstructor;

  const Float64Array: Float64ArrayConstructor;

  const JSON: JSON;

  const Math: Math;

  const RegExp: RegExpConstructor;

  const Map: MapConstructor;

  const Set: SetConstructor;

  const WeakMap: WeakMapConstructor;

  const WeakSet: WeakSetConstructor;

  const Object: ObjectConstructor;

  const RangeError: RangeErrorConstructor;

  const Symbol: SymbolConstructor;

  const Promise: PromiseConstructor;

  function parseInt(value: string, radix?: number): number;

  function parseFloat(value: string): number;

  function decodeURI(uri: string): string;

  function decodeURIComponent(component: string): string;

  function encodeURI(uri: string): string;

  function encodeURIComponent(component: string): string;

  function isFinite(value: number): boolean;

  function isNaN(value: number): boolean;

}

export {};
