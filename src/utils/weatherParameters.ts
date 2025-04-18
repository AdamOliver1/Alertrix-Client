import { ThresholdOperator, WeatherParameter } from "@/types/weather";
const nameMap: Record<string, string> = {
    temperature: 'Temperature',
    temperatureApparent: 'Feels Like Temperature',
    temperatureMin: 'Min Temperature',
    temperatureMax: 'Max Temperature',
    windSpeed: 'Wind Speed',
    windDirection: 'Wind Direction',
    humidity: 'Humidity',
    precipitationProbability: 'Precipitation Probability',
    precipitationType: 'Precipitation Type',
    rainIntensity: 'Rain Intensity',
    snowIntensity: 'Snow Intensity',
    cloudCover: 'Cloud Cover',
    visibility: 'Visibility',
    pressureSurfaceLevel: 'Pressure',
    uvIndex: 'UV Index',
    weatherCode: 'Weather Code',
    name: 'Name' // Add name property to fix linter error
  };

  const unitMap: Record<string, string> = {
    temperature: '°C',
    temperatureApparent: '°C',
    temperatureMin: '°C',
    temperatureMax: '°C',
    windSpeed: 'km/h',
    windDirection: '°',
    humidity: '%',
    precipitationProbability: '%',
    precipitationType: '',
    rainIntensity: 'mm/h',
    snowIntensity: 'mm/h',
    cloudCover: '%',
    visibility: 'km',
    pressureSurfaceLevel: 'hPa',
    uvIndex: '',
    weatherCode: '',
    name: '' 
  };
  
  const symbolMap: Record<ThresholdOperator, string> = {
    '>': 'Greater than',
    '<': 'Less than',
    '>=': 'Greater than or equal to',
    '<=': 'Less than or equal to',
    '=': 'Equal to',
    '!=': 'Not equal to'
  };

  const getOperatorSymbol = (operator: ThresholdOperator): string =>symbolMap[operator] || operator;
const getParameterName = (param: WeatherParameter): string => nameMap[param] || param;
const getParameterUnit = (param: WeatherParameter): string => unitMap[param] || '';

  export { getParameterName, getParameterUnit ,getOperatorSymbol};
