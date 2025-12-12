import React from 'react';

const BackgroundEffects: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Dark Base */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '4s' }} />
      
      {/* Subtle Noise Texture for Texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    </div>
  );
};

export default BackgroundEffects;