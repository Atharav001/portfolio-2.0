import React, { useState, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { moments as rawMoments } from '../../data/moments';
import MomentsLightbox from './MomentsLightbox';
import './MomentsStrip.css';

// Fisher-Yates shuffle function
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const MomentsStrip = () => {
  // Shuffle array once on initial mount
  const shuffledMoments = useMemo(() => shuffleArray(rawMoments), []);

  // Marquee pause state
  const [isPaused, setIsPaused] = useState(false);
  const [activeMoment, setActiveMoment] = useState(null);

  // Check user preference for reduced motion
  const prefersReducedMotion = useReducedMotion();

  // Duplicate items to ensure seamless 0 -> -50% loop
  const marqueeItems = useMemo(() => {
    return [...shuffledMoments, ...shuffledMoments];
  }, [shuffledMoments]);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <div className="moments-scrapbook-container">
      <div className="moments-header-row">
        <div className="moments-header-title-group">
          <span className="section-number-inline">05</span>
          <div>
            <h3 className="moments-section-title">
              MOMENTS <span className="moments-title-accent">gallery</span>
            </h3>
            <p className="moments-subheading">
              Hackathons, events, and everything in between.
            </p>
          </div>
        </div>

        {!prefersReducedMotion && (
          <button
            className="moments-control-btn"
            onClick={togglePause}
            aria-label={isPaused ? "Resume gallery scroll" : "Pause gallery scroll"}
            title={isPaused ? "Resume scroll" : "Pause scroll"}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
            <span className="moments-control-label">
              {isPaused ? "Play" : "Pause"}
            </span>
          </button>
        )}
      </div>

      {/* Scrapbook Viewport with clothesline string */}
      <div
        className={`moments-scrapbook-viewport ${
          prefersReducedMotion ? 'reduced-motion' : ''
        } ${isPaused ? 'paused' : ''}`}
      >
        {/* Soft brass/tan clothesline string running behind the row */}
        <div className="moments-clothesline" aria-hidden="true" />

        <div className="moments-scrapbook-track">
          {marqueeItems.map((item, index) => {
            // Flexible tilt variation for duplicated set
            const baseRotation = item.rotation || (index % 2 === 0 ? -3.5 : 3.5);
            const rotationDeg = index >= shuffledMoments.length ? -baseRotation * 0.85 : baseRotation;

            const cardWidth = item.cardWidth || '290px';
            const photoHeight = item.photoHeight || '185px';

            return (
              <div
                key={`${item.id}-${index}`}
                className="moments-polaroid-card"
                style={{
                  '--tilt-deg': `${rotationDeg}deg`,
                  '--card-width': cardWidth,
                  '--photo-height': photoHeight,
                }}
                onClick={() => setActiveMoment(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveMoment(item);
                  }
                }}
                aria-label={`View photo: ${item.label} (${item.date})`}
              >
                {/* Cyan/Purple Gradient Pin / Clip */}
                <div className="moments-polaroid-pin" aria-hidden="true">
                  <div className="moments-pin-head" />
                  <div className="moments-pin-shadow" />
                </div>

                {/* Photo Image Frame */}
                <div className="moments-polaroid-photo-frame">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="moments-polaroid-image"
                    loading="lazy"
                    width="280"
                    height="185"
                  />
                </div>

                {/* Handwritten Polaroid Caption & Date */}
                <div className="moments-polaroid-caption-area">
                  <span className="moments-handwritten-caption">{item.label}</span>
                  <span className="moments-polaroid-date">{item.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeMoment && (
        <MomentsLightbox
          moment={activeMoment}
          onClose={() => setActiveMoment(null)}
        />
      )}
    </div>
  );
};

export default MomentsStrip;
