import type { IDictionary } from "@tsonic/dotnet/System.Collections.js";
import { Dictionary } from "@tsonic/dotnet/System.Collections.Generic.js";
import type { Type } from "@tsonic/dotnet/System.js";
import { BindingFlags } from "@tsonic/dotnet/System.Reflection.js";
import { JsonElement, JsonValueKind } from "@tsonic/dotnet/System.Text.Json.js";

type Reflectable = {
  GetType(): Type;
};

const fromJsonElement = (element: JsonElement): unknown => {
  switch (element.ValueKind) {
    case JsonValueKind.Null:
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
      const result: unknown[] = [];
      const enumerator = element.EnumerateArray();
      while (enumerator.MoveNext()) {
        result.push(fromJsonElement(enumerator.Current));
      }
      return result;
    }
    case JsonValueKind.Object: {
      const result = new Dictionary<string, unknown>();
      const enumerator = element.EnumerateObject();
      while (enumerator.MoveNext()) {
        const property = enumerator.Current;
        result.Add(property.Name, fromJsonElement(property.Value));
      }
      return result;
    }
    default:
      return undefined;
  }
};

const enumerateEntries = (value: unknown): [string, unknown][] => {
  const result: [string, unknown][] = [];
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
      result.push([property.Name, fromJsonElement(property.Value)]);
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

  const properties = (value as Reflectable).GetType().GetProperties(
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
  public static keys(value: unknown): string[] {
    return enumerateEntries(value).map(([key]) => key);
  }

  public static values(value: unknown): unknown[] {
    return enumerateEntries(value).map(([, entryValue]) => entryValue);
  }

  public static entries(value: unknown): [string, unknown][] {
    return enumerateEntries(value);
  }
}
