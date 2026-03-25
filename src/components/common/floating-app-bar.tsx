// src/components/common/floating-app-bar.tsx
'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useState } from 'react';
import { useReducedMotion } from 'src/hooks/useReducedMotion';
import { FloatingAppBarLinks } from 'src/lib';
import { FloatingDock } from '../ui';

export default function FloatingAppBar() {
  const [visible, setVisible] = useState(true);
  const { scrollY } = useScroll();
  const prefersReduced = useReducedMotion();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    // Show when scrolling up or at top, hide when scrolling down
    if (latest < 100) {
      setVisible(true);
    } else if (latest < previous) {
      setVisible(true);
    } else if (latest > previous && latest > 200) {
      setVisible(false);
    }
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className='fixed bottom-4 z-50 flex left-4 sm:left-1/2 sm:-translate-x-1/2'
        >
          <FloatingDock items={FloatingAppBarLinks} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}