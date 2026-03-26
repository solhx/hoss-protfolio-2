// src/lib/motion.ts
// ═══════════════════════════════════════════════════════════
// Centralized motion configuration for the entire portfolio.
// All components import from here for consistency.
// ═══════════════════════════════════════════════════════════

import type { Transition, Variants } from 'motion/react';

// ─── Duration tokens (seconds) ───
export const duration = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  slowest: 1.2,
} as const;

// ─── Easing curves ───
export const ease = {
  smooth: [0.16, 1, 0.3, 1] as const,       // Aggressive deceleration
  bounce: [0.34, 1.56, 0.64, 1] as const,   // Overshoot
  inOut: [0.4, 0, 0.2, 1] as const,         // Material standard
  out: [0, 0, 0.2, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  expo: [0.87, 0, 0.13, 1] as const,        // Dramatic
} as const;

// ─── Stagger delay tokens ───
export const stagger = {
  fast: 0.04,
  normal: 0.08,
  slow: 0.12,
  section: 0.15,
  dramatic: 0.2,
} as const;

// ─── Spring presets ───
export const springs = {
  gentle: { type: 'spring', stiffness: 100, damping: 20, mass: 1 } satisfies Transition,
  bouncy: { type: 'spring', stiffness: 200, damping: 12, mass: 0.8 } satisfies Transition,
  snappy: { type: 'spring', stiffness: 300, damping: 25, mass: 0.5 } satisfies Transition,
  slow: { type: 'spring', stiffness: 60, damping: 20, mass: 1.5 } satisfies Transition,
} as const;

// ═══════════════════════════════════════════════════════════
// REUSABLE VARIANT FACTORIES
// ═══════════════════════════════════════════════════════════

/** Fade + vertical slide (most common entrance) */
export const fadeSlideUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: duration.slower, ease: ease.smooth, delay },
  },
});

/** Mask reveal — word slides up from behind overflow:hidden parent */
export const maskReveal = (delay = 0): Variants => ({
  hidden: { y: '110%', rotateX: -20 },
  visible: {
    y: '0%',
    rotateX: 0,
    transition: { duration: duration.slower, ease: ease.smooth, delay },
  },
});

/** Scale + fade (for cards, badges) */
export const scaleIn = (delay = 0): Variants => ({
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...springs.bouncy, delay },
  },
});

/** sectionReveal - section scroll reveal */
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 60, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: duration.slower, ease: ease.smooth },
  },
};

/** fadeInUp - upward fade */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: ease.smooth },
  },
};

/** Stagger container — orchestrates children */
export const staggerContainer = (
  childStagger = stagger.normal,
  childDelay = 0.2,
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: childStagger,
      delayChildren: childDelay,
    },
  },
});

/** staggerItem - item stagger for groups */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: duration.slow, ease: ease.smooth },
  },
};

/** staggerChild - backward compatible alias */
export const staggerChild: Variants = staggerItem;

/** Page-level entrance/exit */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 16, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: duration.slower, ease: ease.smooth },
  },
  exit: {
    opacity: 0,
    y: -16,
    filter: 'blur(10px)',
    transition: { duration: duration.normal },
  },
};

/** Diagonal wave delay for grids (top-left → bottom-right) */
export const getGridDelay = (index: number, columns = 3): number => {
  const row = Math.floor(index / columns);
  const col = index % columns;
  return (row + col) * 0.06;
};