import type { int, long, double } from "@tsonic/core/types.js";

declare global {
  interface String {
    readonly length: int;
    trim(): string;
    toUpperCase(): string;
    toLowerCase(): string;
    indexOf(searchString: string, position?: int): int;
    split(separator: string, limit?: int): string[];
    includes(searchString: string, position?: int): boolean;
    startsWith(searchString: string, position?: int): boolean;
    endsWith(searchString: string, endPosition?: int): boolean;
    slice(start?: int, end?: int): string;
    substring(start: int, end?: int): string;
    replace(searchValue: string, replaceValue: string): string;
    charAt(index: int): string;
    charCodeAt(index: int): int;
  }
  interface Array<T> {
    readonly length: int;
    at(index: int): T;
    concat(...items: T[]): T[];
    every(callback: (value: T) => boolean): boolean;
    filter(callback: (value: T) => boolean): T[];
    filter(callback: (value: T, index: int) => boolean): T[];
    find(callback: (value: T) => boolean): T | undefined;
    find(callback: (value: T, index: int) => boolean): T | undefined;
    findIndex(callback: (value: T) => boolean): int;
    findIndex(callback: (value: T, index: int) => boolean): int;
    findLast(callback: (value: T) => boolean): T | undefined;
    findLast(callback: (value: T, index: int) => boolean): T | undefined;
    findLastIndex(callback: (value: T) => boolean): int;
    findLastIndex(callback: (value: T, index: int) => boolean): int;
    flat(depth?: int): unknown[];
    forEach(callback: (value: T) => void): void;
    forEach(callback: (value: T, index: int) => void): void;
    includes(searchElement: T): boolean;
    includes(searchElement: T, fromIndex?: int): boolean;
    indexOf(searchElement: T, fromIndex?: int): int;
    join(separator?: string): string;
    lastIndexOf(searchElement: T, fromIndex?: int): int;
    map<TResult>(callback: (value: T) => TResult): TResult[];
    map<TResult>(callback: (value: T, index: int) => TResult): TResult[];
    reduce(callback: (previousValue: T, currentValue: T) => T): T;
    reduce<TResult>(
      callback: (previousValue: TResult, currentValue: T) => TResult,
      initialValue: TResult
    ): TResult;
    reduceRight<TResult>(
      callback: (previousValue: TResult, currentValue: T) => TResult,
      initialValue: TResult
    ): TResult;
    slice(start?: int, end?: int): T[];
    some(callback: (value: T) => boolean): boolean;
  }
  interface ReadonlyArray<T> {
    readonly length: int;
    at(index: int): T;
    concat(...items: T[]): T[];
    every(callback: (value: T) => boolean): boolean;
    filter(callback: (value: T) => boolean): T[];
    filter(callback: (value: T, index: int) => boolean): T[];
    find(callback: (value: T) => boolean): T | undefined;
    find(callback: (value: T, index: int) => boolean): T | undefined;
    findIndex(callback: (value: T) => boolean): int;
    findIndex(callback: (value: T, index: int) => boolean): int;
    findLast(callback: (value: T) => boolean): T | undefined;
    findLast(callback: (value: T, index: int) => boolean): T | undefined;
    findLastIndex(callback: (value: T) => boolean): int;
    findLastIndex(callback: (value: T, index: int) => boolean): int;
    flat(depth?: int): unknown[];
    forEach(callback: (value: T) => void): void;
    forEach(callback: (value: T, index: int) => void): void;
    includes(searchElement: T): boolean;
    includes(searchElement: T, fromIndex?: int): boolean;
    indexOf(searchElement: T, fromIndex?: int): int;
    join(separator?: string): string;
    lastIndexOf(searchElement: T, fromIndex?: int): int;
    map<TResult>(callback: (value: T) => TResult): TResult[];
    map<TResult>(callback: (value: T, index: int) => TResult): TResult[];
    reduce(callback: (previousValue: T, currentValue: T) => T): T;
    reduce<TResult>(
      callback: (previousValue: TResult, currentValue: T) => TResult,
      initialValue: TResult
    ): TResult;
    reduceRight<TResult>(
      callback: (previousValue: TResult, currentValue: T) => TResult,
      initialValue: TResult
    ): TResult;
    slice(start?: int, end?: int): T[];
    some(callback: (value: T) => boolean): boolean;
  }
  interface Console {
    log(...data: unknown[]): void;
    error(...data: unknown[]): void;
    warn(...data: unknown[]): void;
    info(...data: unknown[]): void;
    debug(...data: unknown[]): void;
  }
  const console: Console;
  interface Date {
    toISOString(): string;
    getTime(): long;
  }
  interface DateConstructor {
    new (): Date;
    new (value: string | number | long): Date;
    now(): long;
    parse(s: string): long;
  }
  const Date: DateConstructor;
  interface JSON {
    parse<T = unknown>(text: string): T;
    stringify(
      value: unknown,
      replacer?: unknown,
      space?: string | number | int
    ): string;
  }
  const JSON: JSON;
  interface Math {
    round(x: double): double;
    max(...values: double[]): double;
    min(...values: double[]): double;
    random(): double;
  }
  const Math: Math;
  interface RegExpMatchArray extends Array<string> {
    index?: int;
    input?: string;
  }
  interface RegExp {
    exec(string: string): RegExpMatchArray | null;
    test(string: string): boolean;
  }
  interface RegExpConstructor {
    new (pattern: string | RegExp, flags?: string): RegExp;
    (pattern: string | RegExp, flags?: string): RegExp;
  }
  const RegExp: RegExpConstructor;
  interface Map<K, V> {
    readonly size: int;
    clear(): void;
    delete(key: K): boolean;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
  }
  interface MapConstructor {
    new <K, V>(entries?: readonly (readonly [K, V])[] | null): Map<K, V>;
  }
  const Map: MapConstructor;
  interface Set<T> {
    readonly size: int;
    add(value: T): this;
    clear(): void;
    delete(value: T): boolean;
    has(value: T): boolean;
  }
  interface SetConstructor {
    new <T = unknown>(values?: readonly T[] | null): Set<T>;
  }
  const Set: SetConstructor;
  function parseInt(str: string, radix?: int): long | undefined;
  function parseFloat(str: string): double;
  function isFinite(value: double): boolean;
  function isNaN(value: double): boolean;
  function setTimeout(
    handler: (...args: unknown[]) => void,
    timeout?: int,
    ...args: unknown[]
  ): int;
  function clearTimeout(id: int): void;
  function setInterval(
    handler: (...args: unknown[]) => void,
    timeout?: int,
    ...args: unknown[]
  ): int;
  function clearInterval(id: int): void;
}

export {};
