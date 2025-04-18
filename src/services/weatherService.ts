import { api } from './api';
import { WeatherData, Location } from '../types/weather';
import { handleApiError } from './errorHandler';

const WEATHER_ENDPOINT = '/weather';

export const weatherService = {
  /**
   * Get current weather for a location
   */
  async getCurrentWeather(
    location: Location | string,
    units: 'metric' | 'imperial' = 'metric'
  ): Promise<WeatherData | null> {
    try {
      let params: Record<string, string | number> = { units };
      
      if (typeof location === 'string') {
        // City name
        params.city = location;
      } else {
        // Coordinates
        params.lat = location.lat;
        params.lon = location.lon;
      }
      
      const response = await api.get<WeatherData>(WEATHER_ENDPOINT, { params });
      return response.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  }
}; 