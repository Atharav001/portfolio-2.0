import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Send, Upload, CheckCircle } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate email sending
    setTimeout(() => {
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      // Reset after 5 seconds to allow more messages
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1000);
  };

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
            </div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="contact-form-container">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="contact-form"
                  className="contact-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="form-row">
                    <div className="input-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="input-group">
                      <label>Email ID</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Subject</label>
                    <input 
                      type="text" 
                      placeholder="Project Inquiry" 
                      required 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>

                  <div className="input-group">
                    <label>Content / Message</label>
                    <textarea 
                      placeholder="Tell me about your project..." 
                      rows="5"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="file-upload-container">
                    <label className="file-label interactive-tag">
                      <Upload size={18} />
                      <span>Upload Documents</span>
                      <input type="file" className="hidden-input" multiple />
                    </label>
                    <p className="file-hint">PDF, DOCX, JPG (Max 10MB)</p>
                  </div>

                  <button type="submit" className="submit-btn interactive-tag">
                    <span>Proceed & Send</span>
                    <Send size={18} />
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-message"
                  className="success-message"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle size={64} className="success-icon" />
                  <h3>Message Sent!</h3>
                  <p>Thanks {formData.name}, I'll get back to you shortly at {formData.email}.</p>
                </motion.div>
              )}
            </AnimatePresence>
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
