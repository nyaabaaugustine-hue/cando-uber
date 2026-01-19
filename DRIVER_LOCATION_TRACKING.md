# CyberCando Driver Location Tracking System

## Overview
The CyberCando Driver Location Tracking System enables real-time tracking of driver locations through an automated registration and location sharing mechanism via Telegram groups.

## Key Features

### 1. Automated Driver Registration
- **Automatic Registration**: When a new member joins the designated Telegram driver group, they are automatically registered as a driver
- **Information Capture**: Automatically captures driver's name, Telegram ID, and other relevant information
- **Welcome Message**: Sends a welcome message to the new driver with instructions

### 2. Real-time Location Tracking
- **Location Sharing**: Drivers can share their current location in the Telegram group
- **Automatic Updates**: Locations are automatically updated on the dashboard every 5 seconds
- **GPS Coordinates**: Captures precise latitude and longitude coordinates
- **Direction Tracking**: Includes bearing/direction information when available

### 3. Dashboard Integration
- **Live Map Display**: Shows all active drivers with their current locations on an interactive map
- **Real-time Updates**: API endpoint `/api/live/drivers` provides live driver locations
- **Driver Information**: Displays driver name, vehicle type, and plate number
- **Status Monitoring**: Shows driver availability status

### 4. Automatic Driver Management
- **Auto Unregistration**: When drivers leave the Telegram group, they are automatically marked as inactive
- **Inactivity Cleanup**: Drivers who haven't updated their location in 30 minutes are marked as offline
- **Status Transitions**: Automatically manages driver status (active/inactive/online/offline)

### 5. Security & Audit Trail
- **Activity Logging**: All driver activities are logged with timestamps
- **Security Auditing**: Maintains audit trails for all system interactions
- **User Attribution**: Links all actions to specific Telegram users

## Technical Implementation

### API Endpoints
- `GET /api/live/drivers` - Returns all active drivers with current locations
- `POST /api/driver/register` - Manual driver registration endpoint
- `GET /api/drivers` - Returns all registered drivers
- `GET /api/events` - Returns activity logs

### Data Model
Each tracked driver includes:
- Driver ID (Telegram user ID)
- Name
- Current GPS coordinates (lat/lng)
- Vehicle type and plate number
- Status (active/inactive)
- Last update timestamp
- Bearing/direction

### Architecture
- **Telegram Bot Integration**: Listens to group events and location sharing
- **Java Backend**: Processes registration and location updates
- **HTTP Server**: Provides REST API for dashboard consumption
- **WebSocket (Optional)**: For real-time updates to dashboard

## Setup Instructions

### 1. Environment Configuration
```bash
# Required environment variables
TELEGRAM_BOT_TOKEN=your_bot_token
RUN_DASHBOARD=true
DASHBOARD_PORT=8088
```

### 2. Telegram Group Setup
1. Create a Telegram group for drivers
2. Add your bot to the group with admin rights
3. Optionally set the group ID as DISPATCH_CHAT_ID

### 3. Starting the System
```bash
# Compile the Java backend
javac -cp "driber/source/lib/*" driber/source/src/main/java/*.java

# Start the system
java -cp "driber/source/bin:driber/source/lib/*" Main
```

## Usage Workflow

### For Drivers
1. Join the designated Telegram driver group
2. Receive automatic registration confirmation
3. Share location in the group to appear on the dashboard
4. Leave the group when going off-duty

### For Dispatchers
1. Monitor the dashboard at `http://localhost:8088/dashboard`
2. View all active drivers in real-time
3. Track driver availability and locations
4. Manage ride assignments based on location data

## Benefits

- **Zero Manual Setup**: Drivers automatically register by joining the group
- **Real-time Tracking**: Live location updates without additional apps
- **Low Barrier to Entry**: Uses familiar Telegram interface
- **Automatic Management**: Handles registration/unregistration automatically
- **Security Focused**: Comprehensive audit logging
- **Scalable**: Handles multiple drivers simultaneously

## Troubleshooting

### Common Issues
- Ensure bot has proper permissions in the Telegram group
- Verify TELEGRAM_BOT_TOKEN is correctly configured
- Check that the dashboard port is not in use
- Confirm Java version compatibility (requires Java 8+)

### API Testing
Use the test script to verify functionality:
```bash
node TEST_DRIVER_LOCATION_TRACKING.js
```

## Security Considerations

- All driver data is logged for audit purposes
- Location sharing is opt-in via group participation
- Driver privacy is maintained through secure logging
- Access to location data is restricted to authorized personnel