// src/components/ui/timeline.tsx
'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    // ✅ Measure only the CONTENT area, not the full container
    if (!contentRef.current) return;

    const measure = () => {
      if (contentRef.current) {
        // Get the actual height of all timeline entries
        const entries = contentRef.current.children;
        if (entries.length === 0) return;

        // Calculate height from first entry top to last entry bottom
        const firstEntry = entries[0] as HTMLElement;
        const lastEntry = entries[entries.length - 1] as HTMLElement;

        const firstTop = firstEntry.offsetTop;
        const lastBottom = lastEntry.offsetTop + lastEntry.offsetHeight;

        setContentHeight(lastBottom - firstTop);
      }
    };

    // Initial measurement
    measure();

    // Re-measure on resize
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(contentRef.current);

    return () => resizeObserver.disconnect();
  }, [data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // ✅ Fixed offset — tracks only while the container is in viewport
    offset: ['start 20%', 'end 50%'],
  });

  const heightTransform = useTransform(
    scrollYProgress,
    [0, 1],
    [0, contentHeight],
  );
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      ref={containerRef}
      className='relative'
    >
      {/* ✅ Content wrapper — used for height measurement */}
      <div ref={contentRef}>
        {data?.map(({ title, content }, index) => (
          <div
            key={index}
            className={`flex justify-start ${
              index === 0 ? 'pt-0' : 'pt-10'
            } md:gap-10`}
          >
            {/* Left side — sticky dot + title */}
            <div className='sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full'>
              <div className='h-10 w-10 absolute left-3 md:left-3 rounded-full bg-white dark:bg-neutral-950 flex items-center justify-center transition-colors duration-300'>
                <div className='h-4 w-4 rounded-full bg-neutral-300 dark:bg-neutral-700 border border-neutral-400 dark:border-neutral-600 transition-colors duration-300 shadow-sm' />
              </div>
              <h3 className='hidden md:block text-xl md:pl-20 md:text-3xl font-bold text-neutral-500 dark:text-neutral-500'>
                {title}
              </h3>
            </div>

            {/* Right side — content */}
            <div className='relative pl-20 pr-4 md:pl-4 w-full'>
              <h3 className='md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500'>
                {title}
              </h3>
              <div>{content}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Timeline line — height now matches actual content, not scrollHeight */}
      <div
        style={{ height: contentHeight }}
        className='absolute md:left-8 left-8 top-0 w-0.5 overflow-hidden
          bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))]
          from-transparent via-neutral-200 dark:via-neutral-700 to-transparent
          [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]'
      >
        <motion.div
          style={{
            height: heightTransform,
            opacity: opacityTransform,
          }}
          className='absolute inset-x-0 top-0 w-0.5 bg-gradient-to-t from-emerald-600 via-emerald-200 to-transparent rounded-full'
        />
      </div>
    </div>
  );
};