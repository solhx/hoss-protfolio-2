// src/components/sections/home/projects-section.tsx
'use client';

import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
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

  // FIXED: Removed bounce:100, using sensible spring config
  const springConfig = { stiffness: 200, damping: 30 };

   // In projects-section.tsx — only these 4 transforms change:

const rotateX = useSpring(
  useTransform(scrollYProgress, [0.2, 0.5], [15, 0]),
  springConfig,
);
const opacity = useSpring(
  useTransform(scrollYProgress, [0.2, 0.5], [0.2, 1]),
  springConfig,
);
const rotateZ = useSpring(
  useTransform(scrollYProgress, [0.2, 0.5], [20, 0]),
  springConfig,
);
const translateY = useSpring(
  useTransform(scrollYProgress, [0.2, 0.5], [-100, 0]),
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
              : { rotateX, rotateZ, translateY, opacity }
          }
          className='flex flex-col items-center gap-4 md:gap-8 pointer-events-auto'
        >
          <InfiniteRow products={firstRow} reverse />
          <InfiniteRow products={secondRow} />
          <InfiniteRow products={thirdRow} reverse />
        </motion.div>
      </div>
    </section>
  );
}

const InfiniteRow = ({
  products,
  reverse = false,
}: {
  products: { title: string; link: string; thumbnail: string }[];
  reverse?: boolean;
}) => {
  return (
    // ADDED: group for pause-on-hover
    <div className='overflow-hidden w-full group/row'>
      <div
        className={`flex ${
          reverse
            ? 'flex-row-reverse animate-marquee-reverse'
            : 'animate-marquee'
        } gap-4 md:gap-8 group-hover/row:[animation-play-state:paused]`}
      >
        {[...products, ...products, ...products].map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
}: {
  product: { title: string; link: string; thumbnail: string };
}) => (
  <Link
    href={product.link}
    target='_blank'
    className='group/product relative shrink-0 w-56 sm:w-[20rem] md:w-104 border border-primary/20 rounded-2xl shadow-sm overflow-hidden cursor-pointer block transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/10'
  >
    <div className='relative w-full aspect-video overflow-hidden rounded-2xl'>
      <Image
        src={product.thumbnail}
        alt={product.title}
        fill
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        className='object-cover transition-transform duration-500 group-hover/product:scale-105'
      />
    </div>
    {/* Gradient overlay instead of flat black — more premium */}
    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover/product:opacity-100 transition-opacity duration-300 pointer-events-none' />
    <h2 className='absolute bottom-4 left-4 text-white text-sm sm:text-base md:text-lg font-medium opacity-0 group-hover/product:opacity-100 transition-all duration-300 translate-y-2 group-hover/product:translate-y-0 pointer-events-none'>
      {product.title}
    </h2>
  </Link>
);

export const Header = () => (
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