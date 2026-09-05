import React, { useState } from 'react';

interface PetAchadinhosLogoProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  className?: string;
}

export const PetAchadinhosLogo: React.FC<PetAchadinhosLogoProps> = ({ 
  size = 'md',
  theme = 'light',
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);
  const logoUrl = "https://i.imgur.com/g4qHahz.png";

  const sizeClasses = {
    sm: 'h-8 w-8 sm:h-9 sm:w-9',
    md: 'h-10 w-10 sm:h-12 sm:w-12',
    lg: 'h-14 w-14 sm:h-16 sm:w-16'
  };

  return (
    <div className={`relative shrink-0 flex items-center justify-center select-none ${className}`}>
      {!hasError ? (
        <img
          src={logoUrl}
          alt="Achadinhos Pet Logo"
          referrerPolicy="no-referrer"
          className={`${sizeClasses[size]} object-contain drop-shadow-xs transition-transform duration-300 group-hover:scale-105`}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-black text-sm shadow-md`}>
          🐾
        </div>
      )}
    </div>
  );
};

