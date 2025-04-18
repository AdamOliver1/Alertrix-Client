import { useState, useEffect, useMemo, useRef } from 'react';
import { useAnimationFrame } from '../../hooks';
import styles from './SpaceBackground.module.scss';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed?: number; // Optional property for twinkling effect
  twinkleDelay?: number; // Optional delay for twinkling
  isLarge?: boolean; // Flag for larger stars
}

const SpaceBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const starsContainerRef = useRef<HTMLDivElement>(null);
  
  // Generate random stars
  const stars = useMemo(() => {
    const starsArray: Star[] = [];
    
    // Generate regular stars
    for (let i = 0; i < 150; i++) {
      const isTwinkling = Math.random() > 0.7; // 30% of stars will twinkle
      
      starsArray.push({
        id: i,
        x: Math.random() * 100, // % of viewport width
        y: Math.random() * 100, // % of viewport height
        size: Math.random() * 2.5 + 0.5, // 0.5-3px
        opacity: Math.random() * 0.7 + 0.3, // 0.3-1.0
        ...(isTwinkling && {
          twinkleSpeed: Math.random() * 3 + 1, // 1-4s
          twinkleDelay: Math.random() * 5, // 0-5s delay
        }),
      });
    }
    
    // Add a few larger, brighter stars
    for (let i = 0; i < 10; i++) {
      starsArray.push({
        id: i + 1000, // Ensure unique IDs
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 3, // 3-5px
        opacity: 0.9,
        twinkleSpeed: Math.random() * 4 + 3, // 3-7s
        twinkleDelay: Math.random() * 3,
        isLarge: true,
      });
    }
    
    return starsArray;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Use the animation frame hook instead of managing requestAnimationFrame manually
  useAnimationFrame(() => {
    if (starsContainerRef.current) {
      const starElements = starsContainerRef.current.children;
      const centerX = 0.5; // center of the screen
      const centerY = 0.5; // center of the screen
      
      for (let i = 0; i < starElements.length; i++) {
        const star = stars[i];
        if (!star) continue;
        
        // Calculate star's normalized position (0-1)
        const starX = star.x / 100;
        const starY = star.y / 100;
        
        // Calculate the direction vector from the star to the cursor
        const dirX = mousePosition.x - starX;
        const dirY = mousePosition.y - starY;
        
        // Calculate distance factor - stars farther from cursor move less
        // This creates a more natural parallax effect
        const distanceToMouse = Math.sqrt(
          Math.pow(mousePosition.x - starX, 2) + 
          Math.pow(mousePosition.y - starY, 2)
        );
        
        // Depth factor based on star properties
        const depthFactor = star.isLarge ? 25 : star.size < 1.5 ? 15 : 20;
        
        // Stars move more when they're closer to the cursor
        const movementScale = Math.max(0.1, 1 - distanceToMouse) * depthFactor;
        
        // Calculate the offset, ensuring stars always move in the direction of the cursor
        const offsetX = dirX * movementScale;
        const offsetY = dirY * movementScale;
        
        const element = starElements[i] as HTMLElement;
        element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    }
  }, [mousePosition, stars]);

  return (
    <div className={styles.spaceBackground} ref={starsContainerRef}>
      {stars.map((star) => (
        <div
          key={star.id}
          className={
            star.isLarge 
              ? styles.largeStar 
              : star.twinkleSpeed 
                ? styles.twinklingStar 
                : styles.star
          }
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            willChange: 'transform',
            ...(star.twinkleSpeed && {
              animationDuration: `${star.twinkleSpeed}s`,
              animationDelay: `${star.twinkleDelay}s`,
            }),
          }}
        />
      ))}
    </div>
  );
};

export default SpaceBackground; 