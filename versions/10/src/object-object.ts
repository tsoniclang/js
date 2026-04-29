import type { Dictionary } from "@tsonic/dotnet/System.Collections.Generic.js";
import { List } from "@tsonic/dotnet/System.Collections.Generic.js";

export class Object {
  static entries<T>(obj: Record<string, T>): [string, T][] {
    const dictionary = obj as object as Dictionary<string, T>;
    const result = new List<[string, T]>();
    const keys = dictionary.Keys.GetEnumerator();
    while (keys.MoveNext()) {
      const key = keys.Current;
      result.Add([key, obj[key]]);
    }
    return result.ToArray();
  }

  static keys<T>(obj: Record<string, T>): string[] {
    const dictionary = obj as object as Dictionary<string, T>;
    const result = new List<string>();
    const keys = dictionary.Keys.GetEnumerator();
    while (keys.MoveNext()) {
      result.Add(keys.Current);
    }
    return result.ToArray();
  }

  static values<T>(obj: Record<string, T>): T[] {
    const dictionary = obj as object as Dictionary<string, T>;
    const result = new List<T>();
    const keys = dictionary.Keys.GetEnumerator();
    while (keys.MoveNext()) {
      const key = keys.Current;
      result.Add(obj[key]);
    }
    return result.ToArray();
  }
}
