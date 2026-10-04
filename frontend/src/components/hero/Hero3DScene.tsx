// =================================================================
// CarePoint Health Management System — Enhanced 3D Medical DNA Hero Visual
// Three.js interactive biological DNA double-helix + pulsating vital core + cursor magnetism
// =================================================================

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Activity, Heart, ShieldCheck, Dna } from 'lucide-react';

export const Hero3DScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  const [activeHeartRate, setActiveHeartRate] = useState(72);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animId: number;

    try {
      scene = new THREE.Scene();

      const width = container.clientWidth || 520;
      const height = container.clientHeight || 520;
      camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
      camera.position.set(0, 0, 15);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const mainGroup = new THREE.Group();
      scene.add(mainGroup);

      // ── 1. Central Bio-Lattice Core ──────────────────────────────
      const coreRadius = 2.8;
      const coreGeo = new THREE.IcosahedronGeometry(coreRadius, 2);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x164A41,
        wireframe: true,
        transparent: true,
        opacity: 0.32
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      mainGroup.add(coreMesh);

      // Inner pulsating bio-nucleus
      const nucleusGeo = new THREE.SphereGeometry(1.3, 32, 32);
      const nucleusMat = new THREE.MeshBasicMaterial({
        color: 0x2F7D6D,
        transparent: true,
        opacity: 0.28
      });
      const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
      mainGroup.add(nucleusMesh);

      // ── 2. Detailed DNA Double Helix Strand ──────────────────────
      const helixGroup = new THREE.Group();
      const numPoints = 72;
      const helixRadius = 3.8;
      const heightSpan = 11.5;
      const turns = 2.8;

      for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * Math.PI * 2 * turns;
        const y = ((i / numPoints) - 0.5) * heightSpan;
        const x1 = Math.cos(t) * helixRadius;
        const z1 = Math.sin(t) * helixRadius;
        const x2 = Math.cos(t + Math.PI) * helixRadius;
        const z2 = Math.sin(t + Math.PI) * helixRadius;

        // Strand 1 Node (Forest Green / Teal)
        const nodeGeo1 = new THREE.SphereGeometry(0.14, 16, 16);
        const nodeMat1 = new THREE.MeshBasicMaterial({
          color: i % 4 === 0 ? 0xE8795B : 0x2F7D6D
        });
        const m1 = new THREE.Mesh(nodeGeo1, nodeMat1);
        m1.position.set(x1, y, z1);
        helixGroup.add(m1);

        // Strand 2 Node (Coral Accent / Teal)
        const nodeGeo2 = new THREE.SphereGeometry(0.14, 16, 16);
        const nodeMat2 = new THREE.MeshBasicMaterial({
          color: i % 4 === 0 ? 0x164A41 : 0xE8795B
        });
        const m2 = new THREE.Mesh(nodeGeo2, nodeMat2);
        m2.position.set(x2, y, z2);
        helixGroup.add(m2);

        // Connected Base Pairs (Hydrogen Bonds)
        if (i % 2 === 0) {
          const pairGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x1, y, z1),
            new THREE.Vector3(x2, y, z2)
          ]);
          const pairMat = new THREE.LineBasicMaterial({
            color: i % 4 === 0 ? 0xE8795B : 0x164A41,
            transparent: true,
            opacity: 0.38
          });
          const pairLine = new THREE.Line(pairGeo, pairMat);
          helixGroup.add(pairLine);
        }
      }

      mainGroup.add(helixGroup);

      // ── 3. Ambient Medical Data Particles ────────────────────────
      const particleCount = window.innerWidth < 768 ? 80 : 160;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 4.2 + Math.random() * 3.8;

        posArray[i] = r * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = r * Math.cos(phi);
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.16,
        color: 0x2F7D6D,
        transparent: true,
        opacity: 0.7
      });
      const particleSystem = new THREE.Points(particleGeo, particleMat);
      mainGroup.add(particleSystem);

      // ── 4. Equatorial Health Pulse Ring ──────────────────────────
      const ringGeo = new THREE.RingGeometry(4.4, 4.6, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xE8795B,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.2;
      mainGroup.add(ringMesh);

      // ── 5. Mouse Lerp Interaction ────────────────────────────────
      let mouseX = 0;
      let mouseY = 0;
      let targetRotX = 0;
      let targetRotY = 0;
      let currentRotX = 0;
      let currentRotY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotY = mouseX * 0.75;
        targetRotX = mouseY * 0.55;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          const rect = container.getBoundingClientRect();
          mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
          mouseY = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
          targetRotY = mouseX * 0.75;
          targetRotX = mouseY * 0.55;
        }
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });

      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };

      window.addEventListener('resize', handleResize);

      // ── Animation Loop ──────────────────────────────────────────
      const clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smooth Lerp for Mouse Rotation
        currentRotX += (targetRotX - currentRotX) * 0.05;
        currentRotY += (targetRotY - currentRotY) * 0.05;

        // Continuous Organic Rotations
        helixGroup.rotation.y = elapsedTime * 0.32;
        coreMesh.rotation.y = -elapsedTime * 0.18;
        coreMesh.rotation.x = elapsedTime * 0.12;
        particleSystem.rotation.y = -elapsedTime * 0.15;
        ringMesh.rotation.z = elapsedTime * 0.22;

        // Mouse Parallax Influence
        mainGroup.rotation.y = currentRotY + (elapsedTime * 0.1);
        mainGroup.rotation.x = currentRotX;
        mainGroup.position.x = currentRotY * 0.5;

        // Biological Heartbeat Pulse Simulation
        const pulse = 1 + Math.sin(elapsedTime * 2.2) * 0.05;
        nucleusMesh.scale.set(pulse, pulse, pulse);

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('resize', handleResize);
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn('Three.js rendering fallback triggered:', err);
      setHasError(true);
    }
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '440px' }}>
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '440px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab'
        }}
      />

      {/* Fallback Display if WebGL is disabled */}
      {hasError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, #E7F3F0 0%, #F8F6F0 70%)',
            borderRadius: '24px'
          }}
        >
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <Activity size={56} color="#164A41" />
            <h3 style={{ marginTop: '12px', color: '#164A41' }}>Bio-Medical Architecture</h3>
            <p style={{ color: '#5F6E68', fontSize: '0.875rem' }}>CarePoint Living Health Network</p>
          </div>
        </div>
      )}

      {/* Floating Tactical Healthcare Data Badges */}
      <div
        style={{
          position: 'absolute',
          top: '12%',
          left: '3%',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E0D6',
          borderRadius: '16px',
          padding: '12px 18px',
          boxShadow: '0 8px 24px -4px rgba(22, 74, 65, 0.10)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          pointerEvents: 'auto',
          zIndex: 10
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#FDF1EE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Heart size={20} color="#E8795B" />
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8A9993', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Living Telemetry
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17201D' }}>{activeHeartRate}</span>
            <span style={{ fontSize: '0.78rem', color: '#5F6E68', fontWeight: 600 }}>BPM · Normal Sinus</span>
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '4%',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E0D6',
          borderRadius: '16px',
          padding: '12px 18px',
          boxShadow: '0 8px 24px -4px rgba(22, 74, 65, 0.10)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          pointerEvents: 'auto',
          zIndex: 10
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#E7F3F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Dna size={20} color="#164A41" />
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8A9993', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Connected Care
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#164A41' }}>
            Living Health Network
          </div>
        </div>
      </div>
    </div>
  );
};
