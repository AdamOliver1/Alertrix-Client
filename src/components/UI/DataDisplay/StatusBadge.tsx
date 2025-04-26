import React from 'react';
import styles from './DataDisplay.module.scss';

interface StatusBadgeProps {
  isActive: boolean;
  activeText: string;
  inactiveText: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  isActive,
  activeText,
  inactiveText,
  className = ''
}) => {
  return (
    <span className={`${styles.statusBadge} ${isActive ? styles.active : styles.inactive} ${className}`}>
      {isActive ? activeText : inactiveText}
    </span>
  );
};

export default StatusBadge; 