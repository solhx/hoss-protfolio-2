// src/components/common/floating-app-bar.tsx
'use client';

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'motion/react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useReducedMotion } from 'src/hooks/useReducedMotion';
import { FloatingAppBarLinks } from 'src/lib';
import { FloatingDock } from "../ui/floating-dock";

// ═══════════════════════════════════════════════════════════
// Section IDs to observe — maps to your section components
// ═══════════════════════════════════════════════════════════
const SECTION_IDS = [
  'home-hero-section',
  'home-about-me-section',
  'home-skills-section',
  'home-experience-section',
  'home-projects-section',
  'home-contact-us-section',
] as const;

export default function FloatingAppBar() {
  const [visible, setVisible] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('');
  const { scrollY } = useScroll();
  const prefersReduced = useReducedMotion();
  const lastScrollY = useRef(0);

  // ─── Show/hide on scroll direction ───
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastScrollY.current;
    lastScrollY.current = latest;

    if (latest < 100) {
      setVisible(true);
    } else if (latest < previous - 5) {
      // Scrolling up (5px threshold to avoid jitter)
      setVisible(true);
    } else if (latest > previous + 5 && latest > 200) {
      // Scrolling down
      setVisible(false);
    }
  });

  // ─── Track active section via IntersectionObserver ───
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: '-40% 0px -40% 0px', // Center 20% of viewport
          threshold: 0,
        },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.95 }}
          animate={
            prefersReduced
              ? { opacity: 1 }
              : { opacity: 1, y: 0, scale: 1 }
          }
          exit={
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, y: 24, scale: 0.95 }
          }
          transition={{
            duration: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className='fixed bottom-4 z-50 flex left-4 sm:left-1/2 sm:-translate-x-1/2'
        >
          {/* Glass morphism backdrop */}
          <div className='relative'>
            {/* Glow behind dock */}
            <div
              className='absolute -inset-2 rounded-2xl opacity-40 blur-xl pointer-events-none'
              style={{
                background:
                  'radial-gradient(ellipse at center, rgb(16 185 129 / 0.15), transparent 70%)',
              }}
            />
            <FloatingDock
              items={FloatingAppBarLinks}
              activeSection={activeSection}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}