// =================================================================
// CarePoint DNA Engine — Configuration Presets & Types
// Defines variant parameters, LOD tiers, and color schemes
// =================================================================

export type DNAVariant = 'hero' | 'assessment' | 'tracker' | 'compact';
export type DNAQuality = 'auto' | 'high' | 'medium' | 'low';

export interface DNAConfig {
  radius: number;
  height: number;
  turns: number;
  numRungs: number;
  tubeRadius: number;
  particleCount: number;
  dustStreamCount: number;
  cameraDistance: number;
  fov: number;
  rotationSpeed: number;
  floatAmplitude: number;
  showLegend?: boolean;
  showControls?: boolean;
  theme: 'cinematic-dark' | 'clinical-light';
}

export const DNA_PRESETS: Record<DNAVariant, Record<'high' | 'medium' | 'low', DNAConfig>> = {
  hero: {
    high: {
      radius: 4.8,
      height: 38.0,
      turns: 3.4,
      numRungs: 72,
      tubeRadius: 0.24,
      particleCount: 1600,
      dustStreamCount: 450,
      cameraDistance: 22,
      fov: 42,
      rotationSpeed: 0.22,
      floatAmplitude: 0.5,
      showLegend: true,
      showControls: true,
      theme: 'cinematic-dark'
    },
    medium: {
      radius: 4.2,
      height: 32.0,
      turns: 2.8,
      numRungs: 48,
      tubeRadius: 0.22,
      particleCount: 900,
      dustStreamCount: 250,
      cameraDistance: 20,
      fov: 44,
      rotationSpeed: 0.20,
      floatAmplitude: 0.35,
      showLegend: true,
      showControls: true,
      theme: 'cinematic-dark'
    },
    low: {
      radius: 3.6,
      height: 26.0,
      turns: 2.2,
      numRungs: 32,
      tubeRadius: 0.20,
      particleCount: 450,
      dustStreamCount: 120,
      cameraDistance: 18,
      fov: 46,
      rotationSpeed: 0.16,
      floatAmplitude: 0.2,
      showLegend: false,
      showControls: false,
      theme: 'cinematic-dark'
    }
  },
  assessment: {
    high: {
      radius: 3.6,
      height: 24.0,
      turns: 2.4,
      numRungs: 44,
      tubeRadius: 0.20,
      particleCount: 800,
      dustStreamCount: 200,
      cameraDistance: 16,
      fov: 40,
      rotationSpeed: 0.25,
      floatAmplitude: 0.3,
      showLegend: true,
      showControls: false,
      theme: 'cinematic-dark'
    },
    medium: {
      radius: 3.2,
      height: 20.0,
      turns: 2.0,
      numRungs: 32,
      tubeRadius: 0.18,
      particleCount: 500,
      dustStreamCount: 120,
      cameraDistance: 15,
      fov: 42,
      rotationSpeed: 0.22,
      floatAmplitude: 0.25,
      showLegend: true,
      showControls: false,
      theme: 'cinematic-dark'
    },
    low: {
      radius: 2.8,
      height: 16.0,
      turns: 1.6,
      numRungs: 24,
      tubeRadius: 0.16,
      particleCount: 250,
      dustStreamCount: 60,
      cameraDistance: 14,
      fov: 45,
      rotationSpeed: 0.18,
      floatAmplitude: 0.15,
      showLegend: false,
      showControls: false,
      theme: 'cinematic-dark'
    }
  },
  tracker: {
    high: {
      radius: 3.2,
      height: 22.0,
      turns: 2.2,
      numRungs: 38,
      tubeRadius: 0.18,
      particleCount: 700,
      dustStreamCount: 180,
      cameraDistance: 15,
      fov: 40,
      rotationSpeed: 0.28,
      floatAmplitude: 0.25,
      showLegend: false,
      showControls: false,
      theme: 'cinematic-dark'
    },
    medium: {
      radius: 2.8,
      height: 18.0,
      turns: 1.8,
      numRungs: 28,
      tubeRadius: 0.16,
      particleCount: 400,
      dustStreamCount: 100,
      cameraDistance: 14,
      fov: 42,
      rotationSpeed: 0.24,
      floatAmplitude: 0.2,
      showLegend: false,
      showControls: false,
      theme: 'cinematic-dark'
    },
    low: {
      radius: 2.4,
      height: 14.0,
      turns: 1.5,
      numRungs: 20,
      tubeRadius: 0.14,
      particleCount: 200,
      dustStreamCount: 50,
      cameraDistance: 13,
      fov: 45,
      rotationSpeed: 0.18,
      floatAmplitude: 0.1,
      showLegend: false,
      showControls: false,
      theme: 'cinematic-dark'
    }
  },
  compact: {
    high: {
      radius: 2.6,
      height: 16.0,
      turns: 1.8,
      numRungs: 26,
      tubeRadius: 0.16,
      particleCount: 400,
      dustStreamCount: 90,
      cameraDistance: 12,
      fov: 40,
      rotationSpeed: 0.3,
      floatAmplitude: 0.2,
      showLegend: false,
      showControls: false,
      theme: 'cinematic-dark'
    },
    medium: {
      radius: 2.4,
      height: 14.0,
      turns: 1.5,
      numRungs: 20,
      tubeRadius: 0.14,
      particleCount: 250,
      dustStreamCount: 60,
      cameraDistance: 11,
      fov: 42,
      rotationSpeed: 0.25,
      floatAmplitude: 0.15,
      showLegend: false,
      showControls: false,
      theme: 'cinematic-dark'
    },
    low: {
      radius: 2.0,
      height: 12.0,
      turns: 1.2,
      numRungs: 16,
      tubeRadius: 0.12,
      particleCount: 120,
      dustStreamCount: 30,
      cameraDistance: 10,
      fov: 45,
      rotationSpeed: 0.2,
      floatAmplitude: 0.1,
      showLegend: false,
      showControls: false,
      theme: 'cinematic-dark'
    }
  }
};
