import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'brand' | 'accent';
  size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', className, ...props }, ref) => {
    const variants = {
      default: 'bg-secondary border-2 border-primary text-primary',
      primary: 'bg-primary text-secondary border-2 border-primary',
      secondary: 'bg-accent border-2 border-primary text-primary',
      brand: 'bg-brand text-secondary border-2 border-brand',
      accent: 'bg-accent border-2 border-primary text-primary',
    };

    const sizes = {
      sm: 'px-sm py-2xs text-xs font-medium',
      md: 'px-md py-sm text-sm font-medium',
    };

    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center rounded-brutalist', variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
