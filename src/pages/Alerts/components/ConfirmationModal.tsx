import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import Popup, { PopupFooter } from '../../../components/Popup';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel
}) => {
  return (
    <Popup
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      icon={<FaExclamationTriangle color="#ea4335" size={48} />}
      footer={
        <PopupFooter
          onCancel={onCancel}
          onConfirm={onConfirm}
          cancelText={cancelButtonText}
          confirmText={confirmButtonText}
        />
      }
    >
      <p style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{message}</p>
    </Popup>
  );
};

export default ConfirmationModal; 