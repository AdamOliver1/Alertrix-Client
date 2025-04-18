import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import { useEscapeKey, useBodyScrollLock } from '../../../hooks';
import styles from './Dialog.module.scss';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
  preventEscapeKey?: boolean;
  preventBodyScroll?: boolean;
  renderInPortal?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  showCloseButton = true,
  preventEscapeKey = false,
  preventBodyScroll = true,
  renderInPortal = true
}) => {
  // Handle escape key
  useEscapeKey(onClose, isOpen && !preventEscapeKey);
  
  // Handle body scroll
  useBodyScrollLock(isOpen && preventBodyScroll);
  
  if (!isOpen) return null;
  
  const dialogContent = (
    <div 
      className={`${styles.overlay} ${overlayClassName}`} 
      onClick={onClose}
    >
      <div 
        className={`${styles.content} ${contentClassName} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        )}
        {children}
      </div>
    </div>
  );
  
  return renderInPortal 
    ? createPortal(dialogContent, document.body)
    : dialogContent;
};

export default Dialog; 