
import type {} from "./type-bootstrap.js";

import {
  Convert,
  Double,
  TypeCode,
  Uri,
} from "@tsonic/dotnet/System.js";
import {
  CultureInfo,
  NumberStyles,
} from "@tsonic/dotnet/System.Globalization.js";

const nan = (): number => Double.NaN;

const toNumericValue = (value: unknown): number => {
  return Convert.ToDouble(value, CultureInfo.InvariantCulture);
};

const isNumericValue = (value: unknown): boolean => {
  switch (Convert.GetTypeCode(value)) {
    case TypeCode.SByte:
    case TypeCode.Byte:
    case TypeCode.Int16:
    case TypeCode.UInt16:
    case TypeCode.Int32:
    case TypeCode.UInt32:
    case TypeCode.Int64:
    case TypeCode.UInt64:
    case TypeCode.Single:
    case TypeCode.Double:
    case TypeCode.Decimal:
      return true;
    default:
      return false;
  }
};

const digitValue = (ch: string): number => {
  if (ch >= "0" && ch <= "9") {
    return ch.charCodeAt(0) - "0".charCodeAt(0);
  }
  if (ch >= "a" && ch <= "z") {
    return ch.charCodeAt(0) - "a".charCodeAt(0) + 10;
  }
  if (ch >= "A" && ch <= "Z") {
    return ch.charCodeAt(0) - "A".charCodeAt(0) + 10;
  }
  return -1;
};

export const parseInt = (value: string, radix?: number): number => {
  const trimmed = value.trimStart();
  if (trimmed.length === 0) {
    return nan();
  }

  let index = 0;
  let sign = 1;
  if (trimmed[index] === "+" || trimmed[index] === "-") {
    sign = trimmed[index] === "-" ? -1 : 1;
    index += 1;
  }

  let actualRadix = radix ?? 0;
  if (actualRadix !== 0 && (actualRadix < 2 || actualRadix > 36)) {
    return nan();
  }

  if (
    actualRadix === 0 &&
    trimmed.slice(index, index + 2).toLowerCase() === "0x"
  ) {
    actualRadix = 16;
    index += 2;
  } else if (actualRadix === 0) {
    actualRadix = 10;
  } else if (
    actualRadix === 16 &&
    trimmed.slice(index, index + 2).toLowerCase() === "0x"
  ) {
    index += 2;
  }

  let parsed = 0;
  let sawDigit = false;

  while (index < trimmed.length) {
    const digit = digitValue(trimmed[index]!);
    if (digit < 0 || digit >= actualRadix) {
      break;
    }
    parsed = parsed * actualRadix + digit;
    sawDigit = true;
    index += 1;
  }

  return sawDigit ? sign * parsed : nan();
};

export const parseFloat = (value: string): number => {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return nan();
  }

  try {
    return Double.Parse(trimmed, NumberStyles.Float, CultureInfo.InvariantCulture);
  } catch {
    return nan();
  }
};

export const isFinite = (value: number): boolean => Double.IsFinite(value);

export const isNaN = (value: number): boolean => Double.IsNaN(value);

export const Number = (value?: unknown): number => {
  if (value === undefined || value === null) {
    return 0;
  }

  if (isNumericValue(value)) {
    return toNumericValue(value);
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return 0;
    }

    if (trimmed === "Infinity") {
      return Double.PositiveInfinity;
    }

    if (trimmed === "-Infinity") {
      return Double.NegativeInfinity;
    }

    try {
      return Double.Parse(trimmed, NumberStyles.Float, CultureInfo.InvariantCulture);
    } catch {
      return nan();
    }
  }

  try {
    return toNumericValue(value);
  } catch {
    return nan();
  }
};

export const String = (value?: unknown): string => {
  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (isNumericValue(value)) {
    const numericValue = toNumericValue(value);
    if (Double.IsNaN(numericValue)) {
      return "NaN";
    }
    if (Double.IsPositiveInfinity(numericValue)) {
      return "Infinity";
    }
    if (Double.IsNegativeInfinity(numericValue)) {
      return "-Infinity";
    }
    return Convert.ToString(numericValue, CultureInfo.InvariantCulture) ?? "";
  }

  return Convert.ToString(value) ?? "";
};

export const Boolean = (value?: unknown): boolean => {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.length > 0;
  }

  if (isNumericValue(value)) {
    const numericValue = toNumericValue(value);
    return !Double.IsNaN(numericValue) && numericValue !== 0;
  }

  return true;
};

export const encodeURIComponent = (component: string): string =>
  Uri.EscapeDataString(component);

export const decodeURIComponent = (component: string): string =>
  Uri.UnescapeDataString(component);

export const encodeURI = (uri: string): string => {
  let encoded = Uri.EscapeDataString(uri);
  encoded = encoded.replaceAll("%3A", ":");
  encoded = encoded.replaceAll("%2F", "/");
  encoded = encoded.replaceAll("%3F", "?");
  encoded = encoded.replaceAll("%23", "#");
  encoded = encoded.replaceAll("%5B", "[");
  encoded = encoded.replaceAll("%5D", "]");
  encoded = encoded.replaceAll("%40", "@");
  encoded = encoded.replaceAll("%21", "!");
  encoded = encoded.replaceAll("%24", "$");
  encoded = encoded.replaceAll("%26", "&");
  encoded = encoded.replaceAll("%27", "'");
  encoded = encoded.replaceAll("%28", "(");
  encoded = encoded.replaceAll("%29", ")");
  encoded = encoded.replaceAll("%2A", "*");
  encoded = encoded.replaceAll("%2B", "+");
  encoded = encoded.replaceAll("%2C", ",");
  encoded = encoded.replaceAll("%3B", ";");
  encoded = encoded.replaceAll("%3D", "=");
  return encoded;
};

export const decodeURI = (uri: string): string => Uri.UnescapeDataString(uri);
