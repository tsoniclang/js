import { ErrorObject } from "./error-object.js";

export class RangeErrorObject extends ErrorObject {
  public readonly name: string = "RangeError";

  public constructor(message?: string) {
    super(message);
  }
}
