// =================================================================
// CarePoint DNA Particles Subsystem
// Dense bioluminescent particle cloud & orbiting helical dust ribbons
// BTS DNA Color Palette: #581845, #900C3E, #C70039, #FF5733, #FFC300
// =================================================================

import * as THREE from 'three';
import { DNAMaterialBank } from '../../lib/dnaMaterials';

export interface ParticlesBuildResult {
  group: THREE.Group;
  particleCloud: THREE.Points;
  dustStream: THREE.Points;
  update: (elapsedTime: number) => void;
  dispose: () => void;
}

export function buildDNAParticles(
  particleCount: number,
  dustStreamCount: number,
  materials: DNAMaterialBank,
  height: number,
  radius: number
): ParticlesBuildResult {
  const group = new THREE.Group();
  group.name = 'DNA_Luminescent_Particles';

  // ── 1. Master Bioluminescent Particle Cloud (BTS DNA Palette) ──
  const cloudGeo = new THREE.BufferGeometry();
  const cloudPositions = new Float32Array(particleCount * 3);
  const cloudColors = new Float32Array(particleCount * 3);
  const cloudOriginalY = new Float32Array(particleCount);
  const cloudPhases = new Float32Array(particleCount);

  const btsPalette = [
    new THREE.Color(0x581845), // Deep Plum
    new THREE.Color(0x900C3E), // Wine Red
    new THREE.Color(0xC70039), // Ruby Red
    new THREE.Color(0xFF5733), // Vibrant Coral
    new THREE.Color(0xFFC300), // Sunflower Gold
    new THREE.Color(0xFF8D5B)  // Luminous Peach
  ];

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const radSpread = radius * 0.7 + Math.random() * (radius * 1.8);
    const py = (Math.random() - 0.5) * height * 1.15;

    cloudPositions[i * 3] = Math.cos(theta) * radSpread;
    cloudPositions[i * 3 + 1] = py;
    cloudPositions[i * 3 + 2] = Math.sin(theta) * radSpread;

    cloudOriginalY[i] = py;
    cloudPhases[i] = Math.random() * Math.PI * 2;

    const col = btsPalette[Math.floor(Math.random() * btsPalette.length)];
    cloudColors[i * 3] = col.r;
    cloudColors[i * 3 + 1] = col.g;
    cloudColors[i * 3 + 2] = col.b;
  }

  cloudGeo.setAttribute('position', new THREE.BufferAttribute(cloudPositions, 3));
  cloudGeo.setAttribute('color', new THREE.BufferAttribute(cloudColors, 3));

  const particleCloud = new THREE.Points(cloudGeo, materials.particlePoints);
  group.add(particleCloud);

  // ── 2. Helical Orbiting Dust Stream Ribbons ────────────────────
  const streamGeo = new THREE.BufferGeometry();
  const streamPositions = new Float32Array(dustStreamCount * 3);
  const streamColors = new Float32Array(dustStreamCount * 3);

  for (let i = 0; i < dustStreamCount; i++) {
    const fraction = i / dustStreamCount;
    const t = fraction * Math.PI * 2 * 6.5;
    const r = radius * 1.35 + Math.sin(fraction * 18.0) * (radius * 0.25);
    const py = (fraction - 0.5) * height * 1.05;

    streamPositions[i * 3] = Math.cos(t) * r;
    streamPositions[i * 3 + 1] = py;
    streamPositions[i * 3 + 2] = Math.sin(t) * r;

    const col = btsPalette[i % btsPalette.length];
    streamColors[i * 3] = col.r;
    streamColors[i * 3 + 1] = col.g;
    streamColors[i * 3 + 2] = col.b;
  }

  streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPositions, 3));
  streamGeo.setAttribute('color', new THREE.BufferAttribute(streamColors, 3));

  const dustStream = new THREE.Points(streamGeo, materials.dustStreamPoints);
  group.add(dustStream);

  // ── 3. Dynamic Realtime Motion Update ──────────────────────────
  const update = (elapsedTime: number) => {
    // Gentle counter-rotations
    particleCloud.rotation.y = -elapsedTime * 0.14;
    dustStream.rotation.y = elapsedTime * 0.22;

    // Upward micro-buoyancy drift on positions
    const posAttr = cloudGeo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3 + 1;
      arr[idx] = cloudOriginalY[i] + Math.sin(elapsedTime * 1.5 + cloudPhases[i]) * 0.45;
    }
    posAttr.needsUpdate = true;
  };

  const dispose = () => {
    cloudGeo.dispose();
    streamGeo.dispose();
  };

  return {
    group,
    particleCloud,
    dustStream,
    update,
    dispose
  };
}
