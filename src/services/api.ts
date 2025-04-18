import axios from 'axios';
import { useErrorStore } from '../stores/errorStore';
import { ApiError } from '../types/error';
import { env } from '../config/env';

const API_URL = env.api.url;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    const errorStore = useErrorStore.getState();
    
    // Handle common errors
    if (response) {
      const { status, data } = response;
      
      // Extract error details from the response
      const errorMessage = data.message || data.error || 'An unknown error occurred';
      const userMessage = data.userMessage || errorMessage;
      
      // Log error to console with status
      console.error(`API Error (${status}):`, errorMessage);
      
      // Show the error using the error store
      errorStore.showError(errorMessage, userMessage);
    } else {
      // Network errors (no response)
      const errorMessage = 'Network error: Cannot connect to server';
      errorStore.showError(errorMessage);
      console.error(errorMessage, error.message);
    }
    
    return Promise.reject(error);
  }
); 