// =================================================================
// CarePoint Health System — Signature Continuous 3D DNA & Bio-Network System
// Real Interactive 3D Double Helix · Scroll-Linked Rotation · Cursor Magnetism
// Inspired by Next-Gen Healthcare & Genomic Data Visualizations
// =================================================================

import React, { useEffect, useRef } from 'react';

export interface MedicalNetworkBackgroundProps {
  variant?: 'global' | 'hero' | 'section' | 'subtle' | 'tracker' | 'assessment';
  density?: 'low' | 'medium' | 'high';
  interactive?: boolean;
  opacity?: number;
  scrollReactive?: boolean;
  activeStep?: number;
  highlightNode?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

interface DnaNode3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  radius: number;
  strand: 0 | 1; // Strand A or Strand B
  colorType: 'green' | 'teal' | 'coral';
  phase: number;
  pairIndex: number;
}

interface AmbientParticle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  colorType: 'green' | 'teal' | 'coral';
  alpha: number;
  pulsePhase: number;
}

export const MedicalNetworkBackground: React.FC<MedicalNetworkBackgroundProps> = ({
  variant = 'global',
  density = 'medium',
  interactive = true,
  opacity,
  scrollReactive = true,
  activeStep = 1,
  className = '',
  style
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calibrated opacity to ensure beautiful presence with zero UI obstruction
  const effectiveOpacity =
    opacity !== undefined
      ? opacity
      : variant === 'hero'
      ? 0.90
      : variant === 'global'
      ? 0.28
      : variant === 'tracker'
      ? 0.38
      : variant === 'assessment'
      ? 0.32
      : variant === 'section'
      ? 0.22
      : 0.16;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = width < 768;

    // Palette Colors (Deep Forest Green, Warm Teal, Radiant Coral)
    const palette = {
      green: '#164A41',
      greenRgb: '22, 74, 65',
      teal: '#2F7D6D',
      tealRgb: '47, 125, 109',
      coral: '#E8795B',
      coralRgb: '232, 121, 91'
    };

    // ── 1. Construct 3D Continuous DNA Double Helix ──────────────
    // The helix spans the full vertical height of the viewport + margin for smooth wrapping
    const helixNodes: DnaNode3D[] = [];
    const basePairsCount = isMobile ? 36 : (variant === 'hero' ? 44 : 56);
    const helixRadius = isMobile ? (variant === 'global' ? 140 : 110) : (variant === 'global' ? 220 : 170);
    const helixHeight = height * 1.35;
    const turnsCount = isMobile ? 2.2 : 3.2;

    for (let i = 0; i < basePairsCount; i++) {
      const t = (i / basePairsCount) * Math.PI * 2 * turnsCount;
      const y = ((i / basePairsCount) - 0.5) * helixHeight;

      // Primary Strand A
      const xA = Math.cos(t) * helixRadius;
      const zA = Math.sin(t) * helixRadius;

      // Complementary Strand B (180 deg phase offset)
      const xB = Math.cos(t + Math.PI) * helixRadius;
      const zB = Math.sin(t + Math.PI) * helixRadius;

      const isCoralA = i % 4 === 0;
      const isCoralB = (i + 2) % 4 === 0;

      // Node A
      helixNodes.push({
        x: xA,
        y: y,
        z: zA,
        baseX: xA,
        baseY: y,
        baseZ: zA,
        radius: isCoralA ? 3.8 : 3.0,
        strand: 0,
        colorType: isCoralA ? 'coral' : 'green',
        phase: Math.random() * Math.PI * 2,
        pairIndex: i
      });

      // Node B
      helixNodes.push({
        x: xB,
        y: y,
        z: zB,
        baseX: xB,
        baseY: y,
        baseZ: zB,
        radius: isCoralB ? 3.8 : 2.8,
        strand: 1,
        colorType: isCoralB ? 'coral' : 'teal',
        phase: Math.random() * Math.PI * 2,
        pairIndex: i
      });
    }

    // ── 2. Construct Ambient Floating 3D Bio-Particles ────────────
    const ambientParticles: AmbientParticle3D[] = [];
    const particleCount = isMobile ? 35 : (variant === 'hero' ? 90 : 65);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * (width * 1.1);
      const y = (Math.random() - 0.5) * (height * 1.2);
      const z = (Math.random() - 0.5) * 350;
      const rand = Math.random();

      ambientParticles.push({
        x,
        y,
        z,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        vz: (Math.random() - 0.5) * 0.2,
        radius: rand > 0.8 ? 2.5 : 1.6,
        colorType: rand > 0.75 ? 'coral' : rand > 0.4 ? 'teal' : 'green',
        alpha: 0.3 + Math.random() * 0.5,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    // ── 3. Smooth Mouse & Scroll Physics (Lerp State) ────────────
    const state = {
      mouseX: width / 2,
      mouseY: height / 2,
      targetMouseX: width / 2,
      targetMouseY: height / 2,
      scrollY: window.scrollY || 0,
      targetScrollY: window.scrollY || 0,
      rotY: 0,
      rotX: 0,
      targetRotY: 0,
      targetRotX: 0
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      state.targetMouseX = e.clientX - rect.left;
      state.targetMouseY = e.clientY - rect.top;

      // 3D Camera Tilt Angles
      const deltaX = (state.targetMouseX - width / 2) / (width / 2);
      const deltaY = (state.targetMouseY - height / 2) / (height / 2);
      state.targetRotY = deltaX * 0.45;
      state.targetRotX = -deltaY * 0.35;
    };

    const handleScroll = () => {
      state.targetScrollY = window.scrollY || 0;
    };

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    if (scrollReactive) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('resize', handleResize);

    // ── 4. Main 3D Rendering Engine ──────────────────────────────
    let time = 0;
    const focalLength = 400;

    const render = () => {
      time += prefersReducedMotion ? 0.004 : 0.016;

      // Lerp Smooth Motion
      state.mouseX += (state.targetMouseX - state.mouseX) * 0.05;
      state.mouseY += (state.targetMouseY - state.mouseY) * 0.05;
      state.scrollY += (state.targetScrollY - state.scrollY) * 0.06;
      state.rotY += (state.targetRotY - state.rotY) * 0.05;
      state.rotX += (state.targetRotX - state.rotX) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Helix Center Anchor Point (Positioned gracefully in 3D space)
      // For global view, shift helix slightly right/center for editorial balance
      const helixCenterX = variant === 'global' ? width * 0.58 : width * 0.50;
      const helixCenterY = height * 0.50;

      // Continuous Scroll-linked vertical helical spin
      const scrollRotation = state.scrollY * 0.0035;
      const continuousSpin = time * 0.25;
      const totalRotY = continuousSpin + scrollRotation + state.rotY;
      const totalRotX = state.rotX + Math.sin(time * 0.5) * 0.05;

      const cosY = Math.cos(totalRotY);
      const sinY = Math.sin(totalRotY);
      const cosX = Math.cos(totalRotX);
      const sinX = Math.sin(totalRotX);

      // Store projected base-pair points for drawing cross rungs
      const projectedNodes: {
        projX: number;
        projY: number;
        projZ: number;
        scale: number;
        alpha: number;
        node: DnaNode3D;
      }[] = [];

      // ── Step A: Project 3D DNA Helix Nodes ─────────────────────
      for (let i = 0; i < helixNodes.length; i++) {
        const node = helixNodes[i];

        // Harmonic breathing wave
        const harmonic = Math.sin(time * 1.5 + node.pairIndex * 0.2) * 5;

        // Apply 3D Rotation on Y-axis
        const x1 = node.baseX * cosY - node.baseZ * sinY;
        const z1 = node.baseZ * cosY + node.baseX * sinY;

        // Apply 3D Rotation on X-axis
        const y2 = (node.baseY + harmonic) * cosX - z1 * sinX;
        const z2 = z1 * cosX + (node.baseY + harmonic) * sinX;

        // 3D Perspective Projection
        const scale = focalLength / (focalLength + z2 + 240);
        let projX = helixCenterX + x1 * scale;
        let projY = helixCenterY + y2 * scale;

        // Depth-dependent Alpha
        let depthAlpha = Math.max(0.18, Math.min(1.0, (z2 + 240) / 480));

        // Cursor Proximity Magnetism & Aura
        if (interactive && !prefersReducedMotion) {
          const dx = state.mouseX - projX;
          const dy = state.mouseY - projY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const magnetRadius = isMobile ? 100 : 180;

          if (dist < magnetRadius) {
            const force = (1 - dist / magnetRadius) * 24;
            projX += (dx / dist) * force;
            projY += (dy / dist) * force;
            depthAlpha = Math.min(1.0, depthAlpha * 1.4);
          }
        }

        projectedNodes.push({
          projX,
          projY,
          projZ: z2,
          scale,
          alpha: depthAlpha,
          node
        });
      }

      // ── Step B: Draw DNA Hydrogen Base-Pair Cross Rungs ────────
      const pairsMap: Record<number, typeof projectedNodes> = {};
      projectedNodes.forEach(p => {
        const pIdx = p.node.pairIndex;
        if (!pairsMap[pIdx]) pairsMap[pIdx] = [];
        pairsMap[pIdx].push(p);
      });

      Object.values(pairsMap).forEach(pair => {
        if (pair.length === 2) {
          const pA = pair[0];
          const pB = pair[1];

          const avgAlpha = (pA.alpha + pB.alpha) * 0.5 * effectiveOpacity;
          const avgScale = (pA.scale + pB.scale) * 0.5;

          // Draw the base-pair rung line
          ctx.beginPath();
          ctx.moveTo(pA.projX, pA.projY);
          ctx.lineTo(pB.projX, pB.projY);

          // Alternating glowing coral / teal hydrogen bonds
          const isHighlight = pA.node.colorType === 'coral' || pB.node.colorType === 'coral';
          if (isHighlight) {
            ctx.strokeStyle = `rgba(${palette.coralRgb}, ${avgAlpha * 1.1})`;
            ctx.lineWidth = 1.6 * avgScale;
          } else {
            ctx.strokeStyle = `rgba(${palette.tealRgb}, ${avgAlpha * 0.85})`;
            ctx.lineWidth = 1.1 * avgScale;
          }
          ctx.stroke();

          // Central hydrogen bond junction dot on rung center
          const midX = (pA.projX + pB.projX) * 0.5;
          const midY = (pA.projY + pB.projY) * 0.5;
          ctx.beginPath();
          ctx.arc(midX, midY, 1.8 * avgScale, 0, Math.PI * 2);
          ctx.fillStyle = isHighlight
            ? `rgba(${palette.coralRgb}, ${avgAlpha * 1.3})`
            : `rgba(${palette.greenRgb}, ${avgAlpha * 0.9})`;
          ctx.fill();
        }
      });

      // ── Step C: Draw DNA Helical Backbone Ribbons ──────────────
      // Strand A backbone line
      const strandA = projectedNodes.filter(p => p.node.strand === 0);
      if (strandA.length > 1) {
        ctx.beginPath();
        ctx.moveTo(strandA[0].projX, strandA[0].projY);
        for (let i = 1; i < strandA.length; i++) {
          ctx.lineTo(strandA[i].projX, strandA[i].projY);
        }
        ctx.strokeStyle = `rgba(${palette.greenRgb}, ${effectiveOpacity * 0.75})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // Strand B backbone line
      const strandB = projectedNodes.filter(p => p.node.strand === 1);
      if (strandB.length > 1) {
        ctx.beginPath();
        ctx.moveTo(strandB[0].projX, strandB[0].projY);
        for (let i = 1; i < strandB.length; i++) {
          ctx.lineTo(strandB[i].projX, strandB[i].projY);
        }
        ctx.strokeStyle = `rgba(${palette.tealRgb}, ${effectiveOpacity * 0.75})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // ── Step D: Draw DNA Nodes with Depth Shading & Aura ───────
      // Sort by Z for proper 3D depth compositing
      projectedNodes.sort((a, b) => a.projZ - b.projZ);

      for (let i = 0; i < projectedNodes.length; i++) {
        const p = projectedNodes[i];
        const r = Math.max(1.2, p.node.radius * p.scale);
        const nodeAlpha = p.alpha * effectiveOpacity;

        const rgb =
          p.node.colorType === 'coral'
            ? palette.coralRgb
            : p.node.colorType === 'teal'
            ? palette.tealRgb
            : palette.greenRgb;

        // Outer glow halo
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, r * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${nodeAlpha * 0.22})`;
        ctx.fill();

        // Solid Node Core
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${nodeAlpha * 1.15})`;
        ctx.fill();
      }

      // ── Step E: Draw Ambient Floating Bio-Data Particles ───────
      for (let i = 0; i < ambientParticles.length; i++) {
        const pt = ambientParticles[i];

        if (!prefersReducedMotion) {
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.z += pt.vz;

          // Boundary wrap
          const hw = width * 0.55;
          const hh = height * 0.6;
          if (pt.x < -hw) pt.x = hw;
          if (pt.x > hw) pt.x = -hw;
          if (pt.y < -hh) pt.y = hh;
          if (pt.y > hh) pt.y = -hh;
        }

        const scale = focalLength / (focalLength + pt.z + 240);
        let projX = width / 2 + pt.x * scale;
        let projY = height / 2 + pt.y * scale;

        const rgb =
          pt.colorType === 'coral'
            ? palette.coralRgb
            : pt.colorType === 'teal'
            ? palette.tealRgb
            : palette.greenRgb;

        const pAlpha = pt.alpha * effectiveOpacity * 0.8;

        ctx.beginPath();
        ctx.arc(projX, projY, pt.radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${pAlpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (scrollReactive) {
        window.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [variant, density, interactive, effectiveOpacity, scrollReactive, activeStep]);

  return (
    <canvas
      ref={canvasRef}
      className={`medical-dna-canvas ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        ...style
      }}
    />
  );
};
