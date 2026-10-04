// =================================================================
// CarePoint DNA Materials Manager
// Palette: BTS DNA Color Palette (#581845, #900C3E, #C70039, #FF5733, #FFC300)
// Physically-based materials with metallic reflections, roughness variation,
// emissive bloom rings, and additive glowing particle blending.
// =================================================================

import * as THREE from 'three';

export interface DNAMaterialBank {
  titaniumRail: THREE.MeshStandardMaterial;
  strandRuby: THREE.MeshStandardMaterial;
  strandGold: THREE.MeshStandardMaterial;
  pinShaft: THREE.MeshStandardMaterial;
  jointChrome: THREE.MeshStandardMaterial;
  glowRuby: THREE.MeshStandardMaterial;
  glowCoral: THREE.MeshStandardMaterial;
  glowGold: THREE.MeshStandardMaterial;
  glowWine: THREE.MeshStandardMaterial;
  glowPlum: THREE.MeshStandardMaterial;
  // Aliases for compatibility
  glowAmber: THREE.MeshStandardMaterial;
  glowCyan: THREE.MeshStandardMaterial;
  glowEmerald: THREE.MeshStandardMaterial;
  sparkSparkle: THREE.MeshBasicMaterial;
  particlePoints: THREE.PointsMaterial;
  dustStreamPoints: THREE.PointsMaterial;
  dispose: () => void;
}

export function createDNAMaterials(): DNAMaterialBank {
  // Titanium / Gunmetal backbone
  const titaniumRail = new THREE.MeshStandardMaterial({
    color: 0x581845,
    emissive: 0x2A0B20,
    emissiveIntensity: 0.25,
    metalness: 0.88,
    roughness: 0.22,
    envMapIntensity: 1.2
  });

  // BTS Strand A (Ruby Red #C70039)
  const strandRuby = new THREE.MeshStandardMaterial({
    color: 0xC70039,
    emissive: 0x900C3E,
    emissiveIntensity: 0.55,
    metalness: 0.86,
    roughness: 0.18,
    envMapIntensity: 1.4
  });

  // BTS Strand B (Sunflower Gold #FFC300)
  const strandGold = new THREE.MeshStandardMaterial({
    color: 0xFFC300,
    emissive: 0xFF5733,
    emissiveIntensity: 0.48,
    metalness: 0.86,
    roughness: 0.18,
    envMapIntensity: 1.4
  });

  // Pin shaft material with Deep Plum finish (#581845)
  const pinShaft = new THREE.MeshStandardMaterial({
    color: 0x581845,
    emissive: 0x2A0B20,
    emissiveIntensity: 0.25,
    metalness: 0.90,
    roughness: 0.22
  });

  // Polished connector collar joints (#900C3E)
  const jointChrome = new THREE.MeshStandardMaterial({
    color: 0x900C3E,
    metalness: 0.92,
    roughness: 0.18
  });

  // High-intensity emissive BTS materials
  const glowRuby = new THREE.MeshStandardMaterial({
    color: 0xC70039,
    emissive: 0xC70039,
    emissiveIntensity: 3.6,
    roughness: 0.1,
    metalness: 0.3
  });

  const glowCoral = new THREE.MeshStandardMaterial({
    color: 0xFF5733,
    emissive: 0xFF5733,
    emissiveIntensity: 3.6,
    roughness: 0.1,
    metalness: 0.3
  });

  const glowGold = new THREE.MeshStandardMaterial({
    color: 0xFFC300,
    emissive: 0xFFC300,
    emissiveIntensity: 3.5,
    roughness: 0.1,
    metalness: 0.3
  });

  const glowWine = new THREE.MeshStandardMaterial({
    color: 0x900C3E,
    emissive: 0x900C3E,
    emissiveIntensity: 3.2,
    roughness: 0.1,
    metalness: 0.3
  });

  const glowPlum = new THREE.MeshStandardMaterial({
    color: 0x581845,
    emissive: 0x900C3E,
    emissiveIntensity: 2.8,
    roughness: 0.1,
    metalness: 0.3
  });

  // Aliases mapped to BTS palette
  const glowAmber = glowGold;
  const glowCyan = glowCoral;
  const glowEmerald = glowRuby;

  // Center ion spark material (#FF5733 / #FFC300)
  const sparkSparkle = new THREE.MeshBasicMaterial({
    color: 0xFFC300,
    transparent: true,
    opacity: 0.95
  });

  // Bioluminescent micro-particles (Additive blending for luminous glow)
  const particlePoints = new THREE.PointsMaterial({
    size: 0.36,
    vertexColors: true,
    transparent: true,
    opacity: 0.94,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  // Outer orbital dust stream points
  const dustStreamPoints = new THREE.PointsMaterial({
    size: 0.28,
    vertexColors: true,
    transparent: true,
    opacity: 0.90,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const dispose = () => {
    titaniumRail.dispose();
    strandRuby.dispose();
    strandGold.dispose();
    pinShaft.dispose();
    jointChrome.dispose();
    glowRuby.dispose();
    glowCoral.dispose();
    glowGold.dispose();
    glowWine.dispose();
    glowPlum.dispose();
    sparkSparkle.dispose();
    particlePoints.dispose();
    dustStreamPoints.dispose();
  };

  return {
    titaniumRail,
    strandRuby,
    strandGold,
    pinShaft,
    jointChrome,
    glowRuby,
    glowCoral,
    glowGold,
    glowWine,
    glowPlum,
    glowAmber,
    glowCyan,
    glowEmerald,
    sparkSparkle,
    particlePoints,
    dustStreamPoints,
    dispose
  };
}
