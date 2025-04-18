import React from 'react';
import { FaExclamationCircle, FaLocationArrow, FaThermometerHalf } from 'react-icons/fa';
import { AlertStatus } from '../../../types/alert';
import { getParameterName, getParameterUnit } from '../../../utils/weatherParameters';
import styles from '../CurrentState.module.scss';

interface TriggeredAlertCardProps {
  alert: AlertStatus;
}

export const TriggeredAlertCard: React.FC<TriggeredAlertCardProps> = ({ alert }) => {
  return (
    <div className={styles.triggeredAlertCard}>
      <div className={styles.cardHeader}>
        <FaExclamationCircle className={styles.alertCardIcon} />
        <h3 className={styles.alertCardTitle}>{alert.name}</h3>
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.infoRow}>
          <FaLocationArrow className={styles.infoIcon} />
          <span className={styles.infoText}>
            {alert.location.name || 
              `Lat: ${alert.location.lat.toFixed(2)}, Lon: ${alert.location.lon.toFixed(2)}`}
          </span>
        </div>
        
        <div className={styles.infoRow}>
          <FaThermometerHalf className={styles.infoIcon} />
          <span className={styles.infoText}>
            {getParameterName(alert.condition.parameter)} {alert.condition.operator} {alert.condition.value}
            {getParameterUnit(alert.condition.parameter)}
          </span>
        </div>
      </div>
      
      <div className={styles.alertStatus}>
        <span className={styles.triggeredBadge}>Triggered</span>
      </div>
    </div>
  );
};

