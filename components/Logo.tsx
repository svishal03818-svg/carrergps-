import React from 'react';
import { Compass } from 'lucide-react';

interface Props {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<Props> = ({ className = "", showText = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
        <Compass className="text-white w-6 h-6 animate-pulse-slow" />
      </div>
      {showText && (
        <span className="text-white font-bold text-xl tracking-tight select-none">
          Career<span className="text-primary">GPS</span>
        </span>
      )}
    </div>
  );
};

export default Logo;