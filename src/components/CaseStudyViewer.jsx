/**
 * CaseStudyViewer.jsx
 * 
 * Renders the detailed case study manuscript for projects.
 * Uses Decoupled Motion Architecture to separate Framer Motion animation wrappers
 * from the static, GPU-accelerated backdrop blur panels (transform: translateZ(0)).
 * Includes hash routing deep link support and responsive TOC.
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, X } from 'lucide-react';
import DOMPurify from 'dompurify';
import './CaseStudyViewer.css';

/** @param {Array<{label: string, value: string}> | {accuracy?: string, cost?: string, scale?: string}} metrics */
const normalizeMetrics = (metrics) => {
  if (!metrics) return [];
  if (Array.isArray(metrics)) {
    return metrics.filter((item) => item?.label && item?.value);
  }
  return [
    metrics.accuracy && { label: 'Accuracy / Performance', value: metrics.accuracy },
    metrics.cost && { label: 'Cost', value: metrics.cost },
    metrics.scale && { label: 'Scale & Speed', value: metrics.scale },
  ].filter(Boolean);
};

const CaseStudyViewer = ({ project, onClose }) => {
  const [isImgZoomed, setIsImgZoomed] = useState(false);

  // Lock body scroll and root Lenis scrolling when open
  useEffect(() => {
    if (!project) return;
    const lenis = window.__lenis;
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';

    // Hash routing deep link support
    const originalHash = window.location.hash;
    window.history.replaceState(null, '', `#project-${project.id}`);
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = '';
      window.history.replaceState(null, '', originalHash || '#projects');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  const handleTocClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      // Smooth scroll within the overlay container scroll bounds
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!project) return null;

  const details = project.caseStudyDetails;
  const metricItems = details ? normalizeMetrics(details.metrics) : [];

  return (
    <>
      <motion.div 
        className="case-study-backdrop-animator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="case-study-backdrop" />
      </motion.div>
      <motion.div 
        className="case-study-overlay"
        data-lenis-prevent="true"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
      >
        {/* Floating close button for easy return without reloading */}
        <button onClick={onClose} className="case-study-close-btn" aria-label="Close Case Study">
          <X size={20} />
        </button>

        {/* Floating gradient orb specifically for the case study header matching the reference image */}
        <div className="case-study-gradient-bg"></div>

      <nav className="case-study-nav">
        <button onClick={onClose} className="back-btn interactive-tag">
          <ArrowLeft size={18} className="mr-2" /> Back to Portfolio
        </button>
        
        <a href={project.liveLink} target="_blank" rel="noreferrer" className="view-live-btn interactive-tag">
          GitHub <ExternalLink size={16} className="ml-1" />
        </a>
      </nav>

        <div className="case-study-layout">
          {/* Main Manuscript Area */}
          <main className="case-study-content">
            <header className="case-study-header">
              <h1 className="case-study-title">{project.title}</h1>
              <div className="case-study-meta">
                <span>Atharav Narang</span>
                <span className="separator">/</span>
                <span>{project.date}</span>
              </div>
            </header>

            <article className="case-study-article">
              {details ? (
                <>
                  <div id="overview" className="case-study-overview-grid">
                    {project.image && (
                      <div className="overview-item image-overview-item interactive-tag" onClick={() => setIsImgZoomed(true)}>
                        <h4>Project Preview</h4>
                        <div className="overview-image-wrapper">
                          <picture style={{ display: 'block', width: '100%', height: '100%' }}>
                            <source
                              srcSet={`/assets/optimized/${project.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}-mobile.webp 800w, /assets/optimized/${project.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}.webp 1600w`}
                              sizes="(max-width: 768px) 90vw, 45vw"
                              type="image/webp"
                            />
                            <img src={`/assets/optimized/${project.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}.jpg`} alt={project.title} className="overview-thumbnail" />
                          </picture>
                          <div className="overview-image-overlay">
                            <span className="view-text">Click to View</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="overview-item">
                      <h4>Role</h4>
                      <p>{details.role}</p>
                    </div>
                    <div className="overview-item">
                      <h4>Tech Stack</h4>
                      <p>{details.techStack}</p>
                    </div>
                    <div className="overview-item">
                      <h4>{details.localLLM ? "Local LLM" : "Platform"}</h4>
                      <p>{details.localLLM || details.platform}</p>
                    </div>
                  </div>

                  <p className="intro-text">
                    {details.problemLead}
                  </p>

                  <h2 id="problem">The Problem: {details.problemTitle}</h2>
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(details.problemText) }} />

                  <h2 id="solution">The Solution: {details.solutionTitle}</h2>
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(details.solutionText) }} />

                  <div id="features">
                    {details.features && details.features.map((feature, index) => (
                      <div key={index} className="feature-section">
                        <h3>{index + 1}. {feature.title}</h3>
                        <p>{feature.text}</p>
                        {feature.image && (
                          <figure className="case-study-img-container">
                            <picture>
                              <source
                                srcSet={`/assets/optimized/${feature.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}-mobile.webp 800w, /assets/optimized/${feature.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}.webp 1600w`}
                                sizes="(max-width: 768px) 90vw, 45vw"
                                type="image/webp"
                              />
                              <img src={`/assets/optimized/${feature.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}.jpg`} alt={feature.title} loading="lazy" />
                            </picture>
                            {feature.caption && <figcaption>{feature.caption}</figcaption>}
                          </figure>
                        )}
                      </div>
                    ))}
                  </div>

                  <h2 id="technical">Technical Implementation</h2>
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(details.technicalText) }} />

                  {details.techHighlights && (
                    <div className="tech-highlights">
                      {details.techHighlights.map((highlight, index) => (
                        <div key={index} className="tech-highlight-item">
                          <h4>{highlight.title}</h4>
                          <p>{highlight.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {details.pipeline && (
                    <div className="pipeline-section">
                      <h3>The Project Lifecycle:</h3>
                      <div className="pipeline-steps-vertical">
                        {details.pipeline.map((step, index) => (
                          <div key={index} className="pipeline-step">
                            <span className="step-number">{index + 1}</span>
                            <span className="step-text">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {details.deepIntegration && (
                    <div className="deep-integration">
                      {details.deepIntegration.map((item, index) => (
                        <div key={index} className="integration-item">
                          <h4>{item.title}</h4>
                          <p>{item.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {metricItems.length > 0 && (
                    <section id="impact" className="case-study-section impact-section">
                      <h2>Results</h2>
                      <div className="impact-content">
                        <div className="metrics-grid">
                          {metricItems.map((item, index) => (
                            <div key={index} className="metric-item">
                              <span className="metric-value">{item.value}</span>
                              <span className="metric-label">{item.label}</span>
                            </div>
                          ))}
                        </div>
                        {details.resultsNote && (
                          <p className="results-note">{details.resultsNote}</p>
                        )}
                      </div>
                    </section>
                  )}

                  {details.designPhilosophy && (
                    <>
                      <h2 id="design">Design Notes</h2>
                      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(details.designPhilosophy) }} />
                    </>
                  )}

                  {details.closingQuote && (
                    <blockquote className="case-study-quote">
                      "{details.closingQuote}"
                    </blockquote>
                  )}
                </>
              ) : (
                <div className="case-study-empty">
                  <p>Case study content coming soon. <a href={project.github}>View the repository →</a></p>
                </div>
              )}

              <hr className="article-divider" />
              
              <div className="article-footer">
                <p>
                  <em>Have questions about the technical implementation? Feel free to reach out on <a href="https://x.com/Atharav3602" className="underline hover:text-white">Twitter</a> or <a href="https://github.com/Atharav001" className="underline hover:text-white">GitHub</a>.</em>
                </p>
              </div>
            </article>
          </main>

          {/* Right Sidebar */}
          <aside className="case-study-sidebar">
            <div className="sticky-contents">
              <h4 className="contents-heading">CONTENTS</h4>
              <ul className="contents-list">
                {details ? (
                  <>
                    <li key="overview"><a href="#overview" onClick={(e) => handleTocClick(e, 'overview')}>Overview</a></li>
                    <li key="problem"><a href="#problem" onClick={(e) => handleTocClick(e, 'problem')}>The Problem</a></li>
                    <li key="solution"><a href="#solution" onClick={(e) => handleTocClick(e, 'solution')}>The Solution</a></li>
                    <li key="features"><a href="#features" onClick={(e) => handleTocClick(e, 'features')}>Key Features</a></li>
                    <li key="technical"><a href="#technical" onClick={(e) => handleTocClick(e, 'technical')}>Technical Details</a></li>
                    {metricItems.length > 0 && (
                      <li key="impact"><a href="#impact" onClick={(e) => handleTocClick(e, 'impact')}>Results</a></li>
                    )}
                    {details.designPhilosophy && (
                      <li key="design"><a href="#design" onClick={(e) => handleTocClick(e, 'design')}>Design Notes</a></li>
                    )}
                  </>
                ) : (
                  <>
                    <li key="overview"><a href="#overview" onClick={(e) => handleTocClick(e, 'overview')}>Overview</a></li>
                    <li key="technical"><a href="#technical" onClick={(e) => handleTocClick(e, 'technical')}>Architecture</a></li>
                    <li key="features"><a href="#features" onClick={(e) => handleTocClick(e, 'features')}>Generation Pipeline</a></li>
                    <li key="conclusion"><a href="#conclusion" onClick={(e) => handleTocClick(e, 'conclusion')}>Conclusion</a></li>
                  </>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </motion.div>

      {/* Fullscreen Image Modal Overlay for Case Study Hero Image */}
      <AnimatePresence>
        {isImgZoomed && (
          <motion.div
            className="fullscreen-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImgZoomed(false)}
            style={{ zIndex: 10001 }}
          >
            <button
              className="modal-close-btn"
              onClick={(e) => { e.stopPropagation(); setIsImgZoomed(false); }}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            <picture style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <source
                srcSet={`/assets/optimized/${project.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}-mobile.webp 800w, /assets/optimized/${project.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}.webp 1600w`}
                sizes="90vw"
                type="image/webp"
              />
              <motion.img
                src={`/assets/optimized/${project.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}.jpg`}
                alt="Fullscreen project preview"
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
    </>
  );
};

export default CaseStudyViewer;
