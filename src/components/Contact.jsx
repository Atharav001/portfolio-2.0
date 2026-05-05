import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-top">
          <h2 className="contact-huge-title">
            LET'S <br />
            <span className="outline-text">COLLABORATE</span>
          </h2>
        </div>

        <div className="contact-layout">
          {/* LEFT: INFO & SOCIALS */}
          <div className="contact-meta">
            <p className="contact-desc">
              Currently open for new opportunities and interesting collaborations in the AI space.
            </p>
            
            <div className="contact-socials">
              <a href="https://www.linkedin.com/in/atharav-narang-132b74273/" target="_blank" rel="noreferrer" className="social-pill interactive-tag">
                LinkedIn <ArrowUpRight size={16} />
              </a>
              <a href="https://github.com/Atharav001" target="_blank" rel="noreferrer" className="social-pill interactive-tag">
                GitHub <ArrowUpRight size={16} />
              </a>
              <a href="https://x.com/Atharav3602" target="_blank" rel="noreferrer" className="social-pill interactive-tag">
                𝕏 (Twitter) <ArrowUpRight size={16} />
              </a>
              <a href="mailto:atharavnarang@example.com" className="social-pill interactive-tag">
                Email Me <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          <span>© {new Date().getFullYear()} ATHARAV NARANG</span>
          <span>ALL RIGHTS RESERVED</span>
          <span>BANGALORE, IN</span>
        </div>
      </div>
    </section>
  );
};

export default Contact;
