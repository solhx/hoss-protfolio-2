// src/components/chat/chat-message.tsx
import { IconRobot, IconUser } from '@tabler/icons-react';
import { motion } from 'motion/react'; // ✅ Fixed: was 'framer-motion'
import { cn } from 'src/utils';

export interface ChatMessageProps {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex w-full items-start gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm',
          isUser
            ? 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
            : 'bg-emerald-600 text-white border-emerald-600',
        )}
      >
        {isUser ? <IconUser size={16} /> : <IconRobot size={16} />}
      </div>
      <div
        className={cn(
          'relative px-4 py-2.5 text-sm shadow-sm max-w-[80%]',
          isUser
            ? 'rounded-2xl rounded-tr-none bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
            : 'rounded-2xl rounded-tl-none bg-white text-neutral-800 border dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-800',
        )}
      >
        {content ? (
          <p className='whitespace-pre-wrap leading-relaxed break-words'>
            {content}
          </p>
        ) : (
          // ✅ Typing indicator when content is empty (streaming)
          <div className='flex items-center gap-1 py-1'>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className='h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500'
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};