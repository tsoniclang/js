import {
  isFinite,
  isInteger,
  isNaN,
  isSafeInteger,
  parseFloat,
  parseInt,
} from "./Globals.js";
import { Convert, Double } from "@tsonic/dotnet/System.js";
import { CultureInfo } from "@tsonic/dotnet/System.Globalization.js";

const MAX_SAFE_INTEGER = 9_007_199_254_740_991;
const MIN_SAFE_INTEGER = -9_007_199_254_740_991;
const EPSILON = 2.220446049250313e-16;
const MAX_VALUE = Double.MaxValue;
const MIN_VALUE = Double.Epsilon;
const POSITIVE_INFINITY = Double.PositiveInfinity;
const NEGATIVE_INFINITY = Double.NegativeInfinity;
const NaN = Double.NaN;

export abstract class Number {
  public static readonly EPSILON = EPSILON;
  public static readonly MAX_SAFE_INTEGER = MAX_SAFE_INTEGER;
  public static readonly MAX_VALUE = MAX_VALUE;
  public static readonly MIN_SAFE_INTEGER = MIN_SAFE_INTEGER;
  public static readonly MIN_VALUE = MIN_VALUE;
  public static readonly NEGATIVE_INFINITY = NEGATIVE_INFINITY;
  public static readonly POSITIVE_INFINITY = POSITIVE_INFINITY;
  public static readonly NaN = NaN;

  public static isFinite(value: number): boolean {
    return isFinite(value);
  }

  public static isInteger(value: number): boolean {
    return isInteger(value);
  }

  public static isNaN(value: number): boolean {
    return isNaN(value);
  }

  public static isSafeInteger(value: number): boolean {
    return isSafeInteger(value);
  }

  public static parseFloat(value: string): number {
    return parseFloat(value);
  }

  public static parseInt(value: string, radix?: number): number {
    return parseInt(value, radix);
  }

  public static toString(value: number): string {
    return (value as Double).ToString(CultureInfo.InvariantCulture) ?? "";
  }

  public static valueOf(value: number): number {
    return value;
  }
}
