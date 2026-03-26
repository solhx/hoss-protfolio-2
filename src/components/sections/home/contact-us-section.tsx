// src/components/sections/home/contact-us-section.tsx
'use client';

import emailjs from '@emailjs/browser';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FlowingMenu, MainTitle } from 'src/components';
import { SectionReveal } from 'src/components/ui/section-reveal';
import { useReducedMotion } from 'src/hooks/useReducedMotion';
import { ContactUsItems } from 'src/lib';
import { duration, ease } from 'src/lib/motion';
import { ContactUsSchema, contactUsSchema } from 'src/validation';

// ─── Spinner ───
const Spinner = () => (
  <motion.div
    className='h-4 w-4 border-2 border-foreground/30 border-t-foreground rounded-full'
    animate={{ rotate: 360 }}
    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
  />
);

// ─── Success Check ───
const SuccessIcon = () => (
  <motion.svg
    className='h-4 w-4 text-emerald-500'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={3}
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <motion.path
      d='M5 13l4 4L19 7'
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: duration.slow, delay: 0.1 }}
    />
  </motion.svg>
);

// ─── Animated Input Wrapper with focus line ───
function FormField({
  children,
  error,
}: {
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className='relative'>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: duration.fast }}
            className='text-red-500 text-sm mt-1.5 flex items-center gap-1'
          >
            <span className='inline-block w-1 h-1 rounded-full bg-red-500' />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HomeContactUsSection() {
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');
  const prefersReduced = useReducedMotion();

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
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const inputClassName =
    'form-input peer';

  return (
    <section
      className='py-8 container mx-auto px-4 sm:px-6 lg:px-8 w-full'
      id='home-contact-us-section'
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <SectionReveal direction='left'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='w-full bg-transparent rounded-2xl space-y-5'
            noValidate
          >
            <MainTitle regularText='Contact' boldText='Me' />

            {/* Name */}
            <FormField error={errors.name?.message}>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='Your Name'
                  {...register('name')}
                  className={inputClassName}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {/* Focus underline animation */}
                <motion.div
                  className='absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500 rounded-full'
                  initial={{ scaleX: 0 }}
                  whileFocus={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: 'center' }}
                />
              </div>
            </FormField>

            {/* Email */}
            <FormField error={errors.email?.message}>
              <input
                type='email'
                placeholder='Your Email'
                {...register('email')}
                className={inputClassName}
                aria-invalid={!!errors.email}
              />
            </FormField>

            {/* Message */}
            <FormField error={errors.message?.message}>
              <textarea
                placeholder='Your Message'
                {...register('message')}
                className={`${inputClassName} h-28 resize-none`}
                aria-invalid={!!errors.message}
              />
            </FormField>

            {/* Submit */}
            <motion.button
              type='submit'
              disabled={status === 'sending'}
              whileHover={
                status !== 'sending' && !prefersReduced
                  ? { scale: 1.01, y: -1 }
                  : {}
              }
              whileTap={
                status !== 'sending' && !prefersReduced
                  ? { scale: 0.98 }
                  : {}
              }
              className={`cursor-pointer text-center w-full px-6 sm:px-7 py-3 rounded-lg backdrop-blur-sm border text-foreground transition-all duration-300 flex items-center justify-center gap-2 ${
                status === 'sending'
                  ? 'bg-neutral-50/30 dark:bg-neutral-100/5 border-card-foreground/20 cursor-not-allowed opacity-70'
                  : status === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400'
                    : status === 'error'
                      ? 'bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400'
                      : 'bg-neutral-50/50 dark:bg-neutral-100/10 border-card-foreground/30 hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/10'
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