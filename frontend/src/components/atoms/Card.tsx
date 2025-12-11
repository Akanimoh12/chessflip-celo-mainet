import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', hoverable = false, className, children, ...props }, ref) => {
    const baseStyles = 'bg-secondary border-3 border-primary rounded-brutalist transition-all duration-150';

    const variants = {
      default: 'shadow-brutalist',
      elevated: 'shadow-brutalist-lg',
      flat: '',
    };

    const paddings = {
      none: '',
      sm: 'p-sm',
      md: 'p-md',
      lg: 'p-lg',
    };

    const hoverStyles = hoverable
      ? 'cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none'
      : '';

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], paddings[padding], hoverStyles, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pb-md border-b-3 border-primary', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({ className, children, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-h4 font-bold text-primary', className)} {...props}>{children}</h3>
));
CardTitle.displayName = 'CardTitle';

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-md', className)} {...props} />
));
CardContent.displayName = 'CardContent';

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-md border-t-3 border-primary', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';
