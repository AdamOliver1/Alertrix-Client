import { useEffect, useState } from 'react';
import { FaLocationArrow, FaPlus, FaTrash, FaRedo } from 'react-icons/fa';
import Button from '../../../components/UI/Button';
import LocationSearch from '../../../components/LocationSearch/LocationSearch';
import Modal from '../../../components/Modal/Modal';
import { useAlertStore } from '../../../stores/alertStore';
import { Location, ThresholdOperator, WeatherParameter } from '../../../types/weather';
import { Alert, AlertDto } from '../../../types/alert';
import { getOperatorSymbol, getParameterName, getParameterUnit } from '@/utils/weatherParameters';
import styles from '../Alerts.module.scss';

interface AlertFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  alert?: Alert;
}

const AlertForm: React.FC<AlertFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  alert
}) => {
  const isEditMode = !!alert;
  const { createAlert, updateAlert, restartAlert } = useAlertStore();
  
  // Weather parameters and operators
  const weatherParameters: WeatherParameter[] = [
    'temperature', 'temperatureApparent', 'humidity', 'windSpeed', 
    'precipitationProbability', 'uvIndex', 'cloudCover', 'visibility'
  ];
  const operators: ThresholdOperator[] = ['>', '<', '>=', '<=', '=', '!='];

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [parameter, setParameter] = useState<WeatherParameter | ''>('');
  const [operator, setOperator] = useState<ThresholdOperator | ''>('');
  const [value, setValue] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [conditionError, setConditionError] = useState<string | null>(null);

  // Initialize form with alert data if in edit mode
  useEffect(() => {
    resetForm();
    
    if (alert) {
      setName(alert.name);
      setDescription(alert.description || '');
      setEmails(alert.emails || []);
      setLocation(alert.location);
      setParameter(alert.condition.parameter);
      setOperator(alert.condition.operator);
      setValue(alert.condition.value);
    }
  }, [alert, isOpen]);

  // Reset form to initial state
  const resetForm = () => {
    setName('');
    setDescription('');
    setEmails([]);
    setLocation(null);
    setParameter('');
    setOperator('');
    setValue('');
    setError(null);
    setSuccessMessage(null);
    setLocationError(null);
    setConditionError(null);
  };

  // Handle location selection
  const handleLocationSelect = (loc: Location) => {
    setLocation(loc);
    setLocationError(null);
  };

  // Email field handlers
  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const addEmailField = () => {
    // Only allow adding up to 5 email fields
    if (emails.length < 5) {
      setEmails([...emails, '']);
    } else {
      setError('Maximum of 5 email recipients allowed');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const removeEmailField = (index: number) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails);
  };

  // Handle restart alert
  const handleRestartAlert = async () => {
    if (!alert) return;
    
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await restartAlert(alert.id);
      setSuccessMessage('Alert successfully restarted!');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restart alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;

    // Validate location
    if (!location) {
      setLocationError('Please select a location');
      isValid = false;
    }

    // Validate condition
    if (!parameter || !operator || value === '') {
      setConditionError('Please complete the condition');
      isValid = false;
    }

    return isValid;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset all errors
    setError(null);
    setLocationError(null);
    setConditionError(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSuccessMessage(null);
    
    try {
      // Filter out empty emails
      const filteredEmails = emails.filter(email => email.trim() !== '');
      
      // Check if we exceed the maximum email limit
      if (filteredEmails.length > 5) {
        throw new Error('Maximum of 5 email addresses allowed');
      }
      
      const alertData: AlertDto = {
        name,
        description,
        emails: filteredEmails,
        location: location as Location, // Safe to cast after validation
        condition: {
          parameter: parameter as WeatherParameter, // Safe to cast after validation
          operator: operator as ThresholdOperator, // Safe to cast after validation
          value: Number(value)
        }
      };
      
      if (isEditMode && alert) {
        await updateAlert(alert.id, alertData);
        // Don't call onSuccess for edit mode since we're already updating the store
      } else {
        await createAlert(alertData);
        // Call onSuccess only after creation to refresh the list in case of new items
        onSuccess();
        // Reset form after successful creation (not for edit)
        resetForm();
      }
      
      // Close the modal in both cases
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Alert' : 'Create New Alert'}
    >
      <form onSubmit={handleSubmit} className={styles.alertForm}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
        
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.formLabel}>Alert Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.formInput}
            placeholder="E.g., High Temperature Alert"
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.formLabel}>Description (Optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.formTextarea}
            placeholder="Describe your alert"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Email Recipients (Optional)</label>
          {emails.length === 0 && (
            <p className={styles.infoText}>No email notifications will be sent for this alert.</p>
          )}
          {emails.map((email, index) => (
            <div key={index} className={styles.emailField}>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                className={styles.formInput}
                placeholder="Enter email address"
                required={false}
              />
              <button
                type="button"
                className={styles.removeEmailButton}
                onClick={() => removeEmailField(index)}
                aria-label="Remove email"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            className={styles.addEmailButton}
            onClick={addEmailField}
            disabled={emails.length >= 5}
          >
            <FaPlus /> {emails.length === 0 ? 'Add Email' : 'Add Another Email'} {emails.length >= 5 ? '(Max 5)' : ''}
          </button>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Location <span className={styles.requiredIndicator}>*</span></label>
          <LocationSearch onLocationSelect={handleLocationSelect} />
          {location && location.name && (
            <div className={styles.selectedLocation}>
              <FaLocationArrow className={styles.locationIcon} />
              <span>{location.name}</span>
            </div>
          )}
          {locationError && <div className={styles.fieldError}>{locationError}</div>}
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Condition <span className={styles.requiredIndicator}>*</span></label>
          <div className={styles.conditionBuilder}>
            <select
              value={parameter}
              onChange={(e) => {
                setParameter(e.target.value as WeatherParameter);
                setConditionError(null);
              }}
              className={styles.formSelect}
              required
            >
              <option value="" disabled>Select parameter</option>
              {weatherParameters.map((param) => (
                <option key={param} value={param}>
                  {getParameterName(param)}
                </option>
              ))}
            </select>
            
            <select
              value={operator}
              onChange={(e) => {
                setOperator(e.target.value as ThresholdOperator);
                setConditionError(null);
              }}
              className={styles.formSelect}
              required
            >
              <option value="" disabled>Select</option>
              {operators.map((op) => (
                <option key={op} value={op}>
                  {getOperatorSymbol(op)}
                </option>
              ))}
            </select>
            
            <input
              type="number"
              value={value}
              onChange={(e) => {
                setValue(e.target.value === '' ? '' : parseFloat(e.target.value));
                setConditionError(null);
              }}
              className={styles.formInput}
              placeholder="Value"
              required
            />
            {parameter ? getParameterUnit(parameter as WeatherParameter) : ''}
          </div>
          {conditionError && <div className={styles.fieldError}>{conditionError}</div>}
        </div>
        
        <div className={styles.formActions}>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          
          {isEditMode && alert?.isTriggered && (
            <Button 
              type="button"
              variant="secondary"
              onClick={handleRestartAlert}
              disabled={isSubmitting}
              className={styles.restartButton}
            >
              <FaRedo /> Restart Alert
            </Button>
          )}
          
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Alert')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AlertForm; 