# Set JAVA_HOME permanently (User level). Run in PowerShell.
# Usage:
#   .\Set-JavaHome.ps1                    # auto-detect JDK and set
#   .\Set-JavaHome.ps1 "C:\Program Files\Java\jdk-17"   # use this path

param(
    [Parameter(Position=0)]
    [string]$JdkPath
)

$searchPaths = @(
    "C:\Program Files\Java\jdk-17*",
    "C:\Program Files\Java\jdk-21*",
    "C:\Program Files\BellSoft\LibericaJDK-17*",
    "C:\Program Files\Eclipse Adoptium\jdk-*",
    "C:\Program Files\Microsoft\jdk-*",
    "C:\Program Files\Amazon Corretto\jdk*",
    "$env:LOCALAPPDATA\Programs\Eclipse Adoptium\jdk-*"
)

if (-not $JdkPath) {
    foreach ($pattern in $searchPaths) {
        $dir = Get-Item $pattern -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($dir -and (Test-Path "$($dir.FullName)\bin\java.exe")) {
            $JdkPath = $dir.FullName
            Write-Host "Found JDK: $JdkPath"
            break
        }
    }
}

if (-not $JdkPath -or -not (Test-Path "$JdkPath\bin\java.exe")) {
    Write-Host "No JDK found. Install JDK 17 from https://adoptium.net/ then run:" -ForegroundColor Yellow
    Write-Host '  .\Set-JavaHome.ps1 "C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot"' -ForegroundColor Cyan
    exit 1
}

[Environment]::SetEnvironmentVariable("JAVA_HOME", $JdkPath, "User")
$env:JAVA_HOME = $JdkPath
Write-Host "JAVA_HOME set permanently to: $JdkPath" -ForegroundColor Green
Write-Host "Open a NEW PowerShell window for it to take effect, then run: .\mvnw.cmd spring-boot:run" -ForegroundColor Green
