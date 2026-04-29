#!/usr/bin/env bash

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$SCRIPT_DIR"
BUILDER_PATH="$REPO_ROOT/index.html"
LAUNCHER_PATH="$REPO_ROOT/launcher.html"
LOGS_DIR="$REPO_ROOT/logs"
NODE_MODULES_DIR="$REPO_ROOT/node_modules"
DEPENDENCY_STAMP_PATH="$NODE_MODULES_DIR/.forge-launcher-deps.hash"
REACT_URL="http://localhost:5173"
API_HEALTH_URL="http://localhost:8787/health"
API_READY_URL="http://localhost:8787/ready"
OLLAMA_TAGS_URL="http://127.0.0.1:11434/api/tags"
RECOMMENDED_MODEL="qwen2.5:7b-instruct"

NO_BROWSER=0
SKIP_HOMEBREW_INSTALL=0
SKIP_OLLAMA_INSTALL=0
SKIP_MODEL_PULL=0
CI_MODE=0

for arg in "$@"; do
  case "$arg" in
    --no-browser) NO_BROWSER=1 ;;
    --skip-homebrew-install) SKIP_HOMEBREW_INSTALL=1 ;;
    --skip-ollama-install) SKIP_OLLAMA_INSTALL=1 ;;
    --skip-model-pull) SKIP_MODEL_PULL=1 ;;
    --ci) CI_MODE=1; NO_BROWSER=1 ;;
    -h|--help)
      cat <<'HELP'
Forge Character macOS launcher

Usage:
  bash ./start-forge-character-mac.sh [flags]

Flags:
  --no-browser              Do not open index.html after startup.
  --skip-homebrew-install   Do not install Homebrew automatically.
  --skip-ollama-install     Do not install Ollama automatically.
  --skip-model-pull         Do not pull a recommended Ollama model automatically.
  --ci                      CI-safe mode. Implies --no-browser and skips GUI prompts where possible.
HELP
      exit 0
      ;;
    *)
      printf "Unknown flag: %s\n" "$arg" >&2
      exit 2
      ;;
  esac
done

mkdir -p "$LOGS_DIR"
RUN_STAMP="$(date +"%Y%m%d-%H%M%S")"
INSTALL_LOG="$LOGS_DIR/launcher-mac-install-$RUN_STAMP.log"
BUILD_LOG="$LOGS_DIR/launcher-mac-build-$RUN_STAMP.log"
BUNDLE_LOG="$LOGS_DIR/launcher-mac-bundle-$RUN_STAMP.log"
OLLAMA_LOG="$LOGS_DIR/launcher-mac-ollama-$RUN_STAMP.log"
DEV_LOG="$LOGS_DIR/launcher-mac-dev-$RUN_STAMP.log"
DEV_PID_PATH="$LOGS_DIR/launcher-mac-dev.pid"

write_step() {
  printf '[%s] %s\n' "$1" "$2"
}

fail_launch() {
  write_step "FAIL" "$1"
  printf "\nLogs for this launch:\n"
  printf "  Install: %s\n" "$INSTALL_LOG"
  printf "  Build:   %s\n" "$BUILD_LOG"
  printf "  Bundle:  %s\n" "$BUNDLE_LOG"
  printf "  Ollama:  %s\n" "$OLLAMA_LOG"
  printf "  Dev:     %s\n" "$DEV_LOG"
  printf "\nTroubleshooting commands:\n"
  printf "  npm run start:ai:mac\n"
  printf "  npm run dev\n"
  printf "  curl http://localhost:8787/health\n"
  printf "  curl http://localhost:8787/ready\n"
  printf "  lsof -nP -iTCP:5173 -sTCP:LISTEN\n"
  printf "  lsof -nP -iTCP:8787 -sTCP:LISTEN\n"
  printf "  lsof -nP -iTCP:11434 -sTCP:LISTEN\n"
  printf "  ollama list\n"
  exit 1
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

quote_for_sh() {
  printf "%s" "$1" | sed "s/'/'\\\\''/g; s/^/'/; s/$/'/"
}

run_logged() {
  label="$1"
  log_path="$2"
  shift 2
  write_step "INFO" "$label..."
  {
    printf '# %s %s\n' "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" "$label"
    "$@"
  } >>"$log_path" 2>&1
  status=$?
  if [ "$status" -ne 0 ]; then
    fail_launch "$label failed. See $log_path"
  fi
  write_step "PASS" "$label completed."
}

run_optional_logged() {
  label="$1"
  log_path="$2"
  shift 2
  write_step "INFO" "$label..."
  {
    printf '# %s %s\n' "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" "$label"
    "$@"
  } >>"$log_path" 2>&1
  status=$?
  if [ "$status" -ne 0 ]; then
    write_step "WARN" "$label failed. See $log_path"
    return 1
  fi
  write_step "PASS" "$label completed."
  return 0
}

add_homebrew_to_path() {
  if [ -x "/opt/homebrew/bin/brew" ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  elif [ -x "/usr/local/bin/brew" ]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi
}

version_supports_repo() {
  raw_version="$1"
  version="${raw_version#v}"
  major="$(printf "%s" "$version" | cut -d. -f1)"
  minor="$(printf "%s" "$version" | cut -d. -f2)"
  patch="$(printf "%s" "$version" | cut -d. -f3)"
  minor="${minor:-0}"
  patch="${patch:-0}"

  case "$major" in
    ''|*[!0-9]*) return 1 ;;
  esac
  case "$minor" in
    ''|*[!0-9]*) return 1 ;;
  esac
  case "$patch" in
    ''|*[!0-9]*) return 1 ;;
  esac

  if [ "$major" -eq 20 ] && [ "$minor" -ge 19 ]; then
    return 0
  fi
  if [ "$major" -eq 22 ] && [ "$minor" -ge 12 ]; then
    return 0
  fi
  if [ "$major" -gt 22 ]; then
    return 0
  fi
  return 1
}

ensure_macos() {
  if [ "$(uname -s)" != "Darwin" ]; then
    fail_launch "This launcher is for macOS. Use START_FORGE_CHARACTER_AI.cmd on Windows."
  fi

  macos_version="$(sw_vers -productVersion 2>/dev/null || printf "unknown")"
  macos_name="$(sw_vers -productName 2>/dev/null || printf "macOS")"
  arch="$(uname -m)"
  write_step "INFO" "$macos_name $macos_version detected on $arch."

  major="$(printf "%s" "$macos_version" | cut -d. -f1)"
  if [ "$major" != "26" ]; then
    write_step "WARN" "This launcher targets macOS Tahoe 26. It may still work on supported older macOS versions, but Tahoe is the tested public target."
  fi
}

ensure_command_line_tools() {
  if xcode-select -p >/dev/null 2>&1; then
    write_step "PASS" "Xcode Command Line Tools are available."
    return
  fi

  if [ "$CI_MODE" -eq 1 ]; then
    write_step "WARN" "Xcode Command Line Tools were not detected in CI mode."
    return
  fi

  write_step "WARN" "Xcode Command Line Tools are required for Homebrew/npm native installs."
  xcode-select --install >/dev/null 2>&1 || true
  fail_launch "Install the Xcode Command Line Tools from the macOS prompt, then rerun the launcher."
}

ensure_homebrew() {
  add_homebrew_to_path
  if command_exists brew; then
    write_step "PASS" "Homebrew is available."
    return 0
  fi

  if [ "$SKIP_HOMEBREW_INSTALL" -eq 1 ] || [ "$CI_MODE" -eq 1 ]; then
    write_step "WARN" "Homebrew is not available and automatic Homebrew install is disabled."
    return 1
  fi

  if ! command_exists curl; then
    fail_launch "curl is required to install Homebrew and was not found."
  fi

  write_step "WARN" "Homebrew was not found. Starting the official Homebrew installer; it may ask for confirmation."
  homebrew_installer="$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" || fail_launch "Could not download the Homebrew installer."
  run_logged "Installing Homebrew" "$INSTALL_LOG" /bin/bash -c "$homebrew_installer"
  add_homebrew_to_path

  if command_exists brew; then
    write_step "PASS" "Homebrew is available after install."
    return 0
  fi

  fail_launch "Homebrew install completed but brew is not on PATH. Follow the Homebrew post-install shellenv instructions, then rerun the launcher."
}

ensure_node_and_npm() {
  add_homebrew_to_path
  node_ok=0
  if command_exists node; then
    node_version="$(node --version 2>/dev/null || printf "")"
    if version_supports_repo "$node_version"; then
      node_ok=1
      write_step "PASS" "Node $node_version meets the repo floor."
    else
      write_step "WARN" "Node $node_version does not meet the repo floor (^20.19.0 or >=22.12.0)."
    fi
  else
    write_step "WARN" "Node.js was not found."
  fi

  if [ "$node_ok" -ne 1 ]; then
    if ! ensure_homebrew; then
      fail_launch "Node.js 20.19+ or 22.12+ is required. Install Node manually or allow Homebrew install, then rerun the launcher."
    fi
    run_logged "Installing Node.js with Homebrew" "$INSTALL_LOG" brew install node
    add_homebrew_to_path
  fi

  if ! command_exists node; then
    fail_launch "Node.js is required and could not be found after installation."
  fi
  node_version="$(node --version 2>/dev/null || printf "")"
  if ! version_supports_repo "$node_version"; then
    fail_launch "Node $node_version is still below the repo floor. Install Node 20.19+ or 22.12+."
  fi

  if ! command_exists npm; then
    fail_launch "npm is required and was not found. Reinstall Node.js with npm included."
  fi

  npm_version="$(npm --version 2>/dev/null || printf "unknown")"
  write_step "PASS" "npm $npm_version is available."
}

ensure_env_file() {
  if [ -f "$REPO_ROOT/.env" ] || [ ! -f "$REPO_ROOT/.env.example" ]; then
    return
  fi

  cp "$REPO_ROOT/.env.example" "$REPO_ROOT/.env"
  write_step "PASS" "Created local .env from .env.example."
}

dependency_fingerprint() {
  (
    cd "$REPO_ROOT" || exit 1
    for path in package.json package-lock.json; do
      if [ -f "$path" ]; then
        shasum -a 256 "$path"
      fi
    done
    find apps packages -type f -name package.json 2>/dev/null | LC_ALL=C sort | while IFS= read -r path; do
      shasum -a 256 "$path"
    done
  ) | shasum -a 256 | awk '{print $1}'
}

dependencies_current() {
  if [ ! -d "$NODE_MODULES_DIR" ] || [ ! -f "$DEPENDENCY_STAMP_PATH" ]; then
    return 1
  fi
  current="$(dependency_fingerprint)"
  saved="$(cat "$DEPENDENCY_STAMP_PATH" 2>/dev/null || printf "")"
  [ "$current" = "$saved" ]
}

ensure_dependencies() {
  cd "$REPO_ROOT" || fail_launch "Could not enter repo root."
  if dependencies_current; then
    write_step "PASS" "npm dependencies are already installed for the current manifests."
    return
  fi

  run_logged "Installing npm dependencies" "$INSTALL_LOG" npm install
  mkdir -p "$NODE_MODULES_DIR"
  dependency_fingerprint >"$DEPENDENCY_STAMP_PATH"
  write_step "PASS" "Dependency fingerprint saved."
}

ensure_build_artifacts() {
  cd "$REPO_ROOT" || fail_launch "Could not enter repo root."
  run_logged "Building shared package artifacts" "$BUILD_LOG" npm run precheck:deps
  run_logged "Regenerating file:// static bundle" "$BUNDLE_LOG" npm run bundle:static
}

test_url() {
  url="$1"
  curl --silent --fail --max-time 3 "$url" >/dev/null 2>&1
}

test_api_ready() {
  if ! test_url "$API_HEALTH_URL"; then
    return 1
  fi
  return 0
}

test_web_ready() {
  test_url "$REACT_URL"
}

listener_pid() {
  port="$1"
  lsof -nP -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null | head -n 1
}

assert_no_unhealthy_port_conflicts() {
  react_ready="$1"
  api_ready="$2"
  conflicts=""

  if [ "$react_ready" -ne 1 ]; then
    pid="$(listener_pid 5173 || true)"
    if [ -n "$pid" ]; then
      conflicts="${conflicts}Port 5173 is occupied by PID $pid, but the React app is not healthy.\n"
    fi
  fi

  if [ "$api_ready" -ne 1 ]; then
    pid="$(listener_pid 8787 || true)"
    if [ -n "$pid" ]; then
      conflicts="${conflicts}Port 8787 is occupied by PID $pid, but the API is not healthy.\n"
    fi
  fi

  if [ -n "$conflicts" ]; then
    printf "%b" "$conflicts"
    fail_launch "Cannot safely start the local stack until the unhealthy port conflict is closed."
  fi
}

test_ollama_ready() {
  curl --silent --fail --max-time 3 "$OLLAMA_TAGS_URL" >/dev/null 2>&1
}

compatible_ollama_model_installed() {
  if ! command_exists ollama; then
    return 1
  fi
  ollama list 2>/dev/null | awk 'NR > 1 { print tolower($1) }' | grep -Ev '(vision|-vl|embed)' | grep -q .
}

ensure_ollama() {
  if command_exists ollama; then
    write_step "PASS" "Ollama CLI is available."
  else
    if [ "$SKIP_OLLAMA_INSTALL" -eq 1 ] || [ "$CI_MODE" -eq 1 ]; then
      write_step "WARN" "Ollama is not installed and automatic Ollama install was skipped."
      return
    fi
    if ! ensure_homebrew; then
      write_step "WARN" "Homebrew is unavailable, so Ollama cannot be installed automatically."
      return
    fi
    run_optional_logged "Installing Ollama with Homebrew" "$OLLAMA_LOG" brew install ollama || true
  fi

  if ! command_exists ollama; then
    write_step "WARN" "Ollama is unavailable. The builder will launch, but AI autofill will fall back to guide mode."
    return
  fi

  if ! test_ollama_ready; then
    write_step "INFO" "Starting Ollama in the background..."
    nohup ollama serve >>"$OLLAMA_LOG" 2>&1 &
    sleep 2
    deadline=$((SECONDS + 25))
    while [ "$SECONDS" -lt "$deadline" ]; do
      if test_ollama_ready; then
        break
      fi
      sleep 2
    done
  fi

  if ! test_ollama_ready; then
    write_step "WARN" "Ollama did not respond on port 11434. AI autofill will fall back to guide mode."
    return
  fi

  write_step "PASS" "Ollama is responding on port 11434."
  if compatible_ollama_model_installed; then
    write_step "PASS" "At least one compatible local Ollama model is installed."
    return
  fi

  if [ "$SKIP_MODEL_PULL" -eq 1 ] || [ "$CI_MODE" -eq 1 ]; then
    write_step "WARN" "No compatible Ollama model is installed and model pull was skipped."
    return
  fi

  write_step "WARN" "No compatible Ollama model found. Pulling $RECOMMENDED_MODEL. This can take several minutes on first run."
  run_optional_logged "Pulling Ollama model $RECOMMENDED_MODEL" "$OLLAMA_LOG" ollama pull "$RECOMMENDED_MODEL" || true
}

start_dev_stack_if_needed() {
  react_ready=0
  api_ready=0
  if test_web_ready; then
    react_ready=1
  fi
  if test_api_ready; then
    api_ready=1
  fi

  if [ "$react_ready" -eq 1 ] && [ "$api_ready" -eq 1 ]; then
    write_step "PASS" "React app and API are already running; reusing the healthy local stack."
    return
  fi

  assert_no_unhealthy_port_conflicts "$react_ready" "$api_ready"

  escaped_root="$(quote_for_sh "$REPO_ROOT")"
  nohup bash -lc "cd $escaped_root && npm run dev" >>"$DEV_LOG" 2>&1 &
  dev_pid=$!
  printf "%s\n" "$dev_pid" >"$DEV_PID_PATH"
  write_step "INFO" "Started npm run dev in the background (PID $dev_pid)."

  deadline=$((SECONDS + 90))
  while [ "$SECONDS" -lt "$deadline" ]; do
    react_ready=0
    api_ready=0
    if test_web_ready; then
      react_ready=1
    fi
    if test_api_ready; then
      api_ready=1
    fi
    if [ "$react_ready" -eq 1 ] && [ "$api_ready" -eq 1 ]; then
      break
    fi
    sleep 2
  done

  if ! test_api_ready; then
    fail_launch "API did not become healthy on port 8787."
  fi

  if test_web_ready; then
    write_step "PASS" "React dev app is responding on port 5173."
  else
    write_step "WARN" "React dev app did not respond on port 5173. The root builder will still open, but check the dev log if you need the React workspace."
  fi
}

report_readiness() {
  if test_url "$API_READY_URL"; then
    ready_payload="$(curl --silent --max-time 3 "$API_READY_URL" 2>/dev/null || printf "")"
    if printf "%s" "$ready_payload" | grep -q '"status"[[:space:]]*:[[:space:]]*"ready"'; then
      write_step "PASS" "API readiness check reports ready."
    else
      write_step "WARN" "API readiness is degraded. Details: $ready_payload"
    fi
  else
    write_step "WARN" "API readiness endpoint could not be read."
  fi

  health_payload="$(curl --silent --max-time 3 "$API_HEALTH_URL" 2>/dev/null || printf "")"
  if printf "%s" "$health_payload" | grep -q '"ai"[[:space:]]*:[[:space:]]*true'; then
    write_step "PASS" "Ollama-backed AI draft autofill is available in the builder."
  else
    write_step "WARN" "The API is up, but AI is unavailable. The root builder chat will fall back to guide mode until Ollama and a compatible model are ready."
  fi
}

cd "$REPO_ROOT" || fail_launch "Could not enter repo root."
write_step "INFO" "Forge Character macOS one-click launcher starting in $REPO_ROOT"
write_step "INFO" "Main builder path: $BUILDER_PATH"
write_step "INFO" "Logs directory: $LOGS_DIR"

ensure_macos
ensure_command_line_tools
ensure_node_and_npm
if ! command_exists curl; then
  fail_launch "curl is required for launcher health probes and was not found."
fi
ensure_env_file
ensure_dependencies
ensure_build_artifacts
ensure_ollama
start_dev_stack_if_needed

if test_api_ready; then
  write_step "PASS" "API health is ready on port 8787."
else
  fail_launch "API health was lost after startup."
fi

report_readiness

if test_web_ready; then
  write_step "PASS" "Secondary React app is responding at $REACT_URL."
fi

if [ "$NO_BROWSER" -ne 1 ]; then
  open "$BUILDER_PATH"
  write_step "PASS" "Opened the main builder at $BUILDER_PATH"
fi

printf "\nUseful follow-up paths and commands:\n"
printf "  Builder:     %s\n" "$BUILDER_PATH"
printf "  Diagnostics: %s\n" "$LAUNCHER_PATH"
printf "  Logs:        %s\n" "$LOGS_DIR"
printf "  React app:   %s\n" "$REACT_URL"
printf "  curl http://localhost:8787/health\n"
printf "  curl http://localhost:8787/ready\n"
printf "  ollama list\n"
printf "  npm run test\n"
