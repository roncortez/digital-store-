import React from 'react';

interface GlowBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'header' | 'footer';
}

export default function GlowBackground({ children, className = '', variant = 'default' }: GlowBackgroundProps) {
  const getGlowElements = () => {
    switch (variant) {
      case 'header':
        return (
          <>
            <div className="absolute top-0 left-0 -ml-10 -mt-10 w-40 h-40 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none"></div>
          </>
        );
      case 'footer':
        return (
          <>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none"></div>
          </>
        );
      default:
        return (
          <>
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none"></div>
          </>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Decorative glow elements */}
      {getGlowElements()}
      
      {/* Content with higher z-index */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
