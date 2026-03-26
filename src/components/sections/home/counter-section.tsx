// src/components/sections/home/counter-section.tsx
'use client';

import { motion, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'src/hooks';
import { CounterStats } from 'src/lib';
import { duration, ease, stagger } from 'src/lib/motion';

// ─── Animated Number ───
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

    if (prefersReduced) {
      setCount(value);
      return;
    }

    let animationFrameId: number;
    const countDuration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / countDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * value);

      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

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

// ─── Plus Suffix ───
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
        delay: 2.2,
        duration: duration.normal,
        ease: ease.bounce,
      }}
      className='text-emerald-500'
    >
      +
    </motion.span>
  );
}

// ─── Counter Card with top accent bar ───
function CounterCard({
  stat,
  isInView,
  index,
}: {
  stat: { label: string; value: number };
  isInView: boolean;
  index: number;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className='group relative flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/20 backdrop-blur-sm px-6 py-8 text-center overflow-hidden'
      variants={
        prefersReduced
          ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
          : {
              hidden: { opacity: 0, y: 28, scale: 0.95, filter: 'blur(6px)' },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                transition: {
                  duration: duration.slower,
                  ease: ease.smooth,
                },
              },
            }
      }
      whileHover={
        prefersReduced
          ? {}
          : {
              y: -4,
              borderColor: 'rgb(16 185 129 / 0.3)',
              transition: { duration: 0.25 },
            }
      }
    >
      {/* Top emerald accent bar — draws in on view */}
      <motion.div
        className='absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent'
        initial={{ scaleX: 0, opacity: 0 }}
        animate={
          isInView
            ? { scaleX: 1, opacity: 1 }
            : { scaleX: 0, opacity: 0 }
        }
        transition={{
          duration: 0.8,
          ease: ease.smooth,
          delay: 0.4 + index * 0.1,
        }}
      />

      {/* Number */}
      <div className='text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tabular-nums'>
        <AnimatedNumber value={stat.value} isInView={isInView} />
        <PlusSuffix isInView={isInView} />
      </div>

      {/* Label */}
      <p className='text-sm sm:text-base text-muted-foreground font-medium tracking-wide'>
        {stat.label}
      </p>

      {/* Bottom accent line on hover */}
      <div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

      {/* Subtle glow on hover */}
      <div className='absolute inset-0 rounded-xl bg-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />
    </motion.div>
  );
}

// ─── Main Component ───
export default function HomeCounterSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const prefersReduced = useReducedMotion();

  return (
    <section id='home-counter-section' className='section-container'>
      <motion.div
        ref={ref}
        className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'
        initial='hidden'
        animate={isInView ? 'visible' : 'hidden'}
        variants={
          prefersReduced
            ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
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
        {CounterStats.map((stat, index) => (
          <CounterCard
            key={stat.label}
            stat={stat}
            isInView={isInView}
            index={index}
          />
        ))}
      </motion.div>
    </section>
  );
}