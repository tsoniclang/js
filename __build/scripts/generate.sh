#!/bin/bash
# Generate TypeScript declarations for @tsonic/js (JSRuntime library)
#
# This script regenerates all TypeScript type declarations from the
# Tsonic.JSRuntime.dll assembly using tsbindgen.
#
# Prerequisites:
#   - .NET 10 SDK installed
#   - tsbindgen repository cloned at ../tsbindgen (sibling directory)
#   - js-runtime repository cloned at ../js-runtime (sibling directory)
#
# Usage:
#   ./__build/scripts/generate.sh [dotnetMajor]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
TSBINDGEN_DIR="$PROJECT_DIR/../tsbindgen"
JS_RUNTIME_DIR="$PROJECT_DIR/../js-runtime"

# .NET major to generate (publishes to versions/<major>/)
DOTNET_MAJOR="${1:-10}"
OUT_DIR="$PROJECT_DIR/versions/$DOTNET_MAJOR"

DOTNET_LIB="$PROJECT_DIR/../dotnet/versions/$DOTNET_MAJOR"
CORE_LIB="$PROJECT_DIR/../core/versions/$DOTNET_MAJOR"

# .NET runtime path (needed for BCL type resolution)
DOTNET_VERSION="${DOTNET_VERSION:-10.0.1}"
DOTNET_HOME="${DOTNET_HOME:-$HOME/.dotnet}"
DOTNET_RUNTIME_PATH="$DOTNET_HOME/shared/Microsoft.NETCore.App/$DOTNET_VERSION"

# Tsonic.JSRuntime.dll path
JSRUNTIME_DLL="$JS_RUNTIME_DIR/artifacts/bin/Tsonic.JSRuntime/Release/net${DOTNET_MAJOR}.0/Tsonic.JSRuntime.dll"
SURFACE_PACKAGE="$JS_RUNTIME_DIR/surface/$DOTNET_MAJOR/tsbindgen.surface-package.json"

echo "================================================================"
echo "Generating @tsonic/js TypeScript Declarations"
echo "================================================================"
echo ""
echo "Configuration:"
echo "  JSRuntime.dll: $JSRUNTIME_DLL"
echo "  .NET Runtime:  $DOTNET_RUNTIME_PATH"
echo "  BCL Library:   $DOTNET_LIB (external reference)"
echo "  tsbindgen:     $TSBINDGEN_DIR"
echo "  Output:        $OUT_DIR"
echo "  Surface:       $SURFACE_PACKAGE"
echo ""

# Verify prerequisites
if [ ! -f "$JSRUNTIME_DLL" ]; then
    echo "ERROR: Tsonic.JSRuntime.dll not found at $JSRUNTIME_DLL"
    echo "Build it first: cd ../js-runtime && dotnet build -c Release"
    exit 1
fi

if [ ! -d "$DOTNET_RUNTIME_PATH" ]; then
    echo "ERROR: .NET runtime not found at $DOTNET_RUNTIME_PATH"
    echo "Set DOTNET_HOME or DOTNET_VERSION environment variables"
    exit 1
fi

if [ ! -d "$TSBINDGEN_DIR" ]; then
    echo "ERROR: tsbindgen not found at $TSBINDGEN_DIR"
    echo "Clone it: git clone https://github.com/tsoniclang/tsbindgen ../tsbindgen"
    exit 1
fi

if [ ! -d "$DOTNET_LIB" ]; then
    echo "ERROR: @tsonic/dotnet not found at $DOTNET_LIB"
    echo "Clone it: git clone https://github.com/tsoniclang/dotnet ../dotnet"
    exit 1
fi

if [ ! -d "$CORE_LIB" ]; then
    echo "ERROR: @tsonic/core not found at $CORE_LIB"
    echo "Clone it: git clone https://github.com/tsoniclang/core ../core"
    exit 1
fi

if [ ! -f "$SURFACE_PACKAGE" ]; then
    echo "ERROR: JS surface package not found at $SURFACE_PACKAGE"
    echo "Expected runtime-owned surface config in ../js-runtime/surface/$DOTNET_MAJOR"
    exit 1
fi

# Ensure output directory exists
mkdir -p "$OUT_DIR"

patch_generated_types() {
  local globals_file="$OUT_DIR/globals.d.ts"
  local internal_file="$OUT_DIR/index/internal/index.d.ts"

  perl -0pi -e 's/isArray\(value: unknown\): boolean;/isArray(value: unknown): value is readonly unknown[] | unknown[];/g' "$globals_file" "$internal_file"
  perl -0pi -e 's/isArray<T>\(value: unknown\): boolean;/isArray<T>(value: unknown): value is readonly T[] | T[];/g' "$internal_file"
}

# Clean output directory (keep package metadata files)
echo "[1/3] Cleaning output directory..."
cd "$OUT_DIR"

# Remove all generated namespace directories
find . -maxdepth 1 -type d ! -name '.' -exec rm -rf {} \; 2>/dev/null || true

# Remove generated files at root (keep package metadata copied from repo root)
find . -maxdepth 1 -type f \
  ! -name 'package.json' \
  ! -name 'README.md' \
  ! -name 'LICENSE' \
  -exec rm -f {} \; 2>/dev/null || true

echo "  Done"

# Build tsbindgen
echo "[2/3] Building tsbindgen..."
cd "$TSBINDGEN_DIR"
dotnet build src/tsbindgen/tsbindgen.csproj -c Release --verbosity quiet
echo "  Done"

# Generate types with CLR-faithful naming.
# Uses --lib to reference BCL types from @tsonic/dotnet instead of regenerating them
# Uses --namespace-map to emit as index.d.ts/index.js for cleaner imports
# Uses --flatten-class to export Globals methods as top-level functions
echo "[3/3] Generating TypeScript declarations..."
dotnet run --project src/tsbindgen/tsbindgen.csproj --no-build -c Release -- \
    generate -a "$JSRUNTIME_DLL" -d "$DOTNET_RUNTIME_PATH" -o "$OUT_DIR" \
    --lib "$DOTNET_LIB" \
    --lib "$CORE_LIB" \
    --namespace-map "Tsonic.JSRuntime=index" \
    --flatten-class "Tsonic.JSRuntime.Globals" \
    --surface-package "$SURFACE_PACKAGE"

patch_generated_types

cp -f "$PROJECT_DIR/README.md" "$OUT_DIR/README.md"
cp -f "$PROJECT_DIR/LICENSE" "$OUT_DIR/LICENSE"

echo "[4/4] Verifying npm package contents..."
PACK_JSON="$(cd "$PROJECT_DIR" && npm pack --dry-run --json "./versions/$DOTNET_MAJOR")"
node - "$OUT_DIR" "$PACK_JSON" <<'NODE'
const fs = require("node:fs");
const path = require("node:path");

const outDir = path.resolve(process.argv[2]);
const packJson = JSON.parse(process.argv[3]);
const packEntry = Array.isArray(packJson) ? packJson[0] : packJson;
const packedFiles = new Set(
  (packEntry.files ?? []).map((entry) => String(entry.path).replace(/\\/g, "/"))
);

const expectedFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    expectedFiles.push(path.relative(outDir, fullPath).replace(/\\/g, "/"));
  }
};
walk(outDir);

const missing = expectedFiles
  .filter((file) => !packedFiles.has(file))
  .sort();

if (missing.length > 0) {
  console.error("ERROR: npm pack is missing generated files:");
  for (const file of missing) {
    console.error(`  - ${file}`);
  }
  process.exit(1);
}
NODE
echo "  Done"

echo ""
echo "================================================================"
echo "Generation Complete"
echo "================================================================"
