import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  // Motion values to hold the mouse coordinates, initialized to center of screen
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  // Smooth springs for sluggish inertia tracking (heavy damping, low stiffness)
  const springConfig = { damping: 100, stiffness: 15, mass: 2 };
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

  return (
    <div className="animated-framer-bg">
      {/* Violet Orb (Tracks cursor directly) */}
      <motion.div
        className="framer-orb orb-1"
        style={{
          x: violetX,
          y: violetY,
        }}
        transformTemplate={({ x, y }) => `translate3d(${x}, ${y}, 0)`}
      />
      
      {/* Teal Orb (Tracks cursor inversely and slower) */}
      <motion.div
        className="framer-orb orb-2"
        style={{
          x: tealX,
          y: tealY,
        }}
        transformTemplate={({ x, y }) => `translate3d(${x}, ${y}, 0)`}
      />
    </div>
  );
};

export default AnimatedBackground;
