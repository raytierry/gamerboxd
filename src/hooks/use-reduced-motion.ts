import { useReducedMotion } from 'motion/react';

export function useAnimationConfig() {
  const shouldReduceMotion = useReducedMotion();

  return {
    shouldReduceMotion,
    transition: shouldReduceMotion
      ? { duration: 0 }
      : { type: 'spring' as const, damping: 25, stiffness: 300 },
    fadeTransition: shouldReduceMotion
      ? { duration: 0 }
      : { duration: 0.2, ease: 'easeOut' },
    springTransition: shouldReduceMotion
      ? { duration: 0 }
      : { type: 'spring', damping: 25, stiffness: 300 },
  };
}

export { useReducedMotion };
