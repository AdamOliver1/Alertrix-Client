import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { env } from '../../config/env';
import { AlertStatus } from '../../types/alert';
import styles from './AlertMap.module.scss';

// Set Mapbox access token
mapboxgl.accessToken = env.mapbox.accessToken;

interface AlertMapProps {
  alerts: AlertStatus[];
  onAlertClick?: (alertId: string) => void;
  selectedAlertId?: string;
}

const AlertMap: React.FC<AlertMapProps> = ({ alerts, onAlertClick, selectedAlertId }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map on component mount
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    if (!env.mapbox.accessToken) {
      console.error('Mapbox access token is missing. Please check your environment configuration.');
      return;
    }

    // Create new map instance
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 20],
      zoom: 1.5
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Set map as loaded when it's ready
    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers for each alert location
  useEffect(() => {
    if (!map.current || !mapLoaded || alerts.length === 0) return;

    // Clear existing markers
    const markers = map.current.getContainer().querySelectorAll(`.${styles.marker}`);
    markers.forEach(marker => marker.remove());
    
    // Create bounds to fit all markers
    const bounds = new mapboxgl.LngLatBounds();
    
    // Add markers for each alert
    alerts.forEach(alert => {
      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = `${styles.marker} ${alert.id === selectedAlertId ? styles.selected : ''}`;
      
      // Create marker and add to map
      new mapboxgl.Marker(markerEl)
        .setLngLat([alert.location.lon, alert.location.lat])
        .addTo(map.current!);
      
      // Add click event to marker
      markerEl.addEventListener('click', () => {
        if (onAlertClick) {
          onAlertClick(alert.id);
        }
      });
      
      // Extend bounds to include this marker
      bounds.extend([alert.location.lon, alert.location.lat]);
    });
    
    // If we have markers, fit the map to show all of them
    if (!bounds.isEmpty()) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12
      });
    }
  }, [alerts, mapLoaded, selectedAlertId, onAlertClick]);

  // Focus on selected alert when it changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedAlertId) return;
    
    const selectedAlert = alerts.find(alert => alert.id === selectedAlertId);
    
    if (selectedAlert) {
      // Fly to the selected alert location with animation
      map.current.flyTo({
        center: [selectedAlert.location.lon, selectedAlert.location.lat],
        zoom: 10,
        duration: 1500,
        essential: true
      });
    }
  }, [selectedAlertId, alerts, mapLoaded]);

  if (!env.mapbox.accessToken) {
    return (
      <div className={styles.mapError}>
        <p>Mapbox access token is missing. Please check your environment configuration.</p>
      </div>
    );
  }

  return (
    <div className={styles.mapContainer} ref={mapContainer} />
  );
};

export default AlertMap; 