import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import './CustomCursor.css';

// How many trail particles to keep in the history queue
const TRAIL_LENGTH = 18;

const CustomCursor = () => {
  const cursorX = useSpring(-100, { stiffness: 1600, damping: 45 });
  const cursorY = useSpring(-100, { stiffness: 1600, damping: 45 });

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const [isHovering, setIsHovering] = useState(false);
  const [isDocked, setIsDocked] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Trail: array of { x, y, id } snapshots of past cursor positions
  const [trail, setTrail] = useState([]);
  const trailIdRef = useRef(0);
  const posRef = useRef({ x: -100, y: -100 });
  const isHoveringRef = useRef(false);

  // Keep isHovering in a ref so the rAF loop can read it without stale closures
  useEffect(() => { isHoveringRef.current = isHovering; }, [isHovering]);

  // ---- Mobile check ----
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ---- Hide native cursor on desktop/fine-pointer devices ----
  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) {
      document.documentElement.classList.add('hide-native-cursor');
    }
    return () => {
      document.documentElement.classList.remove('hide-native-cursor');
    };
  }, []);

  // ---- Dock helper ----
  const updateDockPosition = useCallback(() => {
    const dock = document.getElementById('cursor-dock');
    if (dock) {
      const rect = dock.getBoundingClientRect();
      const tx = rect.left + rect.width / 2;
      const ty = rect.top + rect.height / 2;
      dotX.set(tx); dotY.set(ty);
      cursorX.set(tx); cursorY.set(ty);
      setIsVisible(true);
    }
  }, [cursorX, cursorY, dotX, dotY]);

  // ---- Trail rAF loop ----
  // Runs independently, samples posRef at ~60fps and appends a new trail dot
  useEffect(() => {
    if (isMobile) return;
    let rafId;
    let lastPush = 0;

    const loop = (ts) => {
      rafId = requestAnimationFrame(loop);
      // Throttle: push a new trail dot every ~40ms to get ~25fps trail density
      if (ts - lastPush < 40) return;
      lastPush = ts;

      const { x, y } = posRef.current;
      if (x < 0 || y < 0) return; // don't seed trail before first move

      setTrail(prev => {
        const next = [
          ...prev,
          { x, y, id: trailIdRef.current++, isHovering: isHoveringRef.current }
        ];
        // Cap to TRAIL_LENGTH
        return next.length > TRAIL_LENGTH ? next.slice(next.length - TRAIL_LENGTH) : next;
      });
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [isMobile]);

  // ---- Main mouse event listeners ----
  useEffect(() => {
    if (isMobile) return;
    let isCurrentlyDocked = true;

    const handleMouseMove = (e) => {
      if (isCurrentlyDocked) {
        isCurrentlyDocked = false;
        setIsDocked(false);
      }
      if (!isVisible) setIsVisible(true);

      posRef.current = { x: e.clientX, y: e.clientY };
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        isCurrentlyDocked = true;
        setIsDocked(true);
        updateDockPosition();
        setTrail([]);
      }
    };

    const handleMouseEnter = (e) => {
      isCurrentlyDocked = false;
      setIsDocked(false);
      setIsVisible(true);
      posRef.current = { x: e.clientX, y: e.clientY };
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const isInteractive = e.target.closest(
        'a, button, input, .interactive-tag, .project-image-container, [role="button"], .nav-link, .action-btn'
      );
      setIsHovering(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const t = setTimeout(() => { if (isCurrentlyDocked) updateDockPosition(); }, 200);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      clearTimeout(t);
    };
  }, [isMobile, isVisible, dotX, dotY, cursorX, cursorY, updateDockPosition]);

  if (isMobile) return null;

  const isActive = isHovering && !isDocked;

  return (
    <div
      className="custom-cursor-container"
      style={{
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* ---- Particle trail ---- */}
      {!isDocked && trail.map((p, i) => {
        // i=0 is oldest, i=trail.length-1 is newest
        const denom = Math.max(1, trail.length - 1);
        const age = i / denom;   // 0=oldest → 1=newest
        const opacity = age * 0.55;
        const size = age * (p.isHovering ? 6 : 3.5);
        return (
          <div
            key={p.id}
            className={`cursor-trail-dot${p.isHovering ? ' trail-hover' : ''}`}
            style={{
              left: p.x,
              top: p.y,
              width: Math.max(1, size),
              height: Math.max(1, size),
              opacity,
            }}
          />
        );
      })}

      {/* ---- Main dot ---- */}
      <motion.div
        className={`custom-cursor-dot ${isActive ? 'hovered' : ''} ${isClicking ? 'clicking' : ''}`}
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* ---- Outer ring ---- */}
      <motion.div
        className={`custom-cursor-ring ${isActive ? 'hovered' : ''} ${isDocked ? 'docked' : ''} ${isClicking ? 'clicking' : ''}`}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </div>
  );
};

export default CustomCursor;