// src/components/chat/chat-widget.tsx
'use client';

import { IconMessageChatbot, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState, useCallback } from 'react';
import { useReducedMotion } from 'src/hooks';
import { duration, ease } from 'src/lib/motion';
import { ChatWindow } from './chat-window';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAppeared, setHasAppeared] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const prefersReduced = useReducedMotion();

  // Delayed entrance
  useEffect(() => {
    const timer = setTimeout(() => setHasAppeared(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Lock background scroll when chat is open
  useEffect(() => {
    if (!isOpen) return;

    window.dispatchEvent(
      new CustomEvent('chat-toggle', { detail: { open: true } }),
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent('chat-toggle', { detail: { open: false } }),
      );
    };
  }, [isOpen]);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!hasInteracted) setHasInteracted(true);
  }, [hasInteracted]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
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
            aria-hidden='true'
          />
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence mode='wait'>
        {isOpen && (
          <motion.div
            initial={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.92, y: 16, filter: 'blur(4px)' }
            }
            animate={
              prefersReduced
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }
            }
            exit={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.92, y: 16, filter: 'blur(4px)' }
            }
            transition={{
              duration: 0.35,
              ease: ease.smooth,
            }}
            className='h-125 w-[calc(100vw-2rem)] sm:w-90 mb-3 overflow-hidden rounded-2xl border bg-white shadow-2xl dark:bg-neutral-900 dark:border-neutral-800 z-50 relative'
            role='dialog'
            aria-label='Chat with Hossam'
            aria-modal='true'
          >
            <ChatWindow onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <AnimatePresence>
        {hasAppeared && (
          <motion.button
            initial={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0, rotate: -180 }
            }
            animate={
              prefersReduced
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, rotate: 0 }
            }
            exit={{ opacity: 0, scale: 0 }}
            whileHover={prefersReduced ? {} : { scale: 1.1 }}
            whileTap={prefersReduced ? {} : { scale: 0.9 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
            onClick={toggleChat}
            aria-label={isOpen ? 'Close chat' : 'Open chat'}
            aria-expanded={isOpen}
            className='cursor-pointer relative flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200/60 hover:bg-neutral-300/70 dark:bg-neutral-800/50 dark:hover:bg-neutral-700/60 backdrop-blur-sm transition-colors z-50 shadow-lg shadow-black/10'
          >
            {/* Notification pulse — only before first interaction */}
            {!hasInteracted && !isOpen && !prefersReduced && (
              <motion.span
                className='absolute inset-0 rounded-full border-2 border-emerald-500/50'
                animate={{
                  scale: [1, 1.5, 1.5],
                  opacity: [0.6, 0, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            )}

            {/* Notification dot — before first interaction */}
            {!hasInteracted && !isOpen && (
              <motion.span
                className='absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                  delay: 0.3,
                }}
              />
            )}

            {/* Icon swap animation */}
            <AnimatePresence mode='wait'>
              {isOpen ? (
                <motion.div
                  key='close'
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2, ease: ease.smooth }}
                >
                  <IconX className='h-5 w-5 text-neutral-800 dark:text-neutral-50' />
                </motion.div>
              ) : (
                <motion.div
                  key='chat'
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2, ease: ease.smooth }}
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