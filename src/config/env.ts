// Environment variables
interface EnvConfig {
  mapbox: {
    accessToken: string;
    apiUrl: string;
  };
  api: {
    url: string;
  };
  environment: {
    isDevelopment: boolean;
    isProduction: boolean;
    name: string;
  };
}

// Default values for development (in case env vars are missing)
const defaultConfig: EnvConfig = {
  mapbox: {
    accessToken: '',
    apiUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
  },
  api: {
    url: 'http://localhost:3000/api', 
  },
  environment: {
    isDevelopment: true,
    isProduction: false,
    name: 'development',
  },
};

// Determine current environment
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;
const environmentName = isProduction ? 'production' : 'development';

// Log the environment in development
if (isDevelopment) {
  console.log(`Running in ${environmentName} environment`);
  console.log(`API URL: ${import.meta.env.VITE_API_URL || defaultConfig.api.url}`);
}

// Read environment variables with proper fallbacks
export const env: EnvConfig = {
  mapbox: {
    accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || defaultConfig.mapbox.accessToken,
    apiUrl: import.meta.env.VITE_MAPBOX_API_URL || defaultConfig.mapbox.apiUrl,
  },
  api: {
    url: import.meta.env.VITE_API_URL || defaultConfig.api.url,
  },
  environment: {
    isDevelopment,
    isProduction,
    name: environmentName,
  },
}; 