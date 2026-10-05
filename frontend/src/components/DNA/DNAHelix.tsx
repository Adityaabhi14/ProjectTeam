// =================================================================
// CarePoint DNA Helix Subsystem
// Builds the procedural CatmullRom titanium helical rails and joint rings
// =================================================================

import * as THREE from 'three';
import { HelixGeometryResult } from '../../lib/dnaGeometry';
import { DNAMaterialBank } from '../../lib/dnaMaterials';

export interface HelixBuildResult {
  group: THREE.Group;
  tubes: THREE.Mesh[];
  rings: THREE.Mesh[];
  dispose: () => void;
}

export function buildDNAHelix(
  geoData: HelixGeometryResult,
  materials: DNAMaterialBank,
  tubeRadius: number
): HelixBuildResult {
  const group = new THREE.Group();
  group.name = 'DNA_Helix_Rails';

  const tubes: THREE.Mesh[] = [];
  const rings: THREE.Mesh[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  // ── 1. Titanium Backbone Strand A ───────────────────────────────
  const tubeGeoA = new THREE.TubeGeometry(geoData.curveA, 240, tubeRadius, 14, false);
  geometriesToDispose.push(tubeGeoA);
  const tubeMeshA = new THREE.Mesh(tubeGeoA, materials.titaniumRail);
  tubeMeshA.castShadow = true;
  tubeMeshA.receiveShadow = true;
  group.add(tubeMeshA);
  tubes.push(tubeMeshA);

  // ── 2. Titanium Backbone Strand B ───────────────────────────────
  const tubeGeoB = new THREE.TubeGeometry(geoData.curveB, 240, tubeRadius, 14, false);
  geometriesToDispose.push(tubeGeoB);
  const tubeMeshB = new THREE.Mesh(tubeGeoB, materials.titaniumRail);
  tubeMeshB.castShadow = true;
  tubeMeshB.receiveShadow = true;
  group.add(tubeMeshB);
  tubes.push(tubeMeshB);

  // ── 3. Glowing Collar Rings Encircling Rail Joints ──────────────
  const torusGeo = new THREE.TorusGeometry(tubeRadius * 1.55, tubeRadius * 0.38, 12, 20);
  geometriesToDispose.push(torusGeo);

  geoData.rungs.forEach((rung, index) => {
    // Ring on Strand A
    const ringMatA = rung.baseType.startsWith('A') || rung.baseType.endsWith('A')
      ? materials.glowAmber
      : materials.glowEmerald;
    const ringA = new THREE.Mesh(torusGeo, ringMatA);
    ringA.position.copy(rung.posA);
    ringA.rotation.x = Math.PI / 2;
    group.add(ringA);
    rings.push(ringA);

    // Ring on Strand B
    const ringMatB = rung.baseType.startsWith('T') || rung.baseType.endsWith('T')
      ? materials.glowCyan
      : materials.glowCoral;
    const ringB = new THREE.Mesh(torusGeo, ringMatB);
    ringB.position.copy(rung.posB);
    ringB.rotation.x = Math.PI / 2;
    group.add(ringB);
    rings.push(ringB);
  });

  const dispose = () => {
    geometriesToDispose.forEach(g => g.dispose());
  };

  return {
    group,
    tubes,
    rings,
    dispose
  };
}
