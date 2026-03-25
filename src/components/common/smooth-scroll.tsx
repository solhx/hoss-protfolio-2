// src/components/common/smooth-scroll.tsx
'use client';

import { useGSAP } from '@gsap/react';
import Lenis from '@studio-freight/lenis';
import { gsap, ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useGSAP(() => {
    const isDesktop = window.innerWidth >= 992;

    if (isDesktop) {
      const lenis = new Lenis({
        duration: 1.5,
        smoothWheel: true,
        wheelMultiplier: 1,
      });

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      // ✅ Listen for chat open/close to pause/resume Lenis
      const handleChatToggle = (e: Event) => {
        const { open } = (e as CustomEvent).detail;
        if (open) {
          lenis.stop(); // Pause Lenis — let chat scroll natively
        } else {
          lenis.start(); // Resume Lenis
        }
      };

      window.addEventListener('chat-toggle', handleChatToggle);

      // Hash link handling
      const handleClick = (e: Event) => {
        const target = (e.target as HTMLElement).closest('a');
        if (!target) return;

        const href = target.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        e.preventDefault();
        e.stopPropagation();

        const el = document.querySelector(href);
        if (el) {
          lenis.scrollTo(el as HTMLElement, {
            offset: -20,
            duration: 1.2,
            immediate: false,
          });
          window.history.pushState(null, '', href);
        }
      };

      const initialHash = window.location.hash;
      if (initialHash) {
        const el = document.querySelector(initialHash);
        if (el) {
          setTimeout(() => {
            lenis.scrollTo(el as HTMLElement, {
              offset: -20,
              duration: 1,
              immediate: false,
            });
          }, 200);
        }
      }

      document.addEventListener('click', handleClick, { capture: true });

      return () => {
        lenis.destroy();
        document.removeEventListener('click', handleClick, { capture: true });
        window.removeEventListener('chat-toggle', handleChatToggle);
      };
    }

    // Mobile
    const handleMobileClick = (e: Event) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      e.preventDefault();
      e.stopPropagation();

      const el = document.querySelector(href);
      if (el) {
        const prefersReduced = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches;

        const top = el.getBoundingClientRect().top + window.scrollY - 20;
        window.scrollTo({
          top,
          behavior: prefersReduced ? 'auto' : 'smooth',
        });
        window.history.pushState(null, '', href);
      }
    };

    document.addEventListener('click', handleMobileClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleMobileClick, {
        capture: true,
      });
    };
  }, []);

  return null;
}