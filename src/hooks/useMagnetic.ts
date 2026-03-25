'use client';

import { useRef, useCallback, type RefObject, type MouseEvent } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface MagneticReturn {
  ref: RefObject<HTMLDivElement | null>;
  handlers: {
    onMouseMove: (e: MouseEvent) => void;
    onMouseLeave: () => void;
  };
}

export function useMagnetic(strength: number = 0.3): MagneticReturn {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (prefersReduced || !ref.current) return;

      const { left, top, width, height } =
        ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      ref.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      ref.current.style.transition =
        'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)';
    },
    [strength, prefersReduced],
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0px, 0px)';
    ref.current.style.transition =
      'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
  }, []);

  return {
    ref,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}