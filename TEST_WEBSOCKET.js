// Test WebSocket connection to the API gateway
const WebSocket = require('ws');

console.log('Connecting to WebSocket server at ws://localhost:8080...');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
    console.log('✓ Connected to WebSocket server');
    console.log('Waiting for driver location updates...');
});

ws.on('message', function message(data) {
    console.log('Received message from server:', data.toString());
    
    try {
        const parsedData = JSON.parse(data.toString());
        if (parsedData.type === 'driver_locations') {
            console.log(`✓ Received ${parsedData.data.length} driver locations:`);
            parsedData.data.forEach(driver => {
                console.log(`  - Driver ${driver.id}: ${driver.lat}, ${driver.lng}, bearing: ${driver.bearing}`);
            });
        }
    } catch (e) {
        console.log('Message is not JSON:', data.toString());
    }
});

ws.on('close', function close() {
    console.log('WebSocket connection closed');
});

ws.on('error', function error(err) {
    console.error('WebSocket error:', err);
});