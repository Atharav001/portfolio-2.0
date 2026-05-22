import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './TiltCard.css';

/**
 * TiltCard
 * A reusable 3D perspective tilt wrapper that tracks cursor position
 * and applies smooth rotateX/rotateY transforms plus a specular glare
 * highlight that follows the cursor — creating the illusion of a physical
 * card surface.
 *
 * Accepts any `motion.div` animation props via `animationProps` so the
 * parent's scroll-reveal animations still work.
 */
const TiltCard = ({ children, className = '', animationProps = {} }) => {
  const ref = useRef(null);

  // Normalised cursor position within the card [0, 1]
  // Start at 0.5 (centre) so springs are at rest on mount
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springCfg = { stiffness: 200, damping: 28, mass: 0.6 };

  // Map normalised position to rotation degrees (max ±7°)
  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], [7, -7]),
    springCfg
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], [-7, 7]),
    springCfg
  );

  // Glare highlight position (0%–100% for CSS background)
  const glareX = useTransform(mouseX, [0, 1], [0, 100]);
  const glareY = useTransform(mouseY, [0, 1], [0, 100]);

  // Build the glare gradient as a motion value so it updates on every frame
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.10) 0%, transparent 62%)`
  );

  const glareOpacity = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
    glareOpacity.set(1);
  };

  const handleMouseLeave = () => {
    // Spring back to centre
    mouseX.set(0.5);
    mouseY.set(0.5);
    glareOpacity.set(0);
  };

  return (
    /* Perspective wrapper — must NOT have overflow hidden so 3D is visible */
    <div
      ref={ref}
      className="tilt-perspective"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={`tilt-inner ${className}`}
        style={{ rotateX, rotateY }}
        {...animationProps}
      >
        {children}

        {/* Specular glare layer — sits above content, pointer-events none */}
        <motion.div
          className="tilt-glare"
          aria-hidden="true"
          style={{ background: glareBackground, opacity: glareOpacity }}
        />
      </motion.div>
    </div>
  );
};

export default TiltCard;
