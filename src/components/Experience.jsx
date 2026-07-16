import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import './Experience.css';

const Experience = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const [showJavaCert, setShowJavaCert] = useState(false);
  const [hoveredMl, setHoveredMl] = useState(false);

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const skillGroups = [
    {
      label: 'Languages',
      skills: ['Python', 'Java', 'C/C++', 'JavaScript', 'SQL'],
    },
    {
      label: 'AI / ML / Workflows',
      skills: ['Machine Learning', 'RAG', 'Prompt Engineering', 'Local LLMs & Ollama', 'n8n Automation'],
    },
    {
      label: 'Developer Tools & Platforms',
      skills: ['Git/GitHub', 'Docker', 'Linux', 'Android SDK', 'Data Visualization'],
    },
  ];

  const education = [
    {
      period: '2025 — Present',
      role: 'B.Tech CSE',
      company: 'Manipal Institute of Technology (MAHE), Bengaluru',
      desc: 'Specialising in AI-driven solutions, autonomous systems, and full-stack development.',
    },
  ];

  const handleMlClick = () => {
    window.open('https://www.deeplearning.ai/specializations/machine-learning', '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="experience" className="experience-section" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="section-header">
          <span className="section-number-inline">02</span>
          <h2 className="section-title scroll-reveal">BACKGROUND</h2>
        </div>

        <div className="experience-grid">
          {/* Left Column: Journey / Education only */}
          <motion.div style={{ y: y1 }} className="experience-column">
            <h3 className="column-title">Journey</h3>
            <div className="timeline">
              {education.map((item, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-period">{item.period}</div>
                  <h4 className="timeline-role">{item.role}</h4>
                  <div className="timeline-company">{item.company}</div>
                  <p className="timeline-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Core Capabilities AND Certifications */}
          <motion.div style={{ y: y2 }} className="experience-column">
            <h3 className="column-title">Core Capabilities</h3>
            <div className="skills-groups">
              {skillGroups.map((group) => (
                <div key={group.label} className="skill-group">
                  <span className="skill-group-label">{group.label}</span>
                  <div className="skills-container">
                    {group.skills.map((skill) => (
                      <div key={skill} className="skill-pill interactive-tag">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Compact Certifications Section placed directly under Capabilities */}
            <div className="certifications-section-sidebar">
              <span className="skill-group-label" style={{ display: 'block', marginTop: '3.5rem', marginBottom: '1.25rem' }}>
                Certifications
              </span>
              <div className="certifications-list">
                
                <div 
                  className="cert-card ibm-java interactive-tag" 
                  onClick={() => setShowJavaCert(true)}
                  title="Click to view certificate"
                >
                  <div className="cert-badge">IBM</div>
                  <div className="cert-info">
                    <h4 className="cert-name">IBM SkillBuilder JAVA</h4>
                    <span className="cert-action-hint">Click to view certificate</span>
                  </div>
                </div>

                <div 
                  className="cert-card ml-specialization interactive-tag"
                  onMouseEnter={() => setHoveredMl(true)}
                  onMouseLeave={() => setHoveredMl(false)}
                  onClick={handleMlClick}
                >
                  <div className="cert-badge deeplearning">deeplearning.ai</div>
                  <div className="cert-info">
                    <h4 className="cert-name">Machine Learning Specialisation</h4>
                    <div className="cert-subcourses">
                      <span className="subcourse">Supervised Machine Learning</span>
                      <span className="subcourse">Advanced Learning Algorithms</span>
                      <span className="subcourse">Unsupervised, Recommenders, RL</span>
                    </div>
                    
                    <AnimatePresence>
                      {hoveredMl && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="cert-membership-notice"
                        >
                          ⚠️ Some certificates might not be available due to Membership plans. Click to view details.
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Lightbox Certificate Modal */}
      <AnimatePresence>
        {showJavaCert && (
          <motion.div 
            className="cert-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowJavaCert(false)}
          >
            <motion.div 
              className="cert-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="cert-modal-close" onClick={() => setShowJavaCert(false)}>×</button>
              <picture>
                <source
                  srcSet="/assets/optimized/ibm_java_certificate-mobile.webp 800w, /assets/optimized/ibm_java_certificate.webp 1600w"
                  sizes="(max-width: 768px) 90vw, 45vw"
                  type="image/webp"
                />
                <img 
                  src="/assets/optimized/ibm_java_certificate.jpg" 
                  alt="IBM SkillsBuild JAVA Certificate" 
                  className="cert-modal-image"
                  loading="lazy"
                />
              </picture>
              <div className="cert-modal-footer">
                <h3>IBM SkillsBuild JAVA Certificate</h3>
                <p>Successfully completed Java programming certification powered by IBM SkillsBuild.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Experience;
