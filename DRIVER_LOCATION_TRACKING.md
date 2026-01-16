# Real-Time Driver Location Tracking System

This document describes the real-time driver location tracking system implemented in the CyberCando platform.

## Architecture Overview

The system consists of three main components:

1. **Java Backend (Driver Service)** - Handles driver registration and location updates
2. **Node.js API Gateway** - Provides WebSocket connectivity and API endpoints
3. **React Frontend** - Visualizes driver locations on a map

## Components

### 1. Java Backend (Dashboard Server)

The Java backend runs on port 8088 by default and provides:
- `/api/drivers` - Manage driver registration and profiles
- `/api/drivers/location` - Receive real-time location updates from drivers
- Driver registry with location tracking capabilities

### 2. Node.js API Gateway

The API gateway runs on port 8080 by default and provides:
- WebSocket endpoint for real-time location updates to frontend
- `/api/drivers/locations` - Fetch current driver locations
- `/api/drivers/:id/location` - Update driver location
- Connection proxy to Java backend

### 3. React Frontend

The dashboard frontend displays:
- Real-time map visualization of driver locations
- List of active drivers with location details
- Connection status indicator

## How It Works

1. Drivers send location updates to the Java backend via HTTP POST requests
2. The Java backend stores the location data in the Driver Registry
3. The Node.js API gateway polls the Java backend for updates
4. When locations change, the API gateway broadcasts updates via WebSocket
5. The frontend receives WebSocket messages and updates the map in real-time

## Running the System

### Prerequisites
- Java 8+ 
- Node.js 18+

### Starting the Services

1. **Start the Java backend (driver service):**
   ```bash
   cd driber/source
   ./gradlew run
   ```
   Or if running directly:
   ```bash
   java -jar build/libs/driver-service.jar
   ```

2. **Start the Node.js API gateway:**
   ```bash
   cd dashboard/api
   npm install
   npm start
   ```

3. **Start the React frontend:**
   ```bash
   cd dashboard/web
   npm install
   npm run dev
   ```

### Testing with Mock Driver App

A mock driver application is provided to simulate driver location updates:

```bash
# Install axios dependency
npm install axios

# Run the mock driver app
node mock_driver_app.js
```

## API Endpoints

### Java Backend (Port 8088)
- `GET /api/drivers/location` - Get all active driver locations
- `POST /api/drivers/location` - Update driver location

### Node.js API Gateway (Port 8080)
- `GET /api/drivers/locations` - Get driver locations (proxies to Java backend)
- `POST /api/drivers/:id/location` - Update driver location
- WebSocket connection for real-time updates

## WebSocket Messages

The system uses WebSocket messages with the following format:
```json
{
  "type": "driver_locations",
  "data": [
    {
      "id": "driver-1",
      "lat": 37.7749,
      "lng": -122.4194,
      "bearing": 90,
      "lastUpdated": "2023-10-27T10:00:00.000Z"
    }
  ]
}
```

## Data Model

Driver location data includes:
- `id`: Unique driver identifier
- `lat`: Latitude coordinate
- `lng`: Longitude coordinate
- `bearing`: Direction in degrees (0-359)
- `lastUpdated`: Timestamp of last location update

## Troubleshooting

1. **Connection Issues:** Ensure both services are running and ports are accessible
2. **No Driver Updates:** Check that the Java backend is receiving location updates
3. **Frontend Not Updating:** Verify WebSocket connection is established (check browser console)

## Security

- API endpoints require authentication
- Driver location data is only accessible to authorized users
- Communication uses secure protocols in production