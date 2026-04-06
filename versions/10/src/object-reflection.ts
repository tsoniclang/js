import type { Object as ClrObject, Type } from "@tsonic/dotnet/System.js";

export const getClrType = (value: object): Type => {
  return (value as ClrObject).GetType();
};
