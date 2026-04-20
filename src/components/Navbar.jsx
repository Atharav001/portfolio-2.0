import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState('dark');

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

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.add('light-theme');
      setTheme('light');
    } else {
      document.documentElement.classList.remove('light-theme');
      setTheme('dark');
    }
  };

  const links = ['Home', 'About', 'Experience', 'Projects', 'Contact'];

  const scrollToSection = (e, link) => {
    e.preventDefault();
    setActiveTab(link);
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
      <div className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>

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

        {/* Right Side: Actions (Cursor Dock & Theme Toggle) */}
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
        </div>

      </div>
    </header>
  );
};

export default Navbar;
