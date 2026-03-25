// src/components/chat/chat-window.tsx
'use client';

import { IconRefresh, IconSend, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useChat } from 'src/hooks';
import { ChatMessage } from './chat-message';

interface ChatWindowProps {
  onClose: () => void;
}

interface FormValues {
  message: string;
}

const SUGGESTIONS = [
  { label: '💻 Tech Stack', message: 'What tech stack does Hossam use?' },
  { label: '📁 Projects', message: 'Tell me about his projects' },
  { label: '📞 Contact', message: 'How can I contact Hossam?' },
  { label: '💼 Experience', message: "What's his work experience?" },
];

export const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const { messages, sendMessage, isLoading, clearMessages } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { message: '' },
  });

  const message = useWatch({
    control,
    name: 'message',
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = ({ message }: FormValues) => {
    if (!message.trim() || isLoading) return;
    sendMessage(message);
    reset();
  };

  const handleSuggestion = (suggestion: string) => {
    if (isLoading) return;
    sendMessage(suggestion);
  };

  return (
    <div className='flex h-full flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-950'>
      {/* ─── Header ─── */}
      <div className='flex items-center justify-between border-b px-4 py-3 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-sm z-10'>
        <div className='flex items-center gap-2.5'>
          <div className='relative'>
            <div className='h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center'>
              <span className='text-sm'>🤖</span>
            </div>
            <div className='absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900' />
          </div>
          <div>
            <h3 className='text-sm font-semibold text-neutral-800 dark:text-white'>
              Portfolio AI
            </h3>
            <p className='text-[10px] text-emerald-600 dark:text-emerald-400'>
              Online • Powered by Hossam
            </p>
          </div>
        </div>

        <div className='flex items-center gap-1'>
          <button
            onClick={clearMessages}
            className='rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 transition-colors'
            aria-label='Clear chat'
            title='Clear chat'
          >
            <IconRefresh size={16} />
          </button>
          <button
            onClick={onClose}
            className='rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 transition-colors'
            aria-label='Close chat'
          >
            <IconX size={16} />
          </button>
        </div>
      </div>

      {/* ─── Messages ─── */}
   
<div
  ref={scrollRef}
  className='flex-1 overflow-y-auto w-full p-4 space-y-4 scroll-smooth overscroll-contain'
  onWheel={(e) => {
    // ✅ Stop scroll from propagating to the page
    e.stopPropagation();
  }}
  onTouchMove={(e) => {
    // ✅ Stop touch scroll from propagating on mobile
    e.stopPropagation();
  }}
>
  <AnimatePresence initial={false}>
    {messages.map((m) => (
      <ChatMessage key={m.id} role={m.role} content={m.content} />
    ))}
  </AnimatePresence>
</div>

      {/* ─── Suggestions (only when conversation just started) ─── */}
      <AnimatePresence>
        {messages.length <= 1 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='px-4 pb-2 overflow-hidden'
          >
            <div className='flex flex-wrap gap-1.5'>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleSuggestion(s.message)}
                  className='text-[11px] px-2.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all duration-200'
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Input ─── */}
      <div className='border-t p-4 bg-white dark:bg-neutral-900 dark:border-neutral-800'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex items-center gap-2 rounded-full border bg-neutral-50 px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 dark:bg-neutral-950 dark:border-neutral-800 transition-all duration-200'
        >
          <input
            {...register('message')}
            className='no-outline flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400 dark:text-white'
            placeholder='Ask about skills, projects...'
            disabled={isLoading || isSubmitting}
            autoComplete='off'
          />
          <motion.button
            type='submit'
            disabled={isLoading || !message?.trim()}
            whileHover={
              message?.trim() && !isLoading ? { scale: 1.05 } : {}
            }
            whileTap={
              message?.trim() && !isLoading ? { scale: 0.95 } : {}
            }
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
              message?.trim() && !isLoading
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'
                : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <motion.div
                className='h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full'
                animate={{ rotate: 360 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ) : (
              <IconSend size={14} />
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
};