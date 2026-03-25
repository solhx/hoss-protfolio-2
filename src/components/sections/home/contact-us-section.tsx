// src/components/sections/home/contact-us-section.tsx
'use client';

import emailjs from '@emailjs/browser';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FlowingMenu, MainTitle } from 'src/components';
import { SectionReveal } from 'src/components/ui/section-reveal';
import { ContactUsItems } from 'src/lib';
import { duration, ease } from 'src/lib/motion';
import { ContactUsSchema, contactUsSchema } from 'src/validation';

// Spinner component
const Spinner = () => (
  <motion.div
    className='h-4 w-4 border-2 border-foreground/30 border-t-foreground rounded-full'
    animate={{ rotate: 360 }}
    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
  />
);

// Success checkmark
const SuccessIcon = () => (
  <motion.svg
    className='h-4 w-4 text-emerald-500'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={3}
    strokeLinecap='round'
    strokeLinejoin='round'
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: duration.slow, ease: ease.smooth }}
  >
    <motion.path
      d='M5 13l4 4L19 7'
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: duration.slow, delay: 0.1 }}
    />
  </motion.svg>
);

export default function HomeContactUsSection() {
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactUsSchema>({
    resolver: zodResolver(contactUsSchema),
  });

  const onSubmit = async (data: ContactUsSchema) => {
    try {
      setStatus('sending');
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID!,
        {
          ...data,
          time: new Date().toLocaleString(),
        },
        process.env.NEXT_PUBLIC_EMAIL_USER_ID,
      );
      setStatus('success');
      reset();
      // Auto-reset success message after 5s
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const inputClassName =
    'w-full rounded-lg border border-card-foreground/30 p-3 bg-transparent outline-none transition-all duration-300 focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-muted-foreground/50';

  return (
    <section
      className='py-8 container mx-auto px-4 sm:px-6 lg:px-8 w-full'
      id='home-contact-us-section'
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <SectionReveal direction='left'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='w-full bg-transparent rounded-2xl space-y-4'
          >
            <MainTitle regularText='Contact' boldText='Me' />

            {/* Name field */}
            <div>
              <input
                type='text'
                placeholder='Your Name'
                {...register('name')}
                className={inputClassName}
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    transition={{ duration: duration.fast }}
                    className='text-red-500 text-sm mt-1'
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email field */}
            <div>
              <input
                type='email'
                placeholder='Your Email'
                {...register('email')}
                className={inputClassName}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    transition={{ duration: duration.fast }}
                    className='text-red-500 text-sm mt-1'
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Message field */}
            <div>
              <textarea
                placeholder='Your Message'
                {...register('message')}
                className={`${inputClassName} h-28 resize-none`}
              />
              <AnimatePresence>
                {errors.message && (
                  <motion.p
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    transition={{ duration: duration.fast }}
                    className='text-red-500 text-sm mt-1'
                  >
                    {errors.message.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit button with state feedback */}
            <motion.button
              type='submit'
              disabled={status === 'sending'}
              whileHover={status !== 'sending' ? { scale: 1.01 } : {}}
              whileTap={status !== 'sending' ? { scale: 0.98 } : {}}
              className={`cursor-pointer text-center w-full px-6 sm:px-7 py-3 rounded-lg backdrop-blur-sm border text-foreground transition-all duration-300 flex items-center justify-center gap-2 ${
                status === 'sending'
                  ? 'bg-neutral-50/30 dark:bg-neutral-100/5 border-card-foreground/20 cursor-not-allowed opacity-70'
                  : status === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400'
                    : 'bg-neutral-50/50 dark:bg-neutral-100/10 border-card-foreground/30 hover:border-card-foreground/50'
              }`}
            >
              <AnimatePresence mode='wait'>
                {status === 'sending' ? (
                  <motion.div
                    key='sending'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='flex items-center gap-2'
                  >
                    <Spinner />
                    <span>Sending...</span>
                  </motion.div>
                ) : status === 'success' ? (
                  <motion.div
                    key='success'
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className='flex items-center gap-2'
                  >
                    <SuccessIcon />
                    <span>Message Sent!</span>
                  </motion.div>
                ) : status === 'error' ? (
                  <motion.span
                    key='error'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='text-red-500'
                  >
                    Failed — Try Again
                  </motion.span>
                ) : (
                  <motion.span
                    key='idle'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Send Message
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>
        </SectionReveal>

        <SectionReveal direction='right' delay={0.15}>
          <FlowingMenu items={ContactUsItems} />
        </SectionReveal>
      </div>
    </section>
  );
}