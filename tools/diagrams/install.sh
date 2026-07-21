#!/usr/bin/env sh
set -eu

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
tool_dir="$repo_root/.diagram-tools"
plantuml_version="1.2026.3"
plantuml_sha="53af6760d96bb2737e5e4386e832b46339fc29dec74f412d7c12db7c30db8ec4"
plantuml_url="https://github.com/plantuml/plantuml/releases/download/v${plantuml_version}/plantuml-${plantuml_version}.jar"
structurizr_image="structurizr/structurizr:2026.06.28-playwright"

command -v node >/dev/null 2>&1 || { echo 'Node.js 22 is required.' >&2; exit 1; }
case "$(node --version)" in v22.*) ;; *) echo 'Node.js 22 is required.' >&2; exit 1 ;; esac
command -v java >/dev/null 2>&1 || { echo 'Java 17 or newer is required.' >&2; exit 1; }

cd "$repo_root"
npm ci
mkdir -p "$tool_dir"
if [ ! -f "$tool_dir/plantuml.jar" ]; then
  if command -v curl >/dev/null 2>&1; then
    curl --fail --location "$plantuml_url" --output "$tool_dir/plantuml.jar"
  else
    wget -O "$tool_dir/plantuml.jar" "$plantuml_url"
  fi
fi
actual_sha=$(sha256sum "$tool_dir/plantuml.jar" | cut -d ' ' -f 1)
if [ "$actual_sha" != "$plantuml_sha" ]; then
  rm -f "$tool_dir/plantuml.jar"
  echo "PlantUML checksum mismatch: $actual_sha" >&2
  exit 1
fi
if command -v docker >/dev/null 2>&1; then
  docker pull "$structurizr_image"
else
  echo 'Warning: Docker unavailable; Structurizr rendering will not work.' >&2
fi
npm run diagrams:doctor

