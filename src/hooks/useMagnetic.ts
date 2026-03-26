// src/hooks/useMagnetic.ts
'use client';

import { useRef, useState, useCallback } from 'react';
import {
  useMotionValue,
  useSpring,
  type MotionValue,
} from 'motion/react';
import { useReducedMotion } from './useReducedMotion';

interface MagneticReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  isHovered: boolean;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseLeave: () => void;
  handlers: {
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseLeave: () => void;
  };
}

/**
 * Generic magnetic hook — pass the element type to get a correctly-typed ref.
 *
 * @example
 * // For a <div>
 * const magnetic = useMagnetic<HTMLDivElement>(0.15);
 * <div ref={magnetic.ref} onMouseMove={magnetic.handleMouseMove} />
 *
 * @example
 * // For a <button>
 * const magnetic = useMagnetic<HTMLButtonElement>(0.2);
 * <button ref={magnetic.ref} onMouseMove={magnetic.handleMouseMove} />
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(
  strength: number = 0.35,
): MagneticReturn<T> {
  const ref = useRef<T | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);

  const x = useSpring(xRaw, { stiffness: 200, damping: 15, mass: 0.5 });
  const y = useSpring(yRaw, { stiffness: 200, damping: 15, mass: 0.5 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReducedMotion || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      xRaw.set(deltaX);
      yRaw.set(deltaY);
      setIsHovered(true);
    },
    [prefersReducedMotion, strength, xRaw, yRaw],
  );

  const handleMouseLeave = useCallback(() => {
    xRaw.set(0);
    yRaw.set(0);
    setIsHovered(false);
  }, [xRaw, yRaw]);

  return {
    ref,
    x,
    y,
    isHovered,
    handleMouseMove,
    handleMouseLeave,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}