import { useState, useEffect, useMemo } from 'react';
import { FaWind, FaDroplet } from 'react-icons/fa6';
import { WiHumidity } from 'react-icons/wi';
import { getWeatherIcon, getIconSrc, isDaytime } from '../../utils/weatherIcons';
import { getUserLocation, getDefaultLocation } from '../../utils/location';
import Loader from '../../components/Loader/Loader';
import UnitsToggle, { Units } from '../../components/UnitsToggle';
import LocationSearch from '../../components/LocationSearch/LocationSearch';
import { useWeatherStore } from '../../stores/weatherStore';
import { Location } from '../../types/weather';
import styles from './Home.module.scss';

const Home = () => {
  const { fetchWeather, currentWeather, isLoading, selectedUnits } = useWeatherStore();
  const [units, setUnits] = useState<Units>(selectedUnits);
  
  // Get user's location on component mount
  useEffect(() => {
    const initializeLocation = async () => {
      const userLocation = await getUserLocation();
      if (userLocation) {
        fetchWeather(userLocation);
      } else {
        fetchWeather(getDefaultLocation());
      }
    };
    
    initializeLocation();
  }, [fetchWeather]);

  // Keep local units state in sync with store
  useEffect(() => {
    setUnits(selectedUnits);
  }, [selectedUnits]);

  
  // Format the current date
  const formattedDate = useMemo(() => {
    return new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  }, []);

  // Handle location selection from the search component
  const handleLocationSelect = (location: Location) => {
    fetchWeather(location);
  };

  // Function to toggle temperature units
  const handleUnitsToggle = (newUnits: Units) => {
    useWeatherStore.getState().setUnits(newUnits);
  };
  
  // Get weather icon based on current weather code
  const weatherIcon = useMemo(() => {
    if (!currentWeather) return isDaytime() ? 'clear_day' : 'clear_night';
    return getWeatherIcon(currentWeather.weatherCode, isDaytime());
  }, [currentWeather]);

  // Function to render the appropriate weather icon
  const renderWeatherIcon = () => {
    return (
      <img 
        src={getIconSrc(weatherIcon)} 
        alt={`Weather: ${weatherIcon.replace('_', ' ')}`} 
        className={styles.weatherIcon} 
      />
    );
  };

  return (
    <div className={styles.homePage}>
      <div className="container">
        <div className={styles.searchBar}>
          <LocationSearch 
            onLocationSelect={handleLocationSelect}
          />
        </div>

        {isLoading || !currentWeather ? (
          <Loader />
        ) : (
          <div className={styles.weatherCard}>
            <div className={styles.weatherCardHeader}>
              <h2 className={styles.locationName}>{currentWeather?.name}</h2>
              <p className={styles.dateTime}>{formattedDate}</p>
              <UnitsToggle 
                units={units}
                onToggle={handleUnitsToggle}
                isAbsolute={true}
                isResponsive={true}
              />
            </div>
            
            <div className={styles.weatherCardContent}>
              <div className={styles.weatherMain}>
                <div className={styles.weatherIconContainer}>
                  {renderWeatherIcon()}
                </div>
                <div className={styles.temperatureContainer}>
                  <span className={styles.temperature}>
                    {Math.round(currentWeather.temperature)}°
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
                    {Math.round(currentWeather.windSpeed)} {units === 'imperial' ? 'mph' : 'km/h'}
                  </div>
                </div>
                
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    <FaDroplet className={styles.detailIcon} />
                    <span>Precipitation</span>
                  </div>
                  <div className={styles.detailValue}>
                    {currentWeather.precipitationProbability}%
                  </div>
                </div>
                
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    <WiHumidity className={styles.detailIcon} />
                    <span>Humidity</span>
                  </div>
                  <div className={styles.detailValue}>
                    {Math.round(currentWeather.humidity)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 