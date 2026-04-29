param(
  [switch]$NoBrowser,
  [switch]$SkipOllamaInstall,
  [switch]$SkipModelPull,
  [switch]$NoPause
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$builderPath = Join-Path $repoRoot "index.html"
$launcherPath = Join-Path $repoRoot "launcher.html"
$logsDir = Join-Path $repoRoot "logs"
$nodeModulesDir = Join-Path $repoRoot "node_modules"
$dependencyStampPath = Join-Path $nodeModulesDir ".forge-launcher-deps.hash"
$reactUrl = "http://localhost:5173"
$apiHealthUrl = "http://localhost:8787/health"
$apiReadyUrl = "http://localhost:8787/ready"
$ollamaTagsUrl = "http://127.0.0.1:11434/api/tags"
$preferredNode = [Version]"20.19.0"
$recommendedModel = "qwen2.5:7b-instruct"

New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
$runStamp = Get-Date -Format "yyyyMMdd-HHmmss"
$installLog = Join-Path $logsDir ("launcher-install-" + $runStamp + ".log")
$buildLog = Join-Path $logsDir ("launcher-build-" + $runStamp + ".log")
$bundleLog = Join-Path $logsDir ("launcher-bundle-" + $runStamp + ".log")
$ollamaLog = Join-Path $logsDir ("launcher-ollama-" + $runStamp + ".log")
$devLog = Join-Path $logsDir ("launcher-dev-" + $runStamp + ".log")

function Write-Step([string]$Status, [string]$Message, [ConsoleColor]$Color = [ConsoleColor]::Gray) {
  Write-Host ("[{0}] {1}" -f $Status, $Message) -ForegroundColor $Color
}

function Pause-IfNeeded {
  if (-not $NoPause) {
    Write-Host ""
    Read-Host "Press Enter to close"
  }
}

function Fail-Launch([string]$Message) {
  Write-Step "FAIL" $Message Red
  Write-Host ""
  Write-Host "Logs for this launch:" -ForegroundColor Yellow
  Write-Host ("  Install: " + $installLog)
  Write-Host ("  Build:   " + $buildLog)
  Write-Host ("  Bundle:  " + $bundleLog)
  Write-Host ("  Ollama:  " + $ollamaLog)
  Write-Host ("  Dev:     " + $devLog)
  Write-Host ""
  Write-Host "Troubleshooting commands:" -ForegroundColor Yellow
  Write-Host "  npm.cmd run start:ai"
  Write-Host "  npm.cmd run dev"
  Write-Host "  Get-NetTCPConnection -LocalPort 5173,8787,11434 -State Listen"
  Write-Host "  Invoke-RestMethod http://localhost:8787/health | ConvertTo-Json -Depth 6"
  Write-Host "  Invoke-RestMethod http://localhost:8787/ready | ConvertTo-Json -Depth 6"
  Write-Host "  ollama list"
  Pause-IfNeeded
  exit 1
}

function Get-Tool([string]$CommandName) {
  return Get-Command $CommandName -ErrorAction SilentlyContinue
}

function Update-ProcessPathFromMachine {
  $machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
  $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
  $env:Path = (($machinePath, $userPath, $env:Path) -join ";")
}

function Invoke-LoggedCommand([string]$Label, [string]$LogPath, [string]$FilePath, [string[]]$Arguments) {
  Write-Step "INFO" ($Label + "...") Cyan
  Add-Content -LiteralPath $LogPath -Value ("# " + (Get-Date).ToString("s") + " " + $Label)
  $stdoutPath = Join-Path $env:TEMP ("forge-launcher-" + [guid]::NewGuid().ToString("N") + ".out")
  $stderrPath = Join-Path $env:TEMP ("forge-launcher-" + [guid]::NewGuid().ToString("N") + ".err")
  try {
    $process = Start-Process -FilePath $FilePath -ArgumentList $Arguments -NoNewWindow -Wait -PassThru -RedirectStandardOutput $stdoutPath -RedirectStandardError $stderrPath
    $output = @()
    if (Test-Path $stdoutPath) {
      $output += Get-Content -LiteralPath $stdoutPath -Encoding UTF8 -ErrorAction SilentlyContinue
    }
    if (Test-Path $stderrPath) {
      $output += Get-Content -LiteralPath $stderrPath -Encoding UTF8 -ErrorAction SilentlyContinue
    }
    if ($output.Count -gt 0) {
      $output | Tee-Object -FilePath $LogPath -Append
    }
  } finally {
    Remove-Item -LiteralPath $stdoutPath, $stderrPath -Force -ErrorAction SilentlyContinue
  }
  if ($process.ExitCode -ne 0) {
    Fail-Launch ($Label + " failed. See " + $LogPath)
  }
  Write-Step "PASS" ($Label + " completed.") Green
}

function Invoke-OptionalLoggedCommand([string]$Label, [string]$LogPath, [string]$FilePath, [string[]]$Arguments) {
  Write-Step "INFO" ($Label + "...") Cyan
  Add-Content -LiteralPath $LogPath -Value ("# " + (Get-Date).ToString("s") + " " + $Label)
  $stdoutPath = Join-Path $env:TEMP ("forge-launcher-" + [guid]::NewGuid().ToString("N") + ".out")
  $stderrPath = Join-Path $env:TEMP ("forge-launcher-" + [guid]::NewGuid().ToString("N") + ".err")
  try {
    $process = Start-Process -FilePath $FilePath -ArgumentList $Arguments -NoNewWindow -Wait -PassThru -RedirectStandardOutput $stdoutPath -RedirectStandardError $stderrPath
    $output = @()
    if (Test-Path $stdoutPath) {
      $output += Get-Content -LiteralPath $stdoutPath -Encoding UTF8 -ErrorAction SilentlyContinue
    }
    if (Test-Path $stderrPath) {
      $output += Get-Content -LiteralPath $stderrPath -Encoding UTF8 -ErrorAction SilentlyContinue
    }
    if ($output.Count -gt 0) {
      $output | Tee-Object -FilePath $LogPath -Append
    }
  } finally {
    Remove-Item -LiteralPath $stdoutPath, $stderrPath -Force -ErrorAction SilentlyContinue
  }
  if ($process.ExitCode -ne 0) {
    Write-Step "WARN" ($Label + " failed. See " + $LogPath) Yellow
    return $false
  }
  Write-Step "PASS" ($Label + " completed.") Green
  return $true
}

function Install-WithWinget([string]$PackageId, [string]$Label) {
  if (-not (Get-Tool "winget")) {
    Write-Step "WARN" ("winget is not available, so " + $Label + " cannot be installed automatically.") Yellow
    return $false
  }

  $args = @(
    "install",
    "--id", $PackageId,
    "--exact",
    "--accept-package-agreements",
    "--accept-source-agreements"
  )
  return Invoke-OptionalLoggedCommand ("Installing " + $Label + " with winget") $installLog "winget" $args
}

function Ensure-NodeAndNpm {
  if (-not (Get-Tool "node")) {
    Write-Step "WARN" "Node.js was not found. Trying to install Node.js LTS with winget." Yellow
    [void](Install-WithWinget "OpenJS.NodeJS.LTS" "Node.js LTS")
    Update-ProcessPathFromMachine
  }

  if (-not (Get-Tool "node")) {
    Fail-Launch "Node.js is required and could not be found or installed. Install Node.js 20.19+ or 22.12+, then rerun the launcher."
  }

  if (-not (Get-Tool "npm.cmd")) {
    Update-ProcessPathFromMachine
  }

  if (-not (Get-Tool "npm.cmd")) {
    Fail-Launch "npm.cmd is required and was not found. Reinstall Node.js with npm included, then rerun the launcher."
  }

  $nodeVersionText = (& node --version).Trim()
  $nodeVersion = [Version]($nodeVersionText.TrimStart("v"))
  if ($nodeVersion -lt $preferredNode) {
    Write-Step "WARN" ("Node " + $nodeVersionText + " is below the repo floor 20.19.0. Startup will continue, but Vite will warn. Upgrade Node before final signoff.") Yellow
  } else {
    Write-Step "PASS" ("Node " + $nodeVersionText + " meets the repo floor.") Green
  }

  $npmVersion = (& npm.cmd --version).Trim()
  Write-Step "PASS" ("npm " + $npmVersion + " is available.") Green
}

function Ensure-EnvFile {
  $envPath = Join-Path $repoRoot ".env"
  $examplePath = Join-Path $repoRoot ".env.example"
  if ((Test-Path $envPath) -or -not (Test-Path $examplePath)) {
    return
  }

  Copy-Item -LiteralPath $examplePath -Destination $envPath
  Write-Step "PASS" "Created local .env from .env.example." Green
}

function Get-DependencyFingerprint {
  $files = @()
  foreach ($path in @("package.json", "package-lock.json")) {
    $fullPath = Join-Path $repoRoot $path
    if (Test-Path $fullPath) {
      $files += Get-Item -LiteralPath $fullPath
    }
  }

  foreach ($folder in @("apps", "packages")) {
    $fullFolder = Join-Path $repoRoot $folder
    if (Test-Path $fullFolder) {
      $files += Get-ChildItem -LiteralPath $fullFolder -Recurse -File -Filter "package.json"
    }
  }

  $hashes = foreach ($file in ($files | Sort-Object FullName)) {
    $hash = Get-FileHash -Algorithm SHA256 -LiteralPath $file.FullName
    ($file.FullName.Substring($repoRoot.Length) + ":" + $hash.Hash)
  }
  return ($hashes -join "`n")
}

function Test-DependenciesCurrent {
  if (-not (Test-Path $nodeModulesDir)) {
    return $false
  }
  if (-not (Test-Path $dependencyStampPath)) {
    return $false
  }
  return ((Get-Content -LiteralPath $dependencyStampPath -Raw).TrimEnd() -eq (Get-DependencyFingerprint).TrimEnd())
}

function Ensure-Dependencies {
  if (Test-DependenciesCurrent) {
    Write-Step "PASS" "npm dependencies are already current for the package manifests." Green
    return
  }

  Invoke-LoggedCommand "Installing npm dependencies" $installLog "npm.cmd" @("install")
  if (-not (Test-Path $nodeModulesDir)) {
    Fail-Launch "npm install completed, but node_modules is still missing."
  }
  Set-Content -LiteralPath $dependencyStampPath -Value (Get-DependencyFingerprint) -Encoding UTF8
  Write-Step "PASS" "Dependency fingerprint updated." Green
}

function Ensure-BuildArtifacts {
  Invoke-LoggedCommand "Building shared workspace dependencies" $buildLog "npm.cmd" @("run", "precheck:deps")
  Invoke-LoggedCommand "Regenerating root file:// static bundle" $bundleLog "npm.cmd" @("run", "bundle:static")
}

function Test-HttpReady([string]$Url, [int]$TimeoutSeconds = 2) {
  try {
    $statusCode = (& curl.exe --silent --output NUL --write-out "%{http_code}" --max-time $TimeoutSeconds $Url).Trim()
    return $statusCode -match "^(2|3)\d\d$"
  } catch {
    return $false
  }
}

function Test-WebReady {
  return Test-HttpReady $reactUrl 2
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
  return [pscustomobject]@{
    Port = $Port
    ProcessId = $listener.OwningProcess
    ProcessName = if ($process) { $process.ProcessName } else { "unknown" }
  }
}

function Test-OllamaReady {
  try {
    $rawJson = (& curl.exe --silent --max-time 3 $ollamaTagsUrl).Trim()
    if (-not $rawJson) {
      throw "Empty Ollama tags response."
    }
    $payload = $rawJson | ConvertFrom-Json
    return [pscustomobject]@{
      Ok = $true
      Models = @($payload.models)
      Error = $null
    }
  } catch {
    return [pscustomobject]@{
      Ok = $false
      Models = @()
      Error = $_.Exception.Message
    }
  }
}

function Test-CompatibleOllamaModel($Models) {
  foreach ($model in @($Models)) {
    $name = [string]$model.name
    if (-not $name) {
      continue
    }
    $normalized = $name.ToLowerInvariant()
    if ($normalized.Contains("vision") -or $normalized.Contains("-vl") -or $normalized.Contains("embed")) {
      continue
    }
    return $true
  }
  return $false
}

function Start-OllamaIfPossible {
  if (-not (Get-Tool "ollama")) {
    if ($SkipOllamaInstall) {
      Write-Step "WARN" "Ollama is not installed and automatic Ollama install was skipped." Yellow
      return
    }

    Write-Step "WARN" "Ollama was not found. Trying to install Ollama with winget." Yellow
    [void](Install-WithWinget "Ollama.Ollama" "Ollama")
    Update-ProcessPathFromMachine
  }

  if (-not (Get-Tool "ollama")) {
    Write-Step "WARN" "Ollama is still unavailable. The builder will launch, but AI autofill will fall back to guide mode." Yellow
    return
  }

  $ollamaState = Test-OllamaReady
  if (-not $ollamaState.Ok) {
    Write-Step "INFO" "Starting Ollama service in a background console..." Cyan
    $serveCommand = "ollama serve 2>&1 | Tee-Object -FilePath '" + $ollamaLog.Replace("'", "''") + "' -Append"
    Start-Process -FilePath "powershell.exe" -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", $serveCommand) | Out-Null
    $deadline = (Get-Date).AddSeconds(25)
    do {
      Start-Sleep -Seconds 2
      $ollamaState = Test-OllamaReady
    } until ($ollamaState.Ok -or (Get-Date) -ge $deadline)
  }

  if (-not $ollamaState.Ok) {
    Write-Step "WARN" ("Ollama did not respond on port 11434. AI autofill will fall back to guide mode. Last error: " + $ollamaState.Error) Yellow
    return
  }

  Write-Step "PASS" "Ollama is responding on port 11434." Green
  if (Test-CompatibleOllamaModel $ollamaState.Models) {
    Write-Step "PASS" "At least one compatible local Ollama model is installed." Green
    return
  }

  if ($SkipModelPull) {
    Write-Step "WARN" "No compatible Ollama model is installed and model pull was skipped." Yellow
    return
  }

  Write-Step "WARN" ("No compatible Ollama model found. Pulling " + $recommendedModel + ". This can take several minutes on first run.") Yellow
  [void](Invoke-OptionalLoggedCommand ("Pulling Ollama model " + $recommendedModel) $ollamaLog "ollama" @("pull", $recommendedModel))
}

function Assert-NoUnhealthyPortConflicts([bool]$ReactReady, [bool]$ApiReady) {
  $conflicts = @()
  if (-not $ReactReady) {
    $listener = Get-ListenerInfo 5173
    if ($listener) {
      $conflicts += $listener
    }
  }
  if (-not $ApiReady) {
    $listener = Get-ListenerInfo 8787
    if ($listener) {
      $conflicts += $listener
    }
  }

  if ($conflicts.Count -eq 0) {
    return
  }

  foreach ($conflict in $conflicts) {
    Write-Step "WARN" ("Port " + $conflict.Port + " is occupied by PID " + $conflict.ProcessId + " (" + $conflict.ProcessName + "), but the expected service is not healthy.") Yellow
  }
  Fail-Launch "Cannot safely start the local stack until the unhealthy port conflict is closed."
}

function Start-DevStackIfNeeded {
  $reactReady = Test-WebReady
  $apiState = Test-ApiReady

  if ($reactReady -and $apiState.Ok) {
    Write-Step "PASS" "React app and API are already running; reusing the healthy local stack." Green
    return
  }

  Assert-NoUnhealthyPortConflicts $reactReady $apiState.Ok

  $escapedRoot = $repoRoot.Replace("'", "''")
  $escapedDevLog = $devLog.Replace("'", "''")
  $command = "Set-Location -LiteralPath '" + $escapedRoot + "'; npm.cmd run dev 2>&1 | Tee-Object -FilePath '" + $escapedDevLog + "' -Append"
  $process = Start-Process -FilePath "powershell.exe" -ArgumentList @("-NoProfile", "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $command) -PassThru
  Write-Step "INFO" ("Started npm.cmd run dev in a new PowerShell window (PID " + $process.Id + ").") Cyan

  $deadline = (Get-Date).AddSeconds(90)
  do {
    Start-Sleep -Seconds 2
    $reactReady = Test-WebReady
    $apiState = Test-ApiReady
  } until (($reactReady -and $apiState.Ok) -or (Get-Date) -ge $deadline)

  if (-not $apiState.Ok) {
    $failureReason = if ($apiState.Error) { " Last error: " + $apiState.Error } else { "" }
    Fail-Launch ("API did not become healthy on port 8787." + $failureReason)
  }

  if (-not $reactReady) {
    Write-Step "WARN" "React dev app did not respond on port 5173. The root builder will still open, but check the dev log if you need the React workspace." Yellow
  } else {
    Write-Step "PASS" "React dev app is responding on port 5173." Green
  }
}

Set-Location $repoRoot
Write-Step "INFO" ("Forge Character one-click launcher starting in " + $repoRoot) Cyan
Write-Step "INFO" ("Main builder path: " + $builderPath) Cyan
Write-Step "INFO" ("Logs directory: " + $logsDir) Cyan

Ensure-NodeAndNpm
if (-not (Get-Tool "curl.exe")) {
  Fail-Launch "curl.exe is required for launcher health probes and was not found."
}
Ensure-EnvFile
Ensure-Dependencies
Ensure-BuildArtifacts
Start-OllamaIfPossible
Start-DevStackIfNeeded

$reactReadyFinal = Test-WebReady
$apiStateFinal = Test-ApiReady

if ($apiStateFinal.Ok) {
  Write-Step "PASS" "API health is ready on port 8787." Green
} else {
  Fail-Launch "API health was lost after startup."
}

try {
  $readyPayload = (& curl.exe --silent --max-time 3 $apiReadyUrl).Trim() | ConvertFrom-Json
  if ($readyPayload.status -eq "ready") {
    Write-Step "PASS" "API readiness check reports ready." Green
  } else {
    Write-Step "WARN" ("API readiness is degraded. Details: " + (($readyPayload | ConvertTo-Json -Depth 6 -Compress))) Yellow
  }
} catch {
  Write-Step "WARN" ("API readiness endpoint could not be read: " + $_.Exception.Message) Yellow
}

if ($reactReadyFinal) {
  Write-Step "PASS" ("Secondary React app is responding at " + $reactUrl) Green
}

if ($apiStateFinal.Ai) {
  Write-Step "PASS" "Ollama-backed AI draft autofill is available in the builder." Green
} else {
  Write-Step "WARN" "The API is up, but AI is unavailable. The root builder chat will fall back to guide mode until Ollama and a compatible model are ready." Yellow
}

if (-not $NoBrowser) {
  Start-Process $builderPath | Out-Null
  Write-Step "PASS" ("Opened the main builder at " + $builderPath) Green
}

Write-Host ""
Write-Host "Useful follow-up paths and commands:" -ForegroundColor Yellow
Write-Host ("  Builder:     " + $builderPath)
Write-Host ("  Diagnostics: " + $launcherPath)
Write-Host ("  Logs:        " + $logsDir)
Write-Host ("  React app:   " + $reactUrl)
Write-Host "  Invoke-RestMethod http://localhost:8787/health | ConvertTo-Json -Depth 6"
Write-Host "  Invoke-RestMethod http://localhost:8787/ready | ConvertTo-Json -Depth 6"
Write-Host "  ollama list"
Write-Host "  npm.cmd run test"
