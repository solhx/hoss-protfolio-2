// src/components/sections/home/hero-section.tsx
'use client';

import { IconBrandWhatsapp, IconArrowDown } from '@tabler/icons-react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion, useMagnetic, useMouseParallax } from 'src/hooks';
import { duration, ease } from 'src/lib/motion';
import {
  AnimatedGradientText,
  BackgroundBeamsWithCollision,
} from 'src/components/ui';

// ═══════════════════════════════════════════════════════════
// STAGGER CHOREOGRAPHY (unchanged timing, better animations)
// ═══════════════════════════════════════════════════════════
const STAGGER = {
  badge: 0,
  firstName: 0.2,
  lastName: 0.35,
  techStack: 0.55,
  cta: 0.7,
  scrollHint: 0.9,
} as const;

// ═══════════════════════════════════════════════════════════
// MASK REVEAL VARIANT — word slides up from behind clip
// Much more premium than simple fade+blur
// ═══════════════════════════════════════════════════════════
const maskRevealVariant = {
  hidden: { y: '120%', rotateX: -15 },
  visible: (delay: number) => ({
    y: '0%',
    rotateX: 0,
    transition: {
      duration: duration.slower,
      ease: ease.smooth,
      delay,
    },
  }),
};

// ─── Standard fade + blur for non-text elements ───
const fadeBlurVariant = {
  hidden: { opacity: 0, y: 24, filter: 'blur(10px)' },
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

// ═══════════════════════════════════════════════════════════
// HELPER — conditionally disable animations
// ═══════════════════════════════════════════════════════════
const useMotionProps = (
  variant: typeof maskRevealVariant | typeof fadeBlurVariant,
  delay: number,
  prefersReduced: boolean,
) => {
  if (prefersReduced) return {};
  return {
    variants: variant,
    initial: 'hidden' as const,
    animate: 'visible' as const,
    custom: delay,
  };
};

// ═══════════════════════════════════════════════════════════
// TECH STACK CYCLING — rotates through technology groups
// ═══════════════════════════════════════════════════════════
const techStacks = [
  ['React', 'Next.js', 'Node.js'],
  ['TypeScript', 'MongoDB', 'Express'],
  ['Tailwind CSS', 'Framer Motion', 'REST APIs'],
] as const;

function TechStackCycler({ prefersReduced }: { prefersReduced: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % techStacks.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [prefersReduced]);

  const current = techStacks[index];

  if (prefersReduced) {
    return (
      <p className='text-lg sm:text-xl md:text-2xl font-light tracking-wide max-w-3xl mx-auto text-muted-foreground'>
        {techStacks[0].join(' | ')}
      </p>
    );
  }

  return (
    <div className='h-8 sm:h-10 md:h-12 overflow-hidden relative'>
      <AnimatePresence mode='wait'>
        <motion.p
          key={index}
          className='text-lg sm:text-xl md:text-2xl font-light tracking-wide max-w-3xl mx-auto text-muted-foreground absolute inset-0 flex items-center justify-center'
          initial={{ y: 30, opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -30, opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: ease.smooth }}
        >
          {current.map((tech, i) => (
            <span key={tech}>
              {i > 0 && <span className='text-emerald-500 mx-1.5'>|</span>}
              <span>{tech}</span>
            </span>
          ))}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCROLL INDICATOR — enhanced with line draw
// ═══════════════════════════════════════════════════════════
function ScrollIndicator({ prefersReduced }: { prefersReduced: boolean }) {
  return (
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
                  scaleY: [1, 0.6, 1],
                }
          }
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// AVAILABLE BADGE — unchanged, already clean
// ═══════════════════════════════════════════════════════════
function AvailableBadge() {
  return (
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
}

// ═══════════════════════════════════════════════════════════
// GRID LINES — now with mouse parallax
// ═══════════════════════════════════════════════════════════
function GridLines({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  return (
    <motion.div
      className='absolute inset-0 pointer-events-none overflow-hidden opacity-70 dark:opacity-40'
      style={{ x: mouseX, y: mouseY }}
    >
      <div className='absolute w-px h-full top-0 left-[15%] sm:left-[25%] bg-linear-to-b from-transparent via-emerald-700 dark:via-emerald-200 to-transparent hero-line-shimmer' />
      <div className='absolute w-px h-full top-0 right-[15%] sm:right-[25%] bg-linear-to-b from-transparent via-emerald-700 dark:via-emerald-200 to-transparent hero-line-shimmer [animation-delay:2s]' />
      <div className='absolute w-full h-px left-0 top-[20%] sm:top-[26%] bg-linear-to-r from-transparent via-emerald-700 dark:via-emerald-200 to-transparent hero-line-shimmer [animation-delay:1s]' />
      <div className='absolute w-full h-px left-0 bottom-[20%] sm:bottom-[25%] bg-linear-to-r from-transparent via-emerald-700 dark:via-emerald-200 to-transparent hero-line-shimmer [animation-delay:3s]' />
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// AMBIENT GLOW — now with mouse parallax (deeper layer, more offset)
// ═══════════════════════════════════════════════════════════
function AmbientGlow({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  return (
    <motion.div
      className='absolute inset-0 -z-10'
      style={{ x: mouseX, y: mouseY }}
    >
      <div className='absolute top-0 h-full w-full [&>div]:absolute [&>div]:bottom-auto [&>div]:left-auto [&>div]:right-0 [&>div]:top-0 [&>div]:h-45 sm:[&>div]:h-65 md:[&>div]:h-80 lg:[&>div]:h-95 xl:[&>div]:h-105 [&>div]:w-45 sm:[&>div]:w-65 md:[&>div]:w-[320px] lg:[&>div]:w-95 xl:[&>div]:w-105 [&>div]:-translate-x-[50%] [&>div]:translate-y-[20%] [&>div]:rounded-full [&>div]:bg-[rgba(109,244,173,0.25)] dark:[&>div]:bg-[rgba(109,244,173,0.1)] [&>div]:blur-[80px] [&>div]:animate-[fadePulse_12s_ease-in-out_infinite]'>
        <div />
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// GRAIN OVERLAY — subtle film-grain texture via CSS noise
// ═══════════════════════════════════════════════════════════
function GrainOverlay() {
  return (
    <div
      className='absolute inset-0 pointer-events-none z-20 opacity-[0.03] dark:opacity-[0.04]'
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════
// CTA BUTTON — with animated border glow ring
// ═══════════════════════════════════════════════════════════
function CTAButton({ prefersReduced }: { prefersReduced: boolean }) {
  const magnetic = useMagnetic<HTMLDivElement>(0.15);  // ← Generic type added

  return (
    <div
      ref={magnetic.ref}                              // ← Now correctly typed
      onMouseMove={magnetic.handleMouseMove}
      onMouseLeave={magnetic.handleMouseLeave}
      className='relative inline-block group'
    >
      {/* Animated glow ring behind the button */}
      {!prefersReduced && (
        <motion.div
          className='absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-500/20 via-emerald-400/30 to-emerald-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500'
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{ backgroundSize: '200% 100%' }}
        />
      )}
      <Link
        href='https://api.whatsapp.com/send/?phone=%2B201022828316&text&type=phone_number&app_absent=0'
        target='_blank'
        rel='noopener noreferrer'
        className='main-button group/btn relative z-10'
      >
        <IconBrandWhatsapp
          size='1.2rem'
          className='transition-transform duration-300 group-hover/btn:rotate-[-8deg] group-hover/btn:scale-110'
        />
        <span className='font-medium text-xs sm:text-sm tracking-widest'>
          GET IN TOUCH
        </span>
      </Link>
    </div>
  );
}
// ═══════════════════════════════════════════════════════════
// MAIN HERO COMPONENT
// ═══════════════════════════════════════════════════════════
export default function HomeHeroSection() {
  const prefersReduced = useReducedMotion();

  // Mouse parallax — two layers at different strengths for depth
  const foregroundParallax = useMouseParallax(0.01);
  const backgroundParallax = useMouseParallax(0.025);

  return (
    <section
      id='home-hero-section'
      className='relative flex items-center justify-center overflow-hidden min-h-[calc(100dvh-4rem)] py-12 sm:py-16'
    >
      {/* Background layers with parallax depth */}
      <AmbientGlow mouseX={backgroundParallax.x} mouseY={backgroundParallax.y} />
      <GrainOverlay />

      <BackgroundBeamsWithCollision>
        <GridLines
          mouseX={foregroundParallax.x}
          mouseY={foregroundParallax.y}
        />

        {/* ─── Hero Content ─── */}
        <div className='relative z-10 flex w-full flex-col items-center justify-center space-y-5 sm:space-y-8 text-center'>

          {/* ① Available Badge — scale entrance */}
          <motion.div
            {...useMotionProps(fadeBlurVariant, STAGGER.badge, prefersReduced)}
          >
            <AvailableBadge />
          </motion.div>

          {/* ② Name — MASK REVEAL (premium text animation) */}
          <h1 className='flex flex-col items-center gap-1 sm:gap-2 font-bold text-foreground'>
            {/* "HOSSAM" — each word wraps in overflow:hidden mask */}
            <span
              className='overflow-hidden block'
              style={{ perspective: '600px' }}
            >
              <motion.span
                className='block text-4xl sm:text-6xl md:text-8xl'
                {...useMotionProps(maskRevealVariant, STAGGER.firstName, prefersReduced)}
              >
                <AnimatedGradientText>HOSSAM</AnimatedGradientText>
              </motion.span>
            </span>

            {/* "HASSAN" — staggered after HOSSAM */}
            <span
              className='overflow-hidden block'
              style={{ perspective: '600px' }}
            >
              <motion.span
                className='block text-3xl sm:text-5xl md:text-7xl tracking-tight'
                {...useMotionProps(maskRevealVariant, STAGGER.lastName, prefersReduced)}
              >
                HASSAN
              </motion.span>
            </span>
          </h1>

          {/* ③ Tech Stack — CYCLING text */}
          <motion.div
            {...useMotionProps(fadeBlurVariant, STAGGER.techStack, prefersReduced)}
          >
            <TechStackCycler prefersReduced={prefersReduced} />
          </motion.div>

          {/* ④ CTA Button — magnetic + glow */}
          <motion.div
            {...useMotionProps(fadeBlurVariant, STAGGER.cta, prefersReduced)}
          >
            <CTAButton prefersReduced={prefersReduced} />
          </motion.div>

          {/* ⑤ Scroll Indicator */}
          <motion.div
            {...useMotionProps(fadeBlurVariant, STAGGER.scrollHint, prefersReduced)}
          >
            <ScrollIndicator prefersReduced={prefersReduced} />
          </motion.div>
        </div>
      </BackgroundBeamsWithCollision>
    </section>
  );
}