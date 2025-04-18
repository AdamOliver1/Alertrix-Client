// Import all weather icons from assets
import clearDayIcon from '../assets/icons/clear_day.svg';
import clearNightIcon from '../assets/icons/clear_night.svg';
import mostlyClearDayIcon from '../assets/icons/mostly_clear_day.svg';
import mostlyClearNightIcon from '../assets/icons/mostly_clear_night.svg';
import partlyCloudyDayIcon from '../assets/icons/partly_cloudy_day.svg';
import partlyCloudyNightIcon from '../assets/icons/partly_cloudy_night.svg';
import mostlyCloudyIcon from '../assets/icons/mostly_cloudy.svg';
import cloudyIcon from '../assets/icons/cloudy.svg';
import drizzleIcon from '../assets/icons/drizzle.svg';
import rainLightIcon from '../assets/icons/rain_light.svg';
import rainIcon from '../assets/icons/rain.svg';
import rainHeavyIcon from '../assets/icons/rain_heavy.svg';
import freezingDrizzleIcon from '../assets/icons/freezing_drizzle.svg';
import freezingRainLightIcon from '../assets/icons/freezing_rain_light.svg';
import freezingRainIcon from '../assets/icons/freezing_rain.svg';
import freezingRainHeavyIcon from '../assets/icons/freezing_rain_heavy.svg';
import flurriesIcon from '../assets/icons/flurries.svg';
import snowLightIcon from '../assets/icons/snow_light.svg';
import snowIcon from '../assets/icons/snow.svg';
import snowHeavyIcon from '../assets/icons/snow_heavy.svg';
import icePelletsLightIcon from '../assets/icons/ice_pellets_light.svg';
import icePelletsIcon from '../assets/icons/ice_pellets.svg';
import icePelletsHeavyIcon from '../assets/icons/ice_pellets_heavy.svg';
import fogLightIcon from '../assets/icons/fog_light.svg';
import fogIcon from '../assets/icons/fog.svg';
import tstormIcon from '../assets/icons/tstorm.svg';

/**
 * Maps Tomorrow.io weather codes to icon names
 * @param weatherCode - The Tomorrow.io weather code
 * @param isDay - Whether it's daytime (affects some icons)
 * @returns The icon name to use
 */
export const getWeatherIcon = (weatherCode: number, isDay: boolean = true): string => {
  // Based on Tomorrow.io weather codes
  // https://github.com/tomorrow-io-api/tomorrow-weather-codes

  // Clear
  if (weatherCode === 1000) {
    return isDay ? 'clear_day' : 'clear_night';
  }
  
  // Mostly Clear
  if (weatherCode === 1100) {
    return isDay ? 'mostly_clear_day' : 'mostly_clear_night';
  }
  
  // Partly Cloudy
  if (weatherCode === 1101) {
    return isDay ? 'partly_cloudy_day' : 'partly_cloudy_night';
  }
  
  // Mostly Cloudy
  if (weatherCode === 1102) {
    return 'mostly_cloudy';
  }
  
  // Cloudy
  if (weatherCode === 1001) {
    return 'cloudy';
  }
  
  // Fog, Light Fog
  if (weatherCode === 2000) {
    return 'fog';
  }
  
  if (weatherCode === 2100) {
    return 'fog_light';
  }
  
  // Drizzle
  if (weatherCode === 4000) {
    return 'drizzle';
  }
  
  // Rain (light, moderate, heavy)
  if (weatherCode === 4001) {
    return 'rain_light';
  }
  
  if (weatherCode === 4200) {
    return 'rain';
  }
  
  if (weatherCode === 4201) {
    return 'rain_heavy';
  }
  
  // Freezing Rain (light, moderate, heavy)
  if (weatherCode === 6000) {
    return 'freezing_drizzle';
  }
  
  if (weatherCode === 6001) {
    return 'freezing_rain_light';
  }
  
  if (weatherCode === 6200) {
    return 'freezing_rain';
  }
  
  if (weatherCode === 6201) {
    return 'freezing_rain_heavy';
  }
  
  // Snow (light, moderate, heavy)
  if (weatherCode === 5000) {
    return 'snow_light';
  }
  
  if (weatherCode === 5100) {
    return 'snow';
  }
  
  if (weatherCode === 5101) {
    return 'snow_heavy';
  }
  
  // Flurries
  if (weatherCode === 5001) {
    return 'flurries';
  }
  
  // Ice Pellets (light, moderate, heavy)
  if (weatherCode === 7000) {
    return 'ice_pellets_light';
  }
  
  if (weatherCode === 7101) {
    return 'ice_pellets';
  }
  
  if (weatherCode === 7102) {
    return 'ice_pellets_heavy';
  }
  
  // Thunderstorm
  if (weatherCode === 8000) {
    return 'tstorm';
  }
  
  // Default to clear day if code not found
  return isDay ? 'clear_day' : 'clear_night';
};

/**
 * Maps icon type strings to their corresponding SVG icon imports
 * @param iconType - The weather icon type name
 * @returns The imported SVG icon
 */
export const getIconSrc = (iconType: string): string => {
  switch (iconType) {
    case 'clear_day':
      return clearDayIcon;
    case 'clear_night':
      return clearNightIcon;
    case 'mostly_clear_day':
      return mostlyClearDayIcon;
    case 'mostly_clear_night':
      return mostlyClearNightIcon;
    case 'partly_cloudy_day':
      return partlyCloudyDayIcon;
    case 'partly_cloudy_night':
      return partlyCloudyNightIcon;
    case 'mostly_cloudy':
      return mostlyCloudyIcon;
    case 'cloudy':
      return cloudyIcon;
    case 'drizzle':
      return drizzleIcon;
    case 'rain_light':
      return rainLightIcon;
    case 'rain':
      return rainIcon;
    case 'rain_heavy':
      return rainHeavyIcon;
    case 'freezing_drizzle':
      return freezingDrizzleIcon;
    case 'freezing_rain_light':
      return freezingRainLightIcon;
    case 'freezing_rain':
      return freezingRainIcon;
    case 'freezing_rain_heavy':
      return freezingRainHeavyIcon;
    case 'flurries':
      return flurriesIcon;
    case 'snow_light':
      return snowLightIcon;
    case 'snow':
      return snowIcon;
    case 'snow_heavy':
      return snowHeavyIcon;
    case 'ice_pellets_light':
      return icePelletsLightIcon;
    case 'ice_pellets':
      return icePelletsIcon;
    case 'ice_pellets_heavy':
      return icePelletsHeavyIcon;
    case 'fog_light':
      return fogLightIcon;
    case 'fog':
      return fogIcon;
    case 'tstorm':
      return tstormIcon;
    default:
      return clearDayIcon;
  }
};

/**
 * Helper function to check if it's daytime based on current hour
 * @returns boolean indicating if it's currently daytime
 */
export const isDaytime = (): boolean => {
  const hours = new Date().getHours();
  return hours > 6 && hours < 20; // Simple day/night check (6 AM to 8 PM)
}; 