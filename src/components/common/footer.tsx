// src/components/common/footer.tsx
'use client';

import { motion, useInView } from 'motion/react';
import Link from 'next/link';
import { useRef } from 'react';
import { useReducedMotion } from 'src/hooks/useReducedMotion';
import { FooterSections, FooterSocials } from 'src/lib';
import { duration, ease, stagger } from 'src/lib/motion';

export default function Footer() {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: '-60px' });
  const prefersReduced = useReducedMotion();

  // ─── Shared animation helpers ───
  const fadeUp = (delay = 0) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 24, filter: 'blur(6px)' },
          animate: isInView
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : { opacity: 0, y: 24, filter: 'blur(6px)' },
          transition: {
            duration: duration.slower,
            ease: ease.smooth,
            delay,
          },
        };

  return (
    <footer
      ref={footerRef}
      className='overflow-hidden pt-8 pb-16 border-t border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950'
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between gap-12 md:flex-row'>
        {/* ── Left column: Brand ── */}
        <motion.div className='flex-1' {...fadeUp(0)}>
          <Link
            href='/'
            className='group inline-block'
            title='Back to home'
          >
            <motion.h2
              className='bg-linear-to-r from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-2xl font-bold text-transparent dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-100'
              whileHover={
                prefersReduced ? {} : { scale: 1.05, x: 4 }
              }
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              Hossam Hassan
            </motion.h2>
          </Link>
          <p className='mt-4 max-w-xs text-sm leading-relaxed text-neutral-600 dark:text-neutral-400'>
            Frontend developer crafting beautiful and functional web
            experiences.
          </p>
          <p className='mt-6 text-xs text-neutral-500 dark:text-neutral-500'>
            © {new Date().getFullYear()} Hossam Hassan. All rights reserved.
          </p>
        </motion.div>

        {/* ── Right columns: Navigation ── */}
        <div className='grid flex-1 grid-cols-2 gap-12 md:grid-cols-3'>
          {FooterSections.map(({ title, items }, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              className={sectionIndex === 1 ? 'flex flex-col' : ''}
              {...fadeUp(0.1 + sectionIndex * 0.1)}
            >
              <h3 className='mb-5 text-sm font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-100'>
                {title}
              </h3>

              <div className='mb-6 flex flex-col gap-3'>
                {items.map(({ label, href, download, icon: Icon }, itemIndex) => (
                  <motion.div
                    key={label}
                    initial={
                      prefersReduced
                        ? {}
                        : { opacity: 0, x: -12 }
                    }
                    animate={
                      isInView
                        ? { opacity: 1, x: 0 }
                        : prefersReduced
                          ? {}
                          : { opacity: 0, x: -12 }
                    }
                    transition={{
                      duration: duration.slow,
                      ease: ease.smooth,
                      delay: 0.3 + sectionIndex * 0.1 + itemIndex * 0.05,
                    }}
                  >
                    <Link
                      href={href}
                      download={download}
                      title={label}
                      className='group/link inline-flex items-center gap-1.5 text-sm text-neutral-600 transition-all duration-300 hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400'
                    >
                      {Icon && (
                        <Icon className='h-4 w-4 transition-transform duration-300 group-hover/link:scale-110' />
                      )}
                      <span className='relative'>
                        {label}
                        {/* Underline draw on hover */}
                        <span className='absolute left-0 -bottom-0.5 w-0 h-px bg-emerald-500 transition-all duration-300 group-hover/link:w-full' />
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Social links — only in the second column */}
              {sectionIndex === 1 && (
                <motion.div {...fadeUp(0.4)}>
                  <h3 className='mb-5 text-sm font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-100'>
                    Connect
                  </h3>
                  <div className='flex flex-wrap gap-3'>
                    {FooterSocials.map(
                      ({ href, icon: Icon, label }, socialIndex) => (
                        <motion.div
                          key={label}
                          initial={
                            prefersReduced
                              ? {}
                              : { opacity: 0, scale: 0.5 }
                          }
                          animate={
                            isInView
                              ? { opacity: 1, scale: 1 }
                              : prefersReduced
                                ? {}
                                : { opacity: 0, scale: 0.5 }
                          }
                          transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 15,
                            delay: 0.5 + socialIndex * 0.08,
                          }}
                        >
                          <Link
                            href={href}
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label={label}
                            title={label}
                            className='group/social flex items-center justify-center rounded-lg bg-neutral-200 p-2.5 text-neutral-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-500 hover:text-white hover:shadow-md hover:shadow-emerald-500/20 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-emerald-500 dark:hover:text-white'
                          >
                            {Icon && (
                              <Icon className='h-5 w-5 transition-transform duration-300 group-hover/social:scale-110 group-hover/social:rotate-[-5deg]' />
                            )}
                          </Link>
                        </motion.div>
                      ),
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Divider with animated width ── */}
      <motion.div
        className='my-12 h-px mx-auto max-w-5xl'
        style={{
          background:
            'linear-gradient(90deg, transparent, rgb(163 163 163 / 0.4), transparent)',
        }}
        initial={prefersReduced ? {} : { scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : prefersReduced ? {} : { scaleX: 0 }}
        transition={{
          duration: 1.2,
          ease: ease.smooth,
          delay: 0.6,
        }}
      />

      {/* ── Large name — with scroll-reveal ── */}
      <div className='relative flex items-center justify-center overflow-hidden'>
        <motion.h1
          className='mb-0 text-center text-5xl font-black tracking-tight text-transparent sm:mb-6 md:text-6xl lg:text-[7rem] bg-linear-to-b from-neutral-600 via-neutral-400 to-neutral-200 bg-clip-text dark:from-neutral-400 dark:via-neutral-600 dark:to-neutral-900 select-none'
          initial={
            prefersReduced
              ? {}
              : { opacity: 0, y: 40, scale: 0.9, filter: 'blur(12px)' }
          }
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
              : prefersReduced
                ? {}
                : { opacity: 0, y: 40, scale: 0.9, filter: 'blur(12px)' }
          }
          transition={{
            duration: 1,
            ease: ease.smooth,
            delay: 0.8,
          }}
        >
          HOSSAM
        </motion.h1>

        {/* Decorative gradient line under the name */}
        <motion.div
          className='absolute bottom-0 sm:bottom-4 left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent'
          initial={prefersReduced ? {} : { width: 0 }}
          animate={isInView ? { width: '60%' } : prefersReduced ? {} : { width: 0 }}
          transition={{
            duration: 1.5,
            ease: ease.smooth,
            delay: 1.2,
          }}
        />
      </div>
    </footer>
  );
}