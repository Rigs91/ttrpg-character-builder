@echo off
title Forge Character One-Click Launcher
setlocal
pushd "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-forge-character-ai.ps1" -NoPause
set "EXIT_CODE=%ERRORLEVEL%"
popd
if not "%EXIT_CODE%"=="0" (
  echo.
  echo Forge Character launcher failed. Review the log paths printed above.
  pause
)
exit /b %EXIT_CODE%
