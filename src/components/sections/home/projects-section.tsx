// src/components/sections/home/projects-section.tsx
'use client';

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
} from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useRef } from 'react';
import { MainTitle } from 'src/components/ui';
import { SectionReveal } from 'src/components/ui/section-reveal';
import { useReducedMotion } from 'src/hooks/useReducedMotion';
import { ProductsItems } from 'src/lib';

export default function HomeProjectsSection() {
  const firstRow = ProductsItems.slice(0, 3);
  const secondRow = ProductsItems.slice(3, 6);
  const thirdRow = ProductsItems.slice(6, 9);

  const ref = React.useRef(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const springConfig = { stiffness: 200, damping: 30 };

  const rotateX = useSpring(
    useTransform(scrollYProgress, [0.15, 0.45], [18, 0]),
    springConfig,
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0.15, 0.45], [0.15, 1]),
    springConfig,
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0.15, 0.45], [20, 0]),
    springConfig,
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0.15, 0.45], [-120, 0]),
    springConfig,
  );
  const scale = useSpring(
    useTransform(scrollYProgress, [0.15, 0.45], [0.9, 1]),
    springConfig,
  );

  return (
    <section
      id='home-projects-section'
      className='py-8 w-full overflow-hidden'
    >
      <div
        ref={ref}
        className='relative flex flex-col items-center perspective-[1000px] transform-3d pointer-events-none'
      >
        <Header />
        <motion.div
          style={
            prefersReduced
              ? {}
              : { rotateX, rotateZ, translateY, opacity, scale }
          }
          className='flex flex-col items-center gap-4 md:gap-8 pointer-events-auto'
        >
          <InfiniteRow products={firstRow} reverse speed={28} />
          <InfiniteRow products={secondRow} speed={22} />
          <InfiniteRow products={thirdRow} reverse speed={26} />
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// INFINITE MARQUEE ROW — with variable speed
// ═══════════════════════════════════════════════════════════
const InfiniteRow = ({
  products,
  reverse = false,
  speed = 25,
}: {
  products: { title: string; link: string; thumbnail: string }[];
  reverse?: boolean;
  speed?: number;
}) => {
  return (
    <div className='overflow-hidden w-full group/row'>
      <div
        className={`flex ${
          reverse
            ? 'flex-row-reverse animate-marquee-reverse'
            : 'animate-marquee'
        } gap-4 md:gap-8 group-hover/row:[animation-play-state:paused]`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {/* Triple duplication for seamless infinite loop */}
        {[...products, ...products, ...products].map((product, index) => (
          <ProductCard key={`${product.title}-${index}`} product={product} />
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// PROJECT CARD — with 3D tilt on hover
// ═══════════════════════════════════════════════════════════
const ProductCard = ({
  product,
}: {
  product: { title: string; link: string; thumbnail: string };
}) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const prefersReduced = useReducedMotion();

  const rotateXCard = useMotionValue(0);
  const rotateYCard = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  // Spring-smoothed rotation
  const smoothRotateX = useSpring(rotateXCard, { stiffness: 200, damping: 20 });
  const smoothRotateY = useSpring(rotateYCard, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReduced || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalize cursor position to -1…1
      const normalX = (e.clientX - centerX) / (rect.width / 2);
      const normalY = (e.clientY - centerY) / (rect.height / 2);

      // Tilt: max ±8 degrees
      rotateYCard.set(normalX * 8);
      rotateXCard.set(-normalY * 8);

      // Glare position (percentage)
      glareX.set(((e.clientX - rect.left) / rect.width) * 100);
      glareY.set(((e.clientY - rect.top) / rect.height) * 100);
    },
    [prefersReduced, rotateXCard, rotateYCard, glareX, glareY],
  );

  const handleMouseLeave = useCallback(() => {
    rotateXCard.set(0);
    rotateYCard.set(0);
    glareX.set(50);
    glareY.set(50);
  }, [rotateXCard, rotateYCard, glareX, glareY]);

  return (
    <Link
      ref={cardRef}
      href={product.link}
      target='_blank'
      rel='noopener noreferrer'
      className='group/product relative shrink-0 w-56 sm:w-[20rem] md:w-104 rounded-2xl overflow-hidden cursor-pointer block'
      style={{ perspective: '800px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className='relative w-full aspect-video overflow-hidden rounded-2xl border border-primary/20 shadow-sm transition-shadow duration-300 group-hover/product:shadow-lg group-hover/product:shadow-emerald-500/10'
        style={
          prefersReduced
            ? {}
            : {
                rotateX: smoothRotateX,
                rotateY: smoothRotateY,
                transformStyle: 'preserve-3d' as const,
              }
        }
        whileHover={prefersReduced ? {} : { scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes='(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 30vw'
          className='object-cover transition-transform duration-700 group-hover/product:scale-110'
        />

        {/* Gradient overlay — multi-layer for depth */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/product:opacity-100 transition-opacity duration-500 pointer-events-none' />

        {/* Glare / specular highlight layer */}
        {!prefersReduced && (
          <motion.div
            className='absolute inset-0 pointer-events-none opacity-0 group-hover/product:opacity-100 transition-opacity duration-500'
            style={{
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
            }}
          />
        )}

        {/* Project title + view prompt */}
        <div className='absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover/product:translate-y-0 transition-transform duration-300 pointer-events-none'>
          <h2 className='text-white text-sm sm:text-base md:text-lg font-semibold opacity-0 group-hover/product:opacity-100 transition-opacity duration-300'>
            {product.title}
          </h2>
          <span className='text-white/60 text-xs mt-1 block opacity-0 group-hover/product:opacity-100 transition-opacity duration-500 delay-100'>
            Click to view →
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

// ═══════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════
const Header = () => (
  <SectionReveal>
    <div className='container mx-auto pt-0 pb-8 sm:py-16 px-4 w-full text-left relative -z-10 space-y-4'>
      <MainTitle boldText='Projects' regularText='Explore My' />
      <p className='section-description'>
        I create modern and elegant web products using cutting-edge technologies
        and frameworks, focusing on performance, scalability, and user experience.
      </p>
    </div>
  </SectionReveal>
);