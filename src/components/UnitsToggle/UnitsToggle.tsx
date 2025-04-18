import React from 'react';
import { FaExchangeAlt } from 'react-icons/fa';
import Button from '../UI/Button';
import styles from './UnitsToggle.module.scss';

export type Units = 'imperial' | 'metric';

interface UnitsToggleProps {
  units: Units;
  onToggle: (units: Units) => void;
  className?: string;
  isAbsolute?: boolean;
  isResponsive?: boolean;
}

const UnitsToggle: React.FC<UnitsToggleProps> = ({
  units,
  onToggle,
  className = '',
  isAbsolute = false,
  isResponsive = false
}) => {
  const handleToggle = () => {
    const newUnits = units === 'imperial' ? 'metric' : 'imperial';
    onToggle(newUnits);
  };

  const buttonClasses = `${styles.unitsToggle} ${isAbsolute ? styles.absolute : ''} ${isResponsive ? styles.responsive : ''} ${className}`.trim();

  return (
    <Button 
      variant="outline"
      size="sm"
      onClick={handleToggle}
      aria-label={`Switch to ${units === 'imperial' ? 'Celsius' : 'Fahrenheit'}`}
      className={buttonClasses}
    >
      <span>{units === 'imperial' ? '°F' : '°C'}</span>
      <FaExchangeAlt style={{ 
        margin: '0 8px', 
        fontSize: '0.8em',
        transition: 'transform 0.3s ease, color 0.3s ease'
      }} />
      <span>{units === 'imperial' ? '°C' : '°F'}</span>
    </Button>
  );
};

export default UnitsToggle; 