import React, { ReactNode } from 'react';
import styles from './Card.module.scss';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  glowEffect?: 'blue' | 'purple' | 'teal' | 'none';
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  className = '', 
  glowEffect = 'none',
  hoverable = true
}) => {
  const cardClasses = [
    styles.card,
    hoverable ? styles.hoverable : '',
    glowEffect !== 'none' ? styles[`glow-${glowEffect}`] : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      {title && <h3 className={styles.cardTitle}>{title}</h3>}
      <div className={styles.cardContent}>
        {children}
      </div>
    </div>
  );
};

export default Card; 