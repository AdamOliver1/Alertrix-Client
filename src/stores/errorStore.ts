import { create } from 'zustand';
import { ErrorState } from '../types/error';

export const useErrorStore = create<ErrorState>((set) => ({
  error: null,
  userMessage: null,
  isVisible: false,
  showError: (message: string, userMessage?: string) => {
    set({ 
      error: message, 
      userMessage: userMessage || message, 
      isVisible: true 
    });
    // Auto-hide after 5 seconds
    setTimeout(() => {
      set({ isVisible: false });
    }, 5000);
  },
  hideError: () => set({ isVisible: false }),
})); 