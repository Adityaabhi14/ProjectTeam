// =================================================================
// CarePoint DNA Lighting Rig
// Cinematic multi-point lighting: Key, Cyan Rim, Amber Rim, Back Glow, and Cursor Tracking
// =================================================================

import * as THREE from 'three';

export interface LightingRigResult {
  group: THREE.Group;
  keyLight: THREE.DirectionalLight;
  cyanRim: THREE.PointLight;
  amberRim: THREE.PointLight;
  interactiveLight: THREE.PointLight;
  update: (elapsedTime: number, mouseX: number, mouseY: number, proximity: number) => void;
  dispose: () => void;
}

export function buildDNALighting(theme: 'cinematic-dark' | 'clinical-light'): LightingRigResult {
  const group = new THREE.Group();
  group.name = 'DNA_Cinematic_Lighting';

  const isDark = theme === 'cinematic-dark';

  // Ambient light
  const ambient = new THREE.AmbientLight(
    isDark ? 0xffffff : 0xffffff,
    isDark ? 1.4 : 1.8
  );
  group.add(ambient);

  // Key directional light (warm clinical neutral)
  const keyLight = new THREE.DirectionalLight(0xFFF7ED, isDark ? 2.8 : 2.2);
  keyLight.position.set(12, 18, 20);
  group.add(keyLight);

  // Cyan / Teal Rim Light (High contrast sci-fi edge)
  const cyanRim = new THREE.PointLight(0x0EA5E9, isDark ? 4.5 : 3.0, 45);
  cyanRim.position.set(-14, 6, 12);
  group.add(cyanRim);

  // Amber / Coral Warm Rim Light (Complementary warm edge)
  const amberRim = new THREE.PointLight(0xF59E0B, isDark ? 5.2 : 3.5, 45);
  amberRim.position.set(14, -8, 12);
  group.add(amberRim);

  // Deep Forest Green Back Glow Light
  const backGlow = new THREE.PointLight(0x164A41, isDark ? 3.2 : 2.0, 50);
  backGlow.position.set(0, 2, -16);
  group.add(backGlow);

  // Cursor-following interactive spotlight
  const interactiveLight = new THREE.PointLight(0x38BDF8, 3.0, 30);
  interactiveLight.position.set(0, 0, 10);
  group.add(interactiveLight);

  const update = (elapsedTime: number, mouseX: number, mouseY: number, proximity: number) => {
    // Pulse rim lights organically
    amberRim.intensity = (isDark ? 4.8 : 3.2) + Math.sin(elapsedTime * 2.2) * 1.2;
    cyanRim.intensity = (isDark ? 4.2 : 2.8) + Math.cos(elapsedTime * 2.0) * 1.0;

    // Move interactive light based on cursor position
    interactiveLight.position.x = mouseX * 12.0;
    interactiveLight.position.y = mouseY * 8.0;
    interactiveLight.intensity = 2.5 + proximity * 3.5;
  };

  const dispose = () => {
    // lights don't require buffer geometry dispose
  };

  return {
    group,
    keyLight,
    cyanRim,
    amberRim,
    interactiveLight,
    update,
    dispose
  };
}
