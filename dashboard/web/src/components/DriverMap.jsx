import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function DriverMap({ driverLocations }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef(new Map()); // To keep track of existing markers

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if it hasn't been created yet
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([37.7749, -122.4194], 13); // Center on San Francisco
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);
    }

    // Update markers based on driver locations
    updateMarkers();

    return () => {
      // Cleanup map instance on unmount
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Update markers when driver locations change
    updateMarkers();
  }, [driverLocations]);

  const updateMarkers = () => {
    if (!mapInstance.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstance.current.removeLayer(marker);
    });
    markersRef.current.clear();

    // Add new markers for each driver
    driverLocations.forEach(driver => {
      const marker = L.marker([driver.lat, driver.lng]).addTo(mapInstance.current);
      
      // Add popup with driver information
      marker.bindPopup(`
        <b>${driver.id}</b><br>
        Lat: ${driver.lat.toFixed(6)}<br>
        Lng: ${driver.lng.toFixed(6)}<br>
        Bearing: ${driver.bearing}°<br>
        Last updated: ${new Date(driver.lastUpdated).toLocaleTimeString()}
      `);
      
      // Add tooltip with driver ID
      marker.bindTooltip(driver.id, { permanent: false, opacity: 0.8 });
      
      markersRef.current.set(driver.id, marker);
    });
  };

  return <div ref={mapRef} style={{ height: '500px', width: '100%', borderRadius: '8px' }} />;
}