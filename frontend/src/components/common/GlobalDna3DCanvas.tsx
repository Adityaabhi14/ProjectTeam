// =================================================================
// CarePoint Signature 3D DNA Visual Engine
// Palette: BTS DNA Color Palette
// #581845 (Deep Plum) · #900C3E (Wine Crimson) · #C70039 (Ruby Red)
// #FF5733 (Vibrant Coral) · #FFC300 (Sunflower Gold)
// Dynamic View-Aware Positioning Engine with Smooth Lerping
// Soft Spherical Bioluminescent Particles & Dual Helical Orbiters
// =================================================================

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { NavigationView } from '../../types';

export interface GlobalDna3DCanvasProps {
  opacity?: number;
  currentView?: NavigationView;
  boxSide?: 'left' | 'right';
}

// Generate soft radial glow texture for circular particles
function createGlowPointTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.88)');
  gradient.addColorStop(0.55, 'rgba(255, 255, 255, 0.38)');
  gradient.addColorStop(0.85, 'rgba(255, 255, 255, 0.08)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(32, 32, 32, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const GlobalDna3DCanvas: React.FC<GlobalDna3DCanvasProps> = ({
  opacity = 0.95,
  currentView = 'home',
  boxSide = 'left'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentViewRef = useRef<NavigationView>(currentView);
  const boxSideRef = useRef<'left' | 'right'>(boxSide);

  // Keep refs synchronized with props
  useEffect(() => {
    currentViewRef.current = currentView;
  }, [currentView]);

  useEffect(() => {
    boxSideRef.current = boxSide;
  }, [boxSide]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animId: number;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1100;

    try {
      // ── 1. Scene & Cinematic Camera ─────────────────────────────
      scene = new THREE.Scene();

      // Stable fixed camera distance
      const cameraDistance = isMobile ? 32 : 27;
      camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
      camera.position.set(0, 0, cameraDistance);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0); // Transparent WebGL canvas
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      container.appendChild(renderer.domElement);

      // ── 2. Cinematic Multi-Point BTS DNA Lighting Setup ─────────
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.9);
      scene.add(ambientLight);

      // Key Warm White Light
      const keyLight = new THREE.DirectionalLight(0xFFF8F0, 3.0);
      keyLight.position.set(15, 24, 25);
      scene.add(keyLight);

      // Vibrant Coral Rim Light (#FF5733) from left
      const coralRim = new THREE.PointLight(0xFF5733, 6.2, 70);
      coralRim.position.set(-18, 14, 20);
      scene.add(coralRim);

      // Sunflower Gold Rim Light (#FFC300) from right
      const goldRim = new THREE.PointLight(0xFFC300, 5.8, 65);
      goldRim.position.set(18, -12, 18);
      scene.add(goldRim);

      // Ruby Red Center Glow (#C70039)
      const rubyLight = new THREE.PointLight(0xC70039, 4.6, 55);
      rubyLight.position.set(0, 18, 14);
      scene.add(rubyLight);

      // Deep Plum / Wine Back Glow (#581845 / #900C3E)
      const plumBackGlow = new THREE.PointLight(0x581845, 4.8, 60);
      plumBackGlow.position.set(0, -8, -18);
      scene.add(plumBackGlow);

      // Interactive Cursor Glow Spotlight (#FF5733)
      const cursorGlow = new THREE.PointLight(0xFF5733, 3.6, 38);
      cursorGlow.position.set(0, 0, 12);
      scene.add(cursorGlow);

      // ── 3. Master Rotational DNA Group ───────────────────────────
      const dnaMasterGroup = new THREE.Group();
      dnaMasterGroup.name = 'CarePoint_Master_DNA';
      dnaMasterGroup.position.set(0, 0, 0);
      dnaMasterGroup.scale.set(1, 1, 1);
      scene.add(dnaMasterGroup);

      // ── 4. High-End Materials Using BTS DNA Color Palette ────────
      // Strand A: Vivid Ruby Red (#C70039)
      const matStrandRuby = new THREE.MeshStandardMaterial({
        color: 0xC70039,
        emissive: 0x900C3E,
        emissiveIntensity: 0.55,
        metalness: 0.86,
        roughness: 0.18,
        envMapIntensity: 1.4
      });

      // Strand B: Sunflower Gold (#FFC300)
      const matStrandGold = new THREE.MeshStandardMaterial({
        color: 0xFFC300,
        emissive: 0xFF5733,
        emissiveIntensity: 0.48,
        metalness: 0.86,
        roughness: 0.18,
        envMapIntensity: 1.4
      });

      // Pin Shaft: Deep Plum Metallic (#581845)
      const matPinShaft = new THREE.MeshStandardMaterial({
        color: 0x581845,
        emissive: 0x2A0B20,
        emissiveIntensity: 0.25,
        metalness: 0.90,
        roughness: 0.22
      });

      // ── Luminous Base Pair Emissives (BTS DNA Palette) ───────────
      const matGlowRuby = new THREE.MeshStandardMaterial({
        color: 0xC70039,
        emissive: 0xC70039,
        emissiveIntensity: 3.6,
        roughness: 0.1,
        metalness: 0.3
      });

      const matGlowGold = new THREE.MeshStandardMaterial({
        color: 0xFFC300,
        emissive: 0xFFC300,
        emissiveIntensity: 3.5,
        roughness: 0.1,
        metalness: 0.3
      });

      const matGlowCoral = new THREE.MeshStandardMaterial({
        color: 0xFF5733,
        emissive: 0xFF5733,
        emissiveIntensity: 3.6,
        roughness: 0.1,
        metalness: 0.3
      });

      const matGlowWine = new THREE.MeshStandardMaterial({
        color: 0x900C3E,
        emissive: 0x900C3E,
        emissiveIntensity: 3.2,
        roughness: 0.1,
        metalness: 0.3
      });

      const matGlowPlum = new THREE.MeshStandardMaterial({
        color: 0x581845,
        emissive: 0x900C3E,
        emissiveIntensity: 2.8,
        roughness: 0.1,
        metalness: 0.3
      });

      const basePairRuleSet = [
        { matA: matGlowRuby, matB: matGlowGold, sparkColor: 0xFF5733 },   // Ruby ↔ Gold (Coral Spark)
        { matA: matGlowCoral, matB: matGlowWine, sparkColor: 0xFFC300 },  // Coral ↔ Wine (Gold Spark)
        { matA: matGlowPlum, matB: matGlowRuby, sparkColor: 0xFF5733 },   // Plum ↔ Ruby (Coral Spark)
        { matA: matGlowGold, matB: matGlowCoral, sparkColor: 0x900C3E }   // Gold ↔ Coral (Wine Spark)
      ];

      // ── 5. Generate Procedural DNA Helix ─────────────────────────
      const numRungs = isMobile ? 54 : isTablet ? 76 : 94;
      const helixRadius = isMobile ? 3.6 : 5.0;
      const helixHeight = isMobile ? 38.0 : 50.0;
      const totalTurns = isMobile ? 2.8 : 4.0;
      const tubeRadius = isMobile ? 0.22 : 0.28;

      const curvePointsA: THREE.Vector3[] = [];
      const curvePointsB: THREE.Vector3[] = [];

      const torusGeo = new THREE.TorusGeometry(tubeRadius * 1.55, tubeRadius * 0.4, 12, 22);
      const sparkGeo = new THREE.SphereGeometry(0.16, 16, 16);

      for (let i = 0; i < numRungs; i++) {
        const fraction = i / (numRungs - 1);
        const t = fraction * Math.PI * 2 * totalTurns;
        const y = (fraction - 0.5) * helixHeight;

        // Organic subtle curve wobble
        const wobbleA = Math.sin(fraction * 12.0) * 0.12;
        const wobbleB = Math.cos(fraction * 12.0) * 0.12;

        const xA = Math.cos(t) * (helixRadius + wobbleA);
        const zA = Math.sin(t) * (helixRadius + wobbleA);
        const posA = new THREE.Vector3(xA, y, zA);

        const xB = Math.cos(t + Math.PI) * (helixRadius + wobbleB);
        const zB = Math.sin(t + Math.PI) * (helixRadius + wobbleB);
        const posB = new THREE.Vector3(xB, y, zB);

        curvePointsA.push(posA);
        curvePointsB.push(posB);

        const rule = basePairRuleSet[i % basePairRuleSet.length];

        // Backbone Collar Rings at Joint Connections
        const ringA = new THREE.Mesh(torusGeo, rule.matA);
        ringA.position.copy(posA);
        ringA.rotation.x = Math.PI / 2;
        dnaMasterGroup.add(ringA);

        const ringB = new THREE.Mesh(torusGeo, rule.matB);
        ringB.position.copy(posB);
        ringB.rotation.x = Math.PI / 2;
        dnaMasterGroup.add(ringB);

        // Stepped Mechanical Base-Pair Pins with Central Magnetic Gap
        const dirAtoB = new THREE.Vector3().subVectors(posB, posA).normalize();
        const dirBtoA = new THREE.Vector3().subVectors(posA, posB).normalize();
        const totalDist = posA.distanceTo(posB);
        const pinLength = totalDist * 0.38; // 24% center magnetic gap

        // Pin Shaft A (Deep Plum)
        const pinCenterA = new THREE.Vector3().addVectors(posA, dirAtoB.clone().multiplyScalar(pinLength * 0.5));
        const pinGeoA = new THREE.CylinderGeometry(tubeRadius * 0.55, tubeRadius * 0.72, pinLength, 14);
        const pinMeshA = new THREE.Mesh(pinGeoA, matPinShaft);
        pinMeshA.position.copy(pinCenterA);
        pinMeshA.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dirAtoB);
        dnaMasterGroup.add(pinMeshA);

        // Glowing Tip Lens on Pin A
        const tipPosA = new THREE.Vector3().addVectors(posA, dirAtoB.clone().multiplyScalar(pinLength));
        const tipGeoA = new THREE.CylinderGeometry(tubeRadius * 0.82, tubeRadius * 0.82, tubeRadius * 0.45, 16);
        const tipMeshA = new THREE.Mesh(tipGeoA, rule.matA);
        tipMeshA.position.copy(tipPosA);
        tipMeshA.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dirAtoB);
        dnaMasterGroup.add(tipMeshA);

        // Pin Shaft B (Deep Plum)
        const pinCenterB = new THREE.Vector3().addVectors(posB, dirBtoA.clone().multiplyScalar(pinLength * 0.5));
        const pinGeoB = new THREE.CylinderGeometry(tubeRadius * 0.55, tubeRadius * 0.72, pinLength, 14);
        const pinMeshB = new THREE.Mesh(pinGeoB, matPinShaft);
        pinMeshB.position.copy(pinCenterB);
        pinMeshB.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dirBtoA);
        dnaMasterGroup.add(pinMeshB);

        // Glowing Tip Lens on Pin B
        const tipPosB = new THREE.Vector3().addVectors(posB, dirBtoA.clone().multiplyScalar(pinLength));
        const tipGeoB = new THREE.CylinderGeometry(tubeRadius * 0.82, tubeRadius * 0.82, tubeRadius * 0.45, 16);
        const tipMeshB = new THREE.Mesh(tipGeoB, rule.matB);
        tipMeshB.position.copy(tipPosB);
        tipMeshB.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dirBtoA);
        dnaMasterGroup.add(tipMeshB);

        // Central Magnetic Ion Spark (Hovering in Gap)
        const midPoint = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);
        const sparkMesh = new THREE.Mesh(sparkGeo, rule.matA);
        sparkMesh.position.copy(midPoint);
        dnaMasterGroup.add(sparkMesh);
      }

      // ── 6. Continuous Smooth Helical Backbone Tubes ───────────────
      // Strand A: Ruby Red Rail (#C70039)
      const curveA = new THREE.CatmullRomCurve3(curvePointsA, false, 'catmullrom', 0.5);
      const tubeGeoA = new THREE.TubeGeometry(curveA, 300, tubeRadius, 16, false);
      const tubeMeshA = new THREE.Mesh(tubeGeoA, matStrandRuby);
      tubeMeshA.castShadow = true;
      tubeMeshA.receiveShadow = true;
      dnaMasterGroup.add(tubeMeshA);

      // Strand B: Sunflower Gold Rail (#FFC300)
      const curveB = new THREE.CatmullRomCurve3(curvePointsB, false, 'catmullrom', 0.5);
      const tubeGeoB = new THREE.TubeGeometry(curveB, 300, tubeRadius, 16, false);
      const tubeMeshB = new THREE.Mesh(tubeGeoB, matStrandGold);
      tubeMeshB.castShadow = true;
      tubeMeshB.receiveShadow = true;
      dnaMasterGroup.add(tubeMeshB);

      // ── 7. Soft Spherical Bioluminescent BTS Particle Cloud ───────
      const particleCount = isMobile ? 900 : isTablet ? 1600 : 2500;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);
      const colorArray = new Float32Array(particleCount * 3);
      const originalY = new Float32Array(particleCount);
      const phases = new Float32Array(particleCount);

      const particleTexture = createGlowPointTexture();

      // BTS DNA Palette Colors
      const btsParticleColors = [
        new THREE.Color(0x581845), // Deep Plum
        new THREE.Color(0x900C3E), // Wine Red
        new THREE.Color(0xC70039), // Ruby Red
        new THREE.Color(0xFF5733), // Vibrant Coral
        new THREE.Color(0xFFC300), // Sunflower Gold
        new THREE.Color(0xFF8D5B)  // Luminous Peach Accent
      ];

      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const radSpread = helixRadius * 0.65 + Math.random() * (helixRadius * 2.4);
        const py = (Math.random() - 0.5) * (helixHeight * 1.25);

        posArray[i * 3] = Math.cos(theta) * radSpread;
        posArray[i * 3 + 1] = py;
        posArray[i * 3 + 2] = Math.sin(theta) * radSpread;

        originalY[i] = py;
        phases[i] = Math.random() * Math.PI * 2;

        const col = btsParticleColors[Math.floor(Math.random() * btsParticleColors.length)];
        colorArray[i * 3] = col.r;
        colorArray[i * 3 + 1] = col.g;
        colorArray[i * 3 + 2] = col.b;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

      const particleMat = new THREE.PointsMaterial({
        size: isMobile ? 0.32 : 0.42,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.94,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const particleCloud = new THREE.Points(particleGeo, particleMat);
      dnaMasterGroup.add(particleCloud);

      // ── 8. Orbiting Helical Dust Ribbon Streams (BTS Palette) ──────
      const streamCount = isMobile ? 240 : isTablet ? 420 : 650;
      const streamGeo = new THREE.BufferGeometry();
      const streamPos = new Float32Array(streamCount * 3);
      const streamCol = new Float32Array(streamCount * 3);

      for (let i = 0; i < streamCount; i++) {
        const fraction = i / streamCount;
        const t = fraction * Math.PI * 2 * 7.5;
        const r = (helixRadius * 1.3) + Math.sin(fraction * 20.0) * (helixRadius * 0.22);
        const py = (fraction - 0.5) * (helixHeight * 1.1);

        streamPos[i * 3] = Math.cos(t) * r;
        streamPos[i * 3 + 1] = py;
        streamPos[i * 3 + 2] = Math.sin(t) * r;

        const c = btsParticleColors[i % btsParticleColors.length];
        streamCol[i * 3] = c.r;
        streamCol[i * 3 + 1] = c.g;
        streamCol[i * 3 + 2] = c.b;
      }

      streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPos, 3));
      streamGeo.setAttribute('color', new THREE.BufferAttribute(streamCol, 3));

      const streamMat = new THREE.PointsMaterial({
        size: isMobile ? 0.24 : 0.30,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.90,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const streamPoints = new THREE.Points(streamGeo, streamMat);
      dnaMasterGroup.add(streamPoints);

      // ── 9. Dynamic Target Positioning Logic based on Current View ──
      const getTargetCoords = (view: NavigationView, side: 'left' | 'right', screenW: number) => {
        const isSmallScreen = screenW < 768;
        const isMedScreen = screenW >= 768 && screenW < 1100;

        if (isSmallScreen) {
          return { x: 0, scale: 0.85, tilt: 0 };
        }

        // When in appointments or health assessment view, shift DNA squarely into the open empty space
        if (view === 'appointments' || view === 'assessment') {
          if (side === 'left') {
            // Box is on the left -> DNA shifts squarely into open right space
            const shiftX = isMedScreen ? 6.4 : 9.4;
            return { x: shiftX, scale: 1.05, tilt: -0.06 };
          } else {
            // Box is on the right -> DNA shifts squarely into open left space
            const shiftX = isMedScreen ? -6.4 : -9.4;
            return { x: shiftX, scale: 1.05, tilt: 0.06 };
          }
        }

        if (view === 'treatments' || view === 'doctors') {
          return { x: isMedScreen ? 5.2 : 8.2, scale: 0.98, tilt: -0.04 };
        }

        if (view === 'patient-profile' || view === 'pharmacy') {
          return { x: isMedScreen ? 5.4 : 8.0, scale: 1.0, tilt: -0.04 };
        }

        if (view === 'tracker') {
          return { x: isMedScreen ? -5.4 : -8.0, scale: 1.0, tilt: 0.04 };
        }

        // Default home (centered)
        return { x: 0, scale: 1.0, tilt: 0 };
      };

      // ── 10. Smooth Mouse Physics & Scroll Winding ─────────────────
      const state = {
        targetRotX: 0,
        targetRotY: 0,
        currentRotX: 0,
        currentRotY: 0,
        targetTiltZ: 0,
        currentTiltZ: 0,
        targetScrollY: window.scrollY || 0,
        currentScrollY: window.scrollY || 0,
        normMouseX: 0,
        normMouseY: 0
      };

      const handleMouseMove = (e: MouseEvent) => {
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = (e.clientY / window.innerHeight) * 2 - 1;
        state.normMouseX = normX;
        state.normMouseY = normY;
        state.targetRotY = normX * 0.75;
        state.targetRotX = -normY * 0.4;
        state.targetTiltZ = normX * -0.22;
      };

      const handleScroll = () => {
        state.targetScrollY = window.scrollY || 0;
      };

      const handleResize = () => {
        if (!renderer || !camera) return;
        width = window.innerWidth;
        height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleResize);

      // ── 11. Smooth 60fps Animation Loop with Dynamic Easing ───────
      const clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Target coordinates from view & side
        const target = getTargetCoords(currentViewRef.current, boxSideRef.current, width);

        // Smooth Lerp transitions for position and scale when switching views
        dnaMasterGroup.position.x += (target.x - dnaMasterGroup.position.x) * 0.05;
        dnaMasterGroup.scale.x += (target.scale - dnaMasterGroup.scale.x) * 0.05;
        dnaMasterGroup.scale.y += (target.scale - dnaMasterGroup.scale.y) * 0.05;
        dnaMasterGroup.scale.z += (target.scale - dnaMasterGroup.scale.z) * 0.05;

        // Smooth Lerp Physics for cursor & scroll
        state.currentRotX += (state.targetRotX - state.currentRotX) * 0.055;
        state.currentRotY += (state.targetRotY - state.currentRotY) * 0.055;
        state.currentTiltZ += (state.targetTiltZ - state.currentTiltZ) * 0.055;

        state.currentScrollY += (state.targetScrollY - state.currentScrollY) * 0.065;
        const scrollTwistY = state.currentScrollY * 0.0035;

        if (!prefersReducedMotion) {
          // Continuous Helical Rotation + Smooth Scroll Twist + Cursor Response
          dnaMasterGroup.rotation.y = (elapsedTime * 0.22) + scrollTwistY + state.currentRotY;
          dnaMasterGroup.rotation.x = state.currentRotX + Math.sin(elapsedTime * 0.5) * 0.035;
          dnaMasterGroup.rotation.z = state.currentTiltZ + target.tilt + Math.sin(elapsedTime * 0.4) * 0.025;

          // Gentle harmonic floating motion
          dnaMasterGroup.position.y = Math.sin(elapsedTime * 0.7) * 0.45;

          // Particle counter-rotations
          particleCloud.rotation.y = -elapsedTime * 0.12;
          streamPoints.rotation.y = elapsedTime * 0.18;

          // Micro-buoyancy particle floating drift
          const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
          const arr = posAttr.array as Float32Array;
          for (let i = 0; i < particleCount; i++) {
            const idx = i * 3 + 1;
            arr[idx] = originalY[i] + Math.sin(elapsedTime * 1.5 + phases[i]) * 0.5;
          }
          posAttr.needsUpdate = true;

          // Dynamic light breathing pulses with BTS colors
          coralRim.intensity = 5.8 + Math.sin(elapsedTime * 2.2) * 1.6;
          goldRim.intensity = 5.5 + Math.cos(elapsedTime * 2.0) * 1.5;
          rubyLight.intensity = 4.4 + Math.sin(elapsedTime * 1.8) * 1.3;

          // Move interactive cursor spotlight
          cursorGlow.position.x = state.normMouseX * 14.0;
          cursorGlow.position.y = -state.normMouseY * 10.0;
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        particleTexture.dispose();
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn('3D DNA WebGL initialization failed:', err);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1, // Directly above page background, behind all content cards & footer
        opacity: opacity,
        overflow: 'hidden'
      }}
    />
  );
};
