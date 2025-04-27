import React, { useEffect, useState } from 'react';
import { useAlertStore } from '../../stores/alertStore';
import Loader from '../../components/Loader/Loader';
import { 
  PageHeader, 
  AlertSummary, 
  MapAndAlerts, 
  AllClearDisplay, 
  EvaluationConfirmation 
} from './components';
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
      const result = await evaluateAllAlerts();
      
      if (result) {
        // Provide more informative messages based on whether alerts were triggered
        const message = result.alertsTriggered
          ? "Evaluation complete: Alerts have been triggered!"
          : "Evaluation complete: No new alerts were triggered.";
        
        setEvaluationMessage(message);
      } else {
        setEvaluationMessage("Evaluation completed.");
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      setEvaluationMessage('An error occurred while evaluating alerts.');
    }
  };
  
  const handleCloseEvaluationModal = () => {
    setShowEvaluationModal(false);
    setEvaluationMessage(undefined);
  };
  
  // Render content based on loading and data state
  const renderContent = () => {
    if (isLoadingStatuses && alertStatuses.length === 0) {
      return <Loader text="Loading alerts..." />;
    }
    
    return (
      <div className="container">
        <PageHeader
          lastUpdated={lastUpdated}
          onRefresh={handleManualRefresh}
          onEvaluate={handleEvaluateClick}
          isEvaluating={isEvaluating}
          isLoading={isLoadingStatuses}
        />
        
        <div className={styles.contentContainer}>
          {isLoadingStatuses ? (
            <div className={styles.loadingContainer}>
              <Loader text="Refreshing alerts..." />
            </div>
          ) : triggeredAlerts.length > 0 ? (
            <>
              <AlertSummary alertCount={triggeredAlerts.length} />
              <MapAndAlerts
                alerts={triggeredAlerts}
                selectedAlertId={selectedAlertId}
                onAlertClick={handleAlertClick}
              />
            </>
          ) : (
            <AllClearDisplay />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.currentStatePage}>
      {renderContent()}
      
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