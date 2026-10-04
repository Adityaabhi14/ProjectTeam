// =================================================================
// CarePoint DNA Interaction Hook
// Smooth mouse physics, lerp interpolation, proximity detection,
// and touch drag controls with momentum.
// =================================================================

import { useRef, useEffect, useCallback } from 'react';

export interface InteractionState {
  targetRotX: number;
  targetRotY: number;
  targetTiltZ: number;
  currentRotX: number;
  currentRotY: number;
  currentTiltZ: number;
  isHovered: boolean;
  isDragging: boolean;
  proximityScore: number; // 0 to 1
  scrollOffset: number;
}

export function useDNAInteraction(enabled = true) {
  const stateRef = useRef<InteractionState>({
    targetRotX: 0,
    targetRotY: 0,
    targetTiltZ: 0,
    currentRotX: 0,
    currentRotY: 0,
    currentTiltZ: 0,
    isHovered: false,
    isDragging: false,
    proximityScore: 0,
    scrollOffset: 0
  });

  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);

  const updateScroll = useCallback(() => {
    stateRef.current.scrollOffset = window.scrollY || 0;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent, targetElem?: HTMLElement | null) => {
    if (!enabled) return;
    const state = stateRef.current;

    let normX = 0;
    let normY = 0;

    if (targetElem) {
      const rect = targetElem.getBoundingClientRect();
      const elemCenterX = rect.left + rect.width / 2;
      const elemCenterY = rect.top + rect.height / 2;
      const distFromCenter = Math.hypot(e.clientX - elemCenterX, e.clientY - elemCenterY);
      const maxDist = Math.max(window.innerWidth, window.innerHeight) * 0.6;
      state.proximityScore = Math.max(0, 1 - distFromCenter / maxDist);

      normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    } else {
      normX = (e.clientX / window.innerWidth) * 2 - 1;
      normY = (e.clientY / window.innerHeight) * 2 - 1;
      state.proximityScore = 0.5;
    }

    // Smooth bounded rotation targets
    state.targetRotY = normX * 0.85;
    state.targetRotX = -normY * 0.45;
    state.targetTiltZ = normX * -0.25;
  }, [enabled]);

  const handleMouseEnter = useCallback(() => {
    stateRef.current.isHovered = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const state = stateRef.current;
    state.isHovered = false;
    state.targetRotX = 0;
    state.targetRotY = 0;
    state.targetTiltZ = 0;
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      stateRef.current.isDragging = true;
      lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!stateRef.current.isDragging || !lastTouchRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastTouchRef.current.x;
    const deltaY = touch.clientY - lastTouchRef.current.y;

    stateRef.current.targetRotY += deltaX * 0.008;
    stateRef.current.targetRotX += deltaY * 0.008;

    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(() => {
    stateRef.current.isDragging = false;
    lastTouchRef.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateScroll);
    };
  }, [updateScroll]);

  // Step function to call per frame in RAF loop
  const step = (lerpFactor = 0.055) => {
    const s = stateRef.current;
    s.currentRotX += (s.targetRotX - s.currentRotX) * lerpFactor;
    s.currentRotY += (s.targetRotY - s.currentRotY) * lerpFactor;
    s.currentTiltZ += (s.targetTiltZ - s.currentTiltZ) * lerpFactor;
    return s;
  };

  return {
    stateRef,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    step
  };
}
