'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PushButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
}

const PushButton = forwardRef<HTMLButtonElement, PushButtonProps>(
  ({ className, variant = 'primary', size = 'md', href, children, disabled, ...props }, ref) => {
    const sizeStyles = {
      sm: 'text-sm px-4 py-2',
      md: 'text-base px-6 py-3',
      lg: 'text-lg px-8 py-4',
    };

    const variantStyles = {
      primary: {
        wrapper: '',
        shadow: 'bg-indigo-800',
        front: 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white',
      },
      secondary: {
        wrapper: '',
        shadow: 'bg-gray-700',
        front: 'bg-gradient-to-r from-gray-600 to-gray-500 text-white',
      },
      outline: {
        wrapper: '',
        shadow: 'bg-white/10',
        front: 'bg-card text-foreground border border-white/10',
      },
      ghost: {
        wrapper: '',
        shadow: 'bg-transparent',
        front: 'bg-transparent text-foreground hover:bg-white/5',
      },
    };

    const styles = variantStyles[variant];

    const content = (
      <span
        className={cn(
          'push-button-wrapper group relative inline-block w-full cursor-pointer rounded-xl border-none bg-transparent p-0 outline-offset-4',
          disabled && 'cursor-not-allowed opacity-50',
          styles.wrapper,
          className
        )}
      >
        <span
          className={cn(
            'push-button-shadow absolute inset-0 translate-y-[3px] rounded-xl transition-transform duration-[600ms] ease-[cubic-bezier(.3,.7,.4,1)]',
            'group-hover:translate-y-[5px] group-hover:duration-[250ms]',
            'group-active:translate-y-[1px] group-active:duration-[34ms]',
            styles.shadow
          )}
        />
        <span
          className={cn(
            'push-button-front relative block translate-y-[-4px] rounded-xl font-semibold transition-transform duration-[600ms] ease-[cubic-bezier(.3,.7,.4,1)]',
            'group-hover:translate-y-[-6px] group-hover:duration-[250ms]',
            'group-active:translate-y-[-2px] group-active:duration-[34ms]',
            sizeStyles[size],
            styles.front
          )}
        >
          {children}
        </span>
      </span>
    );

    if (href) {
      return (
        <Link href={href} className="inline-block">
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        className="inline-block border-none bg-transparent p-0"
        {...props}
      >
        {content}
      </button>
    );
  }
);

PushButton.displayName = 'PushButton';

export { PushButton };
