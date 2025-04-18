import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaSyncAlt, FaLocationArrow, FaThermometerHalf, FaBolt } from 'react-icons/fa';
import { useAlertStore } from '../../stores/alertStore';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/UI/Button';
import { AlertMap } from '../../components/Map';
import { getParameterName, getParameterUnit } from '../../utils/weatherParameters';
import { EvaluationConfirmation } from './components';
import styles from './CurrentState.module.scss';

const CurrentState: React.FC = () => {
  const { 
    alertStatuses, 
    isLoadingStatuses, 
    fetchAlertStatuses, 
    evaluateAllAlerts, 
    isEvaluating 
  } = useAlertStore();
  
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedAlertId, setSelectedAlertId] = useState<string | undefined>(undefined);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evaluationMessage, setEvaluationMessage] = useState<string | undefined>(undefined);
  
  // Filter only triggered alerts
  const triggeredAlerts = alertStatuses.filter(alert => alert.isTriggered);
  
  // Fetch alert statuses on mount
  useEffect(() => {
    // Initial fetch
    fetchAlertStatuses();
    setLastUpdated(new Date());
    
    // Set up an interval to refresh data every 20 minutes
    const intervalId = setInterval(() => {
      fetchAlertStatuses();
      setLastUpdated(new Date());
    }, 1200000);
    
    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [fetchAlertStatuses]);
  
  const handleManualRefresh = () => {
    fetchAlertStatuses();
    setLastUpdated(new Date());
  };
  
  const handleAlertClick = (alertId: string) => {
    setSelectedAlertId(alertId);
  };
  
  const handleEvaluateClick = () => {
    setShowEvaluationModal(true);
    setEvaluationMessage(undefined);
  };
  
  const handleEvaluateConfirm = async () => {
    try {
      const message = await evaluateAllAlerts();
      setEvaluationMessage(message || undefined);
      setLastUpdated(new Date());
    } catch (error) {
      setEvaluationMessage('An error occurred while evaluating alerts.');
    }
  };
  
  const handleCloseEvaluationModal = () => {
    setShowEvaluationModal(false);
    setEvaluationMessage(undefined);
  };
  
  const formatLastUpdated = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (isLoadingStatuses && alertStatuses.length === 0) {
    return <Loader text="Loading alerts..." />;
  }
  
  return (
    <div className={styles.currentStatePage}>
      <div className="container">
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Current Alerts Status</h1>
          <div className={styles.headerActions}>
            <Button 
              variant="primary"
              size="sm"
              onClick={handleEvaluateClick}
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
                onClick={handleManualRefresh}
                className={styles.refreshButton}
                disabled={isLoadingStatuses}
              >
                <FaSyncAlt style={{ marginRight: '0.5rem' }} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
        
        <div className={styles.contentContainer}>
          {isLoadingStatuses ? (
            <div className={styles.loadingContainer}>
              <Loader text="Refreshing alerts..." />
            </div>
          ) : triggeredAlerts.length > 0 ? (
            <>
              <div className={styles.alertSummary}>
                <FaExclamationTriangle className={styles.alertIcon} />
                <h2 className={styles.alertSummaryTitle}>
                  {triggeredAlerts.length} Alert{triggeredAlerts.length > 1 ? 's' : ''} Currently Triggered
                </h2>
              </div>
              
              <div className={styles.mapAndAlertsContainer}>
                <div className={styles.mapContainer}>
                  <AlertMap 
                    alerts={triggeredAlerts} 
                    onAlertClick={handleAlertClick} 
                    selectedAlertId={selectedAlertId} 
                  />
                </div>
                
                <div className={styles.triggeredAlertsGrid}>
                  <div className={styles.alertsListHeader}>
                    <h3>Triggered Alerts</h3>
                  </div>
                  <ul className={styles.alertsList}>
                    {triggeredAlerts.map(alert => (
                      <li 
                        key={alert.id} 
                        onClick={() => handleAlertClick(alert.id)}
                        className={`${styles.alertCardWrapper} ${selectedAlertId === alert.id ? styles.selectedCard : ''}`}
                      >
                        <div className={styles.alertListItem}>
                          <div className={styles.listItemHeader}>
                            <FaExclamationTriangle className={styles.alertCardIcon} />
                            <h3 className={styles.alertCardTitle}>{alert.name}</h3>
                            <div className={styles.listItemStatus}>
                              <span className={styles.triggeredBadge}>Triggered</span>
                            </div>
                          </div>
                          
                          <div className={styles.listItemContent}>
                            <div className={styles.infoRow}>
                              <FaLocationArrow className={styles.infoIcon} />
                              <span className={styles.infoText}>
                                {alert.location.name || 
                                  `${alert.location.lat.toFixed(2)}, ${alert.location.lon.toFixed(2)}`}
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
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.allClearContainer}>
              <FaCheckCircle className={styles.allClearIcon} />
              <h2 className={styles.allClearTitle}>All Clear</h2>
              <p className={styles.allClearText}>
                No alerts are currently triggered. Everything is looking good!
              </p>
            </div>
          )}
        </div>
      </div>
      
      <EvaluationConfirmation
        isOpen={showEvaluationModal}
        isLoading={isEvaluating}
        onConfirm={handleEvaluateConfirm}
        onClose={handleCloseEvaluationModal}
        message={evaluationMessage}
      />
    </div>
  );
};

export default CurrentState; 