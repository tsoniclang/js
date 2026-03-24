import { debug, error, info, log, warn } from "./console.js";

abstract class ConsoleModule {
  public static debug(first: unknown, ...rest: unknown[]): void {
    debug(first, ...rest);
  }

  public static error(first: unknown, ...rest: unknown[]): void {
    error(first, ...rest);
  }

  public static info(first: unknown, ...rest: unknown[]): void {
    info(first, ...rest);
  }

  public static log(first: unknown, ...rest: unknown[]): void {
    log(first, ...rest);
  }

  public static warn(first: unknown, ...rest: unknown[]): void {
    warn(first, ...rest);
  }
}

export { ConsoleModule as console };
