// src/components/ui/main-title.tsx
'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { useReducedMotion } from 'src/hooks/useReducedMotion';
import { duration, ease } from 'src/lib/motion';

export interface MainTitleProps {
  boldText: string;
  regularText: string;
  reverse?: boolean;
  /** Use mask-reveal animation (default: true) */
  animated?: boolean;
  className?: string;
}

export const MainTitle: React.FC<MainTitleProps> = ({
  boldText,
  regularText,
  animated = true,
  className,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const prefersReduced = useReducedMotion();

  // No animation path
  if (!animated || prefersReduced) {
    return (
      <h2
        ref={ref}
        className={
          className ??
          'text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-neutral-900 dark:text-neutral-400'
        }
      >
        {regularText}{' '}
        <span className='font-bold dark:text-white'>{boldText}</span>
      </h2>
    );
  }

  return (
    <h2
      ref={ref}
      className={
        className ??
        'text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-neutral-900 dark:text-neutral-400'
      }
    >
      {/* Regular text — fade + slide */}
      <span className='inline-block overflow-hidden align-bottom' style={{ perspective: '500px' }}>
        <motion.span
          className='inline-block'
          initial={{ y: '110%', opacity: 0, rotateX: -15 }}
          animate={
            isInView
              ? { y: '0%', opacity: 1, rotateX: 0 }
              : { y: '110%', opacity: 0, rotateX: -15 }
          }
          transition={{
            duration: duration.slower,
            ease: ease.smooth,
            delay: 0,
          }}
        >
          {regularText}
        </motion.span>
      </span>{' '}
      {/* Bold text — staggered mask reveal */}
      <span className='inline-block overflow-hidden align-bottom' style={{ perspective: '500px' }}>
        <motion.span
          className='inline-block font-bold dark:text-white'
          initial={{ y: '110%', opacity: 0, rotateX: -15 }}
          animate={
            isInView
              ? { y: '0%', opacity: 1, rotateX: 0 }
              : { y: '110%', opacity: 0, rotateX: -15 }
          }
          transition={{
            duration: duration.slower,
            ease: ease.smooth,
            delay: 0.12,
          }}
        >
          {boldText}
        </motion.span>
      </span>
      {/* Decorative underline accent */}
      <motion.span
        className='block h-[2px] mt-3 rounded-full bg-gradient-to-r from-emerald-500/60 via-emerald-400/40 to-transparent'
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{
          duration: duration.slowest ?? 1.2,
          ease: ease.smooth,
          delay: 0.3,
        }}
        style={{ transformOrigin: 'left', maxWidth: '160px' }}
      />
    </h2>
  );
};