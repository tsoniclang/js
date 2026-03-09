#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"
npm run generate:10 >/dev/null

CORE_GLOBALS="$PROJECT_ROOT/versions/10/core-globals.d.ts"

grep -Fq "readonly url: string;" "$CORE_GLOBALS"
grep -Fq "readonly filename: string;" "$CORE_GLOBALS"
grep -Fq "readonly dirname: string;" "$CORE_GLOBALS"
grep -Fq "toString(): string;" "$CORE_GLOBALS"
grep -Fq "valueOf(): boolean;" "$CORE_GLOBALS"

echo "js selftest passed"
