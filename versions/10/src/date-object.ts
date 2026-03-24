import { UTC, now, parse } from "./date-module.js";
import type { int } from "@tsonic/core/types.js";

abstract class JSImportDate {
  public static UTC(
    year: int,
    month: int,
    day: int = 1 as int,
    hours: int = 0 as int,
    minutes: int = 0 as int,
    seconds: int = 0 as int,
    milliseconds: int = 0 as int
  ): number {
    return UTC(year, month, day, hours, minutes, seconds, milliseconds);
  }

  public static now(): number {
    return now();
  }

  public static parse(value: string): number {
    return parse(value);
  }
}

export { JSImportDate as Date };
