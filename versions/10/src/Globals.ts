import {
  Convert,
  Double,
  Uri,
} from "@tsonic/dotnet/System.js";
import {
  CultureInfo,
  NumberStyles,
} from "@tsonic/dotnet/System.Globalization.js";

const nan = (): number => Double.NaN;
const MAX_SAFE_INTEGER: number = 9_007_199_254_740_991;
const MIN_SAFE_INTEGER: number = MAX_SAFE_INTEGER * -1;
type NumberValue = string | number | boolean | null | undefined;
type StringValue = string | number | boolean | object | null;
type BooleanValue = string | number | boolean | object | null | undefined;

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
  let sign: number = 1;
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

  let parsed: number = 0;
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

export const isInteger = (value: number): boolean =>
  Double.IsFinite(value) && value % 1 === 0;

export const isNaN = (value: number): boolean => Double.IsNaN(value);

export const isSafeInteger = (value: number): boolean =>
  isInteger(value) &&
  value <= MAX_SAFE_INTEGER &&
  value >= MIN_SAFE_INTEGER;

export const Number = (value?: NumberValue): number => {
  if (value === undefined || value === null) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return 0;
  }

  try {
    return Double.Parse(trimmed, NumberStyles.Float, CultureInfo.InvariantCulture);
  } catch {
    return nan();
  }
};

export const String = (value?: StringValue): string => {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "number") {
    return Convert.ToString(value, CultureInfo.InvariantCulture) ?? "";
  }

  return Convert.ToString(value) ?? "";
};

export const Boolean = (value?: BooleanValue): boolean => {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0 && !Double.IsNaN(value);
  }

  if (typeof value === "string") {
    return value.length > 0;
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
