@echo off
echo Starting CyberCando Real-Time Driver Location Tracking System...
echo.

echo Setting up environment...
set JAVA_BACKEND_URL=http://localhost:8088

echo Starting Java Backend (Port 8088)...
start cmd /k "cd /d c:\Users\TGNE\Documents\candi2.0\driber\source && gradlew run"

timeout /t 5 /nobreak >nul

echo Starting Node.js API Gateway (Port 8080)...
start cmd /k "cd /d c:\Users\TGNE\Documents\candi2.0\dashboard\api && node server.js"

timeout /t 5 /nobreak >nul

echo Starting React Frontend (Port 5173)...
start cmd /k "cd /d c:\Users\TGNE\Documents\candi2.0\dashboard\web && npm run dev"

echo.
echo All services started!
echo - Java Backend: http://localhost:8088/dashboard
echo - API Gateway: http://localhost:8080
echo - Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause >nul