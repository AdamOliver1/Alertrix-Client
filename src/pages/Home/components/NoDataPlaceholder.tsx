import { FaExclamationTriangle } from 'react-icons/fa';
import styles from '../Home.module.scss';

const NoDataPlaceholder = () => {
  return (
    <div className={styles.weatherCard}>
      <div className={styles.noDataContainer}>
        <FaExclamationTriangle className={styles.noDataIcon} />
        <h3>Weather data unavailable</h3>
        <p>We couldn't retrieve weather information for this location.</p>
        <p>Please try searching for a different location.</p>
      </div>
    </div>
  );
};

export default NoDataPlaceholder; 