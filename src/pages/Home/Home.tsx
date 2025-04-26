import { useState, useEffect, useMemo } from 'react';
import { getUserLocation, getDefaultLocation } from '../../utils/location';
import Loader from '../../components/Loader/Loader';
import { useWeatherStore } from '../../stores/weatherStore';
import { useErrorStore } from '../../stores/errorStore';
import ErrorPopup from '../../components/UI/ErrorPopup/ErrorPopup';
import { Location } from '../../types/weather';
import { WeatherCard, NoDataPlaceholder, SearchBar } from './components';
import { Units } from '../../components/UnitsToggle';
import styles from './Home.module.scss';

const Home = () => {
  const { fetchWeather, currentWeather, isLoading, selectedUnits } = useWeatherStore();
  const { showError } = useErrorStore();
  const [units, setUnits] = useState<Units>(selectedUnits);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  
  // Get user's location on component mount
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const userLocation = await getUserLocation();
        if (userLocation) {
          await fetchWeather(userLocation);
        } else {
          await fetchWeather(getDefaultLocation());
        }
      } catch (error) {
        showError('Failed to get location', 'Could not determine your location. Showing default weather data.');
        await fetchWeather(getDefaultLocation());
      } finally {
        setHasAttemptedLoad(true);
      }
    };
    
    initializeLocation();
  }, [fetchWeather, showError]);

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
    setHasAttemptedLoad(false);
    fetchWeather(location).finally(() => {
      setHasAttemptedLoad(true);
    });
  };

  // Function to toggle temperature units
  const handleUnitsToggle = (newUnits: Units) => {
    useWeatherStore.getState().setUnits(newUnits);
  };
  
  // Render content based on loading and data state
  const renderContent = () => {
    if (isLoading || !hasAttemptedLoad) {
      return <Loader />;
    }
    
    if (!currentWeather) {
      return <NoDataPlaceholder />;
    }
    
    return (
      <WeatherCard 
        weatherData={currentWeather}
        formattedDate={formattedDate}
        units={units}
        onUnitsToggle={handleUnitsToggle}
      />
    );
  };

  return (
    <div className={styles.homePage}>
      <ErrorPopup />
      <div className="container">
        <SearchBar onLocationSelect={handleLocationSelect} />
        {renderContent()}
      </div>
    </div>
  );
};

export default Home; 