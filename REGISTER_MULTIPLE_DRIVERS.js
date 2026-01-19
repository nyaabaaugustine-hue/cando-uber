/**
 * Register Multiple Drivers for Testing
 * 
 * This script simulates the registration of multiple drivers
 * to test the automated registration system
 */

const axios = require('axios');

// Sample driver data for testing
const testDrivers = [
    {
        telegramId: 1001,
        name: 'John Taxi Driver',
        phone: '+1234567890',
        vehicleType: 'Taxi',
        vehiclePlate: 'TAXI-001'
    },
    {
        telegramId: 1002,
        name: 'Sarah Moto Rider',
        phone: '+1234567891',
        vehicleType: 'Motorcycle',
        vehiclePlate: 'MOTO-002'
    },
    {
        telegramId: 1003,
        name: 'Mike Tuk Tuk',
        phone: '+1234567892',
        vehicleType: 'Tuk Tuk',
        vehiclePlate: 'TUK-003'
    },
    {
        telegramId: 1004,
        name: 'Amy Delivery Pro',
        phone: '+1234567893',
        vehicleType: 'Delivery Van',
        vehiclePlate: 'DELV-004'
    },
    {
        telegramId: 1005,
        name: 'David Uber Expert',
        phone: '+1234567894',
        vehicleType: 'Premium Sedan',
        vehiclePlate: 'PREM-005'
    }
];

async function registerDrivers() {
    console.log('🚀 Starting Multi-Driver Registration Process...\n');
    
    const baseUrl = 'http://localhost:8088';
    
    for (let i = 0; i < testDrivers.length; i++) {
        const driver = testDrivers[i];
        console.log(`📋 Registering Driver ${i + 1}/${testDrivers.length}:`);
        console.log(`   Name: ${driver.name}`);
        console.log(`   Vehicle: ${driver.vehicleType} (${driver.vehiclePlate})`);
        
        try {
            const response = await axios.post(`${baseUrl}/api/driver/register`, driver, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(`   ✅ Success: ${response.data.message || 'Driver registered'}`);
        } catch (error) {
            console.log(`   ❌ Error registering ${driver.name}:`, error.response?.data?.message || error.message);
        }
        
        // Small delay between registrations
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('');
    }
    
    console.log('🏁 Multi-Driver Registration Process Completed!');
    
    // Verify registrations
    try {
        console.log('\n🔍 Verifying driver registrations...');
        const driversResponse = await axios.get(`${baseUrl}/api/drivers`);
        console.log(`📋 Total registered drivers: ${driversResponse.data.drivers?.length || 0}`);
        
        const liveResponse = await axios.get(`${baseUrl}/api/live/drivers`);
        console.log(`📍 Drivers with live locations: ${liveResponse.data.drivers?.length || 0}`);
    } catch (error) {
        console.log('⚠️ Could not verify registrations:', error.message);
        console.log('💡 This is expected if the dashboard server is not running');
    }
}

async function simulateAutoRegistrationFlow() {
    console.log('\n🤖 Simulating Auto-Registration Flow...');
    console.log('This represents what happens when drivers join the Telegram group:');
    console.log('');
    
    const events = [
        { type: 'driver_joined', driver: 'Alex NewDriver', action: 'Auto-registered as driver' },
        { type: 'location_shared', driver: 'Alex NewDriver', action: 'Shared location: 5.5560°N, 0.1969°W' },
        { type: 'driver_joined', driver: 'Maria Experienced', action: 'Auto-registered as driver' },
        { type: 'location_shared', driver: 'Maria Experienced', action: 'Shared location: 5.5570°N, 0.1975°W' },
        { type: 'driver_left', driver: 'Old Driver', action: 'Marked as inactive (left group)' }
    ];
    
    for (const event of events) {
        console.log(`• ${event.action} - Driver: ${event.driver}`);
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate real-time events
    }
    
    console.log('\n✅ Auto-registration simulation completed');
}

async function displaySystemCapabilities() {
    console.log('\n🌟 CYBERCANDO DRIVER MANAGEMENT CAPABILITIES');
    console.log('================================================');
    console.log('');
    console.log('AUTOMATED FEATURES:');
    console.log('• Auto-registration when joining Telegram group');
    console.log('• Auto-location tracking via Telegram sharing');
    console.log('• Auto-status management (active/inactive)');
    console.log('• Auto-cleanup of inactive drivers');
    console.log('');
    console.log('MANUAL FEATURES:');
    console.log('• Bulk driver registration (this script)');
    console.log('• Individual driver registration via API');
    console.log('• Dashboard management interface');
    console.log('• Security audit trail');
    console.log('');
    console.log('INTEGRATION POINTS:');
    console.log('• Telegram Bot API');
    console.log('• Real-time Dashboard');
    console.log('• Driver Registry System');
    console.log('• Activity Logging System');
    console.log('');
    console.log('SECURITY FEATURES:');
    console.log('• Comprehensive audit logging');
    console.log('• User attribution for all actions');
    console.log('• Privacy-conscious data handling');
    console.log('• Secure API endpoints');
    console.log('');
}

async function runFullSimulation() {
    await displaySystemCapabilities();
    await registerDrivers();
    await simulateAutoRegistrationFlow();
    
    console.log('\n🎉 CyberCando Driver Registration Simulation Complete!');
    console.log('\nTo start the actual system:');
    console.log('1. Ensure TELEGRAM_BOT_TOKEN is set in .env');
    console.log('2. Compile Java code: javac -cp "driber/source/lib/*" driber/source/src/main/java/*.java');
    console.log('3. Start system: java -cp "driber/source/bin:driber/source/lib/*" Main');
    console.log('4. Visit dashboard at: http://localhost:8088/dashboard');
    console.log('\nThe system will automatically handle driver registrations and location tracking!');
}

// Run the simulation
runFullSimulation().catch(console.error);