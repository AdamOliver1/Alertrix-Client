import React from 'react';
import { FaExclamationTriangle, FaLocationArrow, FaThermometerHalf } from 'react-icons/fa';
import { AlertStatus } from '../../../types/alert';
import { getParameterName, getParameterUnit } from '../../../utils/weatherParameters';
import styles from '../CurrentState.module.scss';
import { StatusBadge, IconWithText } from '../../../components/UI/DataDisplay';

interface AlertsListProps {
  alerts: AlertStatus[];
  selectedAlertId?: string;
  onAlertClick: (alertId: string) => void;
}

export const AlertsList: React.FC<AlertsListProps> = ({
  alerts,
  selectedAlertId,
  onAlertClick
}) => {
  return (
    <div className={styles.triggeredAlertsGrid}>
      <div className={styles.alertsListHeader}>
        <h3>Triggered Alerts</h3>
      </div>
      <ul className={styles.alertsList}>
        {alerts.map(alert => (
          <li 
            key={alert.id} 
            onClick={() => onAlertClick(alert.id)}
            className={`${styles.alertCardWrapper} ${selectedAlertId === alert.id ? styles.selectedCard : ''}`}
          >
            <div className={styles.alertListItem}>
              <div className={styles.listItemHeader}>
                <FaExclamationTriangle className={styles.alertCardIcon} />
                <h3 className={styles.alertCardTitle}>{alert.name}</h3>
                <div className={styles.listItemStatus}>
                  <StatusBadge 
                    isActive={true}
                    activeText="Triggered"
                    inactiveText="Not Triggered"
                    className={styles.triggeredBadge}
                  />
                </div>
              </div>
              
              <div className={styles.listItemContent}>
                <div className={styles.infoRow}>
                  <IconWithText
                    icon={<FaLocationArrow className={styles.infoIcon} />}
                    text={
                      <span className={styles.infoText}>
                        {alert.location.name || 
                          `${alert.location.lat.toFixed(2)}, ${alert.location.lon.toFixed(2)}`}
                      </span>
                    }
                  />
                </div>
                
                <div className={styles.infoRow}>
                  <IconWithText
                    icon={<FaThermometerHalf className={styles.infoIcon} />}
                    text={
                      <span className={styles.infoText}>
                        {getParameterName(alert.condition.parameter)} {alert.condition.operator} {alert.condition.value}
                        {getParameterUnit(alert.condition.parameter)}
                      </span>
                    }
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}; 