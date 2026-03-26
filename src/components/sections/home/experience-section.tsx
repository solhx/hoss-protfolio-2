// src/components/sections/home/experience-section.tsx
'use client';

import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
} from 'motion/react';
import { useRef } from 'react';
import { MainTitle, Timeline } from 'src/components/ui';
import { SectionReveal } from 'src/components/ui/section-reveal';
import { useReducedMotion } from 'src/hooks/useReducedMotion';
import { ExperienceItems } from 'src/lib';
import { stagger } from 'src/lib/motion';

export default function HomeExperienceSection() {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const prefersReduced = useReducedMotion();

  // Scroll-linked progress for the timeline "fill line"
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 20%'],
  });

  // Spring-smoothed progress value for the timeline bar
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  return (
    <section
      id='home-experience-section'
      className='section-container space-y-8'
      ref={sectionRef}
    >
      <SectionReveal>
        <MainTitle regularText='My' boldText='Experience' />
        <p className='section-description mt-4'>
          A timeline of my professional journey and education.
        </p>
      </SectionReveal>

      <div ref={timelineRef}>
        <motion.div
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
                      staggerChildren: stagger.section,
                      delayChildren: 0.3,
                    },
                  },
                }
          }
        >
          <Timeline
            data={ExperienceItems}
            scrollProgress={prefersReduced ? undefined : smoothProgress}
          />
        </motion.div>
      </div>

      {/* Decorative gradient bar at the bottom */}
      <motion.div
        className='h-px w-full max-w-2xl mx-auto'
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
        style={{
          background:
            'linear-gradient(90deg, transparent, rgb(16 185 129 / 0.3), transparent)',
          transformOrigin: 'center',
        }}
      />
    </section>
  );
}