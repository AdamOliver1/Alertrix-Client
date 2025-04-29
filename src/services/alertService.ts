import { api } from './api';
import { Alert, AlertDto, AlertStatus } from '../types/alert';
import { handleApiError } from './errorHandler';

const ALERTS_ENDPOINT = '/alerts';

export const alertService = {
  /**
   * Get a specific alert by ID
   */
  async getAlertById(id: string): Promise<Alert | null> {
    try {
      const response = await api.get<Alert>(`${ALERTS_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },
  
  /**
   * Create a new alert
   */
  async createAlert(alert: AlertDto): Promise<Alert | null> {
    try {
      const response = await api.post<Alert>(ALERTS_ENDPOINT, alert);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },
  
  /**
   * Update an existing alert
   */
  async updateAlert(id: string, alert: Partial<AlertDto>): Promise<Alert | null> {
    try {
      const response = await api.put<Alert>(`${ALERTS_ENDPOINT}/${id}`, alert);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },
  
  /**
   * Delete an alert
   */
  async deleteAlert(id: string): Promise<boolean> {
    try {
      await api.delete(`${ALERTS_ENDPOINT}/${id}`);
      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    }
  },
  
  /**
   * Get the status of all alerts
   */
  async getAlertStatuses(): Promise<AlertStatus[] | null> {
    try {
      const response = await api.get<AlertStatus[]>(`${ALERTS_ENDPOINT}/status`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },
  
  /**
   * Trigger manual evaluation of all alerts
   */
  async evaluateAllAlerts(): Promise<{ message: string } | null> {
    try {
      const response = await api.post<{ message: string }>(`${ALERTS_ENDPOINT}/evaluate`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },
  
  /**
   * Restart an alert by setting isTriggered to false
   */
  async restartAlert(id: string): Promise<Alert | null> {
    try {
      const response = await api.post<Alert>(`${ALERTS_ENDPOINT}/${id}/restart`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  }
}; 