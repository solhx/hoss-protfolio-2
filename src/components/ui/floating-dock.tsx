// src/components/ui/floating-dock.tsx
'use client';

import { IconLayoutNavbarCollapse } from '@tabler/icons-react';
import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { cn } from 'src/utils';

export interface FloatingDockItems {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  download?: boolean;
}

// ─── Helper: Determine if href is a hash link ───
function isHashLink(href?: string): boolean {
  return !!href && href.startsWith('#');
}

// ─── Helper: Determine if href is external ───
function isExternalLink(href?: string): boolean {
  return !!href && href.startsWith('http');
}

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: FloatingDockItems[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

// ═══════════════════════════════════════════════
// MOBILE DOCK
// ═══════════════════════════════════════════════

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: FloatingDockItems[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('relative block md:hidden', className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId='nav'
            className='absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2'
          >
            {items.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: { delay: index * 0.05 },
                }}
                transition={{ delay: (items.length - 1 - index) * 0.05 }}
              >
                <MobileNavItem
                  item={item}
                  onNavigate={() => setOpen(false)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen(!open)}
        className='flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200/60 hover:bg-neutral-300/70 dark:bg-neutral-800/50 dark:hover:bg-neutral-700/60 backdrop-blur-sm transition-colors'
      >
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <IconLayoutNavbarCollapse className='h-5 w-5 text-neutral-800 dark:text-neutral-50' />
        </motion.div>
      </button>
    </div>
  );
};

// ─── Mobile nav item — handles hash, external, and button items ───
const MobileNavItem = ({
  item,
  onNavigate,
}: {
  item: FloatingDockItems;
  onNavigate: () => void;
}) => {
  const baseClassName =
    'flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200/60 hover:bg-neutral-300/70 dark:bg-neutral-800/50 dark:hover:bg-neutral-700/60 backdrop-blur-sm transition-colors';

  // Button (no href) — like theme toggle
  if (!item.href) {
    return (
      <button
        aria-label={item.title}
        onClick={() => {
          item.onClick?.();
          // Don't close menu for toggle actions
        }}
        className={baseClassName}
      >
        <div className='text-neutral-800 dark:text-neutral-50'>{item.icon}</div>
      </button>
    );
  }

  // Hash link — use <a> tag, SmoothScroll handles the scroll
  if (isHashLink(item.href)) {
    return (
      <a
        href={item.href}
        aria-label={item.title}
        onClick={() => {
          // Close mobile menu after clicking
          setTimeout(onNavigate, 100);
        }}
        className={baseClassName}
      >
        <div className='text-neutral-800 dark:text-neutral-50'>{item.icon}</div>
      </a>
    );
  }

  // External link or download — use Next.js Link
  return (
    <Link
      href={item.href}
      aria-label={item.title}
      rel='noopener noreferrer'
      target={isExternalLink(item.href) ? '_blank' : '_self'}
      download={item.download}
      className={baseClassName}
    >
      <div className='text-neutral-800 dark:text-neutral-50'>{item.icon}</div>
    </Link>
  );
};

// ═══════════════════════════════════════════════
// DESKTOP DOCK
// ═══════════════════════════════════════════════

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: FloatingDockItems[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'mx-auto hidden h-16 items-end gap-4 rounded-2xl bg-neutral-100/60 backdrop-blur-[6px] px-4 pb-3 md:flex dark:bg-neutral-900/50',
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════
// ICON CONTAINER (Desktop — with magnetic scaling)
// ═══════════════════════════════════════════════

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onClick,
  download,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  download?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const springConfig = { mass: 0.1, stiffness: 150, damping: 12 };

  const width = useSpring(
    useTransform(distance, [-150, 0, 150], [40, 80, 40]),
    springConfig,
  );
  const height = useSpring(
    useTransform(distance, [-150, 0, 150], [40, 80, 40]),
    springConfig,
  );
  const iconSize = useSpring(
    useTransform(distance, [-150, 0, 150], [20, 40, 20]),
    springConfig,
  );

  const [hovered, setHovered] = useState(false);

  // ─── Tooltip ───
  const Tooltip = () => (
    <AnimatePresence>
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 10, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 2, x: '-50%' }}
          className='absolute -top-8 left-1/2 w-fit rounded-md border border-neutral-300 bg-neutral-100/70 backdrop-blur-[6px] px-2 py-0.5 text-xs text-neutral-800 dark:border-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-50 whitespace-pre pointer-events-none'
        >
          {title}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ─── Icon ───
  const IconInner = () => (
    <motion.div
      style={{ width: iconSize, height: iconSize }}
      className='flex items-center justify-center text-neutral-800 dark:text-neutral-50'
    >
      {icon}
    </motion.div>
  );

  const containerClassName =
    'relative flex aspect-square items-center justify-center rounded-full bg-neutral-200/60 hover:bg-neutral-300/70 dark:bg-neutral-700/50 dark:hover:bg-neutral-600/60 backdrop-blur-[6px] transition-colors cursor-pointer';

  const hoverHandlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  // ─── Button (no href) — like theme toggle ───
  if (!href) {
    return (
      <motion.div ref={ref} style={{ width, height }} {...hoverHandlers}>
        <motion.button
          aria-label={title}
          onClick={onClick}
          className={containerClassName}
          style={{ width: '100%', height: '100%' }}
        >
          <Tooltip />
          <IconInner />
        </motion.button>
      </motion.div>
    );
  }

  // ─── Hash link — use <a> tag so SmoothScroll intercepts it ───
  if (isHashLink(href)) {
    return (
      <motion.div ref={ref} style={{ width, height }} {...hoverHandlers}>
        <a
          href={href}
          aria-label={title}
          className={containerClassName}
          style={{ width: '100%', height: '100%', display: 'flex' }}
        >
          <Tooltip />
          <IconInner />
        </a>
      </motion.div>
    );
  }

  // ─── External link or download — use Next.js Link ───
  return (
    <motion.div ref={ref} style={{ width, height }} {...hoverHandlers}>
      <Link
        href={href}
        aria-label={title}
        rel='noopener noreferrer'
        target={isExternalLink(href) ? '_blank' : '_self'}
        download={download}
        className={containerClassName}
        style={{ width: '100%', height: '100%', display: 'flex' }}
      >
        <Tooltip />
        <IconInner />
      </Link>
    </motion.div>
  );
}