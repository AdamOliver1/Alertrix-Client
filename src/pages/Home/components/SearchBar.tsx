import LocationSearch from '../../../components/LocationSearch/LocationSearch';
import { Location } from '../../../types/weather';
import styles from '../Home.module.scss';

interface SearchBarProps {
  onLocationSelect: (location: Location) => void;
}

const SearchBar = ({ onLocationSelect }: SearchBarProps) => {
  return (
    <div className={styles.searchBar}>
      <LocationSearch onLocationSelect={onLocationSelect} />
    </div>
  );
};

export default SearchBar; 