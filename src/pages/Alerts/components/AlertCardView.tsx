import React from 'react';
import { FaLocationArrow, FaEdit, FaTrash, FaThermometerHalf, FaSearch } from 'react-icons/fa';
import Button from '../../../components/UI/Button';
import Card from '../../../components/UI/Card/Card';
import { AlertStatus } from '../../../types/alert';
import styles from '../Alerts.module.scss';
import { getParameterName, getParameterUnit } from '@/utils/weatherParameters';

interface AlertCardViewProps {
  alerts: AlertStatus[];
  onEdit: (alertId: string) => void;
  onDelete: (alertId: string) => void;
}

const AlertCardView: React.FC<AlertCardViewProps> = ({
  alerts,
  onEdit,
  onDelete,
}) => {
  if (alerts.length === 0) {
    return (
      <div className={styles.noResults}>
        <FaSearch className={styles.noResultsIcon} />
        <p>No matching alerts found for your search.</p>
      </div>
    );
  }

  return (
    <div className={styles.alertsList}>
      {alerts.map((alert) => (
        <Card 
          key={alert.id}
          className={styles.alertCard}
          glowEffect={alert.isTriggered ? "teal" : "none"}
          hoverable
        >
          <div className={styles.alertCardHeader}>
            <h3 className={styles.alertName}>{alert.name || 'Unnamed Alert'}</h3>
            <div className={styles.headerActions}>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => onEdit(alert.id)}
                className={styles.editButton}
                aria-label="Edit alert"
              >
                <FaEdit style={{marginRight: '0.5rem'}} /> Edit
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => onDelete(alert.id)}
                className={`${styles.editButton} ${styles.deleteButton}`}
                aria-label="Delete alert"
              >
                <FaTrash style={{marginRight: '0.5rem'}} /> Delete
              </Button>
              {alert.isTriggered && <div className={styles.triggered}>
              Triggered
               </div>}
            </div>
          </div>
          
          <div className={styles.alertContent}>
            <div className={styles.locationInfo}>
              <FaLocationArrow className={styles.locationIcon} />
              <span>
                {alert.location && (alert.location.name || 
                  `Lat: ${alert.location.lat?.toFixed(2) || '?'}, Lon: ${alert.location.lon?.toFixed(2) || '?'}`)}
              </span>
            </div>
            
            <div className={styles.conditionInfo}>
              <FaThermometerHalf className={styles.locationIcon} />
              <span className={styles.conditionLabel}>Condition:</span>
              <span className={styles.conditionValue}>
                {alert.condition ? 
                  `${getParameterName(alert.condition.parameter)} ${alert.condition.operator} ${alert.condition.value}${getParameterUnit(alert.condition.parameter)}` : 
                  'Condition not specified'}
              </span>
            </div>
            
            <div className={styles.emailsInfo}>
              <span className={styles.emailsLabel}>Email Recipients:</span>
              <div className={styles.emailsList}>
                {alert.emails && alert.emails.length > 0 ? (
                  alert.emails.map((email, index) => (
                    <span key={index} className={styles.emailItem}>{email}</span>
                  ))
                ) : (
                  <span className={styles.emailItem}>No email recipients</span>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AlertCardView; 