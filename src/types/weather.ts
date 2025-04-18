export interface WeatherData {
  temperature: number;
  temperatureApparent: number;
  temperatureMin?: number;
  temperatureMax?: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  precipitationProbability: number;
  precipitationType: number | null;
  rainIntensity: number;
  snowIntensity: number;
  cloudCover: number;
  visibility: number;
  pressureSurfaceLevel: number;
  uvIndex: number;
  weatherCode: number;
  location: Location;
  units: 'metric' | 'imperial';
  name?: string;
  
}

export interface Location {
  lat: number;
  lon: number;
  name?: string;
}

export type WeatherParameter = keyof Omit<WeatherData, 'location' | 'units'>;

export type ThresholdOperator = '>' | '<' | '>=' | '<=' | '=' | '!=';

export interface ThresholdCondition {
  parameter: WeatherParameter;
  operator: ThresholdOperator;
  value: number;
} 