import { useEffect, RefObject } from 'react';

/**
 * Hook that handles clicks outside of the referenced element
 * @param ref Reference to the element to detect clicks outside of
 * @param callback Function to call when a click outside is detected
 * @param enabled Whether the hook is enabled
 */
const useClickOutside = (
  ref: RefObject<HTMLElement>,
  callback: () => void,
  enabled: boolean = true
): void => {
  useEffect(() => {
    if (!enabled) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback, enabled]);
};

export default useClickOutside; 