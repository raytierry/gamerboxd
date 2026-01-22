'use client';

import { motion, useReducedMotion } from 'motion/react';
import { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className = '' }: PageWrapperProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={shouldReduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={shouldReduce 
        ? { duration: 0.01 } 
        : { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
