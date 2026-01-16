// Test script for driver location tracking functionality
const axios = require('axios');

console.log('Testing CyberCando Driver Location Tracking System...\n');

async function testDriverLocationTracking() {
  try {
    // Test 1: Check if Java backend is running
    console.log('1. Testing Java Backend Connection...');
    try {
      const javaResponse = await axios.get('http://localhost:8088/api/drivers/location');
      console.log('✅ Java Backend is accessible');
      console.log(`   Response: ${javaResponse.data.length} drivers found\n`);
    } catch (error) {
      console.log('❌ Java Backend not accessible. Make sure it\'s running on port 8088\n');
    }

    // Test 2: Check if API Gateway is running
    console.log('2. Testing API Gateway Connection...');
    try {
      const apiResponse = await axios.get('http://localhost:8080/api/drivers/locations');
      console.log('✅ API Gateway is accessible');
      console.log(`   Response: ${apiResponse.data.drivers?.length || 0} drivers found\n`);
    } catch (error) {
      console.log('❌ API Gateway not accessible. Make sure it\'s running on port 8080\n');
    }

    // Test 3: Send a sample driver location update
    console.log('3. Testing Driver Location Update...');
    try {
      const driverData = {
        id: 999,
        lat: 37.7749,
        lng: -122.4194,
        bearing: 45
      };
      
      const updateResponse = await axios.post('http://localhost:8080/api/drivers/999/location', driverData);
      console.log('✅ Driver location update successful');
      console.log('   Sent:', driverData, '\n');
    } catch (error) {
      console.log('❌ Driver location update failed:', error.message, '\n');
    }

    // Test 4: Verify the update was received
    console.log('4. Verifying Driver Location Update...');
    try {
      const verifyResponse = await axios.get('http://localhost:8080/api/drivers/locations');
      const updatedDriver = verifyResponse.data.drivers?.find(d => d.id == 999);
      
      if (updatedDriver) {
        console.log('✅ Driver location update verified');
        console.log('   Updated driver:', updatedDriver, '\n');
      } else {
        console.log('⚠️  Driver location update not found in response\n');
      }
    } catch (error) {
      console.log('❌ Failed to verify driver location update:', error.message, '\n');
    }

    console.log('Test completed!');
    console.log('\nTo view the map in real-time:');
    console.log('- Open your browser to http://localhost:5173/map');
    console.log('- The WebSocket connection should show as "Connected"');
    console.log('- Active drivers will appear on the map');

  } catch (error) {
    console.error('Test suite failed:', error.message);
  }
}

// Run the test
testDriverLocationTracking();