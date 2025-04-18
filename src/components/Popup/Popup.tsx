import React, { ReactNode } from 'react';
import Dialog from '../UI/Dialog';
import Button from '../UI/Button';
import styles from './Popup.module.scss';

export interface PopupProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
  maxWidth?: number;
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  title,
  onClose,
  children,
  footer,
  icon,
  maxWidth = 500
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={true}
      overlayClassName={styles.overlay}
      contentClassName={styles.content}
    >
      <div className={styles.header}>
        <h3>{title}</h3>
      </div>
      
      <div className={styles.body}>
        {icon && <div className={styles.iconContainer}>{icon}</div>}
        {children}
      </div>
      
      {footer && <div className={styles.footer}>{footer}</div>}
    </Dialog>
  );
};

export const PopupFooter: React.FC<{
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  isLoading?: boolean;
  children?: ReactNode;
}> = ({
  onCancel,
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  isLoading = false,
  children
}) => {
  if (children) {
    return <>{children}</>;
  }

  return (
    <>
      {onCancel && (
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
      )}
      {onConfirm && (
        <Button 
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : confirmText}
        </Button>
      )}
    </>
  );
};

export default Popup; 