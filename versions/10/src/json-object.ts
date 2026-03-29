import type { int } from "@tsonic/core/types.js";
import { JsonSerializer } from "@tsonic/dotnet/System.Text.Json.js";

export class JSON {
  public static parse<T = unknown>(text: string): T {
    return JsonSerializer.Deserialize<T>(text)!;
  }

  public static stringify(
    value: unknown,
    _replacer?: unknown,
    _space?: string | number | int
  ): string {
    return JsonSerializer.Serialize(value);
  }
}
