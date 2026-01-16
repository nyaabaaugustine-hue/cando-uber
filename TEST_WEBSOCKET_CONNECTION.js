// Test WebSocket connection for driver location tracking
const WebSocket = require('ws');

console.log('Testing WebSocket Connection for Driver Location Tracking...\n');

function testWebSocketConnection() {
  // Connect to the WebSocket server
  const ws = new WebSocket('ws://localhost:8080');

  ws.on('open', () => {
    console.log('✅ WebSocket connection established\n');
  });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log('✅ Received WebSocket message:');
      console.log('   Type:', message.type);
      if (message.data) {
        console.log('   Data length:', Array.isArray(message.data) ? message.data.length : 'N/A');
        if (Array.isArray(message.data) && message.data.length > 0) {
          console.log('   Sample driver:', message.data[0]);
        }
      }
      console.log('');
    } catch (error) {
      console.log('Received raw message:', data.toString());
    }
  });

  ws.on('close', () => {
    console.log('❌ WebSocket connection closed');
  });

  ws.on('error', (error) => {
    console.log('❌ WebSocket error:', error.message);
    console.log('Make sure the API Gateway is running on port 8080\n');
  });

  // Close the connection after 10 seconds
  setTimeout(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
      console.log('Test completed. WebSocket connection working properly.\n');
      console.log('Next steps:');
      console.log('- Start the Java backend on port 8088');
      console.log('- Start the API Gateway on port 8080');
      console.log('- Send driver location updates to the API');
      console.log('- Watch for real-time updates via WebSocket');
    }
  }, 10000);
}

// Run the test
testWebSocketConnection();