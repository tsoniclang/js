import type { JsValue } from "@tsonic/core/types.js";
import { debug, error, info, log, warn } from "./console.js";

type JsConsoleValue = JsValue | undefined;

abstract class ConsoleModule {
  public static debug(...data: JsConsoleValue[]): void {
    debug(...data);
  }

  public static error(...data: JsConsoleValue[]): void {
    error(...data);
  }

  public static info(...data: JsConsoleValue[]): void {
    info(...data);
  }

  public static log(...data: JsConsoleValue[]): void {
    log(...data);
  }

  public static warn(...data: JsConsoleValue[]): void {
    warn(...data);
  }
}

export { ConsoleModule as console };
