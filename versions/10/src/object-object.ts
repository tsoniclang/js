import type { IDictionary } from "@tsonic/dotnet/System.Collections.js";
import { BindingFlags } from "@tsonic/dotnet/System.Reflection.js";
import { JsonElement, JsonValueKind } from "@tsonic/dotnet/System.Text.Json.js";
import type { JsValue } from "@tsonic/core/types.js";
import { jsValueFromJsonElement } from "./js-value-from-json.ts";
import { getClrType } from "./object-reflection.ts";

const enumerateEntries = (value: JsValue): [string, JsValue][] => {
  const result: [string, JsValue][] = [];
  if (value === null || value === undefined) {
    return result;
  }

  if (value instanceof JsonElement) {
    const jsonValue = value as JsonElement;
    if (jsonValue.ValueKind !== JsonValueKind.Object) {
      return result;
    }

    const enumerator = jsonValue.EnumerateObject();
    while (enumerator.MoveNext()) {
      const property = enumerator.Current;
      result.push([property.Name, jsValueFromJsonElement(property.Value)]);
    }
    return result;
  }

  try {
    const dictionary = value as IDictionary;
    const enumerator = dictionary.GetEnumerator();
    while (enumerator.MoveNext()) {
      if (typeof enumerator.Key === "string") {
        result.push([enumerator.Key, enumerator.Value]);
      }
    }
    return result;
  } catch {
  }

  const properties = getClrType(value as object).GetProperties(
    BindingFlags.Public | BindingFlags.Instance
  );
  for (const property of properties) {
    if (property.CanRead) {
      result.push([property.Name, property.GetValue(value)]);
    }
  }

  return result;
};

export abstract class Object {
  public static keys(value: JsValue): string[] {
    return enumerateEntries(value).map(([key]) => key);
  }

  public static values(value: JsValue): JsValue[] {
    return enumerateEntries(value).map(([, entryValue]) => entryValue);
  }

  public static entries(value: JsValue): [string, JsValue][] {
    return enumerateEntries(value);
  }
}
