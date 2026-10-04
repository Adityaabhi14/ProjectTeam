// =================================================================
// CarePoint DNA Component System — Exports
// Reusable components, hooks, geometry helpers, and types
// =================================================================

export { DNA3D, DNA3D as MedicalDNA } from './DNA3D';
export type { DNA3DProps } from './DNA3D';

export { buildDNAHelix } from './DNAHelix';
export type { HelixBuildResult } from './DNAHelix';

export { buildDNABasePairs } from './DNABasePairs';
export type { BasePairsBuildResult } from './DNABasePairs';

export { buildDNAParticles } from './DNAParticles';
export type { ParticlesBuildResult } from './DNAParticles';

export { buildDNALighting } from './DNALighting';
export type { LightingRigResult } from './DNALighting';

export { DNAEnvironment } from './DNAEnvironment';
export { DNAControls } from './DNAControls';
export { DNALoader } from './DNALoader';
export { DNAFallback } from './DNAFallback';

export * from '../../lib/dnaConfig';
export * from '../../lib/dnaGeometry';
export * from '../../lib/dnaMaterials';
export * from '../../hooks/useDNAInteraction';
export * from '../../hooks/useResponsiveDNA';
