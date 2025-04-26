import React from 'react';
import { FaBolt, FaSyncAlt } from 'react-icons/fa';
import Button from '../../../components/UI/Button';
import styles from '../CurrentState.module.scss';

interface PageHeaderProps {
  lastUpdated: Date;
  onRefresh: () => void;
  onEvaluate: () => void;
  isEvaluating: boolean;
  isLoading: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  lastUpdated,
  onRefresh,
  onEvaluate,
  isEvaluating,
  isLoading
}) => {
  const formatLastUpdated = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.pageHeader}>
      <h1 className={styles.pageTitle}>Current Alerts Status</h1>
      <div className={styles.headerActions}>
        <Button 
          variant="primary"
          size="sm"
          onClick={onEvaluate}
          className={styles.evaluateButton}
          disabled={isEvaluating}
        >
          <FaBolt style={{ marginRight: '0.5rem' }} />
          Evaluate All Alerts
        </Button>
        <div className={styles.refreshContainer}>
          <span className={styles.lastUpdated}>
            Last updated: {formatLastUpdated(lastUpdated)}
          </span>
          <Button 
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className={styles.refreshButton}
            disabled={isLoading}
          >
            <FaSyncAlt style={{ marginRight: '0.5rem' }} />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}; 