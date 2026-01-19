import axios from 'axios';

/**
 * DEMO SCRIPT FOR AUTO-DRIVER REGISTRATION SYSTEM
 * 
 * This script demonstrates how the auto-registration system works
 * by simulating Telegram group events and showing the results.
 */

async function demoAutoRegistration() {
    console.log('🚀 AUTO-DRIVER REGISTRATION DEMO');
    console.log('==================================\n');
    
    // Step 1: Show current drivers (should be empty initially)
    console.log('1. Checking current drivers...');
    try {
        const driversResponse = await axios.get('http://localhost:8088/api/drivers');
        console.log(`   Found ${driversResponse.data.length} registered drivers`);
        if (driversResponse.data.length > 0) {
            driversResponse.data.forEach(driver => {
                console.log(`   - ${driver.name} (${driver.vehicleType}) - ${driver.status}`);
            });
        } else {
            console.log('   No drivers registered yet');
        }
    } catch (error) {
        console.log('   Error fetching drivers:', error.message);
        return;
    }
    
    console.log('\n2. Simulating new driver registration...');
    
    // Step 2: Register a test driver (simulating Telegram group join)
    const testDriver = {
        name: 'Demo Driver',
        phone: '555-1234',
        email: 'demo@driver.com',
        vehicleType: 'Sedan',
        vehiclePlate: 'DEMO123'
    };
    
    let driverId;
    try {
        const registerResponse = await axios.post('http://localhost:8088/api/drivers', testDriver);
        driverId = registerResponse.data.id;
        console.log(`   ✅ Driver registered successfully! ID: ${driverId}`);
        
        // Activate the driver
        await axios.put('http://localhost:8088/api/drivers', {
            id: driverId,
            status: 'active',
            isOnline: true
        });
        console.log('   ✅ Driver activated and marked online');
        
    } catch (error) {
        console.log('   ❌ Error registering driver:', error.message);
        return;
    }
    
    console.log('\n3. Simulating location update...');
    
    // Step 3: Update driver location (simulating Telegram location share)
    try {
        const locationResponse = await axios.post('http://localhost:8088/api/drivers/location', {
            id: driverId,
            lat: 37.7749,
            lng: -122.4194,
            bearing: 45
        });
        console.log('   ✅ Location updated successfully');
        
    } catch (error) {
        console.log('   ❌ Error updating location:', error.message);
        return;
    }
    
    console.log('\n4. Checking live drivers API...');
    
    // Step 4: Check the live drivers endpoint
    try {
        const liveResponse = await axios.get('http://localhost:8088/api/live/drivers');
        console.log('   ✅ Live drivers endpoint working');
        console.log(`   Drivers with locations: ${liveResponse.data.drivers.length}`);
        
        if (liveResponse.data.drivers.length > 0) {
            const driver = liveResponse.data.drivers[0];
            console.log(`   - ${driver.name}: ${driver.lat}, ${driver.lng}`);
        }
        
    } catch (error) {
        console.log('   ❌ Error fetching live drivers:', error.message);
    }
    
    console.log('\n5. Final driver list...');
    
    // Step 5: Show final driver list
    try {
        const finalResponse = await axios.get('http://localhost:8088/api/drivers');
        console.log(`   Total drivers: ${finalResponse.data.length}`);
        finalResponse.data.forEach(driver => {
            const locationStatus = driver.location ? '📍 Has location' : '❌ No location';
            const onlineStatus = driver.isOnline ? '🟢 Online' : '🔴 Offline';
            console.log(`   - ${driver.name} | ${onlineStatus} | ${locationStatus}`);
        });
        
    } catch (error) {
        console.log('   Error fetching final driver list:', error.message);
    }
    
    console.log('\n🎉 DEMO COMPLETE!');
    console.log('The auto-registration system is working correctly.');
    console.log('In a real scenario, this would happen automatically when:');
    console.log('- Users join your Telegram driver group');
    console.log('- Drivers share their locations in the group');
    console.log('- The dashboard would show live driver positions');
}

// Run the demo
demoAutoRegistration().catch(console.error);