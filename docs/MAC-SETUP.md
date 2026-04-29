# Mac Setup And One-Click Launcher

Forge Character includes a macOS launcher for sharing the project with Mac users without requiring them to know the repo internals.

## Supported Target

- Primary target: macOS Tahoe 26 on Apple-supported hardware.
- Hardware: Apple Silicon is preferred, especially for Ollama-backed AI autofill. Compatible Intel Macs can run the builder and API, but local AI performance may be limited.
- Browser: the launcher opens the root builder in the user's default browser with the macOS `open` command.

## Fast Path

1. Download or clone the repo.
2. Double-click `START_FORGE_CHARACTER_MAC.command`.
3. Let Terminal finish the checks and installs.
4. Use the builder window that opens at `index.html`.

The launcher checks macOS, Xcode Command Line Tools, Homebrew, Node/npm, npm dependencies, build artifacts, optional Ollama availability, API health, readiness, and the secondary React dev app.

## If macOS Blocks The File

Downloaded `.command` files can be blocked by execute permissions or quarantine metadata. From Terminal, run this once inside the repo folder:

```bash
chmod +x START_FORGE_CHARACTER_MAC.command start-forge-character-mac.sh
xattr -dr com.apple.quarantine .
```

Then double-click `START_FORGE_CHARACTER_MAC.command` again.

## Terminal Launch

If double-click launch is inconvenient:

```bash
npm run start:ai:mac
```

Useful flags:

```bash
bash ./start-forge-character-mac.sh --no-browser
bash ./start-forge-character-mac.sh --skip-ollama-install
bash ./start-forge-character-mac.sh --skip-model-pull
```

## What Gets Installed

- Node/npm are installed or upgraded through Homebrew only if the current versions are missing or below the repo floor.
- Homebrew is installed through the official installer only if it is missing and the user allows the Terminal prompt.
- Ollama is optional. The launcher tries to install/start it and pull `qwen2.5:7b-instruct` only when needed, but the builder still works in guide mode if AI is unavailable.

## Troubleshooting

Launcher logs are written to `logs/`:

```bash
ls -lt logs/launcher-mac-*.log | head
```

Check service health:

```bash
curl http://localhost:8787/health
curl http://localhost:8787/ready
curl http://localhost:5173
```

Check port ownership:

```bash
lsof -nP -iTCP:5173 -sTCP:LISTEN
lsof -nP -iTCP:8787 -sTCP:LISTEN
lsof -nP -iTCP:11434 -sTCP:LISTEN
```

Check Ollama:

```bash
ollama list
curl http://127.0.0.1:11434/api/tags
```

## Manual Smoke Checklist

- Fresh clone or ZIP download opens `START_FORGE_CHARACTER_MAC.command`.
- First run installs or confirms Node/npm and npm dependencies.
- `index.html` opens in the default browser.
- `curl http://localhost:8787/health` returns API health.
- If Ollama is absent, the builder chat reports guide/fallback mode instead of blocking.
- If Ollama and a compatible model are present, the builder chat reports AI autofill availability.
