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

patch_workspace_for_tests() {
  local workspace_dir="$1"
  node - "$workspace_dir" <<'NODE'
const fs = require("node:fs");
const path = require("node:path");

const workspaceDir = path.resolve(process.argv[2]);
const workspacePath = path.join(workspaceDir, "tsonic.workspace.json");
const workspace = JSON.parse(fs.readFileSync(workspacePath, "utf8"));
workspace.testDotnet = {
  packageReferences: [
    { id: "Microsoft.NET.Test.Sdk", version: "17.11.1", types: false },
    { id: "xunit", version: "2.9.2" },
    { id: "xunit.runner.visualstudio", version: "2.5.6", types: false }
  ]
};
fs.writeFileSync(workspacePath, JSON.stringify(workspace, null, 2) + "\n");

const projectName = path.basename(workspaceDir);
const projectConfigPath = path.join(
  workspaceDir,
  "packages",
  projectName,
  "tsonic.json"
);
const projectConfig = JSON.parse(fs.readFileSync(projectConfigPath, "utf8"));
projectConfig.tests = {
  entryPoint: "src/tests/index.ts",
  outputDirectory: ".tsonic/generated-tests",
  outputName: "JsNext.Selftests"
};
fs.writeFileSync(projectConfigPath, JSON.stringify(projectConfig, null, 2) + "\n");

const runnerConfigPath = path.join(
  workspaceDir,
  "packages",
  projectName,
  "xunit.runner.json"
);
fs.writeFileSync(
  runnerConfigPath,
  JSON.stringify(
    {
      parallelizeTestCollections: false,
      maxParallelThreads: 1
    },
    null,
    2
  ) + "\n"
);
NODE
}

copy_fixture_tree() {
  local fixture_dir="$1"
  local workspace_dir="$2"
  local project_name
  project_name="$(basename "$workspace_dir")"
  local project_src="$workspace_dir/packages/$project_name/src"
  mkdir -p "$project_src"
  cp -R "$fixture_dir/." "$project_src/"
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
patch_workspace_for_tests "$WORK_DIR"
copy_fixture_tree "$PROJECT_ROOT/test/fixtures/selftest" "$WORK_DIR"

run_tsonic_in "$WORK_DIR" build >/dev/null
run_tsonic_in "$WORK_DIR" test --test-progress

OUTPUT="$(
  run_tsonic_in "$WORK_DIR" run 2>/dev/null \
    | sed '/^Running /d;/^Process exited with code /d;/^─/d;/^$/d' \
    | tail -n 1
)"
[ "$OUTPUT" = "42,42.5,true,true,123,42,43,true,true,true,true,true,false,a%20b%2Bc,a b+c,true,true,3,9,4,5,0,42,3,abc,1,3,5,true,2,4,3,2,4,3,10,1,3,5,7,10,10,true,42,true" ]

echo "js selftest passed"
