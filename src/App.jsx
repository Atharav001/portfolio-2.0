import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
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
        <AnimatePresence mode="wait">
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Contact />
        </AnimatePresence>
      </main>
    </>
  );
}

export default App;
