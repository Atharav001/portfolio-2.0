import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="contact-container">

          {/* Section label */}
          <div className="contact-section-label">
            <span className="section-number-inline">04</span>
            <span className="about-label-text">Contact</span>
          </div>

          {/* Big title */}
          <h2 className="contact-huge-title">
            LET'S <br />
            <span className="outline-text">COLLABORATE</span>
          </h2>

          {/* Two-column layout: CTA email left, socials right */}
          <div className="contact-layout">

            {/* LEFT — Large mailto CTA */}
            <motion.a
              href="mailto:atharavnarang05@gmail.com"
              className="contact-email-cta interactive-tag"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <span className="contact-email-text">atharavnarang05@gmail.com</span>
              <ArrowUpRight size={28} className="contact-email-icon" />
            </motion.a>

            {/* RIGHT — Socials + descriptor */}
            <motion.div
              className="contact-meta"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <p className="contact-desc">
                Currently open for new opportunities and interesting collaborations in the AI space.
              </p>

              <div className="contact-socials">
                <a href="https://www.linkedin.com/in/atharav-narang-132b74273/" target="_blank" rel="noreferrer" className="social-pill interactive-tag">
                  LinkedIn <ArrowUpRight size={14} />
                </a>
                <a href="https://github.com/Atharav001" target="_blank" rel="noreferrer" className="social-pill interactive-tag">
                  GitHub <ArrowUpRight size={14} />
                </a>
                <a href="https://x.com/Atharav3602" target="_blank" rel="noreferrer" className="social-pill interactive-tag">
                  𝕏 / Twitter <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Footer strip */}
          <div className="footer-copyright">
            <span>© {new Date().getFullYear()} ATHARAV NARANG</span>
            <span>ALL RIGHTS RESERVED</span>
            <span>BANGALORE, IN</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
