export interface ApiError {
  status: string;
  statusCode: number;
  message: string;
  userMessage: string;
  stack?: string;
}

export interface ErrorState {
  error: string | null;
  userMessage: string | null;
  isVisible: boolean;
  showError: (message: string, userMessage?: string) => void;
  hideError: () => void;
} 