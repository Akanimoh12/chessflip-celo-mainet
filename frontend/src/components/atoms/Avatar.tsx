import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { User } from 'lucide-react';

interface AvatarProps extends HTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallbackText?: string;
}

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ src, alt, size = 'md', fallbackText, className, ...props }, ref) => {
    const sizes = {
      sm: 'w-8 h-8 text-body-sm',
      md: 'w-12 h-12 text-body',
      lg: 'w-16 h-16 text-h4',
      xl: 'w-24 h-24 text-h2',
    };

    if (src) {
      return (
        <img
          ref={ref}
          src={src}
          alt={alt}
          className={cn('rounded-brutalist border-3 border-primary object-cover', sizes[size], className)}
          {...props}
        />
      );
    }

    return (
      <div
        className={cn(
          'rounded-brutalist border-3 border-primary bg-primary flex items-center justify-center font-bold text-secondary',
          sizes[size],
          className
        )}
      >
        {fallbackText ? fallbackText.slice(0, 2).toUpperCase() : <User className="w-1/2 h-1/2" />}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
