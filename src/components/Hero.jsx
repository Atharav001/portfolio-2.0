import React, { useCallback, useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useTextScramble } from '../hooks/useTextScramble';
import './Hero.css';

// --- Pipeline Demo Component ---
const stepsInfo = [
  { title: "Claim Ingest", desc: "Claims CSV loaded", color: "#888" },
  { title: "Blind VLM", desc: "Extracting visual facts only", color: "#3b82f6" },
  { title: "Smart Gate", desc: "Validating facts integrity", color: "#10b981" },
  { title: "Adjudication", desc: "Evaluating LLM policy rules", color: "#8b5cf6" },
  { title: "Structured Verdict", desc: "CSV output generated", color: "#ec4899" }
];

const logDatabase = [
  [
    "📥 [INGEST] Claim ID: #4802-V received.",
    "📥 [INGEST] Claimant Narrative: 'Cracked bumper from parking gate.'",
    "📥 [INGEST] Loading damage_bumper.jpg..."
  ],
  [
    "🔍 [VLM] Running Blind Perception node...",
    "🔍 [VLM] Analysis: Bumper scratch detected. No structural crack found.",
    "🔍 [VLM] Confidence score: 0.94"
  ],
  [
    "🛡️ [GATE] Evaluating claimant narrative vs VLM facts...",
    "🛡️ [GATE] CONFLICT DETECTED: Narrative claims 'crack', VLM found 'scratch'.",
    "🛡️ [GATE] Routing to deep review node."
  ],
  [
    "⚖️ [LLM] Applying auto policy clauses...",
    "⚖️ [LLM] Rule 4b: Surface scratches < 3 inches covered under comprehensive.",
    "⚖️ [LLM] Decision: Approve partial payout. Reject full bumper replacement."
  ],
  [
    "✅ [OUTPUT] Verdict generated.",
    "✅ [OUTPUT] Appending row to batch_verdicts.csv...",
    "✅ [OUTPUT] Awaiting next claim."
  ]
];

const PipelineDemo = () => {
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);

  const runNextStep = useCallback(() => {
    setStep((prevStep) => {
      const nextStep = (prevStep + 1) % 5;
      
      // Update logs list
      setLogs((prevLogs) => {
        const nextLogs = [...prevLogs, ...logDatabase[prevStep]];
        // Limit to last 6 log lines
        if (nextLogs.length > 6) {
          return nextLogs.slice(nextLogs.length - 6);
        }
        return nextLogs;
      });

      return nextStep;
    });
  }, [logDatabase]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(runNextStep, 2600);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, runNextStep]);

  const handleReset = () => {
    setStep(0);
    setLogs(["🔄 Pipeline reset to initial state. Waiting..."]);
  };

  return (
    <div className="pipeline-demo-container">
      <div className="pipeline-demo-header">
        <div className="pipeline-header-left">
          <div className="pipeline-status-pulse"></div>
          <span className="pipeline-header-title">AI Pipeline Live Simulator</span>
        </div>
        <div className="pipeline-controls">
          <button 
            className="pipeline-btn" 
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "Pause" : "Simulate"}
          </button>
          <button className="pipeline-btn" onClick={handleReset} title="Reset">
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* Nodes Map */}
      <div className="pipeline-nodes">
        {stepsInfo.map((s, idx) => {
          const isActive = idx === step;
          const isDone = idx < step;
          return (
            <div key={idx} className={`pipeline-node-wrapper ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
              <div className="pipeline-node-dot" style={{ '--node-color': s.color }}>
                {isDone ? <CheckCircle size={12} /> : idx + 1}
              </div>
              <div className="pipeline-node-info">
                <span className="node-title">{s.title}</span>
                <span className="node-desc">{s.desc}</span>
              </div>
              {idx < 4 && <div className="pipeline-edge-connector"></div>}
            </div>
          );
        })}
      </div>

      {/* Simulated Console Log */}
      <div className="pipeline-console">
        <div className="console-title-bar">
          <span className="console-dot red"></span>
          <span className="console-dot yellow"></span>
          <span className="console-dot green"></span>
          <span className="console-filename">debiased_pipeline.log</span>
        </div>
        <div className="console-body">
          {logs.length === 0 ? (
            <div className="console-placeholder">Initializing pipeline logs... Click 'Simulate' or wait.</div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="console-line">
                <span className="console-timestamp">[{new Date().toLocaleTimeString()}]</span> {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Hero Component ---
const Hero = () => {
  // --- Mouse Parallax Setup ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const idleTimeoutRef = useRef(null);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 18, restDelta: 0.001 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 18, restDelta: 0.001 });

  const badgeX  = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const badgeY  = useTransform(springY, [-0.5, 0.5], [-4, 4]);

  const title1X = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const title1Y = useTransform(springY, [-0.5, 0.5], [-10, 10]);

  const title2X = useTransform(springX, [-0.5, 0.5], [-30, 30]);
  const title2Y = useTransform(springY, [-0.5, 0.5], [-15, 15]);

  const descX   = useTransform(springX, [-0.5, 0.5], [-10, 10]);
  const descY   = useTransform(springY, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = useCallback(
    (e) => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }

      mouseX.set((e.clientX / window.innerWidth) - 0.5);
      mouseY.set((e.clientY / window.innerHeight) - 0.5);

      idleTimeoutRef.current = setTimeout(() => {
        mouseX.set(0);
        mouseY.set(0);
      }, 1000);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, []);

  const scramble1 = useTextScramble('ATHARAV', { delay: 350, speed: 35, framesPerChar: 8 });
  const scramble2 = useTextScramble('NARANG',  { delay: 650, speed: 35, framesPerChar: 8 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const handleResumeClick = (e) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = '/Atharav_Narang_Resume.pdf';
    link.download = 'Atharav_Narang_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="hero-section" id="home" onMouseMove={handleMouseMove}>
      <div className="hero-3d-scene">
        <motion.div
          className="hero-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column: Information */}
          <div className="hero-content">
            <motion.div
              variants={itemVariants}
              style={{ x: badgeX, y: badgeY }}
              className="hero-badge"
            >
              <span className="status-dot"></span>
              <span>Open to Summer 2026 AI Engineering Internships</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="hero-title"
              aria-label="ATHARAV NARANG"
            >
              <motion.span
                className="hero-title-line"
                style={{ x: title1X, y: title1Y }}
                aria-hidden="true"
              >
                {scramble1}
              </motion.span>
              <motion.span
                className="hero-title-line hero-role-title"
                style={{ x: title2X, y: title2Y }}
                aria-hidden="true"
              >
                {scramble2}
                <span className="role-subheading">AI Systems Explorer</span>
              </motion.span>
            </motion.h1>

            <motion.div
              variants={itemVariants}
              style={{ x: descX, y: descY }}
              className="hero-description-container"
            >
              <p className="hero-description">
                I build software and explore AI architectures, experimenting with local LLMs and optimizing agentic pipelines.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="hero-actions">
              <a href="#projects" className="btn btn-primary magnetic-btn">
                See projects <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </a>
              <a 
                href="/Atharav_Narang_Resume.pdf" 
                className="btn btn-secondary" 
                onClick={handleResumeClick}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Resume (PDF)
              </a>
            </motion.div>
          </div>

          {/* Right Column: Interactive Pipeline Graphic */}
          <motion.div 
            className="hero-visual"
            variants={itemVariants}
          >
            <PipelineDemo />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
