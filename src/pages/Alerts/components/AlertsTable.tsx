import React, { useEffect } from 'react';
import { FaMapMarkerAlt, FaThermometerHalf, FaSearch } from 'react-icons/fa';
import Button from '../../../components/UI/Button';
import { AlertStatus } from '../../../types/alert';
import styles from '../Alerts.module.scss';
import { getParameterName, getParameterUnit } from '../../../utils/weatherParameters';
import Loader from '@/components/Loader/Loader';
import { 
  StatusBadge, 
  IconWithText, 
  EmailList, 
  ActionButtons, 
  NoResults 
} from '../../../components/UI/DataDisplay';

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
  }, [alerts]);

  if (loading) {
    return <Loader text="Loading alerts data..." />;
  }

  if (!alerts || alerts.length === 0) {
    return (
      <NoResults 
        icon={<FaSearch />}
        message="No matching alerts found for your search."
        className={styles.noResults}
      />
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
                <StatusBadge 
                  isActive={alert.isTriggered}
                  activeText="Triggered"
                  inactiveText="Not Triggered"
                />
              </td>
              <td>
                <EmailList
                  emails={alert.emails || []}
                />
              </td>
              <td>
                <IconWithText
                  icon={<FaMapMarkerAlt />}
                  text={alert.location && (alert.location.name || 
                    `Lat: ${alert.location.lat?.toFixed(2) || '?'}, Lon: ${alert.location.lon?.toFixed(2) || '?'}`)}
                />
              </td>
              <td>
                <IconWithText
                  icon={<FaThermometerHalf />}
                  text={alert.condition ? 
                    `${getParameterName(alert.condition.parameter)} ${alert.condition.operator} ${alert.condition.value}${getParameterUnit(alert.condition.parameter)}` : 
                    'Condition not specified'}
                />
              </td>
              <td className={styles.actionsCell}>
                <ActionButtons>
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
                </ActionButtons>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlertsTable; 