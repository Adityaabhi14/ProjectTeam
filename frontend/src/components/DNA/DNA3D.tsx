// =================================================================
// CarePoint Master 3D DNA System — DNA3D.tsx
// Cinematic double-helix with dark titanium rails, glowing base pairs,
// dense bioluminescent particle cloud, and responsive physics.
// =================================================================

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { DNAVariant, DNAQuality, DNA_PRESETS, DNAConfig } from '../../lib/dnaConfig';
import { generateDNAStructure } from '../../lib/dnaGeometry';
import { createDNAMaterials, DNAMaterialBank } from '../../lib/dnaMaterials';
import { buildDNAHelix, HelixBuildResult } from './DNAHelix';
import { buildDNABasePairs, BasePairsBuildResult } from './DNABasePairs';
import { buildDNAParticles, ParticlesBuildResult } from './DNAParticles';
import { buildDNALighting, LightingRigResult } from './DNALighting';
import { DNAEnvironment } from './DNAEnvironment';
import { DNAControls } from './DNAControls';
import { DNALoader } from './DNALoader';
import { DNAFallback } from './DNAFallback';
import { useDNAInteraction } from '../../hooks/useDNAInteraction';
import { useResponsiveDNA } from '../../hooks/useResponsiveDNA';

export interface DNA3DProps {
  variant?: DNAVariant;
  quality?: DNAQuality;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  showControls?: boolean;
  showLegend?: boolean;
}

export const DNA3D: React.FC<DNA3DProps> = ({
  variant = 'hero',
  quality = 'auto',
  interactive = true,
  className = '',
  style = {},
  showControls = true,
  showLegend = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [activeBaseHighlight, setActiveBaseHighlight] = useState<string | null>(null);

  const responsive = useResponsiveDNA(quality);
  const interaction = useDNAInteraction(interactive);

  // Pick preset configuration based on variant and effective quality tier
  const config: DNAConfig = DNA_PRESETS[variant][responsive.quality];

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !responsive.hasWebGL) {
      setIsLoading(false);
      return;
    }

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animId: number;

    let materials: DNAMaterialBank | null = null;
    let helixObj: HelixBuildResult | null = null;
    let basePairsObj: BasePairsBuildResult | null = null;
    let particlesObj: ParticlesBuildResult | null = null;
    let lightingRig: LightingRigResult | null = null;

    try {
      // ── 1. Create WebGL Scene & Camera ──────────────────────────
      scene = new THREE.Scene();

      const width = container.clientWidth || 400;
      const height = container.clientHeight || 450;

      camera = new THREE.PerspectiveCamera(config.fov, width / height, 0.1, 1000);
      camera.position.set(0, 0, config.cameraDistance);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(responsive.pixelRatio);
      renderer.setClearColor(0x000000, 0); // Transparent canvas inside container
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;

      container.appendChild(renderer.domElement);

      // ── 2. Master Rotational DNA Group ──────────────────────────
      const dnaRootGroup = new THREE.Group();
      dnaRootGroup.name = 'DNA_Master_Root';
      scene.add(dnaRootGroup);

      // ── 3. Initialize Materials Bank ────────────────────────────
      materials = createDNAMaterials();

      // ── 4. Generate Procedural DNA Structure ────────────────────
      const geoData = generateDNAStructure(
        config.radius,
        config.height,
        config.turns,
        config.numRungs
      );

      // ── 5. Build Subsystems ─────────────────────────────────────
      helixObj = buildDNAHelix(geoData, materials, config.tubeRadius);
      dnaRootGroup.add(helixObj.group);

      basePairsObj = buildDNABasePairs(geoData, materials, config.tubeRadius);
      dnaRootGroup.add(basePairsObj.group);

      particlesObj = buildDNAParticles(
        config.particleCount,
        config.dustStreamCount,
        materials,
        config.height,
        config.radius
      );
      dnaRootGroup.add(particlesObj.group);

      lightingRig = buildDNALighting(config.theme);
      scene.add(lightingRig.group);

      setIsLoading(false);

      // ── 6. Event Listeners for Interaction ──────────────────────
      const onMouseMove = (e: MouseEvent) => {
        interaction.handleMouseMove(e, container);
      };

      const onMouseEnter = () => interaction.handleMouseEnter();
      const onMouseLeave = () => interaction.handleMouseLeave();
      const onTouchStart = (e: TouchEvent) => interaction.handleTouchStart(e);
      const onTouchMove = (e: TouchEvent) => interaction.handleTouchMove(e);
      const onTouchEnd = () => interaction.handleTouchEnd();

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      container.addEventListener('mouseenter', onMouseEnter);
      container.addEventListener('mouseleave', onMouseLeave);
      container.addEventListener('touchstart', onTouchStart, { passive: true });
      container.addEventListener('touchmove', onTouchMove, { passive: true });
      container.addEventListener('touchend', onTouchEnd);

      // Resize observer
      const resizeObserver = new ResizeObserver(entries => {
        if (!renderer || !camera) return;
        for (const entry of entries) {
          const w = entry.contentRect.width;
          const h = entry.contentRect.height;
          if (w > 0 && h > 0) {
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
          }
        }
      });
      resizeObserver.observe(container);

      // ── 7. Animation Loop ───────────────────────────────────────
      const clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        const phys = interaction.step(0.055);

        if (!responsive.prefersReducedMotion && !isPaused) {
          // Continuous Helical Rotation
          dnaRootGroup.rotation.y = (elapsedTime * config.rotationSpeed) + phys.currentRotY;
          dnaRootGroup.rotation.x = phys.currentRotX + Math.sin(elapsedTime * 0.6) * 0.05;
          dnaRootGroup.rotation.z = phys.currentTiltZ;

          // Subtle harmonic floating motion
          dnaRootGroup.position.y = Math.sin(elapsedTime * 0.8) * config.floatAmplitude;

          // Realtime particle drift & counter-rotation
          if (particlesObj) {
            particlesObj.update(elapsedTime);
          }

          // Lighting update
          if (lightingRig) {
            lightingRig.update(
              elapsedTime,
              phys.currentRotY,
              phys.currentRotX,
              phys.proximityScore
            );
          }
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('mousemove', onMouseMove);
        if (container) {
          container.removeEventListener('mouseenter', onMouseEnter);
          container.removeEventListener('mouseleave', onMouseLeave);
          container.removeEventListener('touchstart', onTouchStart);
          container.removeEventListener('touchmove', onTouchMove);
          container.removeEventListener('touchend', onTouchEnd);
        }
        resizeObserver.disconnect();

        helixObj?.dispose();
        basePairsObj?.dispose();
        particlesObj?.dispose();
        lightingRig?.dispose();
        materials?.dispose();

        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn('DNA3D WebGL initialization error:', err);
      setIsLoading(false);
    }
  }, [variant, responsive.quality, isPaused, responsive.hasWebGL]);

  // Handle Base Pair Highlighting
  const handleSelectBaseHighlight = (base: string | null) => {
    setActiveBaseHighlight(base);
    // When highlighted, we can pulse specific pins
  };

  const handleResetOrientation = () => {
    interaction.stateRef.current.targetRotX = 0;
    interaction.stateRef.current.targetRotY = 0;
    interaction.stateRef.current.targetTiltZ = 0;
  };

  if (!responsive.hasWebGL) {
    return <DNAFallback reason="no-webgl" />;
  }

  if (responsive.prefersReducedMotion) {
    return <DNAFallback reason="reduced-motion" />;
  }

  return (
    <DNAEnvironment theme={config.theme} className={className} style={style}>
      {isLoading && <DNALoader />}

      {/* 3D WebGL Canvas Mount Container */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '440px',
          position: 'relative',
          cursor: interactive ? 'grab' : 'default',
          zIndex: 5
        }}
      />

      {/* Interactive Controls Overlay */}
      {config.showControls && showControls && (
        <DNAControls
          isPaused={isPaused}
          onTogglePause={() => setIsPaused(p => !p)}
          onResetOrientation={handleResetOrientation}
          activeBaseHighlight={activeBaseHighlight}
          onSelectBaseHighlight={handleSelectBaseHighlight}
          showLegend={config.showLegend && showLegend}
        />
      )}
    </DNAEnvironment>
  );
};
