import React from 'react';
import { FaBolt, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import Button from '../../../components/UI/Button';
import Modal from '../../../components/Modal/Modal';
import styles from '../CurrentState.module.scss';

interface EvaluationConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  message?: string;
}

export const EvaluationConfirmation: React.FC<EvaluationConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  message
}) => {
  // If there's a message, evaluation has been completed
  const evaluationCompleted = !!message;
  
  // Determine if message is success or error
  const isError = message?.toLowerCase().includes('error') || 
                  message?.toLowerCase().includes('failed');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Evaluate All Alerts"
      className={styles.evaluationConfirmationModal}
    >
      <div className={styles.evaluationModal}>
        {!evaluationCompleted ? (
          <>
            <p>Are you sure you want to evaluate all alerts now?</p>
            <p>This will check all alert conditions against current weather data.</p>
            
            <div className={styles.modalActions}>
              <Button 
                variant="outline" 
                onClick={onClose}
                size="sm"
              >
                <FaTimes style={{ marginRight: '0.5rem' }} /> Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={onConfirm}
                size="sm"
                disabled={isLoading}
              >
                <FaBolt style={{ marginRight: '0.5rem' }} /> {isLoading ? 'Evaluating...' : 'Evaluate Now'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className={`${styles.evaluationResult} ${isError ? styles.error : styles.success}`}>
              {isError ? (
                <FaExclamationTriangle style={{ marginRight: '0.5rem', color: 'var(--error)' }} />
              ) : (
                <FaCheckCircle style={{ marginRight: '0.5rem', color: 'var(--success)' }} />
              )}
              <p>{message}</p>
            </div>
            
            <div className={styles.modalActions}>
              <Button 
                variant="primary" 
                onClick={onClose}
                size="sm"
              >
                <FaTimes style={{ marginRight: '0.5rem' }} /> Close
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}; 