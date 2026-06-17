import type { int, JsValue } from "@tsonic/core/types.js";

type RuntimeValue = JsValue | undefined;

declare global {
  interface IArguments {
    readonly length: int;
    readonly [index: number]: RuntimeValue;
  }

  interface String {
    readonly [index: number]: string;
  }
}

export {};
