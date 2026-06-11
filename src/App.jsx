import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
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

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

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
      <motion.div 
        style={{ scaleX, transformOrigin: '0%', backgroundColor: 'var(--text-primary)', height: '2px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100000 }} 
      />
      <div className="noise-overlay"></div>
      <AnimatedBackground />
      <CustomCursor />
      <Navbar />

      <div className="bg-blob bg-blob-1"></div>
      <div className="bg-blob bg-blob-2"></div>

      <main>
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
      <Analytics />
    </>
  );
}

export default App;
