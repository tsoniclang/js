
import type {} from "./type-bootstrap.js";

import { Console as DotnetConsole } from "@tsonic/dotnet/System.js";

export function formatArgs(
  first: unknown,
  rest: readonly unknown[]
): string {
  let result = "";
  const values = [first, ...rest];
  for (let i = 0; i < values.length; i += 1) {
    if (i > 0) {
      result += " ";
    }
    result += `${values[i]}`;
  }
  return result;
}

export function log(first: unknown, ...rest: unknown[]): void {
  DotnetConsole.WriteLine(formatArgs(first, rest));
}

export function error(first: unknown, ...rest: unknown[]): void {
  DotnetConsole.Error.WriteLine(formatArgs(first, rest));
}

export function warn(first: unknown, ...rest: unknown[]): void {
  DotnetConsole.WriteLine(`WARN: ${formatArgs(first, rest)}`);
}

export function info(first: unknown, ...rest: unknown[]): void {
  log(first, ...rest);
}

export function debug(first: unknown, ...rest: unknown[]): void {
  log(first, ...rest);
}
