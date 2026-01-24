import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'pulse' | 'shimmer';
}

function Skeleton({
  className,
  variant = 'shimmer',
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg',
        variant === 'shimmer'
          ? 'animate-shimmer'
          : 'animate-pulse bg-linear-to-br from-secondary to-secondary/60',
        'dark:border dark:border-border/50 border-border/30 shadow-sm dark:shadow-black/15 shadow-black/5',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
