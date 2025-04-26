import { useMemo } from 'react';
import { FaWind, FaDroplet } from 'react-icons/fa6';
import { WiHumidity } from 'react-icons/wi';
import { getWeatherIcon, getIconSrc, isDaytime } from '../../../utils/weatherIcons';
import UnitsToggle, { Units } from '../../../components/UnitsToggle';
import { WeatherData } from '../../../types/weather';
import styles from '../Home.module.scss';

interface WeatherCardProps {
  weatherData: WeatherData;
  formattedDate: string;
  units: Units;
  onUnitsToggle: (units: Units) => void;
}

const WeatherCard = ({ weatherData, formattedDate, units, onUnitsToggle }: WeatherCardProps) => {
  // Get weather icon based on current weather code
  const weatherIcon = useMemo(() => {
    return getWeatherIcon(weatherData.weatherCode, isDaytime());
  }, [weatherData.weatherCode]);

  return (
    <div className={styles.weatherCard}>
      <div className={styles.weatherCardHeader}>
        <h2 className={styles.locationName}>{weatherData.name}</h2>
        <p className={styles.dateTime}>{formattedDate}</p>
        <UnitsToggle 
          units={units}
          onToggle={onUnitsToggle}
          isAbsolute={true}
          isResponsive={true}
        />
      </div>
      
      <div className={styles.weatherCardContent}>
        <div className={styles.weatherMain}>
          <div className={styles.weatherIconContainer}>
            <img 
              src={getIconSrc(weatherIcon)} 
              alt={`Weather: ${weatherIcon.replace('_', ' ')}`} 
              className={styles.weatherIcon} 
            />
          </div>
          <div className={styles.temperatureContainer}>
            <span className={styles.temperature}>
              {Math.round(weatherData.temperature)}°
              {units === 'imperial' ? 'F' : 'C'}
            </span>
          </div>
        </div>
        
        <div className={styles.weatherDetails}>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>
              <FaWind className={styles.detailIcon} />
              <span>Wind</span>
            </div>
            <div className={styles.detailValue}>
              {Math.round(weatherData.windSpeed)} {units === 'imperial' ? 'mph' : 'km/h'}
            </div>
          </div>
          
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>
              <FaDroplet className={styles.detailIcon} />
              <span>Precipitation</span>
            </div>
            <div className={styles.detailValue}>
              {weatherData.precipitationProbability}%
            </div>
          </div>
          
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>
              <WiHumidity className={styles.detailIcon} />
              <span>Humidity</span>
            </div>
            <div className={styles.detailValue}>
              {Math.round(weatherData.humidity)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard; 