import React, { useEffect, useRef } from 'react';

/**
 * High-performance, zero-dependency 3D Thinking Orb Component
 * Renders a glowing rotating particle sphere / orb with smooth canvas animation.
 */
export const ThinkingOrb = ({ size = 32, speed = 1.5 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Generate points on a 3D sphere surface
    const numPoints = 120;
    const radius = (size / 2) * 0.75;
    const points = [];

    const phi = Math.PI * (3 - Math.sqrt(5)); // golden ratio angle

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push({ x: x * radius, y: y * radius, z: z * radius });
    }

    let animationFrameId;
    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      const centerX = size / 2;
      const centerY = size / 2;

      angleX += 0.012 * speed;
      angleY += 0.018 * speed;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Sort points by z for proper depth buffer rendering
      const rotatedPoints = points.map((p) => {
        // Rotate around X
        const y1 = p.y * cosX - p.z * sinX;
        const z1 = p.y * sinX + p.z * cosX;

        // Rotate around Y
        const x2 = p.x * cosY + z1 * sinY;
        const z2 = -p.x * sinY + z1 * cosY;

        return { x: x2, y: y1, z: z2 };
      });

      rotatedPoints.sort((a, b) => a.z - b.z);

      for (const p of rotatedPoints) {
        const scale = (p.z + radius * 2) / (radius * 3);
        const alpha = Math.max(0.15, Math.min(1, scale * 0.9));
        const dotRadius = Math.max(0.6, scale * 1.4);

        const screenX = centerX + p.x;
        const screenY = centerY + p.y;

        ctx.beginPath();
        ctx.arc(screenX, screenY, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
        ctx.shadowBlur = 4 * scale;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    />
  );
};

export default ThinkingOrb;
