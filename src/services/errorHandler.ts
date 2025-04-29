import { AxiosError } from 'axios';
import { useErrorStore } from '../stores/errorStore';

/**
 * Handles API errors and displays them in the global error popup
 * Extracts userMessage from the backend response if available
 */
export const handleApiError = (error: unknown): void => {
  const { showError } = useErrorStore.getState();
  
  if (error instanceof AxiosError && error.response?.data) {
    // Handle Axios errors with proper response data
    const { data } = error.response;
    
    // Extract technical error message and user-friendly message
    const errorMessage = data.message || data.error || error.message || 'An unknown error occurred';
    const userMessage = data.userMessage || errorMessage;
    
    // Show error with both messages
    showError(errorMessage, userMessage);
  } else if (error instanceof Error) {
    // Handle generic Error objects
    showError(error.message);
  } else {
    // Handle unknown error types
    showError('An unknown error occurred');
  }
}; 