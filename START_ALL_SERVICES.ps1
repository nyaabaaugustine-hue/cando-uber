Write-Host "Starting CyberCando Real-Time Driver Location Tracking System..." -ForegroundColor Green
Write-Host ""

Write-Host "Setting up environment..." -ForegroundColor Yellow
$env:JAVA_BACKEND_URL = "http://localhost:8088"

Write-Host "Starting Java Backend (Port 8088)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/c", "cd /d $PSScriptRoot\driber\source && gradlew run"

Start-Sleep -Seconds 5

Write-Host "Starting Node.js API Gateway (Port 8080)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/c", "cd /d $PSScriptRoot\dashboard\api && npm install && node server.js"

Start-Sleep -Seconds 5

Write-Host "Starting React Frontend (Port 5173)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/c", "cd /d $PSScriptRoot\dashboard\web && npm install && npm run dev"

Write-Host ""
Write-Host "All services started!" -ForegroundColor Green
Write-Host "- Java Backend: http://localhost:8088/dashboard" -ForegroundColor Cyan
Write-Host "- API Gateway: http://localhost:8080" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "To view the map: Open your browser to http://localhost:5173/map" -ForegroundColor Magenta