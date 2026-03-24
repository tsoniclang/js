
import type {} from "./type-bootstrap.js";

export const toString = (value: boolean): string =>
  value ? "true" : "false";

export const valueOf = (value: boolean): boolean => value;
