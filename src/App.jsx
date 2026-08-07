import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import './index.css';

// Components
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import AnimatedBackground from './components/AnimatedBackground';
import GrainOverlay from './components/GrainOverlay';

// Reusable animated section divider
const SectionDivider = () => (
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    viewport={{ once: true, margin: '-60px' }}
    style={{
      originX: 0,
      height: '1px',
      background: 'linear-gradient(90deg, var(--accent-blue) 0%, rgba(138,43,226,0.6) 50%, transparent 100%)',
      maxWidth: 'var(--max-width)',
      margin: '0 auto',
      padding: '0 4rem',
      width: 'calc(100% - 8rem)',
    }}
  />
);

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      document.documentElement.style.scrollBehavior = 'auto';
      return;
    }

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
      anchors: true,
    });

    window.__lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(raf);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [shouldReduceMotion]);

  // IntersectionObserver fallback for .scroll-reveal in Firefox
  // (native scroll-driven animations not yet supported there)
  useEffect(() => {
    if (CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) return;

    const els = document.querySelectorAll('.scroll-reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target); // only trigger once
          }
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <motion.div 
        style={{ scaleX, transformOrigin: '0%', backgroundColor: 'var(--text-primary)', height: '2px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 'var(--z-max)' }} 
      />
      <div className="noise-overlay"></div>
      <AnimatedBackground />
      <GrainOverlay />
      <CustomCursor />
      <Navbar />

      <main id="main-content">
          <Hero />
          <SectionDivider />
          <About />
          <SectionDivider />
          <Experience />
          <SectionDivider />
          <Projects />
          <SectionDivider />
          <Contact />
      </main>
    </>
  );
}

export default App;
