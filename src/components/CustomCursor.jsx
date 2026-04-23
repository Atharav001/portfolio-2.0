import React, { useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import './CustomCursor.css';

const CustomCursor = () => {
  // Micro-delay trailing lag for the large outer ring
  const cursorX = useSpring(-100, { stiffness: 1000, damping: 40 });
  const cursorY = useSpring(-100, { stiffness: 1000, damping: 40 });

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const [isHovering, setIsHovering] = useState(false);
  const [isDocked, setIsDocked] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const updateDockPosition = useCallback(() => {
    const dock = document.getElementById('cursor-dock');
    if (dock) {
      const rect = dock.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;

      dotX.set(targetX);
      dotY.set(targetY);
      cursorX.set(targetX);
      cursorY.set(targetY);

      setIsVisible(true);
    }
  }, [cursorX, cursorY, dotX, dotY]);

  useEffect(() => {
    let isCurrentlyDocked = true;

    const handleMouseMove = (e) => {
      if (isCurrentlyDocked) {
        isCurrentlyDocked = false;
        setIsDocked(false);
      }
      if (!isVisible) setIsVisible(true);

      dotX.set(e.clientX);
      dotY.set(e.clientY);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseLeave = (e) => {
      // If leaving the window, dock the cursor
      if (e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
        isCurrentlyDocked = true;
        setIsDocked(true);
        updateDockPosition();
      }
    };

    const handleMouseEnter = (e) => {
      isCurrentlyDocked = false;
      setIsDocked(false);
      setIsVisible(true);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const isInteractive = e.target.closest('a, button, input, .interactive-tag, .project-image-container, [role="button"], .nav-link, .action-btn');
      if (isInteractive) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);

    // Initial check for dock
    const initialTimeout = setTimeout(() => {
      if (isCurrentlyDocked) {
        updateDockPosition();
      }
    }, 200);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      clearTimeout(initialTimeout);
    };
  }, [updateDockPosition, isVisible, dotX, dotY, cursorX, cursorY]);

  // Ensure it's hidden on mobile via JS too, just in case
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 999999,
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.3s ease'
    }}>
      <motion.div
        className={`custom-cursor-dot ${(isHovering && !isDocked) ? 'hovered' : ''}`}
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      <motion.div
        className={`custom-cursor-ring ${(isHovering && !isDocked) ? 'hovered' : ''} ${isDocked ? 'docked' : ''}`}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </div>
  );
};

export default CustomCursor;