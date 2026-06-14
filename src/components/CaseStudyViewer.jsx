import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, X } from 'lucide-react';
import './CaseStudyViewer.css';

const CaseStudyViewer = ({ project, onClose }) => {
  const [isImgZoomed, setIsImgZoomed] = useState(false);

  // Lock body scroll when open
  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = 'hidden';
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

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
        {/* Floating gradient orb specifically for the case study header matching the reference image */}
        <div className="case-study-gradient-bg"></div>

      <nav className="case-study-nav">
        <button onClick={onClose} className="back-btn interactive-tag">
          <ArrowLeft size={18} className="mr-2" /> Back to Portfolio
        </button>
        
        <a href={project.liveLink} target="_blank" rel="noreferrer" className="view-live-btn interactive-tag">
          View Live <ExternalLink size={16} className="ml-1" />
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
                <span className="read-time">5 min read</span>
              </div>
            </header>

            <article className="case-study-article">
              {project.caseStudyDetails ? (
                <>
                  <div id="overview" className="case-study-overview-grid">
                    {project.image && (
                      <div className="overview-item image-overview-item interactive-tag" onClick={() => setIsImgZoomed(true)}>
                        <h4>Project Preview</h4>
                        <div className="overview-image-wrapper">
                          <img src={project.image} alt={project.title} className="overview-thumbnail" />
                          <div className="overview-image-overlay">
                            <span className="view-text">Click to View</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="overview-item">
                      <h4>Role</h4>
                      <p>{project.caseStudyDetails.role}</p>
                    </div>
                    <div className="overview-item">
                      <h4>Tech Stack</h4>
                      <p>{project.caseStudyDetails.techStack}</p>
                    </div>
                    <div className="overview-item">
                      <h4>{project.caseStudyDetails.localLLM ? "Local LLM" : "Platform"}</h4>
                      <p>{project.caseStudyDetails.localLLM || project.caseStudyDetails.platform}</p>
                    </div>
                  </div>

                  <p className="intro-text">
                    {project.caseStudyDetails.problemLead}
                  </p>

                  <h2 id="problem">🧠 The Problem: {project.caseStudyDetails.problemTitle}</h2>
                  <div dangerouslySetInnerHTML={{ __html: project.caseStudyDetails.problemText }} />

                  <h2 id="solution">💡 The Solution: {project.caseStudyDetails.solutionTitle}</h2>
                  <div dangerouslySetInnerHTML={{ __html: project.caseStudyDetails.solutionText }} />

                  <div id="features">
                    {project.caseStudyDetails.features && project.caseStudyDetails.features.map((feature, index) => (
                      <div key={index} className="feature-section">
                        <h3>{index + 1}. {feature.title}</h3>
                        <p>{feature.text}</p>
                        {feature.image && (
                          <figure className="case-study-img-container">
                            <img src={feature.image} alt={feature.title} />
                            {feature.caption && <figcaption>{feature.caption}</figcaption>}
                          </figure>
                        )}
                      </div>
                    ))}
                  </div>

                  <h2 id="technical">🛠️ Technical Implementation</h2>
                  <div dangerouslySetInnerHTML={{ __html: project.caseStudyDetails.technicalText }} />

                  {project.caseStudyDetails.techHighlights && (
                    <div className="tech-highlights">
                      {project.caseStudyDetails.techHighlights.map((highlight, index) => (
                        <div key={index} className="tech-highlight-item">
                          <h4>{highlight.title}</h4>
                          <p>{highlight.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {project.caseStudyDetails.pipeline && (
                    <div className="pipeline-section">
                      <h3>The Tracking Lifecycle:</h3>
                      <div className="pipeline-steps-vertical">
                        {project.caseStudyDetails.pipeline.map((step, index) => (
                          <div key={index} className="pipeline-step">
                            <span className="step-number">{index + 1}</span>
                            <span className="step-text">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.caseStudyDetails.deepIntegration && (
                    <div className="deep-integration">
                      {project.caseStudyDetails.deepIntegration.map((item, index) => (
                        <div key={index} className="integration-item">
                          <h4>{item.title}</h4>
                          <p>{item.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <h2 id="design">💡 Design Philosophy & Takeaways</h2>
                  <div dangerouslySetInnerHTML={{ __html: project.caseStudyDetails.designPhilosophy }} />

                  <blockquote className="case-study-quote">
                    "{project.caseStudyDetails.closingQuote}"
                  </blockquote>
                </>
              ) : (
                <>
                  <p id="overview" className="intro-text">
                    {project.description}
                  </p>

                  <h2>The Vision Behind The Project</h2>
                  <p>
                    The digital content landscape is evolving rapidly. Content creators, marketers, and developers all need high-quality data workflows, but traditional pipelines are expensive and time-consuming. This project was born from a simple question: What if anyone could automate professional-quality tasks in minutes?
                  </p>

                  {/* SCREENSHOT PLACEHOLDER 1 */}
                  <figure className="case-study-hero-img placeholder-screenshot">
                    <div className="screenshot-inner-bounds">
                      <span className="placeholder-text">Screenshot: Upload Vision / Dashboard Interface</span>
                    </div>
                  </figure>

                  <h2 id="technical">Technical Architecture</h2>
                  <p>
                    Building this platform has been an incredible journey through the cutting edge of AI synthesis and robust web development architectures. 
                  </p>
                  
                  <ul className="tech-stack-list">
                    {project.technologies.map((tech, i) => (
                      <li key={i}>{tech}</li>
                    ))}
                  </ul>

                  <h3 id="features">Simplified Generation Pipeline</h3>
                  <p>The core of the logic scales flawlessly across these critical steps:</p>

                  <div className="pipeline-steps">
                    <h4>Step 1: Face Detection & Alignment</h4>
                    <p>Ensuring semantic accuracy through specialized vector mappings.</p>
                    
                    {/* SCREENSHOT PLACEHOLDER 2 */}
                    <figure className="case-study-hero-img placeholder-screenshot">
                      <div className="screenshot-inner-bounds">
                        <span className="placeholder-text">Screenshot: Detection Nodes / Code Snippet</span>
                      </div>
                    </figure>

                    <h4>Step 2: Audio Analysis & Expression</h4>
                    <p>Binding audio transcription and syncing directly to synthesized visual layers.</p>
                  </div>

                  <h3 id="conclusion">Conclusion</h3>
                  <p>
                    Whether you're an engineer looking to scale output or a business needing custom logic layers, this architecture makes the most complex logic pipelines accessible to everyone. Visit the repository or live site to interact directly with the systems built.
                  </p>
                </>
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
                {project.caseStudyDetails ? (
                  <>
                    <li key="overview"><a href="#overview" onClick={(e) => { e.preventDefault(); document.getElementById('overview').scrollIntoView({ behavior: 'smooth' }); }}>Overview</a></li>
                    <li key="problem"><a href="#problem" onClick={(e) => { e.preventDefault(); document.getElementById('problem').scrollIntoView({ behavior: 'smooth' }); }}>The Problem</a></li>
                    <li key="solution"><a href="#solution" onClick={(e) => { e.preventDefault(); document.getElementById('solution').scrollIntoView({ behavior: 'smooth' }); }}>The Solution</a></li>
                    <li key="features"><a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features').scrollIntoView({ behavior: 'smooth' }); }}>Key Features</a></li>
                    <li key="technical"><a href="#technical" onClick={(e) => { e.preventDefault(); document.getElementById('technical').scrollIntoView({ behavior: 'smooth' }); }}>Technical Details</a></li>
                    <li key="design"><a href="#design" onClick={(e) => { e.preventDefault(); document.getElementById('design').scrollIntoView({ behavior: 'smooth' }); }}>Design Philosophy</a></li>
                  </>
                ) : (
                  <>
                    <li key="overview"><a href="#overview" onClick={(e) => { e.preventDefault(); document.getElementById('overview').scrollIntoView({ behavior: 'smooth' }); }}>Overview</a></li>
                    <li key="technical"><a href="#technical" onClick={(e) => { e.preventDefault(); document.getElementById('technical').scrollIntoView({ behavior: 'smooth' }); }}>Architecture</a></li>
                    <li key="features"><a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features').scrollIntoView({ behavior: 'smooth' }); }}>Generation Pipeline</a></li>
                    <li key="conclusion"><a href="#conclusion" onClick={(e) => { e.preventDefault(); document.getElementById('conclusion').scrollIntoView({ behavior: 'smooth' }); }}>Conclusion</a></li>
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
            <motion.img
              src={project.image}
              alt="Fullscreen project preview"
              className="fullscreen-img"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CaseStudyViewer;
