import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import './CustomCursor.css';

const CustomCursor = () => {
  // Micro-delay trailing lag for the large outer ring
  const cursorX = useSpring(-100, { stiffness: 2000, damping: 50 });
  const cursorY = useSpring(-100, { stiffness: 2000, damping: 50 });

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const [isHovering, setIsHovering] = useState(false);
  const [isDocked, setIsDocked] = useState(true); // Default to true!
  const [isReady, setIsReady] = useState(false); // Render blocker

  useEffect(() => {
    let isCurrentlyDocked = true;

    const updateDockPosition = () => {
      const dock = document.getElementById('cursor-dock');
      if (dock) {
        const rect = dock.getBoundingClientRect();
        // Exact center of the dock element
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;

        // Use immediate set (bypass physics) by calling jump if supported, otherwise just set.
        dotX.set(targetX);
        dotY.set(targetY);
        // Do NOT subtract width offsets because 'x' maps to center using CSS translate(-50%, -50%)
        cursorX.set(targetX);
        cursorY.set(targetY);

        setIsReady(true);
      }
    };

    const handleMouseMove = (e) => {
      if (isCurrentlyDocked) {
        isCurrentlyDocked = false;
        setIsDocked(false);
      }
      // Exact mouse coordinates
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
        isCurrentlyDocked = true;
        setIsDocked(true);
        updateDockPosition();
      }
    };

    const handleMouseEnter = (e) => {
      isCurrentlyDocked = false;
      setIsDocked(false);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const isInteractive = e.target.closest('a, button, input, .interactive-tag, .project-image-container');
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

    // Check initial state
    setTimeout(() => {
      if (isCurrentlyDocked) {
        updateDockPosition();
        dotX.jump(dotX.get());
        dotY.jump(dotY.get());
        cursorX.jump(cursorX.get());
        cursorY.jump(cursorY.get());
      }
    }, 50);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, dotX, dotY]);

  if (!isReady) return null;

  return (
    <>
      <motion.div
        className={`custom-cursor-dot ${(isHovering && !isDocked) ? 'hovered' : ''}`}
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className={`custom-cursor-ring ${(isHovering && !isDocked) ? 'hovered' : ''} ${isDocked ? 'docked' : ''}`}
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      />
    </>
  );
};

export default CustomCursor;
