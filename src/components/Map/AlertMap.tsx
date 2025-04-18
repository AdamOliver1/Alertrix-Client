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
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize map on component mount
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    if (!env.mapbox.accessToken) {
      setMapError('Mapbox access token is missing. Please check your environment configuration.');
      return;
    }

    try {
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

      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError('An error occurred while loading the map. Please try refreshing the page.');
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map. Please try refreshing the page.');
    }

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
    if (!map.current || !mapLoaded || alerts.length === 0 || mapError) return;

    try {
      // Clear existing markers
      const markers = map.current.getContainer().querySelectorAll(`.${styles.marker}`);
      markers.forEach(marker => marker.remove());
      
      // Create bounds to fit all markers
      const bounds = new mapboxgl.LngLatBounds();
      
      // Add markers for each alert
      alerts.forEach(alert => {
        try {
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
        } catch (markerError) {
          console.error('Error creating marker:', markerError);
          // Continue with other markers even if one fails
        }
      });
      
      // If we have markers, fit the map to show all of them
      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 12
        });
      }
    } catch (error) {
      console.error('Error adding markers to map:', error);
      setMapError('An error occurred while displaying alert locations on the map.');
    }
  }, [alerts, mapLoaded, selectedAlertId, onAlertClick]);

  // Focus on selected alert when it changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedAlertId || mapError) return;
    
    try {
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
    } catch (error) {
      console.error('Error focusing on selected alert:', error);
      // Don't set error state here to avoid blocking the whole map
    }
  }, [selectedAlertId, alerts, mapLoaded]);

  if (mapError) {
    return (
      <div className={styles.mapError}>
        <p>{mapError}</p>
      </div>
    );
  }

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