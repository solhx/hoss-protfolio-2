// src/components/sections/home/get-in-touch-section.tsx
'use client';

import { motion, useInView } from 'motion/react';
import Link from 'next/link';
import { useRef } from 'react';
import { LightGrid, MainTitle } from 'src/components/ui';
import { SectionReveal } from 'src/components/ui/section-reveal';
import { useMagnetic, useReducedMotion } from 'src/hooks';
import { duration, ease } from 'src/lib/motion';

export default function HomeGetInTouchSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReduced = useReducedMotion();
const magnetic = useMagnetic<HTMLDivElement>(0.12);

  return (
    <section
      id='home-get-in-touch-section'
      className='border-b border-neutral-200 dark:border-neutral-800'
      ref={ref}
    >
      <LightGrid>
        <div className='flex flex-col flex-wrap items-start sm:items-center justify-between md:flex-row gap-6'>
          <SectionReveal direction='left'>
            <div className='flex flex-col items-start space-y-4'>
              <MainTitle
                regularText='Ready to collaborate on'
                boldText='Next Project ?'
              />
              <p className='section-description'>
                Whether you need a modern website, a fast web app, or a complete
                design system, I can help you plan, build, and launch it
                efficiently and at scale.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal direction='right' delay={0.15}>
            <div className='flex flex-col gap-4 sm:w-auto sm:flex-row justify-center md:justify-end'>
            <div
  ref={magnetic.ref}
  onMouseMove={magnetic.handleMouseMove}
  onMouseLeave={magnetic.handleMouseLeave}
  className='relative inline-block group'
>
                {/* Glow ring */}
                {!prefersReduced && (
                  <motion.div
                    className='absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-500/20 via-emerald-400/30 to-emerald-500/20 blur-md'
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: [0, 0.6, 0.3] } : { opacity: 0 }}
                    transition={{
                      duration: 2,
                      delay: 0.8,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  />
                )}
                <Link
                  href='https://api.whatsapp.com/send/?phone=201022828316&text&type=phone_number&app_absent=0'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='main-button relative z-10'
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </SectionReveal>
        </div>
      </LightGrid>
    </section>
  );
}