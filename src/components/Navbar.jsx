import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('light-theme')) {
      setTheme('light');
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'experience', 'projects', 'contact'];
      let maxVisible = 0;
      let current = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Calculate how much of the section is physically visible on the screen
          const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
          if (visibleHeight > maxVisible && visibleHeight > 0) {
            maxVisible = visibleHeight;
            current = section.charAt(0).toUpperCase() + section.slice(1);
          }
        }
      }

      if (current && current !== activeTab) {
        setActiveTab(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  useEffect(() => {
    // Lock body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.add('light-theme');
      setTheme('light');
    } else {
      document.documentElement.classList.remove('light-theme');
      setTheme('dark');
    }
  };

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
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="navbar-container">
      <motion.div 
        className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >

        {/* Left Side: Logo */}
        <div className="navbar-logo-section">
          <a href="#home" className="navbar-logo interactive-tag" onClick={(e) => scrollToSection(e, 'Home')}>
            Atharav Narang
          </a>
        </div>

        {/* Center: Navigation Links */}
        <nav className="navbar-links-section">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className={`nav-link interactive-tag ${activeTab === link ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, link)}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Right Side: Actions (Cursor Dock, Theme Toggle, & Mobile Burger) */}
        <div className="navbar-actions-section">
          {/* Target for the cursor to fly back to when it exits the window screen */}
          <div id="cursor-dock" className="cursor-dock"></div>

          <button
            className="theme-toggle-btn interactive-tag"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Hamburger Menu Button */}
          <button
            className="mobile-menu-btn interactive-tag"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <div className={`burger-icon ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>

      </motion.div>

      {/* Mobile Overlay Menu */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav-links">
          {links.map((link, index) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className={`mobile-nav-link ${activeTab === link ? 'active' : ''} ${isMobileMenuOpen ? 'fade-in' : ''}`}
              onClick={(e) => scrollToSection(e, link)}
              style={{ transitionDelay: `${index * 0.1}s` }}
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
