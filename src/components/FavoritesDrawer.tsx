import React from 'react';
import { 
  X, 
  Heart, 
  Trash2, 
  ExternalLink, 
  ShoppingBag, 
  Sparkles, 
  Share2 
} from 'lucide-react';
import { Product } from '../types';
import { formatBRL } from '../utils/currency';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Product[];
  onRemoveFavorite: (product: Product) => void;
  onClearFavorites: () => void;
  onShopeeClick: (product: Product, referrerSection?: string) => void;
  onOpenProductDetails: (product: Product) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onClearFavorites,
  onShopeeClick,
  onOpenProductDetails,
}) => {
  if (!isOpen) return null;

  const totalEstimate = favorites.reduce((sum, p) => sum + (typeof p.price === 'number' ? p.price : (typeof p.price === 'string' && !isNaN(parseFloat(p.price)) ? parseFloat(p.price) : 0)), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between relative text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            <h2 className="text-base font-bold text-stone-900">
              Meus Produtos Salvos ({favorites.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of items */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          {favorites.length > 0 ? (
            favorites.map((product) => (
              <div
                key={product.id}
                className="p-3 bg-white rounded-2xl border border-stone-200 hover:border-amber-700/50 flex items-center gap-3 transition-colors shadow-2xs"
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  onClick={() => onOpenProductDetails(product)}
                  className="w-16 h-16 rounded-xl object-cover cursor-pointer border border-stone-100"
                />

                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => onOpenProductDetails(product)}
                    className="text-xs font-semibold text-stone-900 truncate hover:text-amber-800 cursor-pointer"
                  >
                    {product.title}
                  </h4>
                  <p className="text-xs font-extrabold text-amber-900 mt-0.5">
                    {formatBRL(product.price)}
                  </p>
                  <p className="text-[10px] text-stone-400 capitalize">
                    {product.category.replace('_', ' ')}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => onShopeeClick(product, 'Gaveta Favoritos')}
                    className="p-2 bg-amber-700 hover:bg-amber-600 text-white rounded-xl shadow-xs cursor-pointer"
                    title="Ver Oferta na Loja"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveFavorite(product)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                    title="Remover"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto text-xl">
                ❤️
              </div>
              <h3 className="text-sm font-bold text-stone-800">Sua lista está vazia</h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Clique no ícone de coração nos produtos para salvar seus itens favoritos e comprar depois.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">Estimativa Total dos Itens:</span>
              <span className="text-base font-extrabold text-stone-900">
                {formatBRL(totalEstimate)}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClearFavorites}
                className="w-1/3 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 text-xs font-semibold cursor-pointer"
              >
                Limpar Lista
              </button>
              <button
                onClick={() => {
                  if (favorites[0]) onShopeeClick(favorites[0], 'Checkout Todos Favoritos');
                }}
                className="w-2/3 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Comprar Itens na Loja</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
