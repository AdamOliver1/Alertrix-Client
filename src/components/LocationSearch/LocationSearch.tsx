import React, { useState, useEffect, useRef } from 'react';
import { env } from '../../config/env';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import Button from '../UI/Button';
import { mapboxService } from '../../services/mapboxService';
import { Location } from '../../types/weather';
import { useClickOutside } from '../../hooks';
import styles from './LocationSearch.module.scss';

interface LocationSearchProps {
  onLocationSelect?: (location: Location) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect }) => {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // Check if Mapbox API configuration is available
  useEffect(() => {
    if (!env.mapbox.accessToken) {
      setError('Mapbox Access Token is not defined. Please check your environment configuration.');
    } else {
      setError(null);
    }
  }, []);
  
  // Use our click outside hook to hide suggestions
  useClickOutside(searchContainerRef as React.RefObject<HTMLElement>, () => {
    setShowSuggestions(false);
  }, showSuggestions);
  
  // Simple debounce of search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchValue]);
  
  // Fetch search results when debouncedValue changes
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedValue.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      
      try {
        const features = await mapboxService.searchLocations(debouncedValue);
        setSuggestions(features);
        setShowSuggestions(features.length > 0);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
        setError('Failed to fetch location suggestions. Please try again.');
        setTimeout(() => setError(null), 3000);
      }
    };
    
    fetchResults();
  }, [debouncedValue]);
  
  // Handle input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  
  // Select a location from suggestions
  const handleSuggestionSelect = (feature: any) => {
    // Convert feature to location using the service
    const location = mapboxService.featureToLocation(feature);
    
    // Call the onLocationSelect callback with the selected location
    if (onLocationSelect) {
      onLocationSelect(location);
    }
    
    // Reset search UI
    setSearchValue('');
    setShowSuggestions(false);
  };
  
  // Handle form submission when user presses enter
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSuggestionSelect(suggestions[0]);
    }
  };

  return (
    <div className={styles.searchSection} ref={searchContainerRef}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.searchInputWrapper}>
          <input
            type="text"
            placeholder="Search for a location..."
            value={searchValue}
            onChange={handleSearchChange}
            onClick={(e) => {
              e.stopPropagation();
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className={styles.searchInput}
            aria-label="Location search"
            aria-expanded={showSuggestions}
            aria-autocomplete="list"
          />
          <Button 
            type="submit" 
            className={styles.searchButton}
            variant="primary"
            aria-label="Search location"
            size="sm"
          >
            <FaSearch />
          </Button>
          
          {/* Location suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className={styles.locationSuggestions} role="listbox">
              {suggestions.map((feature) => (
                <div
                  key={feature.id}
                  className={styles.suggestionItem}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSuggestionSelect(feature);
                  }}
                  role="option"
                >
                  <FaMapMarkerAlt className={styles.locationIcon} />
                  <span>{feature.place_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
      
      {error && (
        <div className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default LocationSearch; 