import { create } from 'zustand';
import { Alert, AlertStatus, AlertDto } from '../types/alert';
import { alertService } from '../services/alertService';
import { handleApiError } from '../services/errorHandler';

interface AlertState {
  // Alert statuses
  alertStatuses: AlertStatus[];
  isLoadingStatuses: boolean;
  
  // Selected alert
  selectedAlert: Alert | null;
  
  // Evaluation
  isEvaluating: boolean;
  
  // Actions
  fetchAlertById: (id: string) => Promise<void>;
  createAlert: (alert: AlertDto) => Promise<Alert | null>;
  updateAlert: (id: string, alert: Partial<AlertDto>) => Promise<Alert | null>;
  deleteAlert: (id: string) => Promise<void>;
  fetchAlertStatuses: () => Promise<void>;
  clearSelectedAlert: () => void;
  evaluateAllAlerts: () => Promise<string | null>;
  restartAlert: (id: string) => Promise<Alert | null>;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  // Initial state
  alertStatuses: [],
  isLoadingStatuses: false,
  selectedAlert: null,
  isEvaluating: false,
  
  // Actions
  fetchAlertById: async (id: string) => {
    try {
      const alert = await alertService.getAlertById(id);
      set({ selectedAlert: alert });
    } catch (error) {
      handleApiError(error);
    }
  },
  
  createAlert: async (alert: AlertDto) => {
    try {
      const newAlert = await alertService.createAlert(alert);
      await get().fetchAlertStatuses();
      return newAlert;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  updateAlert: async (id: string, alert: Partial<AlertDto>) => {
    try {
      const updatedAlert = await alertService.updateAlert(id, alert);
      set({ selectedAlert: updatedAlert });
      await get().fetchAlertStatuses();
      return updatedAlert;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  deleteAlert: async (id: string) => {
    try {
      await alertService.deleteAlert(id);
      set({ selectedAlert: null });
      await get().fetchAlertStatuses();
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  fetchAlertStatuses: async () => {
    set({ isLoadingStatuses: true });
    try {
      const statuses = await alertService.getAlertStatuses();
      set({ alertStatuses: statuses || [], isLoadingStatuses: false });
    } catch (error) {
      set({ isLoadingStatuses: false });
      handleApiError(error);
    }
  },
  
  clearSelectedAlert: () => {
    set({ selectedAlert: null });
  },
  
  evaluateAllAlerts: async () => {
    set({ isEvaluating: true });
    try {
      const result = await alertService.evaluateAllAlerts();
      // Fetch updated statuses after evaluation
      await get().fetchAlertStatuses();
      set({ isEvaluating: false });
      return result?.message || null;
    } catch (error) {
      set({ isEvaluating: false });
      handleApiError(error);
      throw error;
    }
  },
  
  restartAlert: async (id: string) => {
    try {
      const restartedAlert = await alertService.restartAlert(id);
      set({ selectedAlert: restartedAlert });
      await get().fetchAlertStatuses();
      return restartedAlert;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
})); 