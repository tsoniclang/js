import type { JsValue } from "@tsonic/core/types.js";
import { Console as DotnetConsole } from "@tsonic/dotnet/System.js";

type JsConsoleValue = JsValue | undefined;

export function formatArgs(values: readonly JsConsoleValue[]): string {
  let result = "";
  for (let i = 0; i < values.length; i += 1) {
    if (i > 0) {
      result += " ";
    }
    result += String(values[i]);
  }
  return result;
}

export function log(...data: JsConsoleValue[]): void {
  DotnetConsole.WriteLine(formatArgs(data));
}

export function error(...data: JsConsoleValue[]): void {
  DotnetConsole.Error.WriteLine(formatArgs(data));
}

export function warn(...data: JsConsoleValue[]): void {
  DotnetConsole.WriteLine(`WARN: ${formatArgs(data)}`);
}

export function info(...data: JsConsoleValue[]): void {
  log(...data);
}

export function debug(...data: JsConsoleValue[]): void {
  log(...data);
}
