import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Heart, 
  Sparkles, 
  Star, 
  Truck, 
  ShieldCheck, 
  Flame, 
  Share2, 
  Check, 
  Info,
  Package,
  MapPin,
  Tag,
  Lightbulb
} from 'lucide-react';
import { Product } from '../types';
import { CATEGORY_LABELS } from '../data/mockProducts';
import { formatBRL } from '../utils/currency';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onShopeeClick: (product: Product, referrerSection?: string) => void;
  allProducts: Product[];
  onSelectRelatedProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onShopeeClick,
  allProducts,
  onSelectRelatedProduct
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !product) return null;

  const images = [product.imageUrl, ...(product.additionalImages || [])];
  const activeImage = images[selectedImageIndex] || product.imageUrl;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(product.affiliateUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Find related products in the same category
  const related = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 relative text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          
          {/* Left Column: Image Gallery & Badges */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  -{product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx ? 'border-amber-700 scale-105' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Seller Trust Banner */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                  <Package className="w-4 h-4 text-amber-700" />
                  <span>Loja Oficial: {product.sellerName || 'Vendedor Verificado'}</span>
                </div>
                {product.sellerLocation && (
                  <span className="text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {product.sellerLocation}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-stone-600 text-[11px] pt-1 border-t border-stone-200/60">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Garantia de Compra Oficial
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-amber-700" />
                  Envio para todo o Brasil
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Conversion CTA */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Rating & Animal Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-bold text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-stone-400 font-normal text-xs">
                    ({product.reviewsCount} avaliações de compradores)
                  </span>
                </div>
                <span className="text-xs font-bold tracking-tight px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-amber-700" />
                  {CATEGORY_LABELS[product.category]?.label || 'Pet'}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                {product.title}
              </h2>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 block mb-0.5">Preço Promocional Exclusivo</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-amber-900">
                      {formatBRL(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-stone-400 line-through">
                        {formatBRL(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                {product.couponAvailable && (
                  <div className="text-right">
                    <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wide block">Cupom Disponível</span>
                    <span className="text-xs font-mono font-bold bg-white px-2 py-1 rounded-md border border-amber-300 text-amber-900">
                      {product.couponAvailable}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Highlights & Benefits Box */}
              {(product.highlights || product.aiInsights) && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-stone-800 space-y-2.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                    <Lightbulb className="w-4 h-4 text-amber-700" />
                    <span>Destaques & Benefícios</span>
                  </div>
                  {((product.highlights?.idealFor) || (product.aiInsights?.idealFor)) && (
                    <p className="text-stone-700 leading-relaxed">
                      <strong className="text-stone-900">Indicação:</strong> {product.highlights?.idealFor || product.aiInsights?.idealFor}
                    </p>
                  )}
                  {((product.highlights?.whyBuy) || (product.aiInsights?.whyBuy)) && (
                    <p className="text-stone-700 leading-relaxed">
                      <strong className="text-stone-900">Por que vale a pena:</strong> {product.highlights?.whyBuy || product.aiInsights?.whyBuy}
                    </p>
                  )}
                  {((product.highlights?.tips) || (product.aiInsights?.tips)) && (
                    <div className="pt-2 border-t border-amber-200/60 flex items-start gap-1.5 text-stone-600 text-[11px]">
                      <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span><strong>Dica prática:</strong> {product.highlights?.tips || product.aiInsights?.tips}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  Descrição do Produto
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {product.fullDescription}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                
                {/* Main Buy CTA */}
                <button
                  onClick={() => onShopeeClick(product, 'Modal Detalhes')}
                  className="sm:col-span-3 py-3.5 px-6 rounded-2xl bg-amber-700 hover:bg-amber-600 active:scale-[0.99] text-white font-bold text-sm shadow-md hover:shadow-amber-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer group"
                >
                  <span>Comprar na Loja Oficial com Desconto</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Favorite Toggle */}
                <button
                  onClick={() => onToggleFavorite(product)}
                  className={`sm:col-span-1 py-3 px-4 rounded-2xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    isFavorite 
                      ? 'bg-rose-50 border-rose-300 text-rose-600' 
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isFavorite ? 'Salvo' : 'Salvar'}</span>
                </button>
              </div>

              {/* Copy Affiliate Link */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <span className="text-[11px] text-stone-400">
                  Você será redirecionado para a loja oficial do produto
                </span>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 text-amber-800 hover:text-amber-900 font-semibold cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link copiado!' : 'Copiar Link da Oferta'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Related Items Section */}
        {related.length > 0 && (
          <div className="bg-stone-50 p-6 sm:p-8 border-t border-stone-200 rounded-b-3xl">
            <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-700" />
              <span>Produtos Relacionados da Mesma Categoria</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelatedProduct(rel)}
                  className="p-3 bg-white rounded-xl border border-stone-200 hover:border-amber-700 cursor-pointer flex items-center gap-3 transition-colors"
                >
                  <img src={rel.imageUrl} alt={rel.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-stone-900 truncate">{rel.title}</p>
                    <p className="text-xs font-bold text-amber-900">{formatBRL(rel.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
