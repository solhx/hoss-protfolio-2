// src/components/ui/motion-wrapper.tsx
"use client";

import React from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
// Unused imports removed - variants now passed as props
import { staggerContainer } from "../../lib/motion";

// ═══════════════════════════════════════════════════════════
// ANIMATED SECTION — Scroll-triggered reveal
// ═══════════════════════════════════════════════════════════
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  viewportMargin?: string;
  viewportOnce?: boolean;
  delay?: number;
  id?: string;
}

export function AnimatedSection({
  children,
  className,
  variants,
  viewportMargin = "-100px",
  viewportOnce = true,
  delay = 0,
  id,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    margin: viewportMargin,
    once: viewportOnce,
  });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{ willChange: "opacity, transform" }}
      custom={delay}
    >
      {children}
    </motion.section>
  );
}

// ═══════════════════════════════════════════════════════════
// ANIMATED GROUP — Stagger children on scroll
// ═══════════════════════════════════════════════════════════
interface AnimatedGroupProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  viewportOnce?: boolean;
  as?: "div" | "ul" | "ol" | "section";
}

export function AnimatedGroup({
  children,
  className,
  staggerDelay = stagger.normal,
  delayChildren,
  viewportOnce = true,
  as = "div",
}: AnimatedGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once: viewportOnce, 
    amount: 0.2 
  });
  const prefersReducedMotion = useReducedMotion();

  const Component = motion[as] as typeof motion.div;

  if (prefersReducedMotion) {
    const Tag = as as any;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Component
      ref={ref}
      className={className}
      variants={staggerContainer(staggerDelay!, delayChildren)}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </Component>
  );
}

export function AnimatedGroup({
  children,
  className,
  staggerDelay = 0.1,
  delayChildren = 0.2,
  viewportOnce = true,
  as = "div",
}: AnimatedGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: viewportOnce, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  const Component = motion[as] as typeof motion.div;

  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Component
      ref={ref}
      className={className}
      variants={staggerContainer(staggerDelay, delayChildren)}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </Component>
  );
}

// ═══════════════════════════════════════════════════════════
// ANIMATED ITEM — For use inside AnimatedGroup
// ═══════════════════════════════════════════════════════════
interface AnimatedItemProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  as?: "div" | "li" | "article" | "span";
}

export function AnimatedItem({
  children,
  className,
  variants,
  as = "div",
}: AnimatedItemProps) {
  const Component = motion[as] as typeof motion.div;

  return (
    <Component className={className} variants={variants}>
      {children}
    </Component>
  );
}

// ═══════════════════════════════════════════════════════════
// ANIMATED TEXT — Character-by-character reveal
// ═══════════════════════════════════════════════════════════
interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  charDelay?: number;
  viewportOnce?: boolean;
}

export function AnimatedText({
  text,
  className,
  as = "h2",
  charDelay = 0.03,
  viewportOnce = true,
}: AnimatedTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: viewportOnce, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  const Component = motion[as] as typeof motion.h2;

  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }

  const words = text.split(" ");

  return (
    <Component
      ref={ref}
      className={className}
      style={{ display: "flex", flexWrap: "wrap", gap: "0.25em" }}
      aria-label={text}
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} style={{ display: "inline-flex", overflow: "hidden" }}>
          {word.split("").map((char, charIdx) => {
            const totalIdx =
              words.slice(0, wordIdx).join("").length + charIdx + wordIdx;
            return (
              <motion.span
                key={charIdx}
                style={{
                  display: "inline-block",
                  willChange: "transform, opacity",
                }}
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                animate={
                  isInView
                    ? {
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        transition: {
                          type: "spring",
                          stiffness: 150,
                          damping: 12,
                          delay: totalIdx * charDelay,
                        },
                      }
                    : { opacity: 0, y: 50, rotateX: -90 }
                }
                aria-hidden="true"
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </Component>
  );
}

// ═══════════════════════════════════════════════════════════
// REVEAL — Clip-path mask reveal
// ═══════════════════════════════════════════════════════════
interface RevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
}

export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.8,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  const clipPaths = {
    up: {
      hidden: "inset(100% 0% 0% 0%)",
      visible: "inset(0% 0% 0% 0%)",
    },
    down: {
      hidden: "inset(0% 0% 100% 0%)",
      visible: "inset(0% 0% 0% 0%)",
    },
    left: {
      hidden: "inset(0% 100% 0% 0%)",
      visible: "inset(0% 0% 0% 0%)",
    },
    right: {
      hidden: "inset(0% 0% 0% 100%)",
      visible: "inset(0% 0% 0% 0%)",
    },
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: clipPaths[direction].hidden, opacity: 0 }}
      animate={
        isInView
          ? {
              clipPath: clipPaths[direction].visible,
              opacity: 1,
              transition: {
                clipPath: { duration, ease: [0.16, 1, 0.3, 1], delay },
                opacity: { duration: 0.3, delay },
              },
            }
          : {}
      }
    >
      {children}
    </motion.div>
  );
}