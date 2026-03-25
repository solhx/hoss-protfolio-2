// src/components/sections/home/counter-section.tsx
'use client';

import { motion, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'src/hooks';
import { CounterStats } from 'src/lib';
import { duration, ease, stagger } from 'src/lib/motion';

// ─────────────────────────────────────────────
// Animated Number Ticker
// Uses requestAnimationFrame for smooth 60fps counting
// ─────────────────────────────────────────────
function AnimatedNumber({
  value,
  isInView,
}: {
  value: number;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;

    // If user prefers reduced motion, show final value immediately
    if (prefersReduced) {
      setCount(value);
      return;
    }

    let animationFrameId: number;
    const countDuration = 2000; // 2 seconds to count up
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / countDuration, 1);

      // Cubic ease-out — fast start, slow finish
      // Makes the last few numbers feel deliberate
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * value);

      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // Small delay so the entrance animation starts first
    const timeout = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
    }, 200);

    return () => {
      clearTimeout(timeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, value, prefersReduced]);

  return <span>{count}</span>;
}

// ─────────────────────────────────────────────
// Plus sign that fades in after counting finishes
// ─────────────────────────────────────────────
function PlusSuffix({ isInView }: { isInView: boolean }) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.span
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.5 }}
      animate={
        isInView
          ? prefersReduced
            ? { opacity: 1 }
            : { opacity: 1, scale: 1 }
          : {}
      }
      transition={{
        delay: 2.2, // Appears right after counting finishes (2s count + 0.2s initial delay)
        duration: duration.normal,
        ease: ease.bounce,
      }}
      className='text-emerald-500'
    >
      +
    </motion.span>
  );
}

// ─────────────────────────────────────────────
// Single counter card
// ─────────────────────────────────────────────
function CounterCard({
  stat,
  isInView,
}: {
  stat: { label: string; value: number };
  isInView: boolean;
}) {
  return (
    <motion.div
      className='group relative flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/20 backdrop-blur-sm px-6 py-8 text-center transition-colors duration-300 hover:border-emerald-500/30 hover:bg-card/40'
      variants={{
        hidden: { opacity: 0, y: 28, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: duration.slower,
            ease: ease.smooth,
          },
        },
      }}
    >
      {/* Number */}
      <div className='text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tabular-nums'>
        <AnimatedNumber value={stat.value} isInView={isInView} />
        <PlusSuffix isInView={isInView} />
      </div>

      {/* Label */}
      <p className='text-sm sm:text-base text-muted-foreground font-medium tracking-wide'>
        {stat.label}
      </p>

      {/* Bottom accent line — appears on hover */}
      <div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

      {/* Subtle glow on hover */}
      <div className='absolute inset-0 rounded-xl bg-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function HomeCounterSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const prefersReduced = useReducedMotion();

  return (
    <section
      id='home-counter-section'
      className='section-container'
    >
      <motion.div
        ref={ref}
        className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'
        initial='hidden'
        animate={isInView ? 'visible' : 'hidden'}
        variants={
          prefersReduced
            ? {
                hidden: { opacity: 1 },
                visible: { opacity: 1 },
              }
            : {
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: stagger.slow,
                    delayChildren: 0.1,
                  },
                },
              }
        }
      >
        {CounterStats.map((stat) => (
          <CounterCard
            key={stat.label}
            stat={stat}
            isInView={isInView}
          />
        ))}
      </motion.div>
    </section>
  );
}