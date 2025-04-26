import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import styles from '../CurrentState.module.scss';

export const AllClearDisplay: React.FC = () => {
  return (
    <div className={styles.allClearContainer}>
      <FaCheckCircle className={styles.allClearIcon} />
      <h2 className={styles.allClearTitle}>All Clear</h2>
      <p className={styles.allClearText}>
        No alerts are currently triggered.
      </p>
    </div>
  );
}; 