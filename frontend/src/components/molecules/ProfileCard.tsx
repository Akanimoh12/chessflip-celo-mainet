import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Card, CardContent, CardHeader } from '@/components/atoms/Card';
import { Avatar } from '@/components/atoms/Avatar';

interface ProfileCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  role?: string;
  avatarSrc?: string;
  stats?: {
    label: string;
    value: string | number;
  }[];
}

export const ProfileCard = forwardRef<HTMLDivElement, ProfileCardProps>(
  ({ name, role = 'Player', avatarSrc, stats, className, ...props }, ref) => {
    return (
      <Card ref={ref} variant="elevated" className={cn('max-w-sm', className)} {...props}>
        <CardHeader className="flex flex-col items-center space-y-4">
          <Avatar src={avatarSrc} alt={name} size="lg" fallbackText={name} />
          <div className="text-center">
            <h3 className="text-lg font-bold text-primary">{name}</h3>
            <p className="text-sm text-primary/70">{role}</p>
          </div>
        </CardHeader>
        {stats && stats.length > 0 && (
          <CardContent>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t-3 border-primary">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xs text-primary/70">{stat.label}</p>
                  <p className="text-lg font-bold text-primary">{stat.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    );
  }
);

ProfileCard.displayName = 'ProfileCard';
