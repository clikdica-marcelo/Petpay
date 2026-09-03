import React, { useState } from 'react';
import { 
  Search, 
  Heart, 
  Menu, 
  X, 
  Settings,
  Flame,
  User,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { PetAchadinhosLogo } from './PetAchadinhosLogo';
import { UserAccount } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  currentUser: UserAccount | null;
  isAdminUnlocked?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  favoritesCount,
  onOpenFavorites,
  onOpenAdmin,
  onOpenAuth,
  currentUser,
  isAdminUnlocked = false,
}) => {
  const isAdmin = isAdminUnlocked || currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a 
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <PetAchadinhosLogo size="md" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl sm:text-2xl tracking-tight text-stone-900 font-sans">
                    Achadinhos <span className="bg-gradient-to-r from-amber-600 via-amber-700 to-rose-600 bg-clip-text text-transparent">Pet</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs">
                    <Flame className="w-3 h-3 fill-white" />
                    <span>Ofertas</span>
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium hidden sm:flex items-center gap-1.5 mt-0.5">
                  <span className="text-amber-700 font-semibold">Cães & Gatos</span>
                  <span>•</span>
                  <span>Achadinhos & Cupons Verificados</span>
                </p>
              </div>
            </a>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar alimentação, higiene, caminhas, coleiras, roupas..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-stone-100 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-700 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-700/20 transition-all text-stone-800 placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 text-xs cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Favorites Button */}
            <button
              onClick={onOpenFavorites}
              className="relative px-3 sm:px-3.5 py-2 rounded-full border border-stone-200 hover:border-amber-700/40 bg-stone-50 hover:bg-amber-50/50 text-stone-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Ver produtos favoritados"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-stone-600'}`} />
              <span className="hidden sm:inline">Salvos</span>
              {favoritesCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* User Account / Login Button */}
            <button
              onClick={onOpenAuth}
              className={`px-3 sm:px-3.5 py-2 rounded-full border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                currentUser
                  ? currentUser.role === 'admin'
                    ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                  : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700 hover:text-amber-800'
              }`}
              title={currentUser ? `Conta: ${currentUser.email}` : 'Entrar ou criar conta gratuita'}
            >
              {currentUser ? (
                currentUser.role === 'admin' ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span className="font-bold hidden sm:inline">Admin</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold truncate max-w-[90px] hidden sm:inline">
                      {currentUser.name ? currentUser.name.split(' ')[0] : 'Minha Conta'}
                    </span>
                  </>
                )
              ) : (
                <>
                  <User className="w-4 h-4 text-stone-500" />
                  <span className="hidden sm:inline">Entrar</span>
                </>
              )}
            </button>

            {/* Gestão do Site (Admin button displayed only when admin is unlocked or user is admin) */}
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-3 sm:px-3.5 py-2 rounded-full border border-amber-600/50 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs animate-in fade-in"
                title="Gestão do Site e Catálogo"
              >
                <Settings className="w-4 h-4 text-amber-200" />
                <span className="hidden md:inline">Gestão do Site</span>
                <span className="md:hidden">Gestão</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar produtos Pet..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-stone-100 focus:bg-white border border-stone-200 focus:border-amber-700 rounded-full focus:outline-none text-stone-800 placeholder:text-stone-400"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

