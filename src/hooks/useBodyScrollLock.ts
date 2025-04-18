import { useEffect } from 'react';

/**
 * Hook that prevents body scrolling when a modal/popup is open
 * @param isLocked Whether the body scroll should be locked
 */
const useBodyScrollLock = (isLocked: boolean): void => {
  useEffect(() => {
    if (isLocked) {
      // Save the current overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      
      // Restore on cleanup
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isLocked]);
};

export default useBodyScrollLock; 