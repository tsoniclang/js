
import type {} from "./type-bootstrap.js";

import { Convert, Double, Math as DotnetMath } from "@tsonic/dotnet/System.js";
import { CultureInfo } from "@tsonic/dotnet/System.Globalization.js";
import {
  parseFloat as globalParseFloat,
  parseInt as globalParseInt,
} from "./Globals.js";

export const MAX_VALUE: number = Double.MaxValue;
export const MIN_VALUE: number = Double.Epsilon;
export const MAX_SAFE_INTEGER: number = 9007199254740991;
export const MIN_SAFE_INTEGER: number = -9007199254740991;
export const POSITIVE_INFINITY: number = Double.PositiveInfinity;
export const NEGATIVE_INFINITY: number = Double.NegativeInfinity;
export const NaN: number = Double.NaN;
export const EPSILON: number = 2.220446049250313e-16;

export const parseInt = (value: string, radix?: number): number =>
  globalParseInt(value, radix);

export const parseFloat = (value: string): number => globalParseFloat(value);

export const isNaN = (value: number): boolean => Double.IsNaN(value);

export const isFinite = (value: number): boolean => Double.IsFinite(value);

export const isInteger = (value: number): boolean =>
  Double.IsFinite(value) && DotnetMath.Floor(value) === value;

export const isSafeInteger = (value: number): boolean =>
  isInteger(value) &&
  value >= MIN_SAFE_INTEGER &&
  value <= MAX_SAFE_INTEGER;

export const toString = (value: number): string =>
  Convert.ToString(value, CultureInfo.InvariantCulture) ?? "";

export const valueOf = (value: number): number => value;
