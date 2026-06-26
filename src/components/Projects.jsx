import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, ArrowRight, X, Eye } from 'lucide-react';
import TiltCard from './TiltCard';
import './Projects.css';
import { projectsData } from '../data/projects';

// Lazy-load CaseStudyViewer to split chunk bundle size
const CaseStudyViewer = lazy(() => import('./CaseStudyViewer'));

// Skeleton loading component for CaseStudyViewer fallback
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

const ProjectCardWrapper = ({
  project,
  index,
  totalProjects,
  isDesktop,
  setSelectedImage,
  setSelectedCaseStudy
}) => {
  const containerRef = useRef(null);

  // Staggered top offset for sticky cards (e.g. 100px, 140px, 180px, 220px)
  const stickyTop = 100 + index * 40;

  // Track the scroll progress of the individual card wrapper
  // It starts when the top of the wrapper hits its sticky threshold, and ends when it scrolls completely out
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: [`start ${stickyTop}px`, "end start"]
  });

  // Calculate targetScale: earlier cards scale down to add depth, e.g. Card 0 goes to 0.88, Card 3 stays at 1.00
  const targetScale = 1 - ((totalProjects - 1 - index) * 0.04);

  // Transform scale and opacity dynamically based on scroll progress
  const scaleTransform = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const opacityTransform = useTransform(scrollYProgress, [0, 1], [1, 0.65]);

  const scale = isDesktop ? scaleTransform : 1;
  const opacity = isDesktop ? opacityTransform : 1;

  return (
    <div
      ref={containerRef}
      className="project-card-wrapper"
      style={{
        position: isDesktop ? "sticky" : "relative",
        top: isDesktop ? `${stickyTop}px` : "auto",
        zIndex: index + 1
      }}
    >
      <motion.div
        style={{ scale, opacity }}
        className="project-card-inner-container"
      >
        <TiltCard
          className="project-card interactive-tag"
          animationProps={!isDesktop ? {
            initial: { y: 30, opacity: 0 },
            whileInView: { y: 0, opacity: 1 },
            viewport: { once: true, margin: '-50px' },
            transition: { duration: 0.5 },
          } : {}}
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
              <div className="browser-url-bar">{project.urlBar}</div>
              <div className="browser-tab"><Eye size={12} className="mr-1" /> {project.tabTag}</div>
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
      </motion.div>
    </div>
  );
};

const Projects = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [isDesktop, setIsDesktop] = useState(true);

  // Monitor media queries to disable sticky/scale logic on mobile safely
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 993px)');
    const handleMediaChange = (e) => setIsDesktop(e.matches);
    
    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading tracking-tight scroll-reveal">
            Featured <span className="text-accent underline-effect">Projects</span>.
          </h2>
          <p className="text-secondary text-sm font-mono uppercase tracking-widest max-w-2xl scroll-reveal">
            Highlighting my latest work: AI research, security innovation, and full-stack development. All project images feature real screenshots of the active applications.
          </p>
        </div>

        <div className="projects-list flex flex-col gap-8 md:gap-16">
          {projectsData.map((project, index) => (
            <motion.div
              key={project.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: Math.min(index * 0.1, 0.4),
              }}
            >
              <ProjectCardWrapper
                project={project}
                index={index}
                totalProjects={projectsData.length}
                isDesktop={isDesktop}
                setSelectedImage={setSelectedImage}
                setSelectedCaseStudy={setSelectedCaseStudy}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

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
