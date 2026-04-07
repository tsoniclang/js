import {
  Convert,
  Double,
  Object as DotnetObject,
  TypeCode,
} from "@tsonic/dotnet/System.js";
import { CultureInfo } from "@tsonic/dotnet/System.Globalization.js";
import type { JsValue } from "@tsonic/core/types.js";

const isNumericValue = (value: JsValue): boolean => {
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

const toNumericValue = (value: JsValue): number => {
  return Convert.ToDouble(value, CultureInfo.InvariantCulture);
};

export const sameValueZero = <T>(left: T, right: T): boolean => {
  const leftValue = left as JsValue | undefined;
  const rightValue = right as JsValue | undefined;

  if (
    leftValue !== undefined &&
    leftValue !== null &&
    rightValue !== undefined &&
    rightValue !== null &&
    isNumericValue(leftValue) &&
    isNumericValue(rightValue)
  ) {
    const leftNumber = toNumericValue(leftValue);
    const rightNumber = toNumericValue(rightValue);
    return (
      leftNumber === rightNumber ||
      (Double.IsNaN(leftNumber) && Double.IsNaN(rightNumber))
    );
  }

  if (leftValue === rightValue) {
    return true;
  }

  const leftKind = typeof leftValue;
  const rightKind = typeof rightValue;
  if (
    (leftKind === "object" || leftKind === "function") &&
    leftValue !== null &&
    (rightKind === "object" || rightKind === "function") &&
    rightValue !== null
  ) {
    return DotnetObject.ReferenceEquals(leftValue as object, rightValue as object);
  }

  return false;
};
