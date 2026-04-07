import { Object as DotnetObject, Type } from "@tsonic/dotnet/System.js";

export const getClrType = (value: object): Type => {
  return (value as DotnetObject).GetType();
};
