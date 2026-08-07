import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight, X, Eye } from 'lucide-react';
import TiltCard from './TiltCard';
import './Projects.css';
import { projectsData } from '../data/projects';

const CaseStudyViewer = lazy(() => import('./CaseStudyViewer'));

const CaseStudySkeleton = () => (
  <div className="case-study-skeleton" role="status" aria-label="Loading case study">
    <div className="skeleton-line skeleton-title" />
    <div className="skeleton-line skeleton-meta" />
    <div className="skeleton-image" />
    <div className="skeleton-line" />
    <div className="skeleton-line short" />
    <span className="sr-only">Loading case study content…</span>
  </div>
);

const ProjectCard = ({ project, setSelectedImage, setSelectedCaseStudy }) => {
  const imgBase = project.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '');

  return (
    <div className="project-card-wrapper">
      <div className="project-card-inner-container">
        <TiltCard className="project-card interactive-tag">
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
              <div className="browser-url-bar">{project.urlBar}</div>
              <div className="browser-tab"><Eye size={12} className="mr-1" /> {project.tabTag}</div>
            </div>
            <div className="browser-content">
              <picture>
                <source
                  srcSet={`/assets/optimized/${imgBase}-mobile.webp 800w, /assets/optimized/${imgBase}.webp 1600w`}
                  sizes="(max-width: 768px) 90vw, 45vw"
                  type="image/webp"
                />
                <img src={`/assets/optimized/${imgBase}.jpg`} alt={project.title} className="project-img" loading="lazy" />
              </picture>
              <div className="image-hover-overlay">
                <div className="click-to-view-badge">
                  <Eye size={20} className="mb-2" />
                  <span>Click to view</span>
                </div>
              </div>
            </div>
          </div>

          <div className="project-info-container">
            <h3 className="project-title">
              {project.title}
              {project.statusTag && (
                <span className="project-status-tag">{project.statusTag}</span>
              )}
            </h3>
            <p className="project-date">{project.date}</p>

            <p className="project-description">
              {project.description}
            </p>
            <button
              onClick={() => setSelectedCaseStudy(project)}
              className="read-more-link interactive-tag"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-block' }}
            >
              ↓ Read more
            </button>

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
                <ExternalLink size={16} /> View Code <ArrowRight size={16} className="ml-1" />
              </a>
              <button onClick={() => setSelectedCaseStudy(project)} className="action-btn secondary interactive-tag">
                <Eye size={16} /> Case Study <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </TiltCard>
      </div>
    </div>
  );
};

const Projects = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="projects" className="projects-section py-32 px-6 lg:px-16 container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="section-heading mb-16">
          <div className="section-heading-label">
            <span className="section-number-inline">03</span>
            <span className="about-label-text">Projects</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading tracking-tight">
            Featured <span className="text-accent underline-effect">Projects</span>.
          </h2>
          <p className="text-secondary text-sm font-mono uppercase tracking-widest max-w-2xl">
            Highlighting my latest work: AI research, security innovation, and full-stack development. All project images feature real screenshots of the active applications.
          </p>
        </div>

        <div className="projects-list flex flex-col gap-8 md:gap-16">
          {projectsData.map((project, index) => (
            <motion.div
              key={project.id || index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
                delay: Math.min(index * 0.08, 0.32),
              }}
            >
              <ProjectCard
                project={project}
                setSelectedImage={setSelectedImage}
                setSelectedCaseStudy={setSelectedCaseStudy}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

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
            <picture style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <source
                srcSet={`/assets/optimized/${selectedImage.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}-mobile.webp 800w, /assets/optimized/${selectedImage.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}.webp 1600w`}
                sizes="90vw"
                type="image/webp"
              />
              <motion.img
                src={`/assets/optimized/${selectedImage.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}.jpg`}
                alt="Fullscreen expanded project"
                className="fullscreen-img"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              />
            </picture>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCaseStudy && (
          <Suspense fallback={<CaseStudySkeleton />}>
            <CaseStudyViewer
              project={selectedCaseStudy}
              onClose={() => setSelectedCaseStudy(null)}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
