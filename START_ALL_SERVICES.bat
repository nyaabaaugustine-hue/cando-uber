@echo off
echo Starting CyberCando 2.0 Services...
echo.

echo Checking prerequisites...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java is not installed or not in PATH
    pause
    exit /b 1
)

echo ✅ Java is available

echo.
echo Compiling Java backend...
cd /d "c:\Users\TGNE\Documents\candi2.0\driber\source"
if not exist bin mkdir bin
javac -cp "lib/*;src/main/java" -d bin src/main/java/*.java
if %errorlevel% neq 0 (
    echo ❌ Compilation failed
    pause
    exit /b 1
)

echo ✅ Java backend compiled successfully

echo.
echo Starting CyberCando backend with auto-registration and location tracking...
cd /d "c:\Users\TGNE\Documents\candi2.0"
java -cp "driber/source/bin;driber/source/lib/*" Main

pause