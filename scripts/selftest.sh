#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DOTNET_MAJOR="${1:-10}"
WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/js-selftest.XXXXXX")"
TSONIC_CLI="${TSONIC_CLI:-tsonic@latest}"

cleanup() {
  rm -rf "$WORK_DIR"
}
trap cleanup EXIT

run_tsonic() {
  if [[ "$TSONIC_CLI" == *.js ]]; then
    node "$TSONIC_CLI" "$@"
    return
  fi

  npx --yes "$TSONIC_CLI" "$@"
}

run_tsonic_in() {
  local workdir="$1"
  shift
  (
    cd "$workdir"
    run_tsonic "$@"
  )
}

cd "$PROJECT_ROOT"
npm run "generate:$DOTNET_MAJOR" >/dev/null

GLOBALS="$PROJECT_ROOT/versions/$DOTNET_MAJOR/globals.d.ts"

grep -Fq "readonly url: string;" "$GLOBALS"
grep -Fq "readonly filename: string;" "$GLOBALS"
grep -Fq "readonly dirname: string;" "$GLOBALS"
grep -Fq "(value?: unknown): string;" "$GLOBALS"
grep -Fq "toString(): string;" "$GLOBALS"
grep -Fq "valueOf(): boolean;" "$GLOBALS"
grep -Fq "(value?: unknown): number;" "$GLOBALS"
grep -Fq "readonly length: int;" "$GLOBALS"
grep -Fq "indexOf(searchString: string, position?: int): int;" "$GLOBALS"
grep -Fq "now(): long;" "$GLOBALS"
grep -Fq "parse(s: string): number;" "$GLOBALS"
grep -Fq "round(x: number): number;" "$GLOBALS"

run_tsonic_in "$WORK_DIR" init --surface @tsonic/js >/dev/null
npm --prefix "$WORK_DIR" install \
  "$PROJECT_ROOT/../core/versions/$DOTNET_MAJOR" \
  "$PROJECT_ROOT/../dotnet/versions/$DOTNET_MAJOR" \
  "$PROJECT_ROOT/versions/$DOTNET_MAJOR" >/dev/null

PROJECT_NAME="$(basename "$WORK_DIR")"
APP_PATH="$WORK_DIR/packages/$PROJECT_NAME/src/App.ts"

cat >"$APP_PATH" <<'EOF'
import type { int, long } from "@tsonic/core/types.js";

export function main(): void {
  const stringified: string = String(123);
  const numeric: number = Number("42");
  const stringLength: int = "tsonic".length;
  const arrayLength: int = [1, 2, 3].length;
  const firstIndex: int = "banana".indexOf("na");
  const lastIndex: int = "banana".lastIndexOf("a");
  const parsed: number = Date.parse("2024-01-01T00:00:00Z");
  const now: long = Date.now();
  const rounded: number = Math.round(42.7);
  void parsed;
  void now;
  console.log(
    [
      stringLength.toString(),
      arrayLength.toString(),
      firstIndex.toString(),
      lastIndex.toString(),
      stringified,
      numeric.toString(),
      rounded.toString(),
    ]
      .join(",")
  );
}
EOF

run_tsonic_in "$WORK_DIR" build >/dev/null
OUTPUT="$(
  run_tsonic_in "$WORK_DIR" run 2>/dev/null \
    | sed '/^Running /d;/^Process exited with code /d;/^─/d;/^$/d' \
    | tail -n 1
)"
[ "$OUTPUT" = "6,3,2,5,123,42,43" ]

echo "js selftest passed"
