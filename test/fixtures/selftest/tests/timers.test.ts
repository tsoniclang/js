import type { int } from "@tsonic/core/types.js";
import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class TimersTests {
  async timeout_runs_handler(): Promise<void> {
    let fired = false;

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        fired = true;
        resolve();
      }, 1 as int);
    });

    Assert.True(fired);
  }

  async interval_repeats_until_cleared(): Promise<void> {
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

  async concurrent_timeouts_all_complete(): Promise<void> {
    const tasks: Promise<void>[] = [];
    let completed = 0;

    for (let index = 0; index < 32; index += 1) {
      tasks.push(
        new Promise<void>((resolve) => {
          setTimeout(() => {
            completed += 1;
            resolve();
          }, 0 as int);
        })
      );
    }

    await Promise.all(tasks);

    Assert.Equal(32, completed);
  }
}

A<TimersTests>().method((t) => t.timeout_runs_handler).add(FactAttribute);
A<TimersTests>().method((t) => t.interval_repeats_until_cleared).add(FactAttribute);
A<TimersTests>().method((t) => t.concurrent_timeouts_all_complete).add(FactAttribute);
