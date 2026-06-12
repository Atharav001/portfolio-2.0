import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const checkTheme = () => {
      setTheme(document.documentElement.classList.contains('light-theme') ? 'light' : 'dark');
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Motion values to hold the mouse coordinates, initialized to center of screen
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  // Smooth springs for sluggish inertia tracking (high damping, low stiffness)
  const springConfig = { damping: 80, stiffness: 20, mass: 1.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Parallax transform mapping for the Violet Orb (Direct tracking with offset)
  const violetX = useTransform(springX, (val) => val - (typeof window !== 'undefined' ? window.innerWidth : 1400) / 2);
  const violetY = useTransform(springY, (val) => val - (typeof window !== 'undefined' ? window.innerHeight : 900) / 2);

  // Parallax transform mapping for the Teal Orb (Inverse tracking, slower speed)
  const tealX = useTransform(springX, (val) => -0.5 * (val - (typeof window !== 'undefined' ? window.innerWidth : 1400) / 2));
  const tealY = useTransform(springY, (val) => -0.4 * (val - (typeof window !== 'undefined' ? window.innerHeight : 900) / 2));

  // Update mouse position on move completely outside of React's state/render cycles
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const isLight = theme === 'light';

  return (
    <div className="animated-framer-bg">
      <div className="framer-blur-layer"></div>

      {/* Violet Orb (Tracks cursor directly) */}
      <motion.div
        className="framer-orb orb-1"
        style={{
          x: violetX,
          y: violetY,
          background: isLight 
            ? 'radial-gradient(circle, rgba(147,51,234,0.18) 0%, rgba(147,51,234,0) 70%)'
            : 'radial-gradient(circle, rgba(138,43,226,0.18) 0%, rgba(138,43,226,0) 70%)'
        }}
      />
      
      {/* Teal Orb (Tracks cursor inversely and slower) */}
      <motion.div
        className="framer-orb orb-2"
        style={{
          x: tealX,
          y: tealY,
          background: isLight 
            ? 'radial-gradient(circle, rgba(0,132,255,0.15) 0%, rgba(0,132,255,0) 70%)'
            : 'radial-gradient(circle, rgba(0,255,255,0.15) 0%, rgba(0,255,255,0) 70%)'
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
