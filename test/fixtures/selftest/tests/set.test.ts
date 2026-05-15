import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class SetTests {
  add_has_delete_clear_and_size_cover_set_core(): void {
    const values = new Set<number>();
    values.add(1).add(2).add(2);

    Assert.Equal(2, values.size);
    Assert.True(values.has(2));
    Assert.True(values.delete(1));
    Assert.False(values.has(1));

    values.clear();
    Assert.Equal(0, values.size);
  }

  entries_values_keys_and_foreach_cover_iteration_surface(): void {
    const values = new Set<number>([1, 2, 3]);
    const seen: string[] = [];
    let total: number = 0;

    for (const [key, value] of values.entries()) {
      seen.push(`${key}:${value}`);
    }

    for (const value of values.keys()) {
      total += value;
    }

    values.forEach((value) => {
      seen.push(`forEach:${value}`);
    });

    Assert.True(seen.includes("1:1"));
    Assert.True(seen.includes("forEach:3"));
    Assert.Equal(6, total);
  }
}

A<SetTests>().method((t) => t.add_has_delete_clear_and_size_cover_set_core).add(FactAttribute);
A<SetTests>().method((t) => t.entries_values_keys_and_foreach_cover_iteration_surface).add(FactAttribute);
