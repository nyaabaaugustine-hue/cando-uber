// Test script to send driver location updates to the system
const axios = require('axios');

async function testDriverUpdates() {
    console.log('Testing driver location updates...');
    
    // Test data for driver locations
    const drivers = [
        { id: 'driver-1', lat: 37.7749, lng: -122.4194, bearing: 45 },
        { id: 'driver-2', lat: 37.7849, lng: -122.4094, bearing: 90 },
        { id: 'driver-3', lat: 37.7649, lng: -122.4294, bearing: 180 },
        { id: 'driver-4', lat: 37.7949, lng: -122.4394, bearing: 270 },
        { id: 'driver-5', lat: 37.7549, lng: -122.4494, bearing: 0 }
    ];
    
    console.log('Sending driver location updates to Java backend (port 8088)...');
    
    for (const driver of drivers) {
        try {
            const response = await axios.post('http://localhost:8088/api/drivers/location', driver, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(`✓ Driver ${driver.id} location updated:`, response.data);
        } catch (error) {
            console.error(`✗ Failed to update driver ${driver.id}:`, error.message);
        }
    }
    
    console.log('\nWaiting 2 seconds for propagation...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\nFetching current driver locations from API gateway (port 8081)...');
    try {
        // First try to login to get a valid token
        const loginResponse = await axios.post('http://localhost:8081/auth/login', {
            email: 'admin@local.test',
            password: 'Admin123!'
        });
        
        if (loginResponse.data.ok) {
            console.log('✓ Successfully logged in');
            const token = loginResponse.data.user; // token is stored in cookies automatically
            
            // Now fetch driver locations
            const locationsResponse = await axios.get('http://localhost:8081/api/drivers/locations', {
                headers: {
                    'Authorization': `Bearer dummy` // Using dummy since cookies handle auth
                }
            });
            
            console.log('✓ Current driver locations:', locationsResponse.data);
        }
    } catch (error) {
        console.error('✗ Error during login or fetching locations:', error.message);
    }
    
    console.log('\nTest completed. Check the dashboard at http://localhost:5173/ to see the driver locations.');
}

// Run the test
testDriverUpdates();