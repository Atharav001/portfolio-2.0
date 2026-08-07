import React, { useRef, useState } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import './Experience.css';

const Experience = () => {
  const timelineRef = useRef(null);
  const { scrollYProgress: timelineScroll } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });

  const [showJavaCert, setShowJavaCert] = useState(false);
  const [showSpaceLabCert, setShowSpaceLabCert] = useState(false);

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
      period: 'Summer 2026',
      role: 'Space Science & Systems Intern',
      company: 'India Space Lab',
      desc: 'Completed hands-on projects and training in Advanced Drone Technology, CanSat & CubeSat Satellite Programs, Rocketry Science, and Remote Sensing & GIS.',
    },
    {
      period: '2025 — Present',
      role: 'B.Tech CSE',
      company: 'Manipal Institute of Technology (MAHE), Bengaluru',
      desc: 'Specialising in AI-driven solutions, autonomous systems, and full-stack development.',
    },
  ];

  return (
    <section id="experience" className="experience-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="section-header">
          <span className="section-number-inline">02</span>
          <h2 className="section-title">BACKGROUND</h2>
        </div>

        <div className="experience-grid">
          <div className="experience-column">
            <h3 className="column-title">Journey</h3>
            <div className="timeline" ref={timelineRef}>
              <div className="timeline-line-container">
                <div className="timeline-line-track" />
                <motion.div
                  className="timeline-line-progress"
                  style={{ scaleY: timelineScroll }}
                />
              </div>
              {education.map((item, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot-container">
                    <div className="timeline-dot-outer">
                      <div className="timeline-dot-inner" />
                    </div>
                  </div>
                  <div className="timeline-period">{item.period}</div>
                  <h4 className="timeline-role">{item.role}</h4>
                  <div className="timeline-company">{item.company}</div>
                  <p className="timeline-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="experience-column">
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

            <div className="certifications-section-sidebar">
              <span className="skill-group-label certifications-label">
                Certifications
              </span>
              <div className="certifications-list">

                <div
                  className="cert-card space-lab interactive-tag"
                  onClick={() => setShowSpaceLabCert(true)}
                  title="Click to view certificate"
                >
                  <div className="cert-badge space-tech">Space Tech</div>
                  <div className="cert-info">
                    <h4 className="cert-name">India Space Lab Summer Internship</h4>
                    <span className="cert-action-hint">Click to view certificate</span>
                  </div>
                </div>

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

                <div className="cert-card ml-specialization cert-card-in-progress">
                  <div className="cert-badge deeplearning">deeplearning.ai</div>
                  <div className="cert-info">
                    <h4 className="cert-name">Machine Learning Specialisation</h4>
                    <span className="cert-status-badge">In progress</span>
                    <div className="cert-subcourses">
                      <span className="subcourse">Supervised Machine Learning</span>
                      <span className="subcourse">Advanced Learning Algorithms</span>
                      <span className="subcourse">Unsupervised, Recommenders, RL</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSpaceLabCert && (
          <motion.div
            className="cert-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSpaceLabCert(false)}
          >
            <motion.div
              className="cert-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="cert-modal-close" onClick={() => setShowSpaceLabCert(false)}>×</button>
              <picture>
                <source
                  srcSet="/assets/optimized/india_space_lab_certificate-mobile.webp 800w, /assets/optimized/india_space_lab_certificate.webp 1600w"
                  sizes="(max-width: 768px) 90vw, 45vw"
                  type="image/webp"
                />
                <img
                  src="/assets/optimized/india_space_lab_certificate.jpg"
                  alt="India Space Lab Internship Certificate"
                  className="cert-modal-image"
                  loading="lazy"
                />
              </picture>
              <div className="cert-modal-footer">
                <div className="cert-modal-footer-header">
                  <h3>India Space Lab Summer Internship</h3>
                  <a
                    href="/assets/india_space_lab_certificate.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-pdf-btn"
                  >
                    View Original PDF
                  </a>
                </div>
                <p>Summer Internship & Technical Training Program 2026. Specialised in Advanced Drone Technology, CanSat & CubeSat Satellite Programs, Rocketry Science, Remote Sensing & GIS, and Disaster Management.</p>
              </div>
            </motion.div>
          </motion.div>
        )}

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
