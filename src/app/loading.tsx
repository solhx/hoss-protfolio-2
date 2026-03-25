// src/app/loading.tsx
'use client';

import { motion } from 'motion/react';

export default function Loading() {
  return (
    <motion.div
      className='fixed inset-0 z-[100] flex items-center justify-center bg-background'
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className='flex flex-col items-center gap-4'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <motion.div
          className='w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full'
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <span className='text-sm text-muted-foreground tracking-wider'>
          LOADING
        </span>
      </motion.div>
    </motion.div>
  );
}