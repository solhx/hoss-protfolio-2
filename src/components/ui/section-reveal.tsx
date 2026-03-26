// src/components/ui/section-reveal.tsx
'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { useReducedMotion } from 'src/hooks/useReducedMotion';
import { duration, ease } from 'src/lib/motion';

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Distance in pixels to travel */
  distance?: number;
  /** Add blur during entrance */
  blur?: boolean;
  /** Add scale during entrance */
  scale?: boolean;
  /** Viewport margin for trigger */
  margin?: string;
  /** Allow re-triggering (default: false) */
  once?: boolean;
  /** Element tag */
  as?: 'div' | 'section' | 'article' | 'header';
}

const getOffset = (direction: string, distance: number) => {
  const map: Record<string, { x?: number; y?: number }> = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: -distance },
    right: { x: distance },
    none: {},
  };
  return map[direction] ?? {};
};

export function SectionReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 40,
  blur = true,
  scale: shouldScale = false,
  margin = '-80px',
  once = true,
  as = 'div',
}: SectionRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin  });
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const offset = getOffset(direction, distance);
  const Component = motion[as];

  return (
    <Component
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        ...offset,
        ...(blur ? { filter: 'blur(8px)' } : {}),
        ...(shouldScale ? { scale: 0.95 } : {}),
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              ...(blur ? { filter: 'blur(0px)' } : {}),
              ...(shouldScale ? { scale: 1 } : {}),
            }
          : {
              opacity: 0,
              ...offset,
              ...(blur ? { filter: 'blur(8px)' } : {}),
              ...(shouldScale ? { scale: 0.95 } : {}),
            }
      }
      transition={{
        duration: duration.slower,
        ease: ease.smooth,
        delay,
        ...(blur ? { filter: { duration: duration.slow } } : {}),
      }}
      style={{ willChange: 'opacity, transform, filter' }}
    >
      {children}
    </Component>
  );
}