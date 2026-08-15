import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag } from 'lucide-react';

const MomentsLightbox = ({ moment, onClose }) => {
  useEffect(() => {
    if (!moment) return;

    // Lock body scroll while modal is open
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Handle Escape key to close modal
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [moment, onClose]);

  if (!moment) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="moments-lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lightbox-title"
      >
        <motion.div
          className="moments-lightbox-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="moments-lightbox-close"
            onClick={onClose}
            aria-label="Close lightbox"
          >
            <X size={20} />
          </button>

          <div className="moments-lightbox-image-wrapper">
            <img
              src={moment.src}
              alt={moment.alt}
              className="moments-lightbox-image"
            />
          </div>

          <div className="moments-lightbox-footer">
            <div className="moments-lightbox-header">
              <h3 id="lightbox-title" className="moments-lightbox-title">
                {moment.label}
              </h3>
              <div className="moments-lightbox-date">
                <Calendar size={14} />
                <span>{moment.date}</span>
              </div>
            </div>
            <p className="moments-lightbox-alt">{moment.alt}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MomentsLightbox;
