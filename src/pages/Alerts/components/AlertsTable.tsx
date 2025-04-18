import React, { useEffect } from 'react';
import { FaMapMarkerAlt, FaThermometerHalf, FaSearch } from 'react-icons/fa';
import Button from '../../../components/UI/Button';
import { AlertStatus } from '../../../types/alert';
import styles from '../Alerts.module.scss';
import { getParameterName, getParameterUnit } from '../../../utils/weatherParameters';
import Loader from '@/components/Loader/Loader';

interface AlertsTableProps {
  alerts: AlertStatus[];
  onEdit: (alertId: string) => void;
  onDelete: (alertId: string) => void;
  loading?: boolean;
}

const AlertsTable: React.FC<AlertsTableProps> = ({
  alerts,
  onEdit,
  onDelete,
  loading = false
}) => {
  useEffect(() => {
    console.log('Alerts loaded:', alerts);
  }, [alerts]);

  if (loading) {
    return <Loader text="Loading alerts data..." />;
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className={styles.noResults}>
        <FaSearch className={styles.noResultsIcon} />
        <p>No matching alerts found for your search.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.alertsTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Email</th>
            <th>Location</th>
            <th>Condition</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id}>
              <td className={styles.nameCell}>{alert.name || 'Unnamed Alert'}</td>
              <td>
                <span className={alert.isTriggered ? styles.triggered : ''}>
                  {alert.isTriggered ? 'Triggered' : 'Not Triggered'}
                </span>
              </td>
              <td>
                <div className={styles.emailsList}>
                  {alert.emails && alert.emails.length > 0 ? (
                    alert.emails.map((email, index) => (
                      <span key={index} className={styles.emailItem}>{email}</span>
                    ))
                  ) : (
                    <span className={styles.emailItem}>No email recipients</span>
                  )}
                </div>
              </td>
              <td>
                <div className={styles.cellWithIcon}>
                  <FaMapMarkerAlt className={styles.cellIcon} />
                  <span>
                    {alert.location && (alert.location.name || 
                      `Lat: ${alert.location.lat?.toFixed(2) || '?'}, Lon: ${alert.location.lon?.toFixed(2) || '?'}`)}
                  </span>
                </div>
              </td>
              <td>
                <div className={styles.cellWithIcon}>
                  <FaThermometerHalf className={styles.cellIcon} />
                  <span>
                    {alert.condition ? 
                      `${getParameterName(alert.condition.parameter)} ${alert.condition.operator} ${alert.condition.value}${getParameterUnit(alert.condition.parameter)}` : 
                      'Condition not specified'}
                  </span>
                </div>
              </td>
              <td className={styles.actionsCell}>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(alert.id)}
                  aria-label="Edit alert"
                  className={styles.actionButton}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(alert.id)}
                  aria-label="Delete alert"
                  className={styles.deleteButton}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlertsTable; 