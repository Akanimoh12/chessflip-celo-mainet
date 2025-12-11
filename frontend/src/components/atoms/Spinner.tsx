import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'brand';
}

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
};

const variants = {
  default: 'border-primary border-t-brand',
  primary: 'border-primary border-t-brand',
  brand: 'border-brand border-t-primary',
};

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'md', variant = 'default', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-block rounded-full animate-spin',
          sizes[size],
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Spinner.displayName = 'Spinner';
