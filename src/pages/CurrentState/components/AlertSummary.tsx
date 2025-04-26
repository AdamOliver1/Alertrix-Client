import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import styles from '../CurrentState.module.scss';

interface AlertSummaryProps {
  alertCount: number;
}

export const AlertSummary: React.FC<AlertSummaryProps> = ({ alertCount }) => {
  return (
    <div className={styles.alertSummary}>
      <FaExclamationTriangle className={styles.alertIcon} />
      <h2 className={styles.alertSummaryTitle}>
        {alertCount} Alert{alertCount > 1 ? 's' : ''} Currently Triggered
      </h2>
    </div>
  );
}; 