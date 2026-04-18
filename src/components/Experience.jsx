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

  const skills = [
    "Python", "Java", "oops", "C/C++", "Rag", "Data Visualization", "Prompt Engineering", "ML"
  ];

  const education = [
    {
      period: "2023 — Present",
      role: "Student",
      company: "Manipal Institute of Technology (MAHE), Bengaluru",
      desc: "Immersed in tech, specializing in AI-driven solutions and autonomous systems."
    }
  ];

  return (
    <section id="experience" className="experience-section" ref={ref}>
      <div className="section-header">
        <h2 className="section-title">BACKGROUND</h2>
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
           <div className="skills-container">
             {skills.map((skill, index) => (
               <div key={index} className="skill-pill interactive-tag">
                 {skill}
               </div>
             ))}
           </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
