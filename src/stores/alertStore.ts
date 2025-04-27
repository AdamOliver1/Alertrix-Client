import { create } from 'zustand';
import { Alert, AlertStatus, AlertDto } from '../types/alert';
import { alertService } from '../services/alertService';
import { handleApiError } from '../services/errorHandler';

interface AlertState {
  // Core data
  alerts: Alert[];
  alertsById: Record<string, Alert>;
  alertStatuses: AlertStatus[];
  
  // UI states
  isLoading: boolean;
  isLoadingStatuses: boolean;
  isEvaluating: boolean;
  selectedAlert: Alert | null;
  
  // Alerts page actions
  fetchAlerts: () => Promise<void>;
  selectAlert: (id: string) => void;
  clearSelectedAlert: () => void;
  fetchAlertById: (id: string) => Promise<void>;
  
  // Alert CRUD operations
  createAlert: (alert: AlertDto) => Promise<Alert | null>;
  updateAlert: (id: string, alert: Partial<AlertDto>) => Promise<Alert | null>;
  deleteAlert: (id: string) => Promise<void>;
  
  // CurrentState page actions
  fetchAlertStatuses: () => Promise<void>;
  evaluateAllAlerts: () => Promise<{ message: string; alertsTriggered: boolean } | null>;
  restartAlert: (id: string) => Promise<Alert | null>;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  // Initial state
  alerts: [],
  alertsById: {},
  alertStatuses: [],
  isLoading: false,
  isLoadingStatuses: false,
  isEvaluating: false,
  selectedAlert: null,
  
  // Alerts page actions
  fetchAlerts: async () => {
    set({ isLoading: true });
    try {
      const alerts = await alertService.getAllAlerts();
      
      if (!alerts) {
        set({ alerts: [], alertsById: {}, isLoading: false });
        return;
      }
      
      // Create a lookup map for faster access by ID
      const alertsById = alerts.reduce((acc, alert) => {
        acc[alert.id] = alert;
        return acc;
      }, {} as Record<string, Alert>);
      
      set({ alerts, alertsById, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      handleApiError(error, 'Failed to fetch alerts');
    }
  },
  
  selectAlert: (id: string) => {
    const { alertsById } = get();
    const alert = alertsById[id];
    
    if (alert) {
      set({ selectedAlert: alert });
    } else {
      // Alert not in cache, fetch it
      get().fetchAlertById(id);
    }
  },
  
  clearSelectedAlert: () => {
    set({ selectedAlert: null });
  },
  
  fetchAlertById: async (id: string) => {
    try {
      const alert = await alertService.getAlertById(id);
      if (!alert) return;
      
      set(state => {
        // Find if the alert already exists in the array
        const updatedAlerts = [...state.alerts];
        const alertIndex = updatedAlerts.findIndex(a => a.id === id);
        
        if (alertIndex >= 0) {
          updatedAlerts[alertIndex] = alert;
        } else {
          updatedAlerts.push(alert);
        }
        
        return { 
          selectedAlert: alert,
          alerts: updatedAlerts,
          alertsById: { ...state.alertsById, [id]: alert }
        };
      });
    } catch (error) {
      handleApiError(error, `Failed to fetch alert with ID: ${id}`);
    }
  },
  
  // Alert CRUD operations
  createAlert: async (alert: AlertDto) => {
    try {
      const newAlert = await alertService.createAlert(alert);
      if (!newAlert) return null;
      
      set(state => ({
        alerts: [...state.alerts, newAlert],
        alertsById: { ...state.alertsById, [newAlert.id]: newAlert }
      }));
      
      return newAlert;
    } catch (error) {
      handleApiError(error, 'Failed to create new alert');
      throw error;
    }
  },
  
  updateAlert: async (id: string, alert: Partial<AlertDto>) => {
    try {
      const updatedAlert = await alertService.updateAlert(id, alert);
      if (!updatedAlert) return null;
      
      set(state => {
        const updatedAlerts = [...state.alerts];
        const alertIndex = updatedAlerts.findIndex(a => a.id === id);
        
        if (alertIndex >= 0) {
          updatedAlerts[alertIndex] = updatedAlert;
        }
        
        return {
          selectedAlert: updatedAlert,
          alerts: updatedAlerts,
          alertsById: { ...state.alertsById, [id]: updatedAlert }
        };
      });
      
      return updatedAlert;
    } catch (error) {
      handleApiError(error, `Failed to update alert with ID: ${id}`);
      throw error;
    }
  },
  
  deleteAlert: async (id: string) => {
    try {
      const success = await alertService.deleteAlert(id);
      if (!success) return;
      
      set(state => {
        const updatedAlerts = state.alerts.filter(a => a.id !== id);
        const { [id]: _, ...remainingAlerts } = state.alertsById;
        
        return { 
          selectedAlert: state.selectedAlert?.id === id ? null : state.selectedAlert,
          alerts: updatedAlerts,
          alertsById: remainingAlerts
        };
      });
    } catch (error) {
      handleApiError(error, `Failed to delete alert with ID: ${id}`);
      throw error;
    }
  },
  
  // CurrentState page actions
  fetchAlertStatuses: async () => {
    set({ isLoadingStatuses: true });
    try {
      const statuses = await alertService.getAlertStatuses();
      set({ 
        alertStatuses: statuses || [], 
        isLoadingStatuses: false 
      });
    } catch (error) {
      set({ isLoadingStatuses: false });
      handleApiError(error, 'Failed to fetch alert statuses');
    }
  },
  
  evaluateAllAlerts: async () => {
    set({ isEvaluating: true });
    try {
      const result = await alertService.evaluateAllAlerts();
      
      // Only fetch statuses if any alerts were actually triggered
      if (result?.alertsTriggered) {
        const statuses = await alertService.getAlertStatuses();
        
        if (statuses) {
          // Update both statuses and full alerts data for consistency
          set(state => {
            const alertsByIdCopy = { ...state.alertsById };
            const updatedAlerts = [...state.alerts];
            
            // Update triggered status on all affected alerts
            statuses.forEach(status => {
              const existingAlert = alertsByIdCopy[status.id];
              if (existingAlert) {
                // Only update the isTriggered flag
                const updatedAlert = { ...existingAlert, isTriggered: status.isTriggered };
                alertsByIdCopy[status.id] = updatedAlert;
                
                // Also update in array if present
                const alertIndex = updatedAlerts.findIndex(a => a.id === status.id);
                if (alertIndex >= 0) {
                  updatedAlerts[alertIndex] = updatedAlert;
                }
              }
            });
            
            return {
              alertStatuses: statuses,
              alertsById: alertsByIdCopy,
              alerts: updatedAlerts,
              isLoadingStatuses: false,
              isEvaluating: false
            };
          });
        } else {
          set({ isEvaluating: false });
        }
      } else {
        set({ isEvaluating: false });
      }
      
      return result;
    } catch (error) {
      set({ isEvaluating: false });
      handleApiError(error, 'Failed to evaluate alerts');
      throw error;
    }
  },
  
  restartAlert: async (id: string) => {
    try {
      const restartedAlert = await alertService.restartAlert(id);
      if (!restartedAlert) return null;
      
      // Update both alerts and statuses in a single state update
      set(state => {
        // Update in the alerts array
        const updatedAlerts = [...state.alerts];
        const alertIndex = updatedAlerts.findIndex(a => a.id === id);
        if (alertIndex >= 0) {
          updatedAlerts[alertIndex] = restartedAlert;
        }
        
        // Update in the statuses array
        const updatedStatuses = [...state.alertStatuses];
        const statusIndex = updatedStatuses.findIndex(status => status.id === id);
        if (statusIndex >= 0) {
          // We only need the required fields from AlertStatus
          updatedStatuses[statusIndex] = {
            id: restartedAlert.id,
            name: restartedAlert.name,
            emails: restartedAlert.emails,
            isTriggered: restartedAlert.isTriggered,
            condition: restartedAlert.condition,
            location: restartedAlert.location
          };
        }
        
        return {
          selectedAlert: state.selectedAlert?.id === id ? restartedAlert : state.selectedAlert,
          alerts: updatedAlerts,
          alertsById: { ...state.alertsById, [id]: restartedAlert },
          alertStatuses: updatedStatuses
        };
      });
      
      return restartedAlert;
    } catch (error) {
      handleApiError(error, `Failed to restart alert with ID: ${id}`);
      throw error;
    }
  }
})); 