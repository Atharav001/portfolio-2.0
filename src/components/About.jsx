import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  const tools = ["Python", "Ollama", "n8n", "Docker", "Git", "Cursor IDE", "FAISS", "BM25", "Room DB", "React", "Kotlin"];

  return (
    <section id="about" className="about-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="about-wrapper">
          {/* Section label */}
          <div className="about-label">
            <span className="section-number-inline">01</span>
            <span className="about-label-text">About Me</span>
          </div>

          <div className="about-simple-layout">
            <motion.h2
              className="about-statement"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: '-80px' }}
            >
              Building and learning at the<br />
              <span className="about-statement-accent">AI frontier.</span>
            </motion.h2>

            <motion.p
              className="about-body"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: '-80px' }}
            >
              I am an AI Systems Engineer and software developer. I focus on building and experimenting with local intelligence systems, integrating local models (via Ollama) and vector/lexical retrieval methods (FAISS, BM25) to design responsive applications.
              <br /><br />
              I enjoy bridging traditional software concepts with modern automation. Whether developing digital wellness tools or experimenting with claims validation ideas, I am constantly learning, optimizing, and exploring new ways to design reliable systems.
            </motion.p>

            <div className="about-tools-container">
              <h4 className="tools-title">Technologies & Frameworks I Experiment With</h4>
              <div className="tools-cloud">
                {tools.map((tool, idx) => (
                  <span key={idx} className="tool-chip">{tool}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
