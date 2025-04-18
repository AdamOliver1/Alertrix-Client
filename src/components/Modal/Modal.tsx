import React from 'react';
import Dialog from '../UI/Dialog';
import { FaTimes } from 'react-icons/fa';
import styles from './Modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  className
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      overlayClassName={styles.modalOverlay}
      contentClassName={`${styles.modal} ${className || ''}`}
    >
      <div className={styles.modalHeader}>
        {title && <h2 className={styles.modalTitle}>{title}</h2>}
        {showCloseButton && (
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        )}
      </div>
      <div className={styles.modalContent}>
        {children}
      </div>
    </Dialog>
  );
};

export default Modal; 