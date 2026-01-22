'use client';

import { motion, useReducedMotion, type Variants, type HTMLMotionProps } from 'motion/react';

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const variants = {
  fadeIn,
  fadeInUp,
  fadeInDown,
  scaleIn,
  staggerContainer,
  staggerItem,
};

type MotionDivProps = HTMLMotionProps<'div'> & {
  variant?: keyof typeof variants;
  delay?: number;
};

function getTransition(shouldReduce: boolean | null, delay: number) {
  if (shouldReduce) {
    return { duration: 0.01, delay: 0 };
  }
  return { duration: 0.4, delay, ease: 'easeOut' as const };
}

export function FadeIn({ children, delay = 0, ...props }: MotionDivProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={shouldReduce ? reducedVariants : fadeIn}
      transition={getTransition(shouldReduce, delay)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadeInUp({ children, delay = 0, ...props }: MotionDivProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={shouldReduce ? reducedVariants : fadeInUp}
      transition={getTransition(shouldReduce, delay)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, ...props }: MotionDivProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={shouldReduce ? reducedVariants : scaleIn}
      transition={getTransition(shouldReduce, delay)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, ...props }: MotionDivProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={shouldReduce ? reducedVariants : staggerContainer}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...props }: MotionDivProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduce ? reducedVariants : staggerItem}
      transition={shouldReduce ? { duration: 0.01 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
