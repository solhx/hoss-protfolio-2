// src/components/ui/cursor-follower.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useReducedMotion } from 'src/hooks/useReducedMotion';

export function CursorFollower() {
  const prefersReduced = useReducedMotion();
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Inner dot — faster spring
  const dotX = useSpring(cursorX, { stiffness: 400, damping: 28 });
  const dotY = useSpring(cursorY, { stiffness: 400, damping: 28 });

  // Outer ring — slower, trailing spring
  const ringX = useSpring(cursorX, { stiffness: 120, damping: 25 });
  const ringY = useSpring(cursorY, { stiffness: 120, damping: 25 });

  useEffect(() => {
    if (prefersReduced) return;

    // Only show on non-touch devices
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasPointer) return;

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    // Detect hovering over interactive elements
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]')
      ) {
        setIsHoveringInteractive(true);
      }
    };

    const handleOut = () => setIsHoveringInteractive(false);

    window.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mouseover', handleOver, { passive: true });
    document.addEventListener('mouseout', handleOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, [cursorX, cursorY, prefersReduced]);

  if (prefersReduced || !isVisible) return null;

  return (
    <div aria-hidden='true' className='hidden md:block'>
      {/* Inner dot */}
      <motion.div
        className='fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]'
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: 'rgb(16 185 129)', // emerald-500
          mixBlendMode: 'difference',
        }}
        animate={{
          scale: isHoveringInteractive ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Outer ring */}
      <motion.div
        className='fixed top-0 left-0 rounded-full pointer-events-none z-[9998] border-2'
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          borderColor: 'rgb(16 185 129 / 0.5)',
          mixBlendMode: 'difference',
        }}
        animate={{
          width: isHoveringInteractive ? 48 : 32,
          height: isHoveringInteractive ? 48 : 32,
          borderColor: isHoveringInteractive
            ? 'rgb(16 185 129 / 0.8)'
            : 'rgb(16 185 129 / 0.4)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
    </div>
  );
}