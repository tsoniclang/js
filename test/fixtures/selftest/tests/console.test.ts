import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

import { console } from "@tsonic/js/index.js";

export class ConsoleTests {
  console_methods_accept_common_payloads(): void {
    console.debug("debug", 1);
    console.info("info", true);
    console.log("log", "ok");
    console.warn("warn", [1, 2, 3]);
    console.error("error", null);

    Assert.True(true);
  }
}

A<ConsoleTests>().method((t) => t.console_methods_accept_common_payloads).add(FactAttribute);
