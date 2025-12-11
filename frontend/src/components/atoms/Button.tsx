import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'brand' | 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'brand', size = 'md', isLoading = false, disabled = false, className, children, ...props }, ref) => {
    const baseStyles = 'font-medium transition-all duration-150 border-3 border-primary rounded-brutalist active:translate-x-[2px] active:translate-y-[2px]';

    const variants = {
      brand: 'bg-brand text-secondary border-brand shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-brutalist',
      primary: 'bg-secondary text-primary shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-brutalist',
      secondary: 'bg-accent text-primary border-primary shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-brutalist',
      ghost: 'bg-transparent text-primary border-primary hover:bg-accent active:bg-primary/10 disabled:hover:bg-transparent',
    };

    const sizes = {
      sm: 'px-sm py-xs text-body-sm',
      md: 'px-md py-sm text-body',
      lg: 'px-lg py-md text-body-lg',
    };

    const disabledStyles = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], disabledStyles, className)}
        {...props}
      >
        <span className="inline-flex items-center gap-xs">
          {isLoading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
