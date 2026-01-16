import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "react-bootstrap";
import DriverMap from "../components/DriverMap";

export default function MapView() {
  const [driverLocations, setDriverLocations] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  
  useEffect(() => {
    // Connect to WebSocket for real-time driver location updates
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//localhost:8080`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('Connected to WebSocket for driver locations');
      setWsConnected(true);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'driver_locations') {
        setDriverLocations(data.data);
      }
    };
    
    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setWsConnected(false);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        // Trigger re-render to attempt reconnection
        window.location.reload();
      }, 5000);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsConnected(false);
    };
    
    // Poll API gateway for driver locations every 5 seconds as backup
    const pollApiGateway = async () => {
      try {
        const response = await fetch('/api/drivers/locations');
        
        if (response.ok) {
          const data = await response.json();
          setDriverLocations(data.drivers);
        }
      } catch (error) {
        console.error('Error fetching driver locations:', error);
      }
    };
    
    const intervalId = setInterval(pollApiGateway, 5000);
    
    // Cleanup on unmount
    return () => {
      ws.close();
      clearInterval(intervalId);
    };
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Map View</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="d-flex justify-content-between mb-4">
          <h3 className="text-lg font-semibold">Driver Locations</h3>
          <div className={`d-flex align-items-center ${wsConnected ? 'text-success' : 'text-danger'}`}>
            <div className={`rounded-circle me-2 ${wsConnected ? 'bg-success' : 'bg-danger'}`} style={{ width: '12px', height: '12px' }}></div>
            <span>{wsConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <DriverMap driverLocations={driverLocations} />
        </div>
        
        <div className="mb-3" style={{ maxHeight: '240px', overflowY: 'auto' }}>
          {driverLocations.length > 0 ? (
            driverLocations.map((driver) => (
              <div key={driver.id} className="d-flex align-items-center p-3 border rounded-2 mb-2">
                <div className="rounded-circle bg-primary me-3" style={{ width: '12px', height: '12px' }}></div>
                <div className="flex-grow-1">
                  <div className="fw-medium">{driver.id}</div>
                  <div className="text-sm text-muted">
                    Lat: {driver.lat.toFixed(6)}, Lng: {driver.lng.toFixed(6)}
                  </div>
                  <div className="text-xs text-muted">
                    Bearing: {driver.bearing}° | Updated: {new Date(driver.lastUpdated).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted text-center p-4">
              No active drivers tracked yet. Waiting for location updates...
            </p>
          )}
        </div>
        
        <div className="mt-4 text-sm text-muted">
          <p className="mb-2">Real-time driver tracking:</p>
          <ul className="ps-4">
            <li>Drivers' locations update every 5 seconds</li>
            <li>Blue dots indicate active drivers in the system</li>
            <li>Click on markers in the map for detailed information</li>
          </ul>
        </div>
      </CardBody>
    </Card>
  );
}