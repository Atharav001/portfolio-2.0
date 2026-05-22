import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Experience.css';

const Experience = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const skillGroups = [
    {
      label: 'Languages',
      skills: ['Python', 'Java', 'C/C++', 'OOPs'],
    },
    {
      label: 'AI / ML',
      skills: ['Machine Learning', 'RAG', 'Prompt Engineering', 'Local LLMs'],
    },
    {
      label: 'Tools',
      skills: ['n8n', 'Ollama', 'Data Visualization', 'Android (Kotlin)'],
    },
  ];

  const education = [
    {
      period: '2023 — Present',
      role: 'B.Tech CSE',
      company: 'Manipal Institute of Technology (MAHE), Bengaluru',
      desc: 'Specialising in AI-driven solutions, autonomous systems, and full-stack development.',
    },
  ];

  return (
    <section id="experience" className="experience-section" ref={ref}>
      <div className="section-header">
        <span className="section-number-inline">02</span>
        <h2 className="section-title scroll-reveal">BACKGROUND</h2>
      </div>

      <div className="experience-grid">
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
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
