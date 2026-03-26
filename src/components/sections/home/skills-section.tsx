// src/components/sections/home/skills-section.tsx
'use client';

import { motion, useInView, AnimatePresence } from 'motion/react';
import { useRef, useState, useMemo } from 'react';
import { MainTitle } from 'src/components/ui';
import { useReducedMotion } from 'src/hooks/useReducedMotion';
import { SectionReveal } from 'src/components/ui/section-reveal';
import { SkillsItems } from 'src/lib';
import { duration, ease, stagger, getGridDelay } from 'src/lib/motion';

// ═══════════════════════════════════════════════════════════
// SKILL CATEGORY FILTER (optional — enhance if you tag skills)
// If your SkillsItems don't have categories, all render in one grid.
// ═══════════════════════════════════════════════════════════
type SkillItem = (typeof SkillsItems)[number];

export default function HomeSkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const prefersReduced = useReducedMotion();
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Determine columns for grid delay calculation
  const getColumns = () => {
    if (typeof window === 'undefined') return 5;
    if (window.innerWidth < 640) return 2;
    if (window.innerWidth < 768) return 3;
    if (window.innerWidth < 1024) return 4;
    return 5;
  };

  return (
    <section
      id='home-skills-section'
      className='section-container space-y-8'
    >
      <SectionReveal>
        <MainTitle regularText='Some of My' boldText='Skills' />
      </SectionReveal>

      <motion.div
        ref={ref}
        className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2'
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
                    staggerChildren: stagger.fast,
                    delayChildren: 0.15,
                  },
                },
              }
        }
      >
        {SkillsItems.map(({ name, Icon }, index) => (
          <SkillCard
            key={name}
            name={name}
            Icon={Icon}
            index={index}
            prefersReduced={prefersReduced}
            isHovered={hoveredSkill === name}
            isAnyHovered={hoveredSkill !== null}
            onHover={() => setHoveredSkill(name)}
            onLeave={() => setHoveredSkill(null)}
          />
        ))}
      </motion.div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// INDIVIDUAL SKILL CARD — extracted for cleaner logic
// ═══════════════════════════════════════════════════════════
interface SkillCardProps {
  name: string;
  Icon: React.ElementType;
  index: number;
  prefersReduced: boolean;
  isHovered: boolean;
  isAnyHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function SkillCard({
  name,
  Icon,
  index,
  prefersReduced,
  isHovered,
  isAnyHovered,
  onHover,
  onLeave,
}: SkillCardProps) {
  return (
    <motion.div
      className='group relative'
      variants={
        prefersReduced
          ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
          : {
              hidden: { opacity: 0, y: 20, scale: 0.9 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: duration.slow,
                  ease: ease.smooth,
                },
              },
            }
      }
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <motion.div
        className='relative h-full flex items-center backdrop-blur-sm bg-card/20 border border-border/50 rounded-lg px-4 py-2.5 cursor-default overflow-hidden'
        animate={
          prefersReduced
            ? {}
            : {
                borderColor: isHovered
                  ? 'rgb(16 185 129 / 0.5)'
                  : 'rgb(255 255 255 / 0.1)',
                backgroundColor: isHovered
                  ? 'rgb(16 185 129 / 0.05)'
                  : 'rgb(255 255 255 / 0.02)',
                // Dim cards that aren't hovered when one IS hovered
                opacity: isAnyHovered ? (isHovered ? 1 : 0.5) : 1,
                scale: isHovered ? 1.03 : 1,
              }
        }
        transition={{
          duration: 0.25,
          ease: ease.smooth,
        }}
      >
        {/* Spotlight gradient on hover */}
        <AnimatePresence>
          {isHovered && !prefersReduced && (
            <motion.div
              className='absolute inset-0 pointer-events-none'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgb(16 185 129 / 0.08) 0%, transparent 70%)',
              }}
            />
          )}
        </AnimatePresence>

        <div className='flex items-center gap-3 relative z-10'>
          <div className='relative shrink-0'>
            <motion.div
              className='relative p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-900'
              animate={
                prefersReduced
                  ? {}
                  : {
                      backgroundColor: isHovered
                        ? 'rgb(16 185 129 / 0.15)'
                        : undefined,
                      rotate: isHovered ? [0, -8, 8, 0] : 0,
                    }
              }
              transition={{
                duration: 0.4,
                rotate: { duration: 0.5, ease: 'easeInOut' },
              }}
            >
              <Icon
                size={20}
                className='text-foreground/80 transition-colors duration-300'
                strokeWidth={1.5}
                style={{
                  color: isHovered ? 'rgb(16 185 129)' : undefined,
                }}
              />
            </motion.div>
          </div>

          <span
            className='text-sm font-medium text-foreground/90 transition-colors duration-300 tracking-tight'
            style={{
              color: isHovered ? 'rgb(16 185 129)' : undefined,
            }}
          >
            {name}
          </span>
        </div>

        {/* Bottom emerald line — animated width */}
        <motion.div
          className='absolute inset-x-0 bottom-0 h-px bg-emerald-500/60'
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: ease.smooth }}
          style={{ transformOrigin: 'left' }}
        />
      </motion.div>
    </motion.div>
  );
}