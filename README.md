# CyberCando Driver Location Tracking System

Real-time driver location tracking system for the CyberCando transport platform.

## Overview

This system enables real-time tracking of driver locations with the following components:

- **Java Backend**: Handles driver registration and location updates (port 8088)
- **Node.js API Gateway**: Provides WebSocket connectivity and API endpoints (port 8080) 
- **React Frontend**: Visualizes driver locations on a map

## Features

- Real-time location tracking via WebSocket
- Driver location updates every 5 seconds
- Interactive map visualization
- Driver status monitoring

## Quick Start

1. **Install Dependencies**:
   ```bash
   npm run install-deps
   ```

2. **Start All Services**:
   ```bash
   npm run start-all
   ```
   Or run each service separately:
   - Java Backend: `npm run start-java`
   - API Gateway: `npm run start-api`
   - Frontend: `npm run start-web`

3. **View the Dashboard**:
   - Open browser to: http://localhost:5173
   - Navigate to Map View: http://localhost:5173/map

## Testing

Run the location tracking test:
```bash
npm run test-location
```

## Architecture

```
Driver Apps → Java Backend (8088) → API Gateway (8080) → React Frontend (5173)
                                    ↓
                                WebSocket Updates
```

## API Endpoints

- `GET /api/drivers/location` (Java Backend) - Get all active driver locations
- `POST /api/drivers/location` (Java Backend) - Update driver location
- `GET /api/drivers/locations` (API Gateway) - Proxy to Java backend
- `POST /api/drivers/:id/location` (API Gateway) - Proxy to Java backend

## WebSocket Messages

Format:
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

## Files Structure

- `driber/` - Java backend with driver registry and location tracking
- `dashboard/api/` - Node.js API gateway with WebSocket support
- `dashboard/web/` - React frontend with map visualization
- `DRIVER_LOCATION_TRACKING.md` - Detailed architecture documentation