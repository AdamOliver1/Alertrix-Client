import React from 'react';
import styles from './DataDisplay.module.scss';

interface EmailListProps {
  emails: string[];
  emptyMessage?: string;
  className?: string;
}

const EmailList: React.FC<EmailListProps> = ({
  emails,
  emptyMessage = 'No email recipients',
  className = ''
}) => {
  return (
    <div className={`${styles.emailList} ${className}`}>
      {emails && emails.length > 0 ? (
        emails.map((email, index) => (
          <span key={index} className={styles.emailItem}>{email}</span>
        ))
      ) : (
        <span className={styles.emailItem}>{emptyMessage}</span>
      )}
    </div>
  );
};

export default EmailList; 