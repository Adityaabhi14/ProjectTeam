// =================================================================
// CarePoint DNA Base Pairs Subsystem
// Builds stepped mechanical pins (A, T, G, C) with glowing tips and magnetic center gap
// =================================================================

import * as THREE from 'three';
import { HelixGeometryResult } from '../../lib/dnaGeometry';
import { DNAMaterialBank } from '../../lib/dnaMaterials';

export interface BasePairsBuildResult {
  group: THREE.Group;
  pins: THREE.Mesh[];
  tips: THREE.Mesh[];
  sparks: THREE.Mesh[];
  dispose: () => void;
}

export function buildDNABasePairs(
  geoData: HelixGeometryResult,
  materials: DNAMaterialBank,
  tubeRadius: number
): BasePairsBuildResult {
  const group = new THREE.Group();
  group.name = 'DNA_Base_Pairs';

  const pins: THREE.Mesh[] = [];
  const tips: THREE.Mesh[] = [];
  const sparks: THREE.Mesh[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  const sparkGeo = new THREE.SphereGeometry(0.12, 14, 14);
  geometriesToDispose.push(sparkGeo);

  geoData.rungs.forEach((rung) => {
    // Determine materials based on 4 bases
    const matA = rung.glowColorA === 0xF59E0B
      ? materials.glowAmber
      : rung.glowColorA === 0x0EA5E9
      ? materials.glowCyan
      : rung.glowColorA === 0x10B981
      ? materials.glowEmerald
      : materials.glowCoral;

    const matB = rung.glowColorB === 0xF59E0B
      ? materials.glowAmber
      : rung.glowColorB === 0x0EA5E9
      ? materials.glowCyan
      : rung.glowColorB === 0x10B981
      ? materials.glowEmerald
      : materials.glowCoral;

    // ── Pin Shaft A ───────────────────────────────────────────────
    const pinGeoA = new THREE.CylinderGeometry(
      tubeRadius * 0.55,
      tubeRadius * 0.72,
      rung.pinLength,
      14
    );
    geometriesToDispose.push(pinGeoA);

    const pinMeshA = new THREE.Mesh(pinGeoA, materials.pinShaft);
    pinMeshA.position.copy(rung.pinCenterA);
    pinMeshA.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rung.dirAtoB);
    group.add(pinMeshA);
    pins.push(pinMeshA);

    // ── Glowing Tip Lens Collar A ─────────────────────────────────
    const tipGeoA = new THREE.CylinderGeometry(
      tubeRadius * 0.78,
      tubeRadius * 0.78,
      tubeRadius * 0.5,
      16
    );
    geometriesToDispose.push(tipGeoA);

    const tipMeshA = new THREE.Mesh(tipGeoA, matA);
    tipMeshA.position.copy(rung.tipPosA);
    tipMeshA.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rung.dirAtoB);
    group.add(tipMeshA);
    tips.push(tipMeshA);

    // ── Pin Shaft B ───────────────────────────────────────────────
    const pinGeoB = new THREE.CylinderGeometry(
      tubeRadius * 0.55,
      tubeRadius * 0.72,
      rung.pinLength,
      14
    );
    geometriesToDispose.push(pinGeoB);

    const pinMeshB = new THREE.Mesh(pinGeoB, materials.pinShaft);
    pinMeshB.position.copy(rung.pinCenterB);
    pinMeshB.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rung.dirBtoA);
    group.add(pinMeshB);
    pins.push(pinMeshB);

    // ── Glowing Tip Lens Collar B ─────────────────────────────────
    const tipGeoB = new THREE.CylinderGeometry(
      tubeRadius * 0.78,
      tubeRadius * 0.78,
      tubeRadius * 0.5,
      16
    );
    geometriesToDispose.push(tipGeoB);

    const tipMeshB = new THREE.Mesh(tipGeoB, matB);
    tipMeshB.position.copy(rung.tipPosB);
    tipMeshB.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rung.dirBtoA);
    group.add(tipMeshB);
    tips.push(tipMeshB);

    // ── Central Magnetic Ion Spark (Hovering in Gap) ───────────────
    const sparkMesh = new THREE.Mesh(sparkGeo, matA);
    sparkMesh.position.copy(rung.midPoint);
    group.add(sparkMesh);
    sparks.push(sparkMesh);
  });

  const dispose = () => {
    geometriesToDispose.forEach(g => g.dispose());
  };

  return {
    group,
    pins,
    tips,
    sparks,
    dispose
  };
}
