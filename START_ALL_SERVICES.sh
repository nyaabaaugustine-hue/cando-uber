#!/bin/bash

echo "Starting CyberCando 2.0 Services..."
echo ""

echo "Checking prerequisites..."
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed or not in PATH"
    exit 1
fi

echo "✅ Java is available"

echo ""
echo "Compiling Java backend..."

cd "$(dirname "$0")/driber/source"

# Create bin directory if it doesn't exist
mkdir -p bin

# Compile Java files
if javac -cp "lib/*:src/main/java" -d bin src/main/java/*.java; then
    echo "✅ Java backend compiled successfully"
else
    echo "❌ Compilation failed"
    exit 1
fi

echo ""
echo "Starting CyberCando backend with auto-registration and location tracking..."

cd ../../..

# Start the main application
java -cp "driber/source/bin:driber/source/lib/*" Main