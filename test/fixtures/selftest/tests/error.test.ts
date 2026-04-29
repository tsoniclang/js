import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";

export class ErrorTests {
  error_preserves_name_message_and_string_form(): void {
    const error = new Error("boom");

    Assert.Equal("Error", error.name);
    Assert.Equal("boom", error.message);
    Assert.Equal("Error: boom", error.toString());
  }

  empty_error_uses_default_string_form(): void {
    const error = new Error();
    Assert.Equal("Error", error.toString());
  }
}

A<ErrorTests>().method((t) => t.error_preserves_name_message_and_string_form).add(FactAttribute);
A<ErrorTests>().method((t) => t.empty_error_uses_default_string_form).add(FactAttribute);
