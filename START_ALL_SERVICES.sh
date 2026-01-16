#!/bin/bash

echo "Starting CyberCando Real-Time Driver Location Tracking System..."
echo ""

echo "Setting up environment..."
export JAVA_BACKEND_URL="http://localhost:8088"

echo "Starting Java Backend (Port 8088)..."
cd ./driber/source && ./gradlew run &

sleep 5

echo "Starting Node.js API Gateway (Port 8080)..."
cd ../dashboard/api && npm install && node server.js &

sleep 5

echo "Starting React Frontend (Port 5173)..."
cd ../web && npm install && npm run dev &

echo ""
echo "All services started!"
echo "- Java Backend: http://localhost:8088/dashboard"
echo "- API Gateway: http://localhost:8080"
echo "- Frontend: http://localhost:5173"
echo ""
echo "To view the map: Open your browser to http://localhost:5173/map"