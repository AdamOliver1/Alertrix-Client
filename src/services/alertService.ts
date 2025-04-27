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
      handleApiError(error, `Failed to fetch alert with ID: ${id}`);
      return null;
    }
  },
  
  /**
   * Get all alerts with complete data
   */
  async getAllAlerts(): Promise<Alert[] | null> {
    try {
      const response = await api.get<Alert[]>(ALERTS_ENDPOINT);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch all alerts');
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
      handleApiError(error, 'Failed to create new alert');
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
      handleApiError(error, `Failed to update alert with ID: ${id}`);
      return null;
    }
  },
  
  /**
   * Delete an alert
   */
  async deleteAlert(id: string): Promise<boolean> {
    try {
      const response = await api.delete<{ success: boolean, id: string }>(`${ALERTS_ENDPOINT}/${id}`);
      return response.data.success;
    } catch (error) {
      handleApiError(error, `Failed to delete alert with ID: ${id}`);
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
      handleApiError(error, 'Failed to fetch alert statuses');
      return null;
    }
  },
  
  /**
   * Trigger manual evaluation of all alerts
   */
  async evaluateAllAlerts(): Promise<{ message: string; alertsTriggered: boolean } | null> {
    try {
      const response = await api.post<{ message: string; alertsTriggered: boolean }>(`${ALERTS_ENDPOINT}/evaluate`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to evaluate alerts');
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
      handleApiError(error, `Failed to restart alert with ID: ${id}`);
      return null;
    }
  }
}; 