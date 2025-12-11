import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-sm text-sm font-medium text-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-md py-sm border-3 border-primary rounded-brutalist bg-secondary transition-all duration-150',
            'placeholder:text-primary/50',
            'disabled:bg-accent disabled:cursor-not-allowed disabled:text-primary/50',
            'focus:outline-none',
            error && 'border-brand',
            className
          )}
          {...props}
        />
        {error && <p className="mt-sm text-sm text-brand">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
