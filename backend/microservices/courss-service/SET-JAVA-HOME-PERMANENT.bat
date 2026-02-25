@echo off
cd /d "%~dp0"
REM Set JAVA_HOME permanently. Finds JDK automatically (Liberica, Adoptium, etc.).
powershell -NoProfile -ExecutionPolicy Bypass -File ".\Set-JavaHome.ps1"
if errorlevel 1 (
  echo.
  echo If JDK is already installed, run with your path:
  echo   powershell -File Set-JavaHome.ps1 "C:\Program Files\BellSoft\LibericaJDK-17"
  echo.
)
pause
