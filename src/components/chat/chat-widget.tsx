// src/components/chat/chat-widget.tsx
'use client';

import { IconMessageChatbot, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'src/hooks';
import { duration, ease } from 'src/lib/motion';
import { ChatWindow } from './chat-window';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAppeared, setHasAppeared] = useState(false);
  const prefersReduced = useReducedMotion();

  // Delayed entrance
  useEffect(() => {
    const timer = setTimeout(() => setHasAppeared(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Lock background scroll when chat is open
  useEffect(() => {
    if (!isOpen) return;

    // Dispatch custom event so Lenis knows to stop
    window.dispatchEvent(new CustomEvent('chat-toggle', { detail: { open: true } }));

    return () => {
      window.dispatchEvent(new CustomEvent('chat-toggle', { detail: { open: false } }));
    };
  }, [isOpen]);

  return (
    <div className='fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4'>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast }}
            className='fixed inset-0 bg-black/20 backdrop-blur-sm sm:hidden z-40'
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode='wait'>
        {isOpen && (
          <motion.div
            initial={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.92, y: 16 }
            }
            animate={
              prefersReduced
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.92, y: 16 }
            }
            transition={{ ...ease.spring }}
            className='h-125 w-[calc(100vw-2rem)] sm:w-90 mb-3 overflow-hidden rounded-2xl border bg-white shadow-2xl dark:bg-neutral-900 dark:border-neutral-800 z-50 relative'
          >
            <ChatWindow onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <AnimatePresence>
        {hasAppeared && (
          <motion.button
            initial={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0 }
            }
            animate={
              prefersReduced
                ? { opacity: 1 }
                : { opacity: 1, scale: 1 }
            }
            exit={{ opacity: 0, scale: 0 }}
            whileHover={prefersReduced ? {} : { scale: 1.08 }}
            whileTap={prefersReduced ? {} : { scale: 0.92 }}
            transition={{ ...ease.spring }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close chat' : 'Open chat'}
            className='cursor-pointer relative flex h-11 w-11 items-center justify-center rounded-full bg-neutral-200/60 hover:bg-neutral-300/70 dark:bg-neutral-800/50 dark:hover:bg-neutral-700/60 backdrop-blur-sm transition-colors z-50'
          >
            <AnimatePresence mode='wait'>
              {isOpen ? (
                <motion.div
                  key='close'
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: duration.fast }}
                >
                  <IconX className='h-5 w-5 text-neutral-800 dark:text-neutral-50' />
                </motion.div>
              ) : (
                <motion.div
                  key='chat'
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: duration.fast }}
                >
                  <IconMessageChatbot className='h-5 w-5 text-neutral-800 dark:text-neutral-50' />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};