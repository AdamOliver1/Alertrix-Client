import { create } from 'zustand';
import { WeatherData, Location } from '../types/weather';
import { weatherService } from '../services/weatherService';
import { handleApiError } from '../services/errorHandler';
import { useErrorStore } from './errorStore';

interface WeatherState {
  currentWeather: WeatherData | null;
  isLoading: boolean;
  selectedUnits: 'metric' | 'imperial';
  lastFetchedLocation: string | null; // Used for request deduplication
  
  // Actions
  fetchWeather: (location: Location) => Promise<void>;
  setUnits: (units: 'metric' | 'imperial') => void;
}

export const useWeatherStore = create<WeatherState>((set, get) => ({
  // Initial state
  currentWeather: null,
  isLoading: false,
  selectedUnits: 'metric',
  lastFetchedLocation: null,
  
  // Actions
  fetchWeather: async (location: Location) => {
    // Check if we're already fetching this exact location to prevent duplicate calls
    const locationKey = `${location.lat},${location.lon}`;
    if (get().isLoading && get().lastFetchedLocation === locationKey) {
      return; // Avoid duplicate concurrent requests
    }
    
    set({ isLoading: true, lastFetchedLocation: locationKey });
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
        // Use global error handling instead of local error state
        useErrorStore.getState().showError(
          "Failed to fetch weather data", 
          "Unable to retrieve weather information. Please try again later."
        );
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
      // Use the existing handleApiError for consistent error handling
      handleApiError(error);
    }
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
  }
})) 