// src/components/sections/home/hero-section.tsx
'use client';

import { IconBrandWhatsapp } from '@tabler/icons-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useReducedMotion } from 'src/hooks';
import { duration, ease } from 'src/lib/motion';
import {
  AnimatedGradientText,
  BackgroundBeamsWithCollision,
} from 'src/components/ui';
import { useMagnetic } from 'src/hooks';

// ─────────────────────────────────────────────
// Choreography — each element enters in sequence
// Badge → First Name → Last Name → Stack → CTA → Scroll
// ─────────────────────────────────────────────
const STAGGER = {
  badge: 0,
  firstName: 0.15,
  lastName: 0.25,
  techStack: 0.4,
  cta: 0.55,
  scrollHint: 0.75,
} as const;

// ─────────────────────────────────────────────
// Shared entrance variant — blur + fade + slide
// ─────────────────────────────────────────────
const heroItemVariant = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: 'blur(10px)',
  },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: duration.slower,
      ease: ease.smooth,
      delay,
    },
  }),
};

// ─────────────────────────────────────────────
// Helper: conditionally apply motion props
// ─────────────────────────────────────────────
const getMotionProps = (delay: number, prefersReduced: boolean) => {
  if (prefersReduced) return {};
  return {
    variants: heroItemVariant,
    initial: 'hidden' as const,
    animate: 'visible' as const,
    custom: delay,
  };
};

// ─────────────────────────────────────────────
// Tech stack separator
// ─────────────────────────────────────────────
const Separator = () => (
  <span className='text-emerald-500 mx-1'> | </span>
);

// ─────────────────────────────────────────────
// Scroll indicator with custom smooth animation
// ─────────────────────────────────────────────
const ScrollIndicator = ({ prefersReduced }: { prefersReduced: boolean }) => (
  <div className='flex flex-col items-center gap-2'>
    <span className='text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.2em]'>
      Scroll Down
    </span>
    <div className='w-6 h-10 border-2 border-emerald-500/40 rounded-full flex justify-center pt-2'>
      <motion.div
        className='w-1 h-2.5 bg-emerald-500 rounded-full origin-top'
        animate={
          prefersReduced
            ? {}
            : {
                y: [0, 8, 0],
                opacity: [1, 0.3, 1],
                scaleY: [1, 0.8, 1],
              }
        }
        transition={{
          duration: 2.2,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 0.3,
        }}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Available badge with pulse dot
// ─────────────────────────────────────────────
const AvailableBadge = () => (
  <div className='inline-flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-xl bg-card/50 border border-border'>
    <span className='relative flex h-2 w-2'>
      <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75' />
      <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-500' />
    </span>
    <span className='text-xs sm:text-sm font-medium tracking-widest text-muted-foreground'>
      AVAILABLE FOR WORK
    </span>
  </div>
);

// ─────────────────────────────────────────────
// Grid background lines with shimmer
// ─────────────────────────────────────────────
const GridLines = () => (
  <div className='absolute inset-0 pointer-events-none overflow-hidden opacity-70 dark:opacity-40'>
    {/* Vertical lines */}
    <div className='absolute w-px h-full top-0 left-[15%] sm:left-[25%] bg-linear-to-b from-transparent via-emerald-700 dark:via-emerald-200 to-transparent hero-line-shimmer' />
    <div className='absolute w-px h-full top-0 right-[15%] sm:right-[25%] bg-linear-to-b from-transparent via-emerald-700 dark:via-emerald-200 to-transparent hero-line-shimmer [animation-delay:2s]' />
    {/* Horizontal lines */}
    <div className='absolute w-full h-px left-0 top-[20%] sm:top-[26%] bg-linear-to-r from-transparent via-emerald-700 dark:via-emerald-200 to-transparent hero-line-shimmer [animation-delay:1s]' />
    <div className='absolute w-full h-px left-0 bottom-[20%] sm:bottom-[25%] bg-linear-to-r from-transparent via-emerald-700 dark:via-emerald-200 to-transparent hero-line-shimmer [animation-delay:3s]' />
  </div>
);

// ─────────────────────────────────────────────
// Ambient green glow
// ─────────────────────────────────────────────
const AmbientGlow = () => (
  <div className='absolute inset-0 -z-10'>
    <div className='absolute top-0 h-full w-full [&>div]:absolute [&>div]:bottom-auto [&>div]:left-auto [&>div]:right-0 [&>div]:top-0 [&>div]:h-45 sm:[&>div]:h-65 md:[&>div]:h-80 lg:[&>div]:h-95 xl:[&>div]:h-105 [&>div]:w-45 sm:[&>div]:w-65 md:[&>div]:w-[320px] lg:[&>div]:w-95 xl:[&>div]:w-105 [&>div]:-translate-x-[50%] [&>div]:translate-y-[20%] [&>div]:rounded-full [&>div]:bg-[rgba(109,244,173,0.25)] dark:[&>div]:bg-[rgba(109,244,173,0.1)] [&>div]:blur-[80px] [&>div]:animate-[fadePulse_12s_ease-in-out_infinite]'>
      <div />
    </div>
  </div>
);

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function HomeHeroSection() {
  const prefersReduced = useReducedMotion();
  const magnetic = useMagnetic(0.15);

  return (
    <section
      id='home-hero-section'
      className='relative flex items-center justify-center overflow-hidden min-h-[calc(100dvh-4rem)] py-12 sm:py-16'
    >
      {/* Background layers */}
      <AmbientGlow />

      <BackgroundBeamsWithCollision>
        <GridLines />

        {/* ─── Hero Content ─── */}
        <div className='relative z-10 flex w-full flex-col items-center justify-center space-y-5 sm:space-y-8 text-center'>

          {/* ① Available Badge */}
          <motion.div {...getMotionProps(STAGGER.badge, prefersReduced)}>
            <AvailableBadge />
          </motion.div>

          {/* ② Name */}
          <h1 className='flex flex-col items-center gap-1 sm:gap-2 font-bold text-foreground'>
            <motion.span
              {...getMotionProps(STAGGER.firstName, prefersReduced)}
              className='text-4xl sm:text-6xl md:text-8xl'
            >
              <AnimatedGradientText>HOSSAM</AnimatedGradientText>
            </motion.span>

            <motion.span
              {...getMotionProps(STAGGER.lastName, prefersReduced)}
              className='text-3xl sm:text-5xl md:text-7xl tracking-tight'
            >
              HASSAN
            </motion.span>
          </h1>

          {/* ③ Tech Stack */}
          <motion.p
            {...getMotionProps(STAGGER.techStack, prefersReduced)}
            className='text-lg sm:text-xl md:text-2xl font-light tracking-wide max-w-3xl mx-auto text-muted-foreground'
          >
            React
            <Separator />
            Next.js
            <Separator />
            Node.js
          </motion.p>

          {/* ④ CTA Button with Magnetic Effect */}
          <motion.div {...getMotionProps(STAGGER.cta, prefersReduced)}>
            <div
              ref={magnetic.ref}
              onMouseMove={magnetic.handlers.onMouseMove}
              onMouseLeave={magnetic.handlers.onMouseLeave}
              className='inline-block'
            >
              <Link
                href='https://api.whatsapp.com/send/?phone=%2B201022828316&text&type=phone_number&app_absent=0'
                target='_blank'
                rel='noopener noreferrer'
                className='main-button group'
              >
                <IconBrandWhatsapp
                  size='1.2rem'
                  className='transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110'
                />
                <span className='font-medium text-xs sm:text-sm tracking-widest'>
                  GET IN TOUCH
                </span>
              </Link>
            </div>
          </motion.div>

          {/* ⑤ Scroll Indicator */}
          <motion.div {...getMotionProps(STAGGER.scrollHint, prefersReduced)}>
            <ScrollIndicator prefersReduced={prefersReduced} />
          </motion.div>
        </div>
      </BackgroundBeamsWithCollision>
    </section>
  );
}