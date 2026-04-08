param(
  [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$builderPath = Join-Path $repoRoot "index.html"
$launcherPath = Join-Path $repoRoot "launcher.html"
$reactUrl = "http://localhost:5173"
$apiHealthUrl = "http://localhost:8787/health"
$preferredNode = [Version]"20.19.0"

function Write-Step([string]$Status, [string]$Message, [ConsoleColor]$Color = [ConsoleColor]::Gray) {
  Write-Host ("[{0}] {1}" -f $Status, $Message) -ForegroundColor $Color
}

function Fail-Launch([string]$Message) {
  Write-Step "FAIL" $Message Red
  Write-Host ""
  Write-Host "Troubleshooting commands:" -ForegroundColor Yellow
  Write-Host "  npm.cmd run start:ai"
  Write-Host "  npm.cmd run dev"
  Write-Host "  Get-NetTCPConnection -LocalPort 5173,8787 -State Listen"
  Write-Host "  Invoke-RestMethod http://localhost:8787/health | ConvertTo-Json -Depth 6"
  Write-Host "  ollama list"
  Write-Host ""
  Read-Host "Press Enter to close"
  exit 1
}

function Test-WebReady {
  try {
    $statusCode = (& curl.exe --silent --output NUL --write-out "%{http_code}" --max-time 2 $reactUrl).Trim()
    return $statusCode -match "^(2|3)\d\d$"
  } catch {
    return $false
  }
}

function Test-ApiReady {
  $lastError = $null
  for ($attempt = 1; $attempt -le 3; $attempt += 1) {
    try {
      $rawJson = (& curl.exe --silent --max-time 2 $apiHealthUrl).Trim()
      if (-not $rawJson) {
        throw "Empty health response."
      }
      $payload = $rawJson | ConvertFrom-Json
      return [pscustomobject]@{
        Ok = ($payload.status -eq "ok")
        Ai = [bool]$payload.capabilities.ai
        Raw = $payload
        Error = $null
      }
    } catch {
      $lastError = $_.Exception.Message
      Start-Sleep -Milliseconds 250
    }
  }

  return [pscustomobject]@{
    Ok = $false
    Ai = $false
    Raw = $null
    Error = $lastError
  }
}

function Get-ListenerInfo([int]$Port) {
  $listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if (-not $listener) {
    return $null
  }

  $process = Get-Process -Id $listener.OwningProcess -ErrorAction SilentlyContinue
  return @{
    Port = $Port
    ProcessId = $listener.OwningProcess
    ProcessName = if ($process) { $process.ProcessName } else { "unknown" }
  }
}

function Ensure-Tool([string]$CommandName, [string]$InstallHint) {
  if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
    Fail-Launch ($CommandName + " is not available. " + $InstallHint)
  }
}

Set-Location $repoRoot
Write-Step "INFO" ("Forge Character launcher starting in " + $repoRoot) Cyan
Write-Step "INFO" ("Main builder path: " + $builderPath) Cyan

Ensure-Tool "node" "Install Node.js 20.19+ or 22.12+."
Ensure-Tool "npm.cmd" "Install npm with Node.js and reopen this launcher."
Ensure-Tool "curl.exe" "curl.exe is required for launcher health probes."

$nodeVersionText = (& node --version).Trim()
$nodeVersion = [Version]($nodeVersionText.TrimStart("v"))
if ($nodeVersion -lt $preferredNode) {
  Write-Step "WARN" ("Node " + $nodeVersionText + " is below the preferred repo floor 20.19.0. The app may still run, but Vite will warn.") Yellow
} else {
  Write-Step "PASS" ("Node " + $nodeVersionText + " meets the repo floor.") Green
}

if (-not (Test-Path (Join-Path $repoRoot "node_modules"))) {
  Write-Step "INFO" "node_modules is missing. Running npm.cmd install before startup..." Cyan
  & npm.cmd install
  if ($LASTEXITCODE -ne 0) {
    Fail-Launch "npm.cmd install failed."
  }
  Write-Step "PASS" "Dependencies installed." Green
}

$reactReady = Test-WebReady
$apiState = Test-ApiReady
if (-not $apiState.Ok) {
  $conflicts = @()
  foreach ($port in 5173, 8787) {
    $listener = Get-ListenerInfo $port
    if ($listener) {
      if (($port -eq 5173 -and -not $reactReady) -or ($port -eq 8787 -and -not $apiState.Ok)) {
        $conflicts += $listener
      }
    }
  }

  if ($conflicts.Count -gt 0) {
    foreach ($conflict in $conflicts) {
      Write-Step "WARN" ("Port " + $conflict.Port + " is occupied by PID " + $conflict.ProcessId + " (" + $conflict.ProcessName + "), but the expected service is not healthy.") Yellow
    }
    Write-Step "WARN" "Skipping automatic npm.cmd run dev because conflicting listeners were detected." Yellow
  } else {
    $command = 'cd /d "' + $repoRoot + '" && npm.cmd run dev'
    $process = Start-Process -FilePath "cmd.exe" -ArgumentList "/k", $command -PassThru
    Write-Step "INFO" ("Started npm.cmd run dev in a new window (PID " + $process.Id + ").") Cyan

    $deadline = (Get-Date).AddSeconds(70)
    do {
      Start-Sleep -Seconds 2
      $reactReady = Test-WebReady
      $apiState = Test-ApiReady
    } until (($apiState.Ok) -or (Get-Date) -ge $deadline)
  }
}

$reactReady = Test-WebReady
$apiState = Test-ApiReady

if ($apiState.Ok) {
  Write-Step "PASS" "API health is ready on port 8787." Green
} else {
  $failureReason = if ($apiState.Error) { " Last error: " + $apiState.Error } else { "" }
  Write-Step "WARN" ("The API is still offline, so chat autofill will fall back to guide mode." + $failureReason) Yellow
}

if ($reactReady) {
  Write-Step "PASS" ("Secondary React app is responding at " + $reactUrl) Green
} else {
  Write-Step "WARN" "The React dev app is not running. That is okay for the main builder path." Yellow
}

if ($apiState.Ai) {
  Write-Step "PASS" "Ollama-backed AI draft autofill is available in the builder." Green
} elseif ($apiState.Ok) {
  Write-Step "WARN" "The API is up, but AI is unavailable. Start Ollama and install a compatible instruct or text model to enable autofill." Yellow
} else {
  Write-Step "WARN" "AI autofill is unavailable because the local API is offline." Yellow
}

if (-not $NoBrowser) {
  Start-Process $builderPath | Out-Null
  Write-Step "PASS" ("Opened the main builder at " + $builderPath) Green
}

Write-Host ""
Write-Host "Useful follow-up paths and commands:" -ForegroundColor Yellow
Write-Host ("  Builder: " + $builderPath)
Write-Host ("  Diagnostics: " + $launcherPath)
Write-Host "  Invoke-RestMethod http://localhost:8787/health | ConvertTo-Json -Depth 6"
Write-Host "  ollama list"
Write-Host "  npm.cmd run test"
