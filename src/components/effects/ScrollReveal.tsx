import { motion, useInView } from 'motion/react';
import { ReactNode, useRef } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
  className?: string;
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  amount = 0.3,
  once = true,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once,
    amount,
  });

  const variants = {
    up: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
    },
    down: {
      initial: { opacity: 0, y: -50 },
      animate: { opacity: 1, y: 0 },
    },
    left: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
    },
    right: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
  };

  const selectedVariant = variants[direction];

  return (
    <motion.div
      ref={ref}
      initial={selectedVariant.initial}
      animate={isInView ? selectedVariant.animate : selectedVariant.initial}
      transition={{
        duration,
        delay,
        ease: [0.43, 0.13, 0.23, 0.96],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered children animation
interface ScrollRevealStaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  once?: boolean;
  className?: string;
}

export function ScrollRevealStagger({
  children,
  staggerDelay = 0.1,
  direction = 'up',
  once = true,
  className = '',
}: ScrollRevealStaggerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once,
    amount: 0.2,
  });

  const variants = {
    up: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
    },
    down: {
      initial: { opacity: 0, y: -50 },
      animate: { opacity: 1, y: 0 },
    },
    left: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
    },
    right: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
  };

  const selectedVariant = variants[direction];

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? 'animate' : 'initial'}
      variants={{
        animate: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div
              key={index}
              variants={selectedVariant}
              transition={{
                duration: 0.6,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

// Parallax scroll effect
interface ParallaxScrollProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxScroll({
  children,
  speed = 50,
  className = '',
}: ParallaxScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: false,
    amount: 0.5,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 0 }}
      animate={isInView ? { y: speed } : { y: 0 }}
      transition={{
        duration: 0.8,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Fade on scroll with opacity control
interface FadeScrollProps {
  children: ReactNode;
  fadeOut?: boolean;
  className?: string;
}

export function FadeScroll({
  children,
  fadeOut = false,
  className = '',
}: FadeScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: false,
    amount: 0.5,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: fadeOut ? 1 : 0 }}
      animate={{ opacity: isInView ? (fadeOut ? 0 : 1) : (fadeOut ? 1 : 0) }}
      transition={{
        duration: 0.6,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
