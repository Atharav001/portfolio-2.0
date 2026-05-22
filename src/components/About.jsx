import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-wrapper">

        {/* Section label */}
        <div className="about-label">
          <span className="section-number-inline">01</span>
          <span className="about-label-text">About</span>
        </div>

        {/* Editorial statement — large, bold, punchy */}
        <motion.h2
          className="about-statement"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-80px' }}
        >
          Building at the<br />
          <span className="about-statement-accent">AI frontier.</span>
        </motion.h2>

        {/* Body paragraph — smaller, lighter */}
        <motion.p
          className="about-body"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-80px' }}
        >
          Based at MAHE Bengaluru, I am an active developer dedicated to learning
          the modern AI stack. My technical foundation is built on C, C++, Java (OOPs),
          and Python — which I use in the world of LLMs and RAG.
          <br /><br />
          I thrive at the intersection of development and automation, frequently
          experimenting with local model deployment via Ollama and building AI agents
          with n8n. My focus is on creating optimised, AI-driven solutions that are
          as efficient as they are innovative.
        </motion.p>
      </div>
    </section>
  );
};

export default About;
