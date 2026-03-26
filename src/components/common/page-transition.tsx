// src/components/common/page-transition.tsx
'use client';

import { motion } from 'motion/react';
import { useReducedMotion } from 'src/hooks/useReducedMotion';
import { pageTransition } from 'src/lib/motion';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      variants={pageTransition}
      initial='initial'
      animate='animate'
      style={{ willChange: 'opacity, transform, filter' }}
    >
      {children}
    </motion.div>
  );
}