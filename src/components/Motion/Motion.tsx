'use client';

import { motion, type Variants, type HTMLMotionProps } from 'motion/react';

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

export function FadeIn({ children, delay = 0, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadeInUp({ children, delay = 0, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleIn}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...props }: MotionDivProps) {
  return (
    <motion.div variants={staggerItem} {...props}>
      {children}
    </motion.div>
  );
}
