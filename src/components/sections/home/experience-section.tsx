// src/components/sections/home/experience-section.tsx
'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { MainTitle, Timeline } from 'src/components/ui';
import { SectionReveal } from 'src/components/ui/section-reveal';
import { useReducedMotion } from 'src/hooks/useReducedMotion';
import { ExperienceItems } from 'src/lib';
import { duration, ease, stagger } from 'src/lib/motion';

export default function HomeExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReduced = useReducedMotion();

  return (
    <section
      id='home-experience-section'
      className='section-container space-y-8'
      ref={ref}
    >
      <SectionReveal>
        <MainTitle regularText='My' boldText='Experience' />
        <p className='section-description mt-4'>
          A timeline of my professional journey and education.
        </p>
      </SectionReveal>

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
                    delayChildren: 0.2,
                  },
                },
              }
        }
      >
        <Timeline data={ExperienceItems} />
      </motion.div>
    </section>
  );
}