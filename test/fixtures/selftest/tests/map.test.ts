import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class MapTests {
  set_get_has_delete_and_size_cover_map_core(): void {
    const map = new Map<string, number>();
    map.set("answer", 42);
    map.set("count", 3);

    Assert.Equal(2, map.size);
    Assert.True(map.has("answer"));
    Assert.Equal(42, map.get("answer") as number);
    Assert.True(map.delete("count"));
    Assert.Equal(1, map.size);
  }

  iteration_and_foreach_cover_remaining_map_surface(): void {
    const map = new Map<string, number>([["a", 1], ["b", 2]]);
    const entries: string[] = [];
    let total: number = 0;

    for (const [key, value] of map.entries()) {
      entries.push(`${key}:${value}`);
    }

    map.forEach((value, key) => {
      total += value;
      entries.push(`forEach:${key}`);
    });

    Assert.True(entries.includes("a:1"));
    Assert.True(entries.includes("b:2"));
    Assert.True(entries.includes("forEach:a"));
    Assert.Equal(3, total);
  }

  constructor_accepts_existing_map_iterables(): void {
    const original = new Map<string, number>([["a", 1], ["b", 2]]);
    const clone = new Map<string, number>(original);

    Assert.Equal(2, clone.size);
    Assert.Equal(1, clone.get("a") as number);
    Assert.Equal(2, clone.get("b") as number);
  }
}

A<MapTests>().method((t) => t.set_get_has_delete_and_size_cover_map_core).add(FactAttribute);
A<MapTests>().method((t) => t.iteration_and_foreach_cover_remaining_map_surface).add(FactAttribute);
A<MapTests>().method((t) => t.constructor_accepts_existing_map_iterables).add(FactAttribute);
