// src/components/ui/magnetic-button.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence, type HTMLMotionProps } from 'motion/react';
import { useMagnetic } from 'src/hooks/useMagnetic';
import { useReducedMotion } from 'src/hooks/useReducedMotion';
import { cn } from 'src/utils';

// ═══════════════════════════════════════════════════════════
// VARIANTS
// ═══════════════════════════════════════════════════════════
const variants = {
  primary:
    'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35',
  secondary:
    'bg-white/10 backdrop-blur-md text-foreground border border-white/20 hover:bg-white/20',
  ghost:
    'text-foreground hover:bg-foreground/5',
  outline:
    'border-2 border-foreground/20 text-foreground hover:border-emerald-500/50 hover:bg-emerald-500/5',
  glass:
    'bg-neutral-50/50 dark:bg-neutral-100/10 backdrop-blur-sm border border-card-foreground/30 text-foreground hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/10',
} as const;

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-6 py-3 text-base rounded-xl gap-2',
  lg: 'px-8 py-4 text-lg rounded-2xl gap-2.5',
} as const;

// ═══════════════════════════════════════════════════════════
// TYPES — Use HTMLMotionProps instead of native HTML attrs
// This avoids the onDrag/onAnimationStart type conflicts
// ═══════════════════════════════════════════════════════════
type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

interface MagneticButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number;
  variant?: ButtonVariant;
  size?: ButtonSize;
  glow?: boolean;
  shine?: boolean;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export function MagneticButton({
  children,
  className,
  magneticStrength = 0.3,
  variant = 'primary',
  size = 'md',
  glow = true,
  shine = true,
  disabled,
  ...props
}: MagneticButtonProps) {
  const magnetic = useMagnetic<HTMLButtonElement>(magneticStrength);
  const prefersReduced = useReducedMotion();

  return (
    <motion.button
      ref={magnetic.ref}
      className={cn(
        'relative inline-flex items-center justify-center',
        'font-medium transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-50',
        'cursor-pointer select-none overflow-hidden',
        variants[variant],
        sizes[size],
        className,
      )}
      style={
        prefersReduced
          ? {}
          : { x: magnetic.x, y: magnetic.y }
      }
      onMouseMove={magnetic.handleMouseMove}
      onMouseLeave={magnetic.handleMouseLeave}
      whileTap={
        prefersReduced || disabled
          ? {}
          : { scale: 0.96, transition: { duration: 0.1 } }
      }
      whileHover={
        prefersReduced || disabled
          ? {}
          : { scale: 1.02 }
      }
      disabled={disabled}
      {...props}
    >
      {/* ── Glow ring ── */}
      {glow && !prefersReduced && !disabled && (
        <AnimatePresence>
          {magnetic.isHovered && (
            <motion.span
              className='absolute -inset-1 rounded-[inherit] blur-xl pointer-events-none'
              style={{
                background:
                  variant === 'primary'
                    ? 'linear-gradient(135deg, rgb(16 185 129 / 0.3), rgb(52 211 153 / 0.2))'
                    : 'linear-gradient(135deg, rgb(16 185 129 / 0.15), rgb(52 211 153 / 0.1))',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.15 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      )}

      {/* ── Content ── */}
      <span className='relative z-10 flex items-center justify-center gap-2'>
        {children}
      </span>

      {/* ── Shine sweep ── */}
      {shine && !prefersReduced && !disabled && (
        <AnimatePresence>
          {magnetic.isHovered && (
            <motion.span
              className='absolute inset-0 z-[5] pointer-events-none overflow-hidden rounded-[inherit]'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.span
                className='absolute inset-0'
                style={{
                  background:
                    'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 60%)',
                  width: '200%',
                  height: '100%',
                }}
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 0.7,
                  ease: 'easeInOut',
                }}
              />
            </motion.span>
          )}
        </AnimatePresence>
      )}

      {/* ── Press inner shadow ── */}
      <motion.span
        className='absolute inset-0 rounded-[inherit] pointer-events-none'
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
        }}
        initial={{ opacity: 0 }}
        whileTap={{ opacity: 1 }}
        transition={{ duration: 0.05 }}
      />
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════
// MAGNETIC LINK — Same visual, renders as <a>
// ═══════════════════════════════════════════════════════════
interface MagneticLinkProps
  extends Omit<HTMLMotionProps<'a'>, 'children'> {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number;
  variant?: ButtonVariant;
  size?: ButtonSize;
  glow?: boolean;
  shine?: boolean;
}

export function MagneticLink({
  children,
  className,
  magneticStrength = 0.3,
  variant = 'glass',
  size = 'md',
  glow = true,
  shine = true,
  ...props
}: MagneticLinkProps) {
  const magnetic = useMagnetic<HTMLAnchorElement>(magneticStrength);
  const prefersReduced = useReducedMotion();

  return (
    <motion.a
      ref={magnetic.ref}
      className={cn(
        'relative inline-flex items-center justify-center',
        'font-medium transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
        'cursor-pointer select-none overflow-hidden no-underline',
        variants[variant],
        sizes[size],
        className,
      )}
      style={
        prefersReduced
          ? {}
          : { x: magnetic.x, y: magnetic.y }
      }
      onMouseMove={magnetic.handleMouseMove}
      onMouseLeave={magnetic.handleMouseLeave}
      whileTap={
        prefersReduced
          ? {}
          : { scale: 0.96, transition: { duration: 0.1 } }
      }
      {...props}
    >
      {/* Glow */}
      {glow && !prefersReduced && (
        <AnimatePresence>
          {magnetic.isHovered && (
            <motion.span
              className='absolute -inset-1 rounded-[inherit] blur-xl pointer-events-none'
              style={{
                background:
                  'linear-gradient(135deg, rgb(16 185 129 / 0.15), rgb(52 211 153 / 0.1))',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.15 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      )}

      {/* Content */}
      <span className='relative z-10 flex items-center gap-2'>
        {children}
      </span>

      {/* Shine */}
      {shine && !prefersReduced && (
        <AnimatePresence>
          {magnetic.isHovered && (
            <motion.span
              className='absolute inset-0 z-[5] pointer-events-none overflow-hidden rounded-[inherit]'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.span
                className='absolute inset-0'
                style={{
                  background:
                    'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)',
                  width: '200%',
                  height: '100%',
                }}
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
              />
            </motion.span>
          )}
        </AnimatePresence>
      )}
    </motion.a>
  );
}