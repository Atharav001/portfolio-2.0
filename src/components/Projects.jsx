import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight, X, Eye } from 'lucide-react';
import CaseStudyViewer from './CaseStudyViewer';
import './Projects.css';

const projectsData = [
  {
    id: 1,
    title: "Scroller's Dashboard",
    date: "February 2025 - March 2025",
    description: "A high-performance digital wellness application that tracks every single swipe to break the cycle of doom-scrolling through real-time interventions.",
    image: "/assets/dashboard.png",
    readMore: "#",
    technologies: ["Native Android", "Kotlin", "AccessibilityService", "Room DB"],
    liveLink: "https://github.com/Atharav001/shortform-usage-sentinel",
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
