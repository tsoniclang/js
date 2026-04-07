import { overloads as O } from "@tsonic/core/lang.js";
import type { int, JsValue } from "@tsonic/core/types.js";
import { JsonSerializer } from "@tsonic/dotnet/System.Text.Json.js";
import { JsonElement } from "@tsonic/dotnet/System.Text.Json.js";
import { jsValueFromJsonElement } from "./js-value-from-json.ts";

export class JSON {
  public static parse(text: string): JsValue;
  public static parse<T>(text: string): T;
  public static parse(_text: unknown): unknown {
    throw new Error("stub");
  }

  public static parse_value(text: string): JsValue {
    return jsValueFromJsonElement(JsonElement.Parse(text));
  }

  public static parse_typed<T>(text: string): T {
    return JsonSerializer.Deserialize<T>(text)!;
  }

  public static stringify(
    value: JsValue,
    _replacer?: JsValue,
    _space?: string | number | int
  ): string {
    return JsonSerializer.Serialize(value);
  }
}

O<typeof JSON>().method((json) => json.parse_value).family((json) => json.parse);
O<typeof JSON>().method((json) => json.parse_typed).family((json) => json.parse);
