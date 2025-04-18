import React, { ReactNode } from 'react';
import styles from './Table.module.scss';

interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}

const Table: React.FC<TableProps> = ({ 
  headers, 
  children, 
  className = '',
  striped = true,
  hoverable = true,
  compact = false
}) => {
  const tableClasses = [
    styles.table,
    striped ? styles.striped : '',
    hoverable ? styles.hoverable : '',
    compact ? styles.compact : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.tableContainer}>
      <table className={tableClasses}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

const TableRow: React.FC<TableRowProps> = ({ children, className = '' }) => {
  return (
    <tr className={`${styles.tableRow} ${className}`}>
      {children}
    </tr>
  );
};

const TableCell: React.FC<TableCellProps> = ({ children, className = '', colSpan }) => {
  return (
    <td className={`${styles.tableCell} ${className}`} colSpan={colSpan}>
      {children}
    </td>
  );
};

export { Table, TableRow, TableCell }; 