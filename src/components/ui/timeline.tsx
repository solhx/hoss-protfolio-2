// src/components/ui/timeline.tsx
'use client';

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  type MotionValue,
} from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'src/hooks/useReducedMotion';
import { duration, ease } from 'src/lib/motion';

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  /** Optional externally-controlled scroll progress (0→1) */
  scrollProgress?: MotionValue<number>;
}

export const Timeline = ({ data, scrollProgress }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const prefersReduced = useReducedMotion();

  // ── Measure content height ──
  useEffect(() => {
    if (!contentRef.current) return;

    const measure = () => {
      if (contentRef.current) {
        const entries = contentRef.current.children;
        if (entries.length === 0) return;

        const firstEntry = entries[0] as HTMLElement;
        const lastEntry = entries[entries.length - 1] as HTMLElement;
        const firstTop = firstEntry.offsetTop;
        const lastBottom = lastEntry.offsetTop + lastEntry.offsetHeight;

        setContentHeight(lastBottom - firstTop);
      }
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(contentRef.current);
    return () => resizeObserver.disconnect();
  }, [data]);

  // ── Internal scroll tracking (fallback if no external progress) ──
  const { scrollYProgress: internalProgress } = useScroll({
    target: containerRef,
    offset: ['start 20%', 'end 50%'],
  });

  // Use external scrollProgress if provided, else internal
  const activeProgress = scrollProgress ?? internalProgress;

  const heightTransform = useTransform(
    activeProgress,
    [0, 1],
    [0, contentHeight],
  );
  const opacityTransform = useTransform(activeProgress, [0, 0.1], [0, 1]);

  // Smooth spring for the fill line
  const smoothHeight = useSpring(heightTransform, {
    stiffness: 100,
    damping: 30,
  });

  return (
    <div ref={containerRef} className='relative'>
      {/* Content wrapper */}
      <div ref={contentRef}>
        {data?.map(({ title, content }, index) => (
          <TimelineItem
            key={index}
            title={title}
            content={content}
            index={index}
            isFirst={index === 0}
            isLast={index === data.length - 1}
            progress={activeProgress}
            totalItems={data.length}
            prefersReduced={prefersReduced}
          />
        ))}
      </div>

      {/* ── Timeline vertical line ── */}
      <div
        style={{ height: contentHeight }}
        className='absolute md:left-8 left-8 top-0 w-0.5 overflow-hidden
          bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))]
          from-transparent via-neutral-200 dark:via-neutral-700 to-transparent
          [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]'
      >
        {/* Animated fill line */}
        <motion.div
          style={{
            height: prefersReduced ? contentHeight : smoothHeight,
            opacity: prefersReduced ? 1 : opacityTransform,
          }}
          className='absolute inset-x-0 top-0 w-0.5 bg-gradient-to-t from-emerald-600 via-emerald-300 to-transparent rounded-full'
        />

        {/* Glowing tip at the bottom of the fill */}
        {!prefersReduced && (
          <motion.div
            style={{ top: smoothHeight }}
            className='absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgb(16_185_129/0.6)] -mt-1'
          />
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// INDIVIDUAL TIMELINE ITEM — scroll-triggered entrance
// ═══════════════════════════════════════════════════════════
interface TimelineItemProps {
  title: string;
  content: React.ReactNode;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  progress: MotionValue<number>;
  totalItems: number;
  prefersReduced: boolean;
}

function TimelineItem({
  title,
  content,
  index,
  isFirst,
  progress,
  totalItems,
  prefersReduced,
}: TimelineItemProps) {
  const itemRef = useRef(null);
  const isInView = useInView(itemRef, { once: true, margin: '-80px' });

  // Calculate this item's activation threshold (0→1)
  const threshold = totalItems > 1 ? index / (totalItems - 1) : 0;

  // Dot becomes active (emerald) when scroll progress passes this item
  const dotActive = useTransform(progress, (v) => v >= threshold * 0.85);

  return (
    <div
      ref={itemRef}
      className={`flex justify-start ${isFirst ? 'pt-0' : 'pt-10'} md:gap-10`}
    >
      {/* Left side — sticky dot + title */}
      <div className='sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full'>
        {/* Dot container */}
        <div className='h-10 w-10 absolute left-3 md:left-3 rounded-full bg-white dark:bg-neutral-950 flex items-center justify-center transition-colors duration-300'>
          <motion.div
            className='h-4 w-4 rounded-full border transition-colors duration-500 shadow-sm'
            animate={
              prefersReduced
                ? {}
                : {
                    backgroundColor: isInView
                      ? 'rgb(16 185 129)'
                      : 'rgb(212 212 212)',
                    borderColor: isInView
                      ? 'rgb(16 185 129)'
                      : 'rgb(163 163 163)',
                    scale: isInView ? [1, 1.3, 1] : 1,
                    boxShadow: isInView
                      ? '0 0 12px rgb(16 185 129 / 0.4)'
                      : '0 0 0px transparent',
                  }
            }
            transition={{
              duration: 0.5,
              scale: { duration: 0.6, ease: 'easeOut' },
            }}
          />
        </div>

        {/* Desktop title */}
        <motion.h3
          className='hidden md:block text-xl md:pl-20 md:text-3xl font-bold'
          initial={prefersReduced ? {} : { opacity: 0, x: -20 }}
          animate={
            isInView
              ? { opacity: 1, x: 0, color: 'rgb(16 185 129)' }
              : prefersReduced
                ? {}
                : { opacity: 0, x: -20 }
          }
          transition={{
            duration: duration.slower,
            ease: ease.smooth,
            color: { duration: 0.8, delay: 0.2 },
          }}
          style={{ color: isInView ? undefined : 'rgb(115 115 115)' }}
        >
          {title}
        </motion.h3>
      </div>

      {/* Right side — content */}
      <motion.div
        className='relative pl-20 pr-4 md:pl-4 w-full'
        initial={
          prefersReduced
            ? {}
            : { opacity: 0, y: 30, filter: 'blur(6px)' }
        }
        animate={
          isInView
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : prefersReduced
              ? {}
              : { opacity: 0, y: 30, filter: 'blur(6px)' }
        }
        transition={{
          duration: duration.slower,
          ease: ease.smooth,
          delay: 0.15,
        }}
      >
        {/* Mobile title */}
        <h3 className='md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500'>
          {title}
        </h3>
        <div>{content}</div>
      </motion.div>
    </div>
  );
}