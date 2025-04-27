import { AxiosError } from 'axios';
import { useErrorStore } from '../stores/errorStore';

/**
 * Handles API errors and displays them in the global error popup
 * Extracts userMessage from the backend response if available
 * @param error The error object to handle
 * @param contextMessage Optional context message for debugging
 */
export const handleApiError = (error: unknown, contextMessage?: string): void => {
  const { showError } = useErrorStore.getState();
  
  if (error instanceof AxiosError && error.response?.data) {
    // Handle Axios errors with proper response data
    const { data } = error.response;
    
    // Extract technical error message and user-friendly message
    const errorMessage = data.message || data.error || error.message || 'An unknown error occurred';
    const userMessage = data.userMessage || errorMessage;
    
    // Add context information for debugging
    const debugMessage = contextMessage ? `${contextMessage}: ${errorMessage}` : errorMessage;
    
    // Show error with both messages
    showError(debugMessage, userMessage);
  } else if (error instanceof Error) {
    // Handle generic Error objects
    const debugMessage = contextMessage ? `${contextMessage}: ${error.message}` : error.message;
    showError(debugMessage);
  } else {
    // Handle unknown error types
    const debugMessage = contextMessage ? `${contextMessage}: An unknown error occurred` : 'An unknown error occurred';
    showError(debugMessage);
  }
}; 