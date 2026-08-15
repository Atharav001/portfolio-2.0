import React, { useCallback, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTextScramble } from '../hooks/useTextScramble';
import ChatWidget from './ChatWidget';
import './Hero.css';

const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const idleTimeoutRef = useRef(null);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 18, restDelta: 0.001 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 18, restDelta: 0.001 });

  const badgeX  = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const badgeY  = useTransform(springY, [-0.5, 0.5], [-4, 4]);

  const title1X = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const title1Y = useTransform(springY, [-0.5, 0.5], [-10, 10]);

  const title2X = useTransform(springX, [-0.5, 0.5], [-30, 30]);
  const title2Y = useTransform(springY, [-0.5, 0.5], [-15, 15]);

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

  const scramble1 = useTextScramble('ATHARAV', { delay: 350, speed: 35, framesPerChar: 8 });
  const scramble2 = useTextScramble('NARANG',  { delay: 650, speed: 35, framesPerChar: 8 });

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

  const handleResumeClick = (e) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = '/Atharav Narang.pdf';
    link.download = 'Atharav Narang.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="hero-section" id="home" onMouseMove={handleMouseMove}>
      <div className="hero-3d-scene">
        <motion.div
          className="hero-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="hero-content">
            <motion.div
              variants={itemVariants}
              style={{ x: badgeX, y: badgeY }}
              className="hero-badge"
            >
              <span className="status-dot"></span>
              <span>Available for Software Engineering Internships</span>
            </motion.div>

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
                className="hero-title-line hero-role-title"
                style={{ x: title2X, y: title2Y }}
                aria-hidden="true"
              >
                {scramble2}
                <span className="role-subheading">B.Tech Computer Science</span>
              </motion.span>
            </motion.h1>

            <motion.div
              variants={itemVariants}
              style={{ x: descX, y: descY }}
              className="hero-description-container"
            >
              <p className="hero-description">
                Second-year B.Tech CSE student at Manipal Institute of Technology. I build software projects—ML pipelines, Android apps, and web tools—and learn by shipping.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="hero-actions">
              <a href="#projects" className="btn btn-primary magnetic-btn">
                See projects <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </a>
              <a
                href="/Atharav Narang.pdf"
                className="btn btn-secondary"
                onClick={handleResumeClick}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Resume (PDF)
              </a>
            </motion.div>
          </div>

          <motion.div
            className="hero-visual"
            variants={itemVariants}
          >
            <ChatWidget />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

