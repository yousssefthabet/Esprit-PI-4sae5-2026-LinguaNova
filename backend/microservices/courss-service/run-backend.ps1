# Run the course backend (Spring Boot). Sets JAVA_HOME if needed.
# Usage: .\run-backend.ps1

$possiblePaths = @(
    "C:\Program Files\Java\jdk-17",
    "C:\Program Files\Java\jdk-21",
    "C:\Program Files\Eclipse Adoptium\jdk-17*",
    "C:\Program Files\Microsoft\jdk-17*",
    "C:\Program Files\Amazon Corretto\jdk17*",
    "$env:LOCALAPPDATA\Programs\Eclipse Adoptium\jdk-17*"
)

if (-not $env:JAVA_HOME) {
    foreach ($p in $possiblePaths) {
        $resolved = Get-Item $p -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($resolved -and (Test-Path "$($resolved.FullName)\bin\java.exe")) {
            $env:JAVA_HOME = $resolved.FullName
            Write-Host "Using JAVA_HOME=$env:JAVA_HOME"
            break
        }
    }
}

if (-not $env:JAVA_HOME) {
    Write-Host "JAVA_HOME not set and no JDK found in common locations." -ForegroundColor Red
    Write-Host "Install JDK 17 (e.g. https://adoptium.net/) then either:" -ForegroundColor Yellow
    Write-Host "  1. Set JAVA_HOME in System Environment Variables to your JDK folder, or" -ForegroundColor Yellow
    Write-Host "  2. Run: `$env:JAVA_HOME = 'C:\Path\To\Your\jdk-17'" -ForegroundColor Yellow
    exit 1
}

Set-Location $PSScriptRoot
& .\mvnw.cmd spring-boot:run
