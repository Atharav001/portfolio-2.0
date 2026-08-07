import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  const tools = ["Ollama", "FAISS", "BM25", "n8n", "Room DB", "Kotlin", "Cursor IDE"];

  return (
    <section id="about" className="about-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="about-wrapper">
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
              I am a second-year B.Tech Computer Science student at Manipal Institute of Technology, Bengaluru. I am a tech enthusiast who learns by building—local LLMs, Android apps, browser extensions, and the occasional hackathon pipeline.
              <br /><br />
              Most of my work sits at the intersection of AI systems and software engineering: RAG with FAISS and BM25, agentic workflows, and tools that run locally instead of relying on paid APIs. I pick up new stacks when a project needs them and ship until it works.
            </motion.p>

            <div className="about-tools-container">
              <h4 className="tools-title">Tools I reach for often</h4>
              <div className="tools-cloud">
                {tools.map((tool) => (
                  <span key={tool} className="tool-chip">{tool}</span>
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
