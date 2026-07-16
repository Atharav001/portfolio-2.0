import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.dataset.theme || 'dark';
    }
    return 'dark';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = (e) => {
      if (!localStorage.getItem('theme')) {
        const next = e.matches ? 'light' : 'dark';
        document.documentElement.classList.toggle('light-theme', next === 'light');
        document.documentElement.dataset.theme = next;
        setTheme(next);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleTheme = (e) => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const applyTheme = () => {
      document.documentElement.classList.toggle('light-theme', next === 'light');
      document.documentElement.dataset.theme = next;
      localStorage.setItem('theme', next);
      setTheme(next);
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!document.startViewTransition || reducedMotion) {
      applyTheme();
      return;
    }

    // Option 4: Corner Burst - Always expand from top-right corner
    const x = window.innerWidth;
    const y = 0;

    // Radius to cover the farthest corner of the viewport
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(applyTheme);

    transition.ready.then(() => {
      const isDarkToLight = next === 'light';
      // Reveal the *new* theme by expanding a circle from button origin
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 600,
          easing: isDarkToLight
            ? 'cubic-bezier(0.4, 0, 0.2, 1)'
            : 'cubic-bezier(0.0, 0.0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'experience', 'projects', 'contact'];
      let maxVisible = 0;
      let current = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
          if (visibleHeight > maxVisible && visibleHeight > 0) {
            maxVisible = visibleHeight;
            current = section.charAt(0).toUpperCase() + section.slice(1);
          }
        }
      }

      if (current) {
        setActiveTab(current);
      }
    };

    // Use Lenis scroll if available, otherwise window scroll
    const lenis = window.__lenis;
    if (lenis) {
      lenis.on('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (lenis) {
        lenis.off('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const lenis = window.__lenis;
    if (isMobileMenuOpen) {
      if (lenis) lenis.stop();
      document.body.style.overflow = 'hidden';
    } else {
      if (lenis) lenis.start();
      document.body.style.overflow = '';
    }
    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const links = ['Home', 'About', 'Experience', 'Projects', 'Contact'];

  const scrollToSection = (e, link) => {
    e.preventDefault();
    setActiveTab(link);
    setIsMobileMenuOpen(false); // Close menu on click
    const targetId = link === 'Home' ? 'home' : link.toLowerCase();
    const element = document.getElementById(targetId);
    if (element) {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(`#${targetId}`);
      } else {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <header className="navbar-container">
      <a href="#about" className="skip-link">Skip to main content</a>
      <motion.div 
        className="navbar-animator"
        initial={{ top: -100, opacity: 0 }}
        animate={{ top: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', width: '100%' }}
      >
        <div className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>

        {/* Left Side: Logo */}
        <div className="navbar-logo-section">
          <a href="#home" className="navbar-logo interactive-tag" onClick={(e) => scrollToSection(e, 'Home')}>
            <span className="logo-full">Atharav Narang</span>
            <span className="logo-short">Atharav</span>
          </a>
        </div>

        {/* Center: Navigation Links */}
        <nav className="navbar-links-section" aria-label="Primary navigation">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link === 'Home' ? 'home' : link.toLowerCase()}`}
              className={`nav-link interactive-tag ${activeTab === link ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, link)}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Right Side: Actions (Theme Toggle & Mobile Burger) */}
        <div className="navbar-actions-section">
          {/* Target for the cursor to fly back to when it exits the window screen */}
          <div id="cursor-dock" className="cursor-dock"></div>

          <button
            className="theme-toggle-btn interactive-tag"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={theme === 'light'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Hamburger Menu Button */}
          <button
            className="mobile-menu-btn interactive-tag"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu-nav"
          >
            <div className={`burger-icon ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
        </div>

      </motion.div>

      {/* Mobile Overlay Menu */}
      <div 
        id="mobile-menu-nav" 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        aria-label="Mobile navigation"
      >
        <nav className="mobile-nav-links">
          {links.map((link, index) => (
            <a
              key={link}
              href={`#${link === 'Home' ? 'home' : link.toLowerCase()}`}
              className={`mobile-nav-link ${activeTab === link ? 'active' : ''} ${isMobileMenuOpen ? 'fade-in' : ''}`}
              onClick={(e) => scrollToSection(e, link)}
              style={{ '--stagger-index': index }}
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
