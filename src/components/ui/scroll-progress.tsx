// src/components/ui/scroll-progress.tsx
'use client';

import { motion, useScroll, useSpring } from 'motion/react';
import { useReducedMotion } from 'src/hooks/useReducedMotion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const prefersReduced = useReducedMotion();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
  });

  if (prefersReduced) return null;

  return (
    <motion.div
      className='fixed top-0 left-0 right-0 h-[2px] bg-emerald-500 origin-left z-[100]'
      style={{ scaleX }}
    />
  );
}