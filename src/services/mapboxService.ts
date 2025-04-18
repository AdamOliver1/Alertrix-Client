import { env } from '../config/env';
import { Location } from '../types/weather';

interface MapboxFeature {
  id: string;
  place_name: string;
  geometry: {
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: Record<string, any>;
}

interface GeocodingResponse {
  features: MapboxFeature[];
  type: string;
}

export const mapboxService = {
  /**
   * Search for locations by query string
   * @param query Search query (e.g. city name)
   * @param types Optional types to filter (e.g. 'place', 'locality', 'neighborhood')
   * @returns Promise with location suggestions
   */
  async searchLocations(
    query: string,
    types: string[] = ['place', 'locality', 'neighborhood']
  ): Promise<MapboxFeature[]> {
    if (!env.mapbox.accessToken) {
      throw new Error('Mapbox Access Token is not defined');
    }

    if (query.length < 3) {
      return [];
    }

    try {
      const endpoint = `${env.mapbox.apiUrl}/${encodeURIComponent(query)}.json?access_token=${
        env.mapbox.accessToken
      }&types=${types.join(',')}`;

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Mapbox API error:', response.status, errorText);
        throw new Error(`Mapbox API error: ${response.status}`);
      }
      
      const data = await response.json() as GeocodingResponse;
      return data.features || [];
    } catch (error) {
      console.error('Error searching locations:', error);
      // Return empty array instead of throwing to prevent breaking UI
      return [];
    }
  },

  /**
   * Get location info from coordinates
   * @param longitude Longitude coordinate
   * @param latitude Latitude coordinate
   * @param types Optional types to filter
   * @returns Promise with location data
   */
  async reverseGeocode(
    longitude: number,
    latitude: number,
    types: string[] = ['place']
  ): Promise<Location | null> {
    if (!env.mapbox.accessToken) {
      throw new Error('Mapbox Access Token is not defined');
    }

    try {
      const endpoint = `${env.mapbox.apiUrl}/${longitude},${latitude}.json?access_token=${
        env.mapbox.accessToken
      }&types=${types.join(',')}`;

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Mapbox API error:', response.status, errorText);
        throw new Error(`Mapbox API error: ${response.status}`);
      }
      
      const data = await response.json() as GeocodingResponse;

      if (data.features && data.features.length > 0) {
        return {
          name: data.features[0].place_name,
          lat: latitude,
          lon: longitude
        };
      }
      
      // Return basic location if no features found
      return {
        name: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
        lat: latitude,
        lon: longitude
      };
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      // Return basic location info instead of throwing
      return {
        name: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
        lat: latitude,
        lon: longitude
      };
    }
  },

  /**
   * Convert a Mapbox feature to a location object
   * @param feature Mapbox feature
   * @returns Location object
   */
  featureToLocation(feature: MapboxFeature): Location {
    try {
      const [lon, lat] = feature.geometry.coordinates;
      return {
        name: feature.place_name,
        lat,
        lon
      };
    } catch (error) {
      console.error('Error converting feature to location:', error);
      // Return default location to prevent UI breaks
      return {
        name: 'Unknown location',
        lat: 0,
        lon: 0
      };
    }
  }
}; 