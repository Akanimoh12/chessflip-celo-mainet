import { type LucideIcon, type LucideProps } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface IconProps extends LucideProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'brand';
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const variantMap = {
  default: 'text-primary',
  primary: 'text-primary',
  secondary: 'text-secondary',
  brand: 'text-brand',
};

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconComponent, size = 'md', variant = 'default', className, ...props }, ref) => {
    return (
      <IconComponent
        ref={ref}
        className={cn(sizeMap[size], variantMap[variant], className)}
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';
