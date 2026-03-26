export class Error {
  public readonly name: string = "Error";
  public readonly message: string;
  public readonly stack?: string;

  public constructor(message?: string) {
    this.message = message ?? "";
  }

  public toString(): string {
    if (this.message === "") {
      return this.name;
    }

    return `${this.name}: ${this.message}`;
  }
}
