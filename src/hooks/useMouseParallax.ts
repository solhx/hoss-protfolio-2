// src/hooks/useMouseParallax.ts
'use client';

import { useEffect } from 'react';
import { useMotionValue, useSpring } from 'motion/react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Returns spring-animated x/y motion values that respond to
 * cursor position relative to viewport center.
 *
 * Usage:
 *   const { x, y } = useMouseParallax(0.02);
 *   <motion.div style={{ x, y }} />
 */
export function useMouseParallax(strength = 0.02) {
  const prefersReduced = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 50, damping: 20 });
  const y = useSpring(rawY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    if (prefersReduced) return;

    const handler = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      rawX.set((e.clientX - centerX) * strength);
      rawY.set((e.clientY - centerY) * strength);
    };

    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, [strength, rawX, rawY, prefersReduced]);

  return { x, y };
}