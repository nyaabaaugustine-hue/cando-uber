@echo off
echo Starting CyberCando Transport Dashboard Services...

REM Start the Node.js API server in the background
echo Starting API server on port 8080...
start "API Server" cmd /c "cd /d dashboard\api && node server.js"

timeout /t 5 /nobreak >nul

REM Start the Java dashboard server in the background
echo Starting Java dashboard server on port 8088...
set RUN_ONLY_DASHBOARD=true
set DASHBOARD_PORT=8088
start "Java Dashboard" cmd /c "cd /d driber\source && gradlew.bat run"

echo.
echo Services started!
echo - API Server: http://localhost:8080
echo - Java Dashboard: http://localhost:8088
echo.
echo Press any key to exit...
pause >nul