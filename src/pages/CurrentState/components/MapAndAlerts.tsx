import React from 'react';
import { AlertMap } from '../../../components/Map';
import { AlertStatus } from '../../../types/alert';
import { AlertsList } from './AlertsList';
import styles from '../CurrentState.module.scss';

interface MapAndAlertsProps {
  alerts: AlertStatus[];
  selectedAlertId?: string;
  onAlertClick: (alertId: string) => void;
}

export const MapAndAlerts: React.FC<MapAndAlertsProps> = ({
  alerts,
  selectedAlertId,
  onAlertClick
}) => {
  return (
    <div className={styles.mapAndAlertsContainer}>
      <div className={styles.mapContainer}>
        <AlertMap
          alerts={alerts}
          onAlertClick={onAlertClick}
          selectedAlertId={selectedAlertId}
        />
      </div>
      
      <AlertsList
        alerts={alerts}
        selectedAlertId={selectedAlertId}
        onAlertClick={onAlertClick}
      />
    </div>
  );
}; 