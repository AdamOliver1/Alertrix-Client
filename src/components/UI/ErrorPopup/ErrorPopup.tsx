import { useErrorStore } from '../../../stores/errorStore';
import { FaTimes } from 'react-icons/fa';
import { useEscapeKey } from '../../../hooks';
import { env } from '../../../config/env';
import './ErrorPopup.scss';

const ErrorPopup = () => {
  const { error, userMessage, isVisible, hideError } = useErrorStore();

  // Use the reusable escape key hook
  useEscapeKey(hideError, isVisible);

  if (!isVisible || !userMessage) return null;

  // Check if we're in development mode using our env config
  const isDev = env.environment.isDevelopment;
  const displayMessage = userMessage;
  const displayTechnical = isDev && error !== userMessage ? error : null;

  return (
    <div className="error-popup">
      <div className="error-popup__content">
        <div className="error-popup__message">
          {displayMessage}
          
          {displayTechnical && (
            <div className="error-popup__technical">
              <small>{displayTechnical}</small>
            </div>
          )}
        </div>
        <button className="error-popup__close" onClick={hideError}>
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup; 