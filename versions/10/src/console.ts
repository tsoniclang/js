import { Console as DotnetConsole } from "@tsonic/dotnet/System.js";

export function formatArgs(values: readonly unknown[]): string {
  let result = "";
  for (let i = 0; i < values.length; i += 1) {
    if (i > 0) {
      result += " ";
    }
    result += `${values[i]}`;
  }
  return result;
}

export function log(...data: unknown[]): void {
  DotnetConsole.WriteLine(formatArgs(data));
}

export function error(...data: unknown[]): void {
  DotnetConsole.Error.WriteLine(formatArgs(data));
}

export function warn(...data: unknown[]): void {
  DotnetConsole.WriteLine(`WARN: ${formatArgs(data)}`);
}

export function info(...data: unknown[]): void {
  log(...data);
}

export function debug(...data: unknown[]): void {
  log(...data);
}
