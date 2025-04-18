import { useRef, useEffect, DependencyList } from 'react';

/**
 * Hook that sets up a requestAnimationFrame loop
 * @param callback Function to call on each animation frame
 * @param dependencies Array of dependencies for the effect
 */
export const useAnimationFrame = (
  callback: (deltaTime: number) => void,
  dependencies: DependencyList = []
): void => {
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  
  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

export default useAnimationFrame; 