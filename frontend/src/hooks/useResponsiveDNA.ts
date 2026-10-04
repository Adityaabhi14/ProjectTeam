// =================================================================
// CarePoint Responsive DNA & Quality Settings Hook
// Detects viewport, WebGL capability, battery/power tier, and reduced-motion.
// =================================================================

import { useState, useEffect } from 'react';
import { DNAQuality } from '../lib/dnaConfig';

export interface ResponsiveDNAState {
  quality: 'high' | 'medium' | 'low';
  isMobile: boolean;
  isTablet: boolean;
  prefersReducedMotion: boolean;
  hasWebGL: boolean;
  pixelRatio: number;
}

export function useResponsiveDNA(requestedQuality: DNAQuality = 'auto'): ResponsiveDNAState {
  const [state, setState] = useState<ResponsiveDNAState>(() => {
    const isClient = typeof window !== 'undefined';
    const isMobile = isClient ? window.innerWidth < 768 : false;
    const isTablet = isClient ? window.innerWidth >= 768 && window.innerWidth < 1024 : false;
    const prefersReducedMotion = isClient ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

    let hasWebGL = true;
    if (isClient) {
      try {
        const canvas = document.createElement('canvas');
        hasWebGL = Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch {
        hasWebGL = false;
      }
    }

    let quality: 'high' | 'medium' | 'low' = 'high';
    if (requestedQuality !== 'auto') {
      quality = requestedQuality;
    } else {
      if (isMobile || prefersReducedMotion) quality = 'low';
      else if (isTablet) quality = 'medium';
      else quality = 'high';
    }

    const pixelRatio = isClient ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    return {
      quality,
      isMobile,
      isTablet,
      prefersReducedMotion,
      hasWebGL,
      pixelRatio
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let quality: 'high' | 'medium' | 'low' = 'high';
      if (requestedQuality !== 'auto') {
        quality = requestedQuality;
      } else {
        if (isMobile || prefersReducedMotion) quality = 'low';
        else if (isTablet) quality = 'medium';
        else quality = 'high';
      }

      setState(prev => ({
        ...prev,
        isMobile,
        isTablet,
        prefersReducedMotion,
        quality
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [requestedQuality]);

  return state;
}
