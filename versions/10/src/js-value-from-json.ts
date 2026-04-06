import { Dictionary } from "@tsonic/dotnet/System.Collections.Generic.js";
import { JsonElement, JsonValueKind } from "@tsonic/dotnet/System.Text.Json.js";
import type { JsValue } from "@tsonic/core/types.js";

export const jsValueFromJsonElement = (element: JsonElement): JsValue => {
  switch (element.ValueKind) {
    case JsonValueKind.Null:
    case JsonValueKind.Undefined:
      return null;
    case JsonValueKind.True:
      return true;
    case JsonValueKind.False:
      return false;
    case JsonValueKind.Number:
      return element.GetDouble();
    case JsonValueKind.String:
      return element.GetString();
    case JsonValueKind.Array: {
      const result: JsValue[] = [];
      const enumerator = element.EnumerateArray();
      while (enumerator.MoveNext()) {
        result.push(jsValueFromJsonElement(enumerator.Current));
      }
      return result;
    }
    case JsonValueKind.Object: {
      const result = new Dictionary<string, JsValue>();
      const enumerator = element.EnumerateObject();
      while (enumerator.MoveNext()) {
        const property = enumerator.Current;
        result.Add(property.Name, jsValueFromJsonElement(property.Value));
      }
      return result;
    }
    default:
      throw new Error(`Unsupported JsonValueKind: ${element.ValueKind}`);
  }
};
