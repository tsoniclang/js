#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DOTNET_MAJOR="${1:-10}"
WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/js-selftest.XXXXXX")"
if [ -n "${TSONIC_CLI:-}" ]; then
  TSONIC_CLI="$TSONIC_CLI"
elif [ -f "$PROJECT_ROOT/../tsonic/packages/cli/dist/index.js" ]; then
  TSONIC_CLI="$PROJECT_ROOT/../tsonic/packages/cli/dist/index.js"
else
  TSONIC_CLI="tsonic@latest"
fi
LOCAL_NUGET_FEED="$WORK_DIR/local-nuget"
export NUGET_PACKAGES="$WORK_DIR/nuget-packages"

assert_local_dependency_alignment() {
  local dependency_name="$1"
  local dependency_version="$2"
  local sibling_package_json="$PROJECT_ROOT/../${dependency_name#@tsonic/}/versions/$DOTNET_MAJOR/package.json"

  if [ ! -f "$sibling_package_json" ]; then
    return
  fi

  local sibling_version
  sibling_version="$(node -e 'const fs=require("node:fs"); const p=JSON.parse(fs.readFileSync(process.argv[1],"utf8")); process.stdout.write(p.version);' "$sibling_package_json")"

  if [ "$dependency_version" != "$sibling_version" ]; then
    echo "Local dependency drift detected for $dependency_name: package.json pins $dependency_version but sibling repo is $sibling_version" >&2
    exit 1
  fi
}

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

write_local_nuget_config() {
  local workspace_dir="$1"
  cat >"$workspace_dir/nuget.config" <<EOF
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <clear />
    <add key="local" value="$LOCAL_NUGET_FEED" />
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
  </packageSources>
</configuration>
EOF
}

pack_local_runtime_packages() {
  mkdir -p "$LOCAL_NUGET_FEED"
  dotnet pack "$PROJECT_ROOT/../runtime/src/Tsonic.Runtime/Tsonic.Runtime.csproj" -c Release -o "$LOCAL_NUGET_FEED" >/dev/null
}

PINNED_CORE_VERSION="$(node -e 'const fs=require("node:fs"); const p=JSON.parse(fs.readFileSync(process.argv[1],"utf8")); process.stdout.write(p.dependencies["@tsonic/core"]);' "$PROJECT_ROOT/versions/$DOTNET_MAJOR/package.json")"
PINNED_DOTNET_VERSION="$(node -e 'const fs=require("node:fs"); const p=JSON.parse(fs.readFileSync(process.argv[1],"utf8")); process.stdout.write(p.dependencies["@tsonic/dotnet"]);' "$PROJECT_ROOT/versions/$DOTNET_MAJOR/package.json")"
assert_local_dependency_alignment "@tsonic/core" "$PINNED_CORE_VERSION"
assert_local_dependency_alignment "@tsonic/dotnet" "$PINNED_DOTNET_VERSION"

pack_local_runtime_packages

cat >"$WORK_DIR/package.json" <<EOF
{
  "name": "js-next-selftest",
  "private": true,
  "type": "module",
  "dependencies": {
    "@tsonic/core": "file:$PROJECT_ROOT/../core/versions/$DOTNET_MAJOR",
    "@tsonic/dotnet": "file:$PROJECT_ROOT/../dotnet/versions/$DOTNET_MAJOR",
    "@tsonic/js": "file:$PROJECT_ROOT/versions/$DOTNET_MAJOR"
  }
}
EOF

npm --prefix "$WORK_DIR" install >/dev/null
run_tsonic_in "$WORK_DIR" init --surface @tsonic/js --skip-types >/dev/null
write_local_nuget_config "$WORK_DIR"

PROJECT_NAME="$(basename "$WORK_DIR")"
APP_PATH="$WORK_DIR/packages/$PROJECT_NAME/src/App.ts"

cat >"$APP_PATH" <<'EOF'
import type { int, long } from "@tsonic/core/types.js";
import type { Date as SourceDate } from "@tsonic/js/index.js";

export function main(): void {
  const parsed: number = parseInt("42");
  const parsedFloat: number = parseFloat("42.5");
  const finite: boolean = isFinite(parsedFloat);
  const nan: boolean = isNaN(parseFloat("not-a-number"));
  const stringified: string = String(123);
  const numeric: number = Number("42");
  const truthy: boolean = Boolean(1);
  const falsey: boolean = Boolean(0);
  const rounded: number = Math.round(42.7);
  const epoch: number = Date.parse("2024-01-01T00:00:00Z");
  const now: long = Date.now();
  const utcDate: Date = new Date(epoch);
  const importedDate: SourceDate = new Date(epoch);
  const iso: string = utcDate.toISOString();
  const millis: long = importedDate.getTime();
  const encodedComponent: string = encodeURIComponent("a b+c");
  const decodedComponent: string = decodeURIComponent(encodedComponent);
  const encodedUri: string = encodeURI("https://example.com/a path?q=a b#x");
  const decodedUri: string = decodeURI(encodedUri);
  const stringLength: int = "tsonic".length;
  const bytes = new Uint8Array([1, 2, 3]);
  const map = new Map<string, number>();
  map.set("answer", 42);
  const set = new Set<number>();
  set.add(1);
  set.add(2);
  set.add(3);

  if (bytes.length !== 3) throw new Error("bad bytes");
  if (map.get("answer") !== 42) throw new Error("bad map");
  if (set.size !== 3) throw new Error("bad set");
  if (!Array.isArray([1, 2, 3])) throw new Error("bad array");
  if (stringLength !== 6) throw new Error("bad string length");
  if (!iso.startsWith("2024-01-01T00:00:00")) throw new Error("bad date iso");
  if (millis !== epoch) throw new Error("bad date millis");
  if (encodedComponent !== "a%20b%2Bc") throw new Error("bad encodeURIComponent");
  if (decodedComponent !== "a b+c") throw new Error("bad decodeURIComponent");
  if (!encodedUri.includes("https://example.com/a%20path?q=a%20b#x")) throw new Error("bad encodeURI");
  if (decodedUri !== "https://example.com/a path?q=a b#x") throw new Error("bad decodeURI");

  console.log(
    [
      parsed.toString(),
      parsedFloat.toString(),
      finite.toString(),
      nan.toString(),
      stringified,
      numeric.toString(),
      rounded.toString(),
      (epoch > 0).toString(),
      (now > 0).toString(),
      iso.startsWith("2024-01-01T00:00:00").toString(),
      (millis === epoch).toString(),
      truthy.toString(),
      String(falsey),
      encodedComponent,
      decodedComponent,
      encodedUri.includes("https://example.com/a%20path?q=a%20b#x").toString(),
      (decodedUri === "https://example.com/a path?q=a b#x").toString(),
      bytes.length.toString(),
      map.get("answer")!.toString(),
      set.size.toString(),
    ].join(",")
  );
}
EOF

run_tsonic_in "$WORK_DIR" build >/dev/null

OUTPUT="$(
  run_tsonic_in "$WORK_DIR" run 2>/dev/null \
    | sed '/^Running /d;/^Process exited with code /d;/^─/d;/^$/d' \
    | tail -n 1
)"
[ "$OUTPUT" = "42,42.5,true,true,123,42,43,true,true,true,true,true,false,a%20b%2Bc,a b+c,true,true,3,42,3" ]

echo "js selftest passed"
