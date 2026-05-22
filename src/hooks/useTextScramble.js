import { useState, useEffect, useCallback } from 'react';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!?';

/**
 * useTextScramble
 * Scrambles a string through random characters before resolving
 * letter-by-letter to the target text.
 *
 * @param {string} targetText - The final text to resolve to.
 * @param {object} options
 * @param {number} options.delay   - ms before the animation starts
 * @param {number} options.speed   - ms per animation frame (lower = faster)
 * @param {number} options.framesPerChar - how many frames each character scrambles before resolving
 */
export function useTextScramble(targetText, { delay = 0, speed = 40, framesPerChar = 8 } = {}) {
  const [displayText, setDisplayText] = useState(targetText);

  const runScramble = useCallback(() => {
    const chars = targetText.split('');
    let frame = 0;
    let intervalId;

    // Kick off with a fully scrambled version immediately
    setDisplayText(
      chars
        .map((c) => (c === ' ' ? ' ' : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]))
        .join('')
    );

    intervalId = setInterval(() => {
      frame++;
      const resolved = Math.min(Math.floor(frame / framesPerChar), chars.length);

      setDisplayText(
        chars
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < resolved) return char;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join('')
      );

      if (resolved >= chars.length) {
        clearInterval(intervalId);
        setDisplayText(targetText);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [targetText, speed, framesPerChar]);

  useEffect(() => {
    const timeout = setTimeout(runScramble, delay);
    return () => clearTimeout(timeout);
  }, [runScramble, delay]);

  return displayText;
}
