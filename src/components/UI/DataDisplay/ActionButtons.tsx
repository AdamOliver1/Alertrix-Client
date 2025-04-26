import React, { ReactNode } from 'react';
import styles from './Table.module.scss';

interface ActionButtonsProps {
  children: ReactNode;
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`${styles.actionButtons} ${className}`}>
      {children}
    </div>
  );
};

export default ActionButtons; 