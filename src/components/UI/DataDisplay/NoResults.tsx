import React, { ReactElement } from 'react';
import styles from './DataDisplay.module.scss';

interface NoResultsProps {
  icon: ReactElement;
  message: string;
  className?: string;
}

const NoResults: React.FC<NoResultsProps> = ({
  icon,
  message,
  className = ''
}) => {
  return (
    <div className={`${styles.noResults} ${className}`}>
      <span className={styles.noResultsIcon}>{icon}</span>
      <p>{message}</p>
    </div>
  );
};

export default NoResults; 