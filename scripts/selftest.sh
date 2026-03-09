#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"
npm run generate:10 >/dev/null

GLOBALS="$PROJECT_ROOT/versions/10/globals.d.ts"

grep -Fq "readonly url: string;" "$GLOBALS"
grep -Fq "readonly filename: string;" "$GLOBALS"
grep -Fq "readonly dirname: string;" "$GLOBALS"
grep -Fq "toString(): string;" "$GLOBALS"
grep -Fq "valueOf(): boolean;" "$GLOBALS"

echo "js selftest passed"
