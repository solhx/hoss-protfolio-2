// src/lib/motion.ts
// Centralized motion design tokens for consistent animation behavior

export const duration = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  slowest: 1.2,
} as const;

export const ease = {
  default: [0.25, 0.1, 0.25, 1.0] as const,
  in: [0.4, 0.0, 1.0, 1.0] as const,
  out: [0.0, 0.0, 0.2, 1.0] as const,
  inOut: [0.4, 0.0, 0.2, 1.0] as const,
  smooth: [0.16, 1, 0.3, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
  spring: { type: 'spring' as const, stiffness: 200, damping: 24 },
  gentleSpring: { type: 'spring' as const, stiffness: 120, damping: 20 },
} as const;

export const stagger = {
  fast: 0.03,
  normal: 0.06,
  slow: 0.1,
  section: 0.15,
} as const;
// Reusable animation variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: ease.smooth,
      delay: i * stagger.normal,
    },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.normal, ease: ease.default },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.slow, ease: ease.smooth },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.slow, ease: ease.smooth },
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.slow, ease: ease.smooth },
  },
};

// Container variant for staggered children
export const staggerContainer = (staggerAmount = stagger.normal) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerAmount,
      delayChildren: 0.1,
    },
  },
});