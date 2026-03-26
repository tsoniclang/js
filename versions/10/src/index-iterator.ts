import type { int } from "@tsonic/core/types.js";

export class IndexIterator<T> implements IterableIterator<T> {
  private index: int = 0 as int;

  public constructor(
    private readonly getLength: () => int,
    private readonly getValue: (index: int) => T
  ) {
  }

  public next(): IteratorResult<T, undefined> {
    if (this.index >= this.getLength()) {
      return {
        done: true,
        value: undefined,
      };
    }

    const current = this.index;
    this.index = (this.index + 1) as int;
    return {
      done: false,
      value: this.getValue(current),
    };
  }

  public return(value?: undefined): IteratorResult<T, undefined> {
    this.index = this.getLength();
    return {
      done: true,
      value,
    };
  }

  public throw(error?: unknown): IteratorResult<T, undefined> {
    throw error;
  }

  public [Symbol.iterator](): IterableIterator<T> {
    return this;
  }
}
