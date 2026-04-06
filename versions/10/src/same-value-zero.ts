import { Double, Object as DotnetObject } from "@tsonic/dotnet/System.js";
import type { JsValue } from "@tsonic/core/types.js";

export const sameValueZero = <T>(left: T, right: T): boolean => {
  const leftValue = left as JsValue | undefined;
  const rightValue = right as JsValue | undefined;

  if (typeof leftValue === "number" && typeof rightValue === "number") {
    return (
      leftValue === rightValue ||
      (Double.IsNaN(leftValue) && Double.IsNaN(rightValue))
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
