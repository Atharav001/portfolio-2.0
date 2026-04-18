import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

  // Soft elegant floating paths
  const floatAnimation1 = {
    x: [0, 100, -50, 0],
    y: [0, -100, 50, 0],
    rotate: [0, 90, 180, 360],
    scale: [1, 1.2, 0.9, 1],
    transition: { duration: 25, repeat: Infinity, ease: 'linear' }
  };

  const floatAnimation2 = {
    x: [0, -120, 80, 0],
    y: [0, 150, -100, 0],
    rotate: [360, 180, 90, 0],
    scale: [1, 0.8, 1.1, 1],
    transition: { duration: 30, repeat: Infinity, ease: 'linear' }
  };

  const floatAnimation3 = {
    x: [-100, 150, -80, -100],
    y: [100, -80, 150, 100],
    rotate: [0, -180, -360, 0],
    scale: [1.1, 0.9, 1.2, 1.1],
    transition: { duration: 35, repeat: Infinity, ease: 'linear' }
  };

  const isLight = theme === 'light';

  return (
    <div className="animated-framer-bg">
      <div className="framer-blur-layer"></div>

      <motion.div
        className="framer-orb orb-1"
        style={{
          background: isLight 
            ? 'radial-gradient(circle, rgba(138,43,226,0.55) 0%, rgba(138,43,226,0) 70%)'
            : 'radial-gradient(circle, rgba(138,43,226,0.25) 0%, rgba(138,43,226,0) 70%)'
        }}
        animate={floatAnimation1}
      />
      
      <motion.div
        className="framer-orb orb-2"
        style={{
          background: isLight 
            ? 'radial-gradient(circle, rgba(0,255,255,0.5) 0%, rgba(0,255,255,0) 70%)'
            : 'radial-gradient(circle, rgba(0,255,255,0.18) 0%, rgba(0,255,255,0) 70%)'
        }}
        animate={floatAnimation2}
      />

      <motion.div
        className="framer-orb orb-3"
        style={{
          background: isLight 
            ? 'radial-gradient(circle, rgba(138,43,226,0.45) 0%, rgba(138,43,226,0) 70%)'
            : 'radial-gradient(circle, rgba(138,43,226,0.2) 0%, rgba(138,43,226,0) 70%)'
        }}
        animate={floatAnimation3}
      />
    </div>
  );
};

export default AnimatedBackground;
