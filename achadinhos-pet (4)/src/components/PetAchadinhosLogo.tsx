import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface PetAchadinhosLogoProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
}

export const PetAchadinhosLogo: React.FC<PetAchadinhosLogoProps> = ({ 
  size = 'md',
  theme = 'light'
}) => {
  const [dogError, setDogError] = useState(false);
  const [catError, setCatError] = useState(false);

  const containerSizes = {
    sm: 'w-12 h-8 rounded-xl',
    md: 'w-16 h-11 rounded-2xl',
    lg: 'w-20 h-14 rounded-3xl'
  };

  const badgeSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  // High quality photography: Real cute Dog & Real cute Cat
  const dogPhotoUrl = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=80";
  const catPhotoUrl = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=200&q=80";

  return (
    <div className={`relative ${containerSizes[size]} shrink-0 group select-none`}>
      {/* Elegant Golden Amber Gradient Glow Halo & Border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400 rounded-2xl opacity-90 group-hover:opacity-100 blur-[1px] group-hover:blur-xs transition duration-300" />
      
      {/* Dual Composition Container (Dog & Cat together) */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-stone-900 border border-amber-300/40 shadow-md flex">
        {/* Left Side: Dog Photo */}
        <div className="relative w-1/2 h-full overflow-hidden border-r border-white/20">
          {!dogError ? (
            <img
              src={dogPhotoUrl}
              alt="Cão"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
              onError={() => setDogError(true)}
            />
          ) : (
            <div className="w-full h-full bg-amber-700 flex items-center justify-center text-xs">🐶</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        </div>

        {/* Right Side: Cat Photo */}
        <div className="relative w-1/2 h-full overflow-hidden">
          {!catError ? (
            <img
              src={catPhotoUrl}
              alt="Gato"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
              onError={() => setCatError(true)}
            />
          ) : (
            <div className="w-full h-full bg-amber-800 flex items-center justify-center text-xs">🐱</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Floating Sparkle / Achadinho Deal Badge in Bottom Center/Right */}
      <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full p-0.5 shadow-md border-2 border-white ring-1 ring-black/5 flex items-center justify-center">
        <Sparkles className={`${badgeSizes[size]} text-amber-100 fill-amber-200`} />
      </div>
    </div>
  );
};
