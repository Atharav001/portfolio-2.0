import React, { useEffect, useRef } from 'react';
import './AnimatedBackground.css';

export default function AnimatedBackground() {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const shootingStarsRef = useRef([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        let width = canvas.width;
        let height = canvas.height;

        let frameCount = 0;
        let repelRects = [];

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        // Optimized counts for butter-smooth rendering
        const PARTICLE_COUNT = isMobile
            ? Math.min(10, Math.floor((width * height) / 80000))
            : Math.min(60, Math.floor((width * height) / 20000));

        const isLightTheme = document.documentElement.classList.contains('light-theme');
        const darkColors = [
            'rgba(0, 200, 255, ',   // Cyan
            'rgba(138, 43, 226, ',  // Purple
            'rgba(255, 255, 255, ', // White
        ];
        const lightColors = [
            'rgba(0, 180, 255, ',   // Saturated Cyan
            'rgba(138, 43, 226, ',  // Purple
            'rgba(236, 72, 153, ',  // Saturated Rose
        ];
        const colors = isLightTheme ? lightColors : darkColors;

        particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => {
            const colorIndex = Math.floor(Math.random() * colors.length);
            const colorBase = colors[colorIndex];
            let spawnX = Math.random() * width;
            if (spawnX > width * 0.25 && spawnX < width * 0.75 && Math.random() < 0.7) {
                spawnX = Math.random() < 0.5 ? Math.random() * (width * 0.25) : width * 0.75 + Math.random() * (width * 0.25);
            }
            return {
                x: spawnX,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                radius: Math.random() * 1.8 + (isLightTheme ? 2.8 : 1.5), // Balanced professional dot size (not overdone)
                opacity: Math.random() * 0.3 + 0.45,
                colorIndex: colorIndex,
                colorBase: colorBase,
            };
        });

        // Setup observer for theme changes
        let wasLightTheme = isLightTheme;
        const observer = new MutationObserver(() => {
            const isLight = document.documentElement.classList.contains('light-theme');
            if (isLight !== wasLightTheme) {
                wasLightTheme = isLight;
                const newColors = isLight ? lightColors : darkColors;
                particlesRef.current.forEach(p => {
                    p.colorBase = newColors[p.colorIndex];
                });
            }
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);
            
            const mouse = mouseRef.current;
            const particles = particlesRef.current;
            const isLight = document.documentElement.classList.contains('light-theme');

            // Spawn shooting stars occasionally
            const shootingStars = shootingStarsRef.current;
            if (Math.random() < (isMobile ? 0.003 : 0.008) && shootingStars.length < (isMobile ? 2 : 4)) {
                const angle = Math.PI / 6 + Math.random() * (Math.PI / 12); // angle of descent (approx 30-45 degrees)
                const speed = Math.random() * 8 + 6;
                shootingStars.push({
                    x: Math.random() * w * 1.2 - w * 0.2,
                    y: -50,
                    dx: Math.cos(angle) * speed,
                    dy: Math.sin(angle) * speed,
                    length: Math.random() * 80 + 80,
                    opacity: Math.random() * 0.5 + 0.3,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }

            // Update & Draw shooting stars in background
            for (let s = shootingStars.length - 1; s >= 0; s--) {
                const star = shootingStars[s];
                star.x += star.dx;
                star.y += star.dy;
                star.opacity -= 0.005; // gradual fade out

                if (star.opacity <= 0 || star.x > w + 100 || star.y > h + 100) {
                    shootingStars.splice(s, 1);
                    continue;
                }

                // Draw trail with linear gradient
                const grad = ctx.createLinearGradient(star.x, star.y, star.x - star.dx * (star.length / 10), star.y - star.dy * (star.length / 10));
                grad.addColorStop(0, star.color + `${star.opacity})`);
                grad.addColorStop(1, star.color + '0)');

                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(star.x - star.dx * 2, star.y - star.dy * 2);
                ctx.strokeStyle = star.color + `${star.opacity * 1.2})`;
                ctx.lineWidth = isLight ? 2.0 : 1.5;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(star.x - star.dx * 2, star.y - star.dy * 2);
                ctx.lineTo(star.x - star.dx * (star.length / 10), star.y - star.dy * (star.length / 10));
                ctx.strokeStyle = grad;
                ctx.lineWidth = isLight ? 1.5 : 1.0;
                ctx.stroke();
            }

            // Throttled query of text blocks
            frameCount++;
            if (frameCount % 20 === 0 || repelRects.length === 0) {
                const elements = document.querySelectorAll(
                    'h1, h2, h3, h4, p, .project-card, .timeline-item, .cert-card, .social-pill, .btn'
                );
                repelRects = Array.from(elements)
                    .map(el => {
                        const rect = el.getBoundingClientRect();
                        return {
                            left: rect.left,
                            right: rect.right,
                            top: rect.top,
                            bottom: rect.bottom,
                            centerX: rect.left + rect.width / 2,
                            centerY: rect.top + rect.height / 2,
                            width: rect.width,
                            height: rect.height
                        };
                    })
                    .filter(r => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < h);
            }

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Mouse repulsion
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    p.vx += (dx / dist) * force * 0.02;
                    p.vy += (dy / dist) * force * 0.02;
                }

                // Damping
                p.vx *= 0.99;
                p.vy *= 0.99;

                // Repel away from text element boxes dynamically
                for (let r = 0; r < repelRects.length; r++) {
                    const rect = repelRects[r];
                    const pad = 15;
                    if (p.x > rect.left - pad && p.x < rect.right + pad &&
                        p.y > rect.top - pad && p.y < rect.bottom + pad) {
                        
                        const dx = p.x - rect.centerX;
                        const dy = p.y - rect.centerY;
                        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                        const maxDist = Math.max(rect.width, rect.height) / 2 + pad;
                        
                        if (dist < maxDist) {
                            const force = (1 - dist / maxDist) * 0.005;
                            p.vx += (dx / dist) * force;
                            p.vy += (dy / dist) * force;
                        }
                    }
                }

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < -10) p.x = w + 10;
                if (p.x > w + 10) p.x = -10;
                if (p.y < -10) p.y = h + 10;
                if (p.y > h + 10) p.y = -10;

                // Draw Volumetric smooth glow
                const glowRadius = p.radius * (isLight ? 2.5 : 3.5);
                const grad = ctx.createRadialGradient(p.x, p.y, p.radius, p.x, p.y, glowRadius);
                const glowAlpha = isLight ? p.opacity * 0.35 : p.opacity * 0.15;
                grad.addColorStop(0, p.colorBase + `${glowAlpha})`);
                grad.addColorStop(1, p.colorBase + '0)');

                ctx.beginPath();
                ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();

                // Draw Core Particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                const coreAlpha = isLight ? p.opacity * 0.95 : p.opacity;
                ctx.fillStyle = p.colorBase + `${coreAlpha})`;
                ctx.fill();

                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const cdx = p.x - p2.x;
                    const cdy = p.y - p2.y;
                    const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
                    if (cdist < 120) {
                        const baseAlpha = isLight ? 0.20 : 0.10; // Optimized connection opacity
                        const alpha = baseAlpha * (1 - cdist / 120);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        
                        const grad = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
                        grad.addColorStop(0, p.colorBase + `${alpha})`);
                        grad.addColorStop(1, p2.colorBase + `${alpha})`);

                        ctx.strokeStyle = grad;
                        ctx.lineWidth = 0.45; // slightly thinner for cleaner visuals
                        ctx.stroke();
                    }
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationRef.current);
            observer.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="animated-framer-bg"
        />
    );
}
