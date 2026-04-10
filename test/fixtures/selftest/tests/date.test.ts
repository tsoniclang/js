import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class DateTests {
  public parse_now_and_utc_cover_static_surface(): void {
    const epoch = Date.parse("2024-01-01T00:00:00Z");

    Assert.True(epoch > 0);
    Assert.Equal(epoch, Date.UTC(2024, 0, 1, 0, 0, 0, 0));
    Assert.True(Date.now() > 0);
  }

  public getters_and_setters_cover_instance_surface(): void {
    const date = new Date(Date.UTC(2024, 0, 1, 10, 20, 30, 40));

    Assert.Equal(2024, date.getUTCFullYear());
    Assert.Equal(0, date.getUTCMonth());
    Assert.Equal(1, date.getUTCDate());
    Assert.Equal(10, date.getUTCHours());

    date.setUTCMinutes(45, 50, 60);
    Assert.Equal(45, date.getUTCMinutes());
    Assert.Equal(50, date.getUTCSeconds());
    Assert.Equal(60, date.getUTCMilliseconds());
    Assert.True(date.toISOString().startsWith("2024-01-01T10:45:50"));
  }
}

A<DateTests>().method((t) => t.parse_now_and_utc_cover_static_surface).add(FactAttribute);
A<DateTests>().method((t) => t.getters_and_setters_cover_instance_surface).add(FactAttribute);
