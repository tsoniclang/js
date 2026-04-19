import type { int } from "@tsonic/core/types.js";
import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class TimersTests {
  public async timeout_runs_handler(): Promise<void> {
    let fired = false;

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        fired = true;
        resolve();
      }, 1 as int);
    });

    Assert.True(fired);
  }

  public async interval_repeats_until_cleared(): Promise<void> {
    let count = 0;

    await new Promise<void>((resolve) => {
      let id = 0 as int;
      id = setInterval(() => {
        count += 1;
        if (count >= 2) {
          clearInterval(id);
          resolve();
        }
      }, 1 as int);
    });

    Assert.True(count >= 2);
  }
}

A<TimersTests>().method((t) => t.timeout_runs_handler).add(FactAttribute);
A<TimersTests>().method((t) => t.interval_repeats_until_cleared).add(FactAttribute);
