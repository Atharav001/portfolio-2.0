import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, ArrowRight, X, Eye } from 'lucide-react';
import CaseStudyViewer from './CaseStudyViewer';
import TiltCard from './TiltCard';
import './Projects.css';

const projectsData = [
  {
    id: 1,
    title: "Scroller's Dashboard",
    date: "February 2025 - March 2025",
    description: "A high-performance digital wellness application that tracks every single swipe to break the cycle of doom-scrolling through real-time interventions.",
    image: "/assets/scrollers_dashboard_mockup.png",
    readMore: "#",
    technologies: ["Native Android", "Kotlin", "AccessibilityService", "Room DB"],
    liveLink: "https://github.com/Atharav001/shortform-usage-sentinel",
    urlBar: "github.com/Atharav001/shortform-usage-sentinel",
    tabTag: "App",
    caseStudy: "#",
    caseStudyDetails: {
      role: "Android Developer & UI/UX Designer",
      techStack: "Native Android, Kotlin, AccessibilityService API, Room Database (SQLite), UsageStatsManager API",
      platform: "Android 6.0+",
      problemLead: "Short-form video platforms like Instagram Reels and YouTube Shorts are engineered to hijack our attention. A 'quick 5-minute break' often spirals into hundreds of videos consumed without a single conscious decision.",
      problemTitle: "The Illusion of Passive Consumption",
      problemText: "Existing screen-time apps fall short because they only measure duration. They can tell you that you spent 45 minutes on Instagram, but they don't capture the depth of the rabbit hole. They measure the clock, not the behavior.<br/><br/>I realized that to actually break the cycle of 'doom-scrolling,' I needed an intervention that measured the physical act of scrolling itself.",
      solutionTitle: "A Digital Conscience",
      solutionText: "Scroller's Dashboard is a high-performance digital wellness application built for intentional living. Instead of simply locking you out of your apps, it tracks every single swipe and creates a 'pattern interrupt.' It forces you to confront exactly how much content you are consuming in real-time, placing your daily goals right next to your scroll count.<br/><br/>It doesn't tell you to stop; it asks you if you really want to continue.",
      features: [
        {
          title: "Precision Scroll Tracking",
          text: "Unlike traditional digital wellbeing tools, Scroller's Dashboard counts every single Reel and Short. It doesn't merely know the app is open—it analyzes the screen to count each individual flick.",
          image: "/assets/scrollers_dashboard_main.png",
          caption: "The main dashboard showing live scroll counts, 3-day trend indicators, and current streak."
        },
        {
          title: "The Pattern Interrupt (Real-Time Intervention)",
          text: "This is the core of the application. When a user hits their pre-configured scroll limit (e.g., 50 Reels), a glassmorphic overlay is drawn directly over the feed. It makes the alert impossible to ignore without being entirely destructive to the UX.",
          image: "/assets/scrollers_dashboard_alert.png",
          caption: "The real-time intervention screen interrupting an active Instagram Reel session."
        },
        {
          title: "Psychological Redirection via Goal Sync",
          text: "Instead of a generic warning message, the intervention screen displays the user's synced To-Do List and Daily Habits. By placing long-term goals side-by-side with short-term consumption, it creates a moment of mindfulness. Users are given a choice: quit and take a break, or consciously choose to keep scrolling.",
          image: "/assets/scrollers_dashboard_goals.png",
          caption: "The Goal and Habit trackers. Tasks can be added mid-scroll and immediately sync back to the main dashboard."
        },
        {
          title: "Advanced Analytics & Privacy",
          text: "A command center for digital health that includes visual trends and a streak system to gamify intentional living. Because this involves personal behavioral data, the app operates with a 100% local storage architecture.",
          image: "/assets/scrollers_dashboard_analytics.png",
          caption: "The History tab showing past usage and averages, gatekept by biometric security for privacy."
        }
      ],
      technicalText: "Building Scroller's Dashboard required deep integration with Android's system-level APIs to ensure accurate, real-time tracking without draining the device's battery.",
      techHighlights: [
        {
          title: "The Core Engine: AccessibilityService",
          text: "At the heart of the application is the ScrollerAccessibilityService. When active, it listens to UI events specifically within Instagram and YouTube. I built custom trackers (InstagramTracker and YouTubeTracker) that analyze screen height and touch events to detect valid swipe gestures, incrementing the count only when a new video is actually loaded."
        },
        {
          title: "Data Verification via UsageStatsManager",
          text: "To ensure the data is airtight, the background service periodically syncs with Android's UsageStatsManager. This guarantees that the total screen-time displayed inside the app matches the operating system's official records perfectly."
        }
      ],
      pipeline: [
        "User Swipes",
        "AccessibilityService captures the event",
        "Custom Tracker validates the scroll gesture",
        "Scroll count is incremented locally",
        "System UsageStatsManager sync is applied"
      ],
      deepIntegration: [
        {
          title: "Seamless Interventions & Local Architecture",
          text: "Overlays: Utilized Android's SYSTEM_ALERT_WINDOW (TYPE_APPLICATION_OVERLAY) permission to trigger the real-time glassmorphic interventions exactly when the limit is breached."
        },
        {
          title: "Database",
          text: "All swipe events, tasks, habits, and analytics are handled locally via a Room Database. There are no cloud servers, ensuring absolute user privacy and zero network latency."
        },
        {
          title: "Optimization",
          text: "The background engine is strictly optimized to wake up and process data only when the target packages (Instagram/YouTube) are in the foreground, ensuring negligible battery impact."
        }
      ],
      designPhilosophy: "When designing the UI, I leaned into modern aesthetics—specifically utilizing Glassmorphism for the overlay—to make the intervention feel like a seamless part of the OS rather than a clunky third-party block.<br/><br/>The biggest takeaway from building this project was realizing that friction is a feature. By introducing a momentary pause in an otherwise infinitely frictionless feed, user behavior completely changes.",
      closingQuote: "Every reel you watch is a choice. This app just makes sure it's actually a choice."
    }
  },
  {
    id: 2,
    title: "AI Support Triage Agent",
    date: "May 2026",
    description: "A terminal-based AI support triage agent for the HackerRank Orchestrate hackathon, utilizing local LLMs and RAG to process support tickets with deterministic behavior and local grounding.",
    image: "/assets/ai_support_triage.png",
    readMore: "#",
    technologies: ["Python", "Local LLM", "OpenAI", "RAG", "Terminal-based"],
    liveLink: "https://github.com/Atharav001/AI-Support-Triage-Agent",
    urlBar: "github.com/Atharav001/AI-Support-Triage-Agent",
    tabTag: "Terminal",
    caseStudy: "#",
    caseStudyDetails: {
      role: "AI/Backend Developer",
      techStack: "Python, Local LLMs, OpenAI API, Retrieval-Augmented Generation (RAG), Terminal/CLI",
      platform: "Terminal-based / Desktop",
      problemLead: "Support teams are often overwhelmed by the sheer volume of incoming tickets. The challenge was to build an automated, deterministically reliable system that could triage these requests locally without relying on external APIs, ensuring strict privacy and fast response times.",
      problemTitle: "The Need for Localized AI Triage",
      problemText: "Cloud-based AI models pose privacy risks and latency issues for sensitive support ticket data. We needed a solution that was fully grounded in a local corpus, avoiding hallucinations and maintaining a strict deterministic behavior for consistent ticket categorization and response generation.",
      solutionTitle: "Terminal-Based RAG System",
      solutionText: "We developed a terminal-based support triage agent for the HackerRank Orchestrate hackathon. It utilizes a Retrieval-Augmented Generation (RAG) architecture powered by a local LLM. It ingests support tickets, retrieves relevant context from a localized knowledge base, and deterministically outputs the correct categorization, priority, and suggested response—all entirely locally.",
      features: [
        {
          title: "Strict Local Grounding",
          text: "The agent strictly relies on the provided local corpus, ensuring that its responses and predictions are factual and directly related to the organization's knowledge base, effectively eliminating hallucinations.",
          image: "/assets/ai_support_triage.png",
          caption: "Terminal output showing the RAG process and deterministic predictions."
        },
        {
          title: "Deterministic Behavior",
          text: "Engineered to provide consistent and reproducible outputs for identical inputs, an essential requirement for reliable automated support triage.",
          image: "/assets/ai_support_triage.png",
          caption: "Consistent structured JSON output generated by the local LLM."
        }
      ],
      technicalText: "The core challenge was orchestrating the local LLM to execute complex reasoning tasks within a constrained environment while strictly adhering to the HackerRank Orchestrate submission requirements (Code zip, Predictions CSV, and Chat transcript).",
      techHighlights: [
        {
          title: "Local LLM Integration",
          text: "Seamlessly integrated lightweight local models and OpenAI API support to perform sophisticated inference, offering a choice between absolute privacy or high-performance cloud processing."
        },
        {
          title: "Optimized Retrieval System",
          text: "Implemented an efficient vector-based search to instantly pull relevant FAQs, previous tickets, and system logs to provide context to the LLM."
        }
      ],
      pipeline: [
        "Ingest incoming support ticket via CLI arguments",
        "Retrieve contextual data from local vector store",
        "Construct strict prompt with context and ticket details",
        "Local LLM or OpenAI (via API Key) processes and predicts category/priority",
        "Output structured JSON and update CSV predictions"
      ],
      deepIntegration: [
        {
          title: "Terminal Interface",
          text: "Fully functional command-line interface that allows seamless batch processing or individual ticket triage directly from the terminal."
        },
        {
          title: "Hackathon Compliance",
          text: "Built strictly following the requirements of the HackerRank challenge, including precise formatting for the predictions and maintaining a clean submission bundle."
        }
      ],
      designPhilosophy: "The focus was purely on robust functionality, speed, and reliability. By keeping the application entirely terminal-based, we minimized overhead and maximized the processing power dedicated to the local LLM.",
      closingQuote: "Bringing intelligent, deterministic AI to the edge—where privacy meets performance."
    }
  },
  {
    id: 3,
    title: "Agentic Deep Research System",
    date: "2026",
    description: "A fully agentic, ReAct-pattern deep research system built over a corpus of 439 arXiv papers, incorporating a four-stage reasoning loop to address the limitations of single-pass RAG.",
    image: "/assets/deep_research_mockup.png",
    readMore: "#",
    technologies: ["Agentic RAG", "Python", "Local LLMs", "FAISS", "BM25", "Ollama"],
    liveLink: "https://github.com/Atharav001/RAG-Agentic-Deep-Research",
    urlBar: "github.com/Atharav001/RAG-Agentic-Deep-Research",
    tabTag: "Terminal",
    caseStudy: "#",
    caseStudyDetails: {
      role: "AI Researcher & Developer",
      techStack: "Python, Ollama (gemma3:4b), FAISS, BM25Okapi, PyMuPDF",
      platform: "Local AI Agent",
      problemLead: "Single-pass retrieval-augmented generation systems degrade systematically on multi-source academic queries, where answer completeness depends on evidence aggregation across several independent papers.",
      problemTitle: "The Limitations of Single-Pass RAG",
      problemText: "Conventional RAG architectures operate as single-pass pipelines. This design exhibits fundamental failure modes under the conditions characteristic of academic literature synthesis due to query ambiguity, evidence sparsity, and positional retrieval bias (the 'Lost in the Middle' effect).",
      solutionTitle: "Agentic ReAct-Pattern Architecture",
      solutionText: "A ReAct-pattern deep research system incorporating a four-stage reasoning loop—Planner, Hybrid Retriever, Reflector, and NLI-backed Synthesizer. A seven-configuration ablation study demonstrates that the complete agentic system achieves measurably superior citation precision and answer faithfulness.",
      features: [
        {
          title: "Context-Enriched Chunking",
          text: "Every chunk is prepended with a structured prefix (Paper Title, Section, Abstract) before embedding. This directly addresses the 'Lost in the Middle' problem, ensuring chunks encode both local semantic content and origin context."
        },
        {
          title: "Hybrid Retrieval & RRF",
          text: "Maintains a dense index (BAAI/bge-small-en-v1.5 via FAISS) and a lexical index (BM25Okapi). Fusion is performed via Reciprocal Rank Fusion (RRF) with k=60, followed by cross-encoder reranking."
        },
        {
          title: "The ReAct Reasoning Loop",
          text: "A dynamic loop where the Planner decomposes queries, the Retriever executes hybrid pipelines, and the Reflector acts as a retrieval quality controller to generate follow-up queries."
        },
        {
          title: "NLI Citation Verifier",
          text: "Performs Strict ID Boundary Checking. Every inline citation is cross-referenced against the retrieved evidence list, surgically removing sentences tied to absent arXiv IDs without discarding valid content."
        }
      ],
      technicalText: "Built over a corpus of 439 arXiv papers, evaluated using a 30-question dataset and 7 ablation configurations. The inference backend runs entirely locally on Ollama (gemma3:4b) with zero API dependency.",
      techHighlights: [
        {
          title: "Dynamic Routing via Reflector",
          text: "The Reflector evaluates citation coverage against domain-appropriate thresholds. On deficit, it generates semantically distinct follow-up queries."
        },
        {
          title: "Scale-Invariant Score Fusion",
          text: "RRF is mathematically superior to naive score averaging because it is scale-invariant and rank-position-sensitive, naturally amplifying consensus high-confidence retrievals."
        }
      ],
      pipeline: [
        "Planner decomposes the question into sub-queries",
        "Hybrid Retriever executes FAISS+BM25 searches",
        "RRF and Cross-Encoder Reranking filter top context",
        "Reflector loop ensures citation coverage thresholds",
        "Synthesizer generates answer and NLI Verifier checks citations"
      ],
      deepIntegration: [
        {
          title: "Zero API Dependency",
          text: "The entire system runs on fully local inference backends, ensuring complete data privacy and reproducibility."
        }
      ],
      designPhilosophy: "The central design insight is that dynamic routing via an iterative Reflector loop is categorically superior to a fixed retrieval pipeline. This transforms retrieval from a deterministic lookup into a coverage-maximising search process.",
      closingQuote: "Transforming retrieval from a deterministic lookup into a coverage-maximising search process."
    }
  },
  {
    id: 4,
    title: 'Portfolio 2.0 - Immersive Developer Experience',
    date: 'May 2026',
    description: 'A high-performance, immersive developer portfolio featuring canvas-based neural simulations, glassmorphic UI overlay case studies, and smooth inertia physics navigation.',
    image: '/assets/portfolio_v2.png',
    readMore: '#',
    technologies: ['React', 'Framer Motion', 'Vanilla CSS', 'Lenis Scroll', 'Vite'],
    liveLink: 'https://github.com/Atharav001/portfolio-2.0',
    urlBar: 'github.com/Atharav001/portfolio-2.0',
    tabTag: 'Web',
    caseStudy: '#',
    caseStudyDetails: {
      role: 'Lead Creative Developer & Designer',
      techStack: 'React, Framer Motion, Lenis Scroll, HTML5 Canvas, Vanilla CSS, Vite',
      platform: 'Web (Responsive)',
      problemLead: 'Standard developer portfolios are often flat, static, and fail to immediately capture interest or showcase the developer\'s creative interactive engineering capabilities.',
      problemTitle: 'The Sea of Homogeneity',
      problemText: 'Most developer portfolios use repetitive, plain bootstrap grids or flat templates with no interactive personality. In the competitive space of AI and full-stack engineering, a personal website should be a live testament of technical excellence, clean code, and premium interactive storytelling.',
      solutionTitle: 'Immersive Design & Interaction',
      solutionText: 'Portfolio 2.0 breaks this paradigm. Using math-driven canvas neural network animations, beautiful organic backdrop-filter overlays, and high-performance inertia scroll physics, the site delivers a futuristic developer showcase that is as responsive as it is visually beautiful.<br/><br/><div class="theme-showcase-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 2rem 0; width: 100%;"><div class="theme-card" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; overflow: hidden; padding: 12px; transition: all 0.3s ease;"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;"><span style="font-family: monospace; font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 0.05em;">Dark Theme</span><span style="background: rgba(138, 43, 226, 0.15); color: #c084fc; font-size: 0.7rem; padding: 2px 8px; border-radius: 9999px;">Primary Mode</span></div><img src="/assets/portfolio_dark.jpg" alt="Portfolio Dark Theme" style="width: 100%; border-radius: 6px; aspect-ratio: 16/9; object-fit: cover; border: 1px solid rgba(255, 255, 255, 0.05);" /></div><div class="theme-card" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; overflow: hidden; padding: 12px; transition: all 0.3s ease;"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;"><span style="font-family: monospace; font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 0.05em;">Light Theme</span><span style="background: rgba(138, 43, 226, 0.15); color: #c084fc; font-size: 0.7rem; padding: 2px 8px; border-radius: 9999px;">Alternate Mode</span></div><img src="/assets/portfolio_light.jpg" alt="Portfolio Light Theme" style="width: 100%; border-radius: 6px; aspect-ratio: 16/9; object-fit: cover; border: 1px solid rgba(255, 255, 255, 0.05);" /></div></div>',
      features: [
        {
          title: 'Mathematical Canvas Simulation',
          text: 'A beautiful interactive particle engine running on an HTML5 canvas, calculating dynamic proximity lines to form a real-time reactive neural-orb constellation.'
        },
        {
          title: 'Glassmorphic Case Study Drawer',
          text: 'Instead of simple pages, an elegant glassmorphic drawer slides out with buttery smooth spring physics to present detailed interactive documentation.'
        },
        {
          title: 'Momentum Inertia Physics',
          text: 'Integrated Lenis scroll engine with linear interpolation to offer smooth scrolling across all devices and platforms, enhancing the overall tactical feel.'
        }
      ],
      technicalText: 'Developing the portfolio required overcoming standard browser canvas bottlenecking and animation layout shifts.',
      techHighlights: [
        {
          title: 'Optimized Canvas Animation Loop',
          text: 'Developed a lightweight mathematical particle engine in Vanilla JS. Proximity calculations are limited dynamically to avoid high CPU/GPU overhead, maintaining a consistent 60 FPS experience.'
        },
        {
          title: 'Intersection Observer Fallbacks',
          text: 'Created robust polyfill fallbacks in JavaScript for browsers that do not natively support CSS view-timeline or scroll-driven animation standards.'
        }
      ],
      pipeline: [
        'User enters website',
        'Lenis initializes scroll timeline bindings',
        'Mathematical particle simulation spawns neural node orb',
        'Framer motion orchestrates fade-in reveals on scroll',
        'Interactive custom magnetic cursor reacts to hover states'
      ],
      deepIntegration: [
        {
          title: 'Modular Pure CSS Tokens',
          text: 'Built with pure CSS variables for maximum flex control, avoiding massive external libraries and keeping bundle sizes extremely slim for optimal SEO metrics.'
        },
        {
          title: 'Dynamic Custom Cursor & Magnetic Fields',
          text: 'A custom cursor with inertia delay that morphs into a glowing ring when hovering over interactive items, reinforcing deep user engagement.'
        }
      ],
      designPhilosophy: 'Design is not just what it looks like, but how it works. By combining complex mathematical animations with clean software patterns, the portfolio serves as an active product showcase rather than a simple CV.',
      closingQuote: 'An interactive resume is standard. A digital experience is unforgettable.'
    }
  }
];

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
      <div className="section-heading mb-16">
        <div className="section-heading-label">
          <span className="section-number-inline">03</span>
          <span className="about-label-text">Projects</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading tracking-tight scroll-reveal">
          Featured <span className="text-accent underline-effect">Projects</span>.
        </h2>
        <p className="text-secondary text-sm font-mono uppercase tracking-widest max-w-2xl scroll-reveal">
          Highlighting my latest work: AI research, security innovation, and full-stack development.
        </p>
      </div>

      <div className="projects-list flex flex-col gap-8 md:gap-16">
        {projectsData.map((project, index) => (
          <ProjectCardWrapper
            key={project.id}
            project={project}
            index={index}
            totalProjects={projectsData.length}
            isDesktop={isDesktop}
            setSelectedImage={setSelectedImage}
            setSelectedCaseStudy={setSelectedCaseStudy}
          />
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

      <AnimatePresence>
        {selectedCaseStudy && (
          <CaseStudyViewer
            project={selectedCaseStudy}
            onClose={() => setSelectedCaseStudy(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
