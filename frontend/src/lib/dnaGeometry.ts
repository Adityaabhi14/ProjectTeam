// =================================================================
// CarePoint DNA Geometry Engine
// Mathematical models for double-helix strands, stepped mechanical base pins,
// magnetic gaps, collar rings, and orbiting particle trajectories.
// =================================================================

import * as THREE from 'three';

export interface HelixRungData {
  index: number;
  posA: THREE.Vector3;
  posB: THREE.Vector3;
  midPoint: THREE.Vector3;
  dirAtoB: THREE.Vector3;
  dirBtoA: THREE.Vector3;
  pinCenterA: THREE.Vector3;
  pinCenterB: THREE.Vector3;
  tipPosA: THREE.Vector3;
  tipPosB: THREE.Vector3;
  pinLength: number;
  baseType: 'AT' | 'TA' | 'GC' | 'CG';
  glowColorA: number;
  glowColorB: number;
  baseNameA: string;
  baseNameB: string;
}

export interface HelixGeometryResult {
  curveA: THREE.CatmullRomCurve3;
  curveB: THREE.CatmullRomCurve3;
  pointsA: THREE.Vector3[];
  pointsB: THREE.Vector3[];
  rungs: HelixRungData[];
}

// CarePoint Biomedical Color Constants
export const DNA_COLORS = {
  adenine: 0xF59E0B,   // Amber
  thymine: 0x0EA5E9,   // Cyan
  guanine: 0x10B981,   // Emerald
  cytosine: 0xE8795B,  // Coral
  titanium: 0x1E293B,  // Dark slate titanium
  pinShaft: 0x334155,  // Metallic pin shaft
  jointChrome: 0x64748B // Polished mechanical joint
};

export function generateDNAStructure(
  radius: number,
  height: number,
  turns: number,
  numRungs: number
): HelixGeometryResult {
  const pointsA: THREE.Vector3[] = [];
  const pointsB: THREE.Vector3[] = [];
  const rungs: HelixRungData[] = [];

  const baseTypes: Array<'AT' | 'TA' | 'GC' | 'CG'> = ['AT', 'GC', 'TA', 'CG'];

  for (let i = 0; i < numRungs; i++) {
    const fraction = i / (numRungs - 1);
    const angle = fraction * Math.PI * 2 * turns;
    const y = (fraction - 0.5) * height;

    // Subtle natural organic variations
    const organicWobbleA = Math.sin(fraction * 12.0) * 0.08;
    const organicWobbleB = Math.cos(fraction * 12.0) * 0.08;

    const rA = radius + organicWobbleA;
    const rB = radius + organicWobbleB;

    // Position of Strand A
    const xA = Math.cos(angle) * rA;
    const zA = Math.sin(angle) * rA;
    const posA = new THREE.Vector3(xA, y, zA);

    // Position of Strand B (180 degrees offset around helix axis)
    const xB = Math.cos(angle + Math.PI) * rB;
    const zB = Math.sin(angle + Math.PI) * rB;
    const posB = new THREE.Vector3(xB, y, zB);

    pointsA.push(posA);
    pointsB.push(posB);

    // Vector directions
    const dirAtoB = new THREE.Vector3().subVectors(posB, posA).normalize();
    const dirBtoA = new THREE.Vector3().subVectors(posA, posB).normalize();
    const totalDist = posA.distanceTo(posB);

    // Base pair pin length (each pin covers ~38% of total distance, leaving a 24% magnetic gap in the center)
    const pinLength = totalDist * 0.38;

    // Center of Pin A and Pin B
    const pinCenterA = new THREE.Vector3().addVectors(posA, dirAtoB.clone().multiplyScalar(pinLength * 0.5));
    const pinCenterB = new THREE.Vector3().addVectors(posB, dirBtoA.clone().multiplyScalar(pinLength * 0.5));

    // Tip positions for glowing collar lenses
    const tipPosA = new THREE.Vector3().addVectors(posA, dirAtoB.clone().multiplyScalar(pinLength));
    const tipPosB = new THREE.Vector3().addVectors(posB, dirBtoA.clone().multiplyScalar(pinLength));

    // Midpoint where magnetic ion spark hovers
    const midPoint = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);

    // Base type assignment (A-T or G-C pairs)
    const baseType = baseTypes[i % baseTypes.length];
    let glowColorA = DNA_COLORS.adenine;
    let glowColorB = DNA_COLORS.thymine;
    let baseNameA = 'Adenine (A)';
    let baseNameB = 'Thymine (T)';

    if (baseType === 'TA') {
      glowColorA = DNA_COLORS.thymine;
      glowColorB = DNA_COLORS.adenine;
      baseNameA = 'Thymine (T)';
      baseNameB = 'Adenine (A)';
    } else if (baseType === 'GC') {
      glowColorA = DNA_COLORS.guanine;
      glowColorB = DNA_COLORS.cytosine;
      baseNameA = 'Guanine (G)';
      baseNameB = 'Cytosine (C)';
    } else if (baseType === 'CG') {
      glowColorA = DNA_COLORS.cytosine;
      glowColorB = DNA_COLORS.guanine;
      baseNameA = 'Cytosine (C)';
      baseNameB = 'Guanine (G)';
    }

    rungs.push({
      index: i,
      posA,
      posB,
      midPoint,
      dirAtoB,
      dirBtoA,
      pinCenterA,
      pinCenterB,
      tipPosA,
      tipPosB,
      pinLength,
      baseType,
      glowColorA,
      glowColorB,
      baseNameA,
      baseNameB
    });
  }

  const curveA = new THREE.CatmullRomCurve3(pointsA, false, 'catmullrom', 0.5);
  const curveB = new THREE.CatmullRomCurve3(pointsB, false, 'catmullrom', 0.5);

  return {
    curveA,
    curveB,
    pointsA,
    pointsB,
    rungs
  };
}
