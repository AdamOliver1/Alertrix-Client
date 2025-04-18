import { useEffect } from 'react';

/**
 * Hook that handles escape key press
 * @param callback Function to call when escape key is pressed
 * @param dependencies Array of dependencies for the effect
 */
const useEscapeKey = (
  callback: () => void,
  enabled: boolean = true
): void => {
  useEffect(() => {
    if (!enabled) return;
    
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [callback, enabled]);
};

export default useEscapeKey; 