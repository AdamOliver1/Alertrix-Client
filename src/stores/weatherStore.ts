import { create } from 'zustand';
import { WeatherData, Location } from '../types/weather';
import { weatherService } from '../services/weatherService';
import { handleApiError } from '../services/errorHandler';

interface WeatherState {
  currentWeather: WeatherData | null;
  savedLocations: Location[];
  isLoading: boolean;
  error: string | null;
  selectedUnits: 'metric' | 'imperial';
  
  // Actions
  fetchWeather: (location: Location) => Promise<void>;
  addLocation: (location: Location) => void;
  removeLocation: (locationId: string) => void;
  setUnits: (units: 'metric' | 'imperial') => void;
  clearError: () => void;
}

export const useWeatherStore = create<WeatherState>((set, get) => ({
  // Initial state
  currentWeather: null,
  savedLocations: [],
  isLoading: false,
  error: null,
  selectedUnits: 'metric',
  
  // Actions
  fetchWeather: async (location: Location) => {
    set({ isLoading: true });
    try {
      const units = get().selectedUnits;
      const weatherData = await weatherService.getCurrentWeather(location, units);
      
      if (weatherData) {
        set({ 
          currentWeather: { 
            ...weatherData,
            name: location.name || weatherData.name
          }, 
          isLoading: false 
        });
      } else {
        set({ isLoading: false, error: "Failed to fetch weather data" });
      }
    } catch (error) {
      set({ isLoading: false });
      handleApiError(error);
    }
  },
  
  addLocation: (location: Location) => {
    set(state => {
      // Check if location already exists to avoid duplicates
      const exists = state.savedLocations.some(
        loc => loc.lat === location.lat && loc.lon === location.lon
      );
      
      if (exists) return state;
      
      return {
        savedLocations: [...state.savedLocations, location]
      };
    });
  },
  
  removeLocation: (locationId: string) => {
    set(state => ({
      savedLocations: state.savedLocations.filter(location => {
        // Create a unique identifier from lat and lon since Location may not have an id
        const locationKey = `${location.lat},${location.lon}`;
        return locationKey !== locationId;
      })
    }));
  },
  
  setUnits: (units: 'metric' | 'imperial') => {
    const currentWeather = get().currentWeather;
    if (!currentWeather) {
      set({ selectedUnits: units });
      return;
    }
    
    // Create a copy of current weather
    let updatedWeather = {...currentWeather};
    
    // Convert temperature values based on the new units
    if (units === 'imperial' && get().selectedUnits === 'metric') {
      // Metric to Imperial
      updatedWeather.temperature = updatedWeather.temperature * 9/5 + 32;
      updatedWeather.windSpeed = updatedWeather.windSpeed * 0.621371; // km/h to mph
    } else if (units === 'metric' && get().selectedUnits === 'imperial') {
      // Imperial to Metric
      updatedWeather.temperature = (updatedWeather.temperature - 32) * 5/9;
      updatedWeather.windSpeed = updatedWeather.windSpeed / 0.621371; // mph to km/h
    }
    
    // Update the state with the new units and converted weather data
    set({ 
      selectedUnits: units,
      currentWeather: updatedWeather
    });
  },
  
  clearError: () => {
    set({ error: null });
  }
})) 