import React from 'react';
import { 
  Heart, 
  ExternalLink, 
  Sparkles, 
  Star, 
  Truck, 
  Flame, 
  Tag,
  CheckCircle2,
  Share2,
  Trophy,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { Product } from '../types';
import { formatBRL } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
  onShopeeClick: (product: Product, referrerSection?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  onShopeeClick,
}) => {

  const isTopRated = product.rating >= 4.8;
  const isBestSeller = product.salesCount >= 4000;
  const isBigDiscount = (product.discountPercent || 0) >= 30;

  return (
    <div 
      onClick={() => onShopeeClick(product, 'Card Container')}
      className="group bg-white rounded-2xl border border-stone-200 hover:border-amber-600/60 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer"
    >
      
      {/* Top Image Container */}
      <div 
        onClick={(e) => {
          e.stopPropagation();
          onShopeeClick(product, 'Card Image');
        }}
        className="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer"
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Dynamic Curated Badges Over Image */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1">
              <Flame className="w-3 h-3 fill-white" />
              -{product.discountPercent}% OFF
            </span>
          )}

          {isBestSeller && (
            <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-200" />
              Mais Vendido
            </span>
          )}

          {product.freeShipping && (
            <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1">
              <Truck className="w-3 h-3" />
              Entrega Rápida
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
          aria-label="Salvar produto nos favoritos"
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/95 hover:bg-white text-stone-600 hover:text-rose-600 shadow-md backdrop-blur-xs transition-colors z-10 cursor-pointer active:scale-90"
        >
          <Heart 
            className={`w-4 h-4 transition-transform ${
              isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-500'
            }`} 
          />
        </button>

        {/* Star Rating Badge Floating Bottom Right */}
        <div className="absolute bottom-2.5 right-2.5 bg-stone-950/85 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-md">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{product.rating.toFixed(1)}</span>
        </div>

        {/* Hover Insight */}
        {product.highlights?.idealFor && (
          <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-stone-950 via-stone-900/90 to-transparent text-white text-[11px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate font-medium">{product.highlights.idealFor}</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Social Proof Stats */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verificado</span>
            </div>
            <span className="text-[11px] font-medium text-stone-500">
              {product.salesCount > 1000 ? `+${(product.salesCount / 1000).toFixed(1)}k comprados` : `${product.salesCount} comprados`}
            </span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={(e) => {
              e.stopPropagation();
              onShopeeClick(product, 'Card Title');
            }}
            className="text-sm font-bold text-stone-900 line-clamp-2 hover:text-amber-800 cursor-pointer transition-colors leading-snug mb-2 font-sans"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Tags / Coupons */}
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium">
                {tag}
              </span>
            ))}
            {product.couponAvailable && (
              <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-300/80 px-2 py-0.5 rounded-md font-bold">
                Cupom: {product.couponAvailable}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="pt-3 border-t border-stone-100 mt-1">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-stone-950">
                  {formatBRL(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    {formatBRL(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-stone-500 font-medium">Em até 12x no cartão</p>
            </div>

            {product.discountPercent && product.discountPercent > 0 && typeof product.price === 'number' && typeof product.originalPrice === 'number' && (
              <span className="text-[11px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                Economize {formatBRL(product.originalPrice - product.price)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {/* Main Action Direct to Store */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShopeeClick(product, 'Card Grid');
              }}
              className="col-span-4 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-700 hover:bg-amber-600 active:scale-[0.98] text-white font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <span>Melhor Preço</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* View Details Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(product);
              }}
              aria-label="Ver detalhes e prós"
              className="col-span-1 flex items-center justify-center rounded-xl bg-stone-100 hover:bg-amber-100/80 text-stone-700 hover:text-amber-900 border border-stone-200 transition-colors cursor-pointer"
              title="Ver análise completa e prós"
            >
              <Sparkles className="w-4 h-4 text-amber-800" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
