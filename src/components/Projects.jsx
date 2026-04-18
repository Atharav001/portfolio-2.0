import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight, X, Eye } from 'lucide-react';
import CaseStudyViewer from './CaseStudyViewer';
import './Projects.css';

const projectsData = [
  {
    id: 1,
    title: 'Scroller\'s Dashboard Analytics',
    date: 'February 2025 - March 2025',
    description: 'A comprehensive operational dashboard to help scrollers manage and deeply analyze real-time streaming interaction datasets via predictive AI models.',
    image: '/assets/dashboard.png',
    readMore: '#',
    technologies: ['React', 'D3.js', 'PostgreSQL', 'Express'],
    liveLink: 'https://github.com/Atharav001',
    caseStudy: '#'
  },
  {
    id: 2,
    title: 'Voice2Web - Intelligent Interface Maker',
    date: 'April 2025 - Present',
    description: 'Voice2Web is an AI-powered conversational builder platform that automatically generates web interfaces from spoken commands using highly optimized LLM routing logic.',
    image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=1600',
    readMore: '#',
    technologies: ['Next.js', 'React', 'OpenAI', 'TailwindCSS/CSS'],
    liveLink: 'https://github.com/Atharav001',
    caseStudy: '#'
  }
];

const Projects = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="projects" className="projects-section py-32 px-6 lg:px-16 container mx-auto">
      <div className="section-heading mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading tracking-tight">
          Featured <span className="text-accent underline-effect">Projects</span>.
        </h2>
        <p className="text-secondary text-sm font-mono uppercase tracking-widest max-w-2xl">
          Highlighting my latest work: AI research, security innovation, and full-stack development.
        </p>
      </div>

      <div className="projects-list flex flex-col gap-8 md:gap-16">
        {projectsData.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="project-card interactive-tag"
          >
            {/* LEFT: Mac Browser Frame Image */}
            <div 
              className="project-image-container group" 
              onClick={() => setSelectedImage(project.image)}
            >
              <div className="browser-header">
                <div className="browser-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="browser-url-bar">{project.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</div>
                <div className="browser-tab"><Eye size={12} className="mr-1" /> App</div>
              </div>
              <div className="browser-content">
                <img src={project.image} alt={project.title} className="project-img" loading="lazy" />
                
                {/* Hover Reveal: Click to View */}
                <div className="image-hover-overlay">
                  <div className="click-to-view-badge">
                    <Eye size={20} className="mb-2" />
                    <span>Click to view</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Project Info */}
            <div className="project-info-container">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-date">{project.date}</p>
              
              <p className="project-description">
                {project.description}
              </p>
              <a href={project.readMore} className="read-more-link">
                ↓ Read more
              </a>

              <div className="technologies-section">
                <h4 className="tech-heading">TECHNOLOGIES</h4>
                <div className="tech-tags">
                  {project.technologies.map(tech => (
                    <span key={tech} className="tech-badge focus-pill">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="project-actions">
                <a href={project.liveLink} target="_blank" rel="noreferrer" className="action-btn primary interactive-tag">
                  <ExternalLink size={16} /> View Live <ArrowRight size={16} className="ml-1" />
                </a>
                <button onClick={() => setSelectedCaseStudy(project)} className="action-btn secondary interactive-tag">
                  <Eye size={16} /> Case Study <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Image Modal Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fullscreen-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="modal-close-btn"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            <motion.img 
              src={selectedImage} 
              alt="Fullscreen expanded project" 
              className="fullscreen-img"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <CaseStudyViewer 
        project={selectedCaseStudy} 
        onClose={() => setSelectedCaseStudy(null)} 
      />
    </section>
  );
};

export default Projects;
