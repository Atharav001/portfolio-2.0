import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-wrapper">
        <motion.p 
          className="about-headline"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Based at MAHE Bengaluru, I am an active developer dedicated to learning the modern AI stack. My technical foundation is built on C, C++, Java (OOPs), and Python, which I use in the world of LLMs and RAG.
          <br /><br />
          I thrive in the intersection of development and automation, frequently experimenting with local model deployment via Ollama and building AI agents with n8n. My focus is on creating optimized, AI-driven solutions that are as efficient as they are innovative.
        </motion.p>
      </div>
    </section>
  );
};

export default About;
