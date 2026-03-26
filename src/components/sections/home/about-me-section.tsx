// src/components/sections/home/about-me-section.tsx
'use client';

import { IconFileDownload } from '@tabler/icons-react';
import { motion, useInView } from 'motion/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRef } from 'react';
import { CardBody, CardContainer, CardItem } from 'src/components/ui';
import { SectionReveal } from 'src/components/ui/section-reveal';
import { MainTitle } from 'src/components/ui/main-title';
import { useReducedMotion } from 'src/hooks/useReducedMotion';
import { AboutMeSectionData } from 'src/lib';
import { duration, ease, stagger } from 'src/lib/motion';

const Ballpit = dynamic(
  () => import('src/components/ui/ballpit').then((m) => m.Ballpit),
  {
    ssr: false,
    loading: () => (
      <div className='absolute inset-0 -z-2 bg-gradient-to-br from-emerald-500/5 to-transparent' />
    ),
  },
);

export default function HomeAboutMeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const prefersReduced = useReducedMotion();

  return (
    <section
      className='section-container space-y-8'
      id='home-about-me-section'
    >
      {/* Section title */}
      <SectionReveal>
        <MainTitle regularText='About' boldText='Me' />
      </SectionReveal>

      <motion.div
        ref={ref}
        className='grid grid-cols-1 md:grid-cols-2 gap-8'
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
                    delayChildren: 0.15,
                  },
                },
              }
        }
      >
        {AboutMeSectionData.map(({ details, icon: Icon, title }, index) => (
          <motion.div
            key={index}
            variants={
              prefersReduced
                ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
                : {
                    hidden: {
                      opacity: 0,
                      y: 40,
                      scale: 0.95,
                      filter: 'blur(8px)',
                    },
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
          >
            <CardContainer className='inter-var'>
              <CardBody className='group relative overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-md transition-all duration-300 hover:border-emerald-500 dark:hover:border-emerald-400/40'>
                {isInView && !prefersReduced ? (
                  <Ballpit
                    className='absolute inset-0 -z-2'
                    count={20}
                    gravity={0.07}
                    colors={[
                      '#022C22',
                      '#064E3B',
                      '#065F46',
                      '#047857',
                      '#059669',
                      '#10B981',
                      '#34D399',
                      '#6EE7B7',
                    ]}
                    followCursor={false}
                  />
                ) : (
                  <div className='absolute inset-0 -z-2 bg-gradient-to-br from-emerald-500/5 to-transparent' />
                )}

                <div className='p-8'>
                  <CardItem
                    translateZ='60'
                    className='flex items-center gap-3 text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4'
                  >
                    <motion.div
                      className='p-2 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-lg transition-colors duration-300 group-hover:bg-emerald-500/20'
                      whileHover={
                        prefersReduced
                          ? {}
                          : { rotate: [0, -8, 8, 0], scale: 1.05 }
                      }
                      transition={{ duration: 0.4 }}
                    >
                      <Icon className='w-7 h-7 text-emerald-600 dark:text-emerald-400' />
                    </motion.div>
                    {title}
                  </CardItem>

                  <div className='space-y-4'>
                    {details.map(
                      ({ isButton, icon: DetailIcon, text, translateZ }, j) =>
                        isButton ? (
                          <CardItem
                            className='mt-4'
                            key={j}
                            translateZ={translateZ}
                          >
                            <Link
                              href='/Hossam-Hassan-Resume.pdf'
                              download
                              className='main-button group/dl'
                            >
                              <IconFileDownload className='w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/dl:-translate-y-0.5' />
                              <span className='font-medium text-xs sm:text-sm tracking-wide'>
                                VIEW RESUME
                              </span>
                            </Link>
                          </CardItem>
                        ) : (
                          <CardItem
                            key={j}
                            translateZ={translateZ}
                            className='flex items-center gap-3 text-neutral-900 dark:text-neutral-100 mb-2'
                          >
                            {DetailIcon && (
                              <DetailIcon className='w-4 h-4 text-neutral-700 dark:text-neutral-400 shrink-0' />
                            )}
                            <span className='text-sm leading-relaxed'>
                              {text}
                            </span>
                          </CardItem>
                        ),
                    )}
                  </div>

                  <CardItem
                    translateZ='30'
                    className='absolute z-[-1] right-4 bottom-4 w-32 sm:w-40 h-32 sm:h-40 pointer-events-none select-none opacity-[0.06]'
                  >
                    <Icon className='w-full h-full text-emerald-500' />
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}