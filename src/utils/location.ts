import { Location } from '../types/weather';
import { mapboxService } from '../services/mapboxService';

export const getUserLocation = async (): Promise<Location | null> => {
  if (!navigator.geolocation) {
    return null;
  }

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;
    const location = await mapboxService.reverseGeocode(longitude, latitude);
    return location;
  } catch (error) {
    console.error('Error getting user location:', error);
    return null;
  }
};

export const getDefaultLocation = (): Location => ({
  lat: 32.0853,
  lon: 34.7818,
  name: 'Tel Aviv, Israel'
}); 