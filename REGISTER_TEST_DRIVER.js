// Script to register a test driver
import axios from 'axios';

async function registerTestDriver() {
  try {
    console.log('Registering test driver...');
    const response = await axios.post('http://localhost:8088/api/drivers', {
      name: 'Test Driver',
      phone: '123-456-7890',
      email: 'test@example.com',
      vehicleType: 'Sedan',
      vehiclePlate: 'ABC123'
    });
    console.log('Driver registered successfully:', response.data);
    
    // Now try to update the driver's location
    if (response.data.id) {
      console.log(`\nUpdating location for driver ID: ${response.data.id}`);
      const locationResponse = await axios.post('http://localhost:8088/api/drivers/location', {
        id: response.data.id,
        lat: 37.7749,
        lng: -122.4194,
        bearing: 45
      });
      console.log('Location updated:', locationResponse.data);
      
      // Get the driver location
      const getLocationResponse = await axios.get('http://localhost:8088/api/drivers/location');
      console.log('Current driver locations:', getLocationResponse.data);
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

registerTestDriver();