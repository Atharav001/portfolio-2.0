import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, Globe } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="hero-section" id="home">
      <motion.div 
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="hero-badge">
          <Globe size={16} className="badge-icon pulse" />
          <span>Available for global work</span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="hero-title">
          <span className="hero-title-line">ATHARAV</span>
          <span className="hero-title-line">NARANG</span>
        </motion.h1>
        
        <motion.div variants={itemVariants} className="hero-description-container">
          <ArrowDownRight size={32} className="hero-arrow" />
          <p className="hero-description">
            Focused on bridging the gap between traditional software engineering and Agentic AI. I build intelligent systems and data-driven applications from the ground up at MIT Bengaluru.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="hero-actions">
          <a href="#projects" className="btn btn-primary magnetic-btn">
            View Projects
          </a>
          <a href="#contact" className="btn btn-secondary">
            Get in touch
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
