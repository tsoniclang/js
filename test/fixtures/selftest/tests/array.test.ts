import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class ArrayTests {
  public constructor_and_mutation_cover_core_array_methods(): void {
    const values = [1, 2, 3];

    Assert.Equal(3, values.length);
    Assert.Equal(1, values.shift() as number);
    values.unshift(0);
    values.push(4);
    Assert.Equal(4, values.pop() as number);
    Assert.Equal("0,2,3", values.join(","));
  }

  public search_and_copy_methods_cover_indexing_slices_and_reverse(): void {
    const values = [1, 2, 3, 4, 5];

    Assert.Equal(3, values.at(2) as number);
    Assert.True(values.includes(4));
    Assert.Equal(3, values.indexOf(4));
    Assert.Equal("2,3,4", values.slice(1, 4).join(","));

    values.reverse();
    Assert.Equal("5,4,3,2,1", values.join(","));
  }

  public higher_order_methods_cover_new_dispatchers(): void {
    const values = [1, 2, 3, 4];

    Assert.True(values.every((value) => value > 0));
    Assert.True(values.some((value) => value > 3));
    Assert.Equal("2,4", values.filter((value) => value % 2 === 0).join(","));
    Assert.Equal(3, values.find((value) => value === 3) as number);
    Assert.Equal(2, values.findIndex((value) => value === 3));
    Assert.Equal(4, values.findLast((value) => value % 2 === 0) as number);
    Assert.Equal(3, values.findLastIndex((value) => value % 2 === 0));

    let total = 0;
    values.forEach((value) => {
      total += value;
    });

    Assert.Equal(10, total);
    Assert.Equal("1,3,5,7", values.map((value, index) => value + index).join(","));
    Assert.Equal(10, values.reduce((sum, value) => sum + value, 0));
    Assert.Equal(10, values.reduceRight((sum, value) => sum + value, 0));
  }
}

A<ArrayTests>().method((t) => t.constructor_and_mutation_cover_core_array_methods).add(FactAttribute);
A<ArrayTests>().method((t) => t.search_and_copy_methods_cover_indexing_slices_and_reverse).add(FactAttribute);
A<ArrayTests>().method((t) => t.higher_order_methods_cover_new_dispatchers).add(FactAttribute);
