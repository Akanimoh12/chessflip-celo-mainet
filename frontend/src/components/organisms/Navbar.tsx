import { type HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface NavbarProps extends HTMLAttributes<HTMLElement> {
  logo?: string;
  children?: React.ReactNode;
}

export const Navbar = ({ logo = 'ChessFlip', children, className, ...props }: NavbarProps) => {
  return (
    <nav
      className={cn(
        'border-b-3 border-primary bg-secondary shadow-brutalist sticky top-0 z-50',
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-primary hover:text-brand transition-colors">
            {logo}
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/lobby" 
              className="text-sm font-semibold text-primary/70 hover:text-brand transition-colors"
            >
              Lobby
            </Link>
            <Link 
              to="/leaderboard" 
              className="text-sm font-semibold text-primary/70 hover:text-brand transition-colors"
            >
              Leaderboard
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {children}
        </div>
      </div>
    </nav>
  );
};

Navbar.displayName = 'Navbar';
