Write-Host "Starting CyberCando 2.0 Services..." -ForegroundColor Green
Write-Host ""

Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check if Java is available
try {
    $javaVersion = java -version 2>&1
    Write-Host "✅ Java is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Java is not installed or not in PATH" -ForegroundColor Red
    Pause
    exit 1
}

Write-Host ""
Write-Host "Compiling Java backend..." -ForegroundColor Yellow

Set-Location "c:\Users\TGNE\Documents\candi2.0\driber\source"

# Create bin directory if it doesn't exist
if (!(Test-Path "bin")) {
    New-Item -ItemType Directory -Name "bin" | Out-Null
}

# Compile Java files
$compileResult = javac -cp "lib/*;src/main/java" -d bin src/main/java/*.java 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Compilation failed:" -ForegroundColor Red
    Write-Host $compileResult -ForegroundColor Red
    Pause
    exit 1
}

Write-Host "✅ Java backend compiled successfully" -ForegroundColor Green

Write-Host ""
Write-Host "Starting CyberCando backend with auto-registration and location tracking..." -ForegroundColor Yellow

Set-Location "c:\Users\TGNE\Documents\candi2.0"

# Start the main application
java -cp "driber/source/bin;driber/source/lib/*" Main

Pause