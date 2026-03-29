import {
  Convert,
  Double,
  Object as DotnetObject,
  TypeCode,
} from "@tsonic/dotnet/System.js";
import { CultureInfo } from "@tsonic/dotnet/System.Globalization.js";

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

export const sameValueZero = (left: unknown, right: unknown): boolean => {
  if (isNumericValue(left) && isNumericValue(right)) {
    const leftNumber = toNumericValue(left);
    const rightNumber = toNumericValue(right);
    return (
      leftNumber === rightNumber ||
      (Double.IsNaN(leftNumber) && Double.IsNaN(rightNumber))
    );
  }

  return DotnetObject.Equals(left, right);
};
