/**
 * AnimatedBackground.jsx
 * 
 * Implements a pure CSS Aurora UI background using radial gradients and keyframe animations.
 * Provides a dynamic, performant background that reacts to the theme (light/dark).
 * 
 * Replaces the previous JS-heavy particle canvas for better performance and battery life.
 */
import React from 'react';
import './AnimatedBackground.css';

export default function AnimatedBackground() {
    return (
        <div className="animated-framer-bg" />
    );
}
