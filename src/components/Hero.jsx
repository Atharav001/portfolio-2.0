import React, { useCallback, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { useTextScramble } from '../hooks/useTextScramble';
import './Hero.css';

const Hero = () => {
  // --- Mouse Parallax Setup ---
  // Raw mouse position normalised to [-0.5, 0.5]
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const idleTimeoutRef = useRef(null);

  // Smooth spring followers — low stiffness so the motion feels heavy and cinematic
  const springX = useSpring(mouseX, { stiffness: 50, damping: 18, restDelta: 0.001 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 18, restDelta: 0.001 });

  // Each "layer" moves at a different rate — creates the illusion of real Z-depth
  const badgeX  = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const badgeY  = useTransform(springY, [-0.5, 0.5], [-4, 4]);

  const title1X = useTransform(springX, [-0.5, 0.5], [-20, 20]);   // ATHARAV — mid depth
  const title1Y = useTransform(springY, [-0.5, 0.5], [-10, 10]);

  const title2X = useTransform(springX, [-0.5, 0.5], [-40, 40]);   // NARANG — closest to viewer
  const title2Y = useTransform(springY, [-0.5, 0.5], [-20, 20]);

  const descX   = useTransform(springX, [-0.5, 0.5], [-10, 10]);
  const descY   = useTransform(springY, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = useCallback(
    (e) => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }

      mouseX.set((e.clientX / window.innerWidth) - 0.5);
      mouseY.set((e.clientY / window.innerHeight) - 0.5);

      idleTimeoutRef.current = setTimeout(() => {
        mouseX.set(0);
        mouseY.set(0);
      }, 1000);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, []);

  // --- Text Scramble ---
  // Each line resolves independently with a slight delay offset
  const scramble1 = useTextScramble('ATHARAV', { delay: 350, speed: 35, framesPerChar: 8 });
  const scramble2 = useTextScramble('NARANG',  { delay: 650, speed: 35, framesPerChar: 8 });

  // --- Framer Motion entrance variants (preserved from original) ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="hero-section" id="home" onMouseMove={handleMouseMove}>
      {/* Perspective wrapper — gives the whole section a 3D stage */}
      <div className="hero-3d-scene">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge — slowest layer */}
          <motion.div
            variants={itemVariants}
            style={{ x: badgeX, y: badgeY }}
            className="hero-badge"
          >
            <span>Available to work globally</span>
          </motion.div>

          {/* Title — two lines at different parallax depths */}
          <motion.h1
            variants={itemVariants}
            className="hero-title"
            aria-label="ATHARAV NARANG"
          >
            <motion.span
              className="hero-title-line"
              style={{ x: title1X, y: title1Y }}
              aria-hidden="true"
            >
              {scramble1}
            </motion.span>
            <motion.span
              className="hero-title-line"
              style={{ x: title2X, y: title2Y }}
              aria-hidden="true"
            >
              {scramble2}
            </motion.span>
          </motion.h1>

          {/* Description — subtle depth */}
          <motion.div
            variants={itemVariants}
            style={{ x: descX, y: descY }}
            className="hero-description-container"
          >
            <ArrowDownRight size={32} className="hero-arrow" />
            <p className="hero-description">
              Focused on bridging the gap between traditional software engineering and Agentic AI.
              I build intelligent systems and data-driven applications from the ground up at MIT Bengaluru.
            </p>
          </motion.div>

          {/* CTA buttons — no parallax, they feel grounded */}
          <motion.div variants={itemVariants} className="hero-actions">
            <a href="#projects" className="btn btn-primary magnetic-btn">
              View Projects
            </a>
            <a href="#contact" className="btn btn-secondary">
              Get in touch
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
