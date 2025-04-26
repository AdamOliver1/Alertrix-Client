import React, { ReactElement } from 'react';
import styles from './Table.module.scss';

interface IconWithTextProps {
  icon: ReactElement;
  text: string | ReactElement;
  className?: string;
}

const IconWithText: React.FC<IconWithTextProps> = ({
  icon,
  text,
  className = ''
}) => {
  return (
    <div className={`${styles.iconWithText} ${className}`}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default IconWithText; 