import { debug, error, info, log, warn } from "./console.js";

abstract class ConsoleModule {
  public static debug(...data: unknown[]): void {
    debug(...data);
  }

  public static error(...data: unknown[]): void {
    error(...data);
  }

  public static info(...data: unknown[]): void {
    info(...data);
  }

  public static log(...data: unknown[]): void {
    log(...data);
  }

  public static warn(...data: unknown[]): void {
    warn(...data);
  }
}

export { ConsoleModule as console };
