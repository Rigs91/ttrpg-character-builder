#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

bash "$SCRIPT_DIR/start-forge-character-mac.sh"
EXIT_CODE=$?

if [ "$EXIT_CODE" -ne 0 ]; then
  printf "\nForge Character Mac launcher failed. Review the log paths printed above.\n"
  printf "Press Return to close this window."
  read -r _
fi

exit "$EXIT_CODE"
