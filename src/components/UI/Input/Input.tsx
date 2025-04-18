import React, { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  helperText?: string;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  fullWidth = false,
  variant = 'default',
  helperText,
  containerClassName = '',
  className = '',
  ...props
}) => {
  const containerClasses = [
    styles.container,
    fullWidth ? styles.fullWidth : '',
    styles[variant],
    error ? styles.error : '',
    containerClassName
  ].filter(Boolean).join(' ');

  const inputClasses = [
    styles.input,
    icon ? styles.withIcon : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input className={inputClasses} {...props} />
      </div>
      {(error || helperText) && (
        <div className={error ? styles.errorText : styles.helperText}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};

export default Input; 