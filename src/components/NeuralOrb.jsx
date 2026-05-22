import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './NeuralOrb.css';

// ---------- Geometry helpers ----------
const TAU = Math.PI * 2;

// Generate a stable set of node positions on the sphere surface
function generateNodes(count, seed = 42) {
  const nodes = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i + seed;
    nodes.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
    });
  }
  return nodes;
}

// Rotate a 3D point around Y then X axes
function rotatePoint(point, rotX, rotY) {
  // Rotate around Y axis
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
  const x1 = point.x * cosY + point.z * sinY;
  const z1 = -point.x * sinY + point.z * cosY;

  // Rotate around X axis
  const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
  const y2 = point.y * cosX - z1 * sinX;
  const z2 = point.y * sinX + z1 * cosX;

  return { x: x1, y: y2, z: z2 };
}

// Simple perspective projection
function project(point, radius, cx, cy) {
  const perspective = 2.5;
  const scale = perspective / (perspective - point.z);
  return {
    x: cx + point.x * radius * scale,
    y: cy + point.y * radius * scale,
    scale,
  };
}

// ---------- Main Component ----------
const NODES = generateNodes(32);
const EDGES = (() => {
  const edges = [];
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i + 1; j < NODES.length; j++) {
      const dx = NODES[i].x - NODES[j].x;
      const dy = NODES[i].y - NODES[j].y;
      const dz = NODES[i].z - NODES[j].z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < 0.72) edges.push([i, j, dist]);
    }
  }
  return edges;
})();

export default function NeuralOrb() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const rotRef = useRef({ x: 0.3, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const targetRotRef = useRef({ x: 0.3, y: 0 });
  const pulseRef = useRef(0);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking relative to center of viewport for the "look toward cursor" effect
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const springMouseX = useSpring(rawMouseX, { stiffness: 30, damping: 20 });
  const springMouseY = useSpring(rawMouseY, { stiffness: 30, damping: 20 });

  // Mobile check
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Global mouse tracking
  useEffect(() => {
    const handleMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 to +1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      rawMouseX.set(nx);
      rawMouseY.set(ny);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [rawMouseX, rawMouseY]);

  // Canvas rendering loop
  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const SIZE = 180;
    const R = 68; // sphere radius in px
    const CX = SIZE / 2;
    const CY = SIZE / 2;
    canvas.width = SIZE;
    canvas.height = SIZE;

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);

      const mx = springMouseX.get();
      const my = springMouseY.get();

      // Target rotation driven by mouse (subtle — max ~40deg tilt)
      targetRotRef.current.y = mx * 0.7;
      targetRotRef.current.x = 0.3 + my * 0.4;

      // Smooth lerp toward target
      const lerpFactor = 0.04;
      rotRef.current.x += (targetRotRef.current.x - rotRef.current.x) * lerpFactor;
      rotRef.current.y += (targetRotRef.current.y - rotRef.current.y) * lerpFactor;

      // Slow auto-spin around Y when no strong mouse input
      if (Math.abs(mx) < 0.1 && Math.abs(my) < 0.1) {
        rotRef.current.y += 0.003;
      }

      pulseRef.current = t;
      t += 0.02;

      // Project all nodes
      const projected = NODES.map((n) => {
        const rotated = rotatePoint(n, rotRef.current.x, rotRef.current.y);
        const proj = project(rotated, R, CX, CY);
        return { ...proj, z: rotated.z };
      });

      // --- Draw outer glow ring ---
      const pulseScale = 1 + Math.sin(t * 1.5) * 0.04;
      const glowGrad = ctx.createRadialGradient(CX, CY, R * 0.7 * pulseScale, CX, CY, R * 1.35 * pulseScale);
      glowGrad.addColorStop(0, 'rgba(0, 200, 255, 0.07)');
      glowGrad.addColorStop(0.5, 'rgba(138, 43, 226, 0.06)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(CX, CY, R * 1.35 * pulseScale, 0, TAU);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // --- Draw sphere body gradient ---
      const bodyGrad = ctx.createRadialGradient(CX - R * 0.2, CY - R * 0.2, R * 0.1, CX, CY, R);
      bodyGrad.addColorStop(0, 'rgba(120, 40, 200, 0.18)');
      bodyGrad.addColorStop(0.5, 'rgba(0, 160, 220, 0.10)');
      bodyGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, TAU);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // --- Draw sphere rim (outer border) ---
      const rimGrad = ctx.createLinearGradient(CX - R, CY, CX + R, CY);
      rimGrad.addColorStop(0, 'rgba(0, 200, 255, 0.4)');
      rimGrad.addColorStop(0.5, 'rgba(138, 43, 226, 0.3)');
      rimGrad.addColorStop(1, 'rgba(0, 200, 255, 0.4)');
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, TAU);
      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // --- Draw edges (neural connections) ---
      for (const [i, j, dist] of EDGES) {
        const a = projected[i];
        const b = projected[j];
        const avgZ = (a.z + b.z) / 2;

        // Only draw edges on front hemisphere mostly
        const opacity = Math.max(0, (avgZ + 0.6) / 1.6) * 0.65;
        if (opacity < 0.02) continue;

        // Synaptic pulse traveling along edges
        const synapsePhase = (t * 1.5 + i * 0.4) % TAU;
        const synapseBoost = Math.max(0, Math.cos(synapsePhase)) * 0.5;

        const edgeOpacity = opacity * (0.5 + synapseBoost);

        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, `rgba(0, 200, 255, ${edgeOpacity * 0.7})`);
        grad.addColorStop(0.5, `rgba(180, 80, 255, ${edgeOpacity})`);
        grad.addColorStop(1, `rgba(0, 200, 255, ${edgeOpacity * 0.7})`);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.7 + synapseBoost * 0.8;
        ctx.stroke();
      }

      // --- Draw nodes ---
      for (const p of projected) {
        const opacity = Math.max(0, (p.z + 0.7) / 1.7);
        if (opacity < 0.05) continue;

        const nodeSize = (1.2 + p.z * 0.8) * p.scale;

        // Node glow
        const nodeGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, nodeSize * 3);
        nodeGlow.addColorStop(0, `rgba(0, 220, 255, ${opacity * 0.4})`);
        nodeGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeSize * 3, 0, TAU);
        ctx.fillStyle = nodeGlow;
        ctx.fill();

        // Node dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, nodeSize), 0, TAU);
        ctx.fillStyle = `rgba(180, 240, 255, ${opacity * 0.9})`;
        ctx.fill();
      }

      // --- Specular highlight (top-left) ---
      const specGrad = ctx.createRadialGradient(CX - R * 0.35, CY - R * 0.35, 0, CX - R * 0.35, CY - R * 0.35, R * 0.5);
      specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
      specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, TAU);
      ctx.fillStyle = specGrad;
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [isMobile, springMouseX, springMouseY]);

  if (isMobile) return null;

  return (
    <motion.div
      className="neural-orb-container"
      initial={{ opacity: 0, scale: 0.6, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Tooltip label */}
      <motion.div
        className="orb-tooltip"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
        transition={{ duration: 0.25 }}
        aria-hidden="true"
      >
        <span className="orb-tooltip-dot" />
        Neural Interface
      </motion.div>

      <canvas ref={canvasRef} className="neural-orb-canvas" aria-hidden="true" />
    </motion.div>
  );
}
