import {
  E,
  LN2,
  LN10,
  LOG2E,
  LOG10E,
  PI,
  SQRT1_2,
  SQRT2,
  abs,
  acos,
  asin,
  atan,
  atan2,
  ceil,
  cos,
  exp,
  floor,
  log,
  log10,
  log2,
  max,
  min,
  pow,
  random,
  round,
  sign,
  sin,
  sqrt,
  tan,
  trunc,
} from "./Math.js";

abstract class JSImportMath {
  public static readonly E = E;
  public static readonly PI = PI;
  public static readonly LN2 = LN2;
  public static readonly LN10 = LN10;
  public static readonly LOG2E = LOG2E;
  public static readonly LOG10E = LOG10E;
  public static readonly SQRT1_2 = SQRT1_2;
  public static readonly SQRT2 = SQRT2;

  public static abs(value: number): number {
    return abs(value);
  }

  public static acos(value: number): number {
    return acos(value);
  }

  public static asin(value: number): number {
    return asin(value);
  }

  public static atan(value: number): number {
    return atan(value);
  }

  public static atan2(left: number, right: number): number {
    return atan2(left, right);
  }

  public static ceil(value: number): number {
    return ceil(value);
  }

  public static cos(value: number): number {
    return cos(value);
  }

  public static exp(value: number): number {
    return exp(value);
  }

  public static floor(value: number): number {
    return floor(value);
  }

  public static log(value: number): number {
    return log(value);
  }

  public static log10(value: number): number {
    return log10(value);
  }

  public static log2(value: number): number {
    return log2(value);
  }

  public static max(...values: number[]): number {
    return max(...values);
  }

  public static min(...values: number[]): number {
    return min(...values);
  }

  public static pow(left: number, right: number): number {
    return pow(left, right);
  }

  public static random(): number {
    return random();
  }

  public static round(value: number): number {
    return round(value);
  }

  public static sign(value: number): number {
    return sign(value);
  }

  public static sin(value: number): number {
    return sin(value);
  }

  public static sqrt(value: number): number {
    return sqrt(value);
  }

  public static tan(value: number): number {
    return tan(value);
  }

  public static trunc(value: number): number {
    return trunc(value);
  }
}

export { JSImportMath as Math };
