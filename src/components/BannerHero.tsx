import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Percent, 
  Truck, 
  ShieldCheck, 
  Flame, 
  Tag, 
  ChevronLeft, 
  ChevronRight, 
  PackageCheck,
  Utensils,
  BedDouble,
  Sparkles,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';
import { ProductCategory, Product, Banner } from '../types';
import { DEFAULT_BANNERS } from '../data/mockProducts';
import { formatBRL } from '../utils/currency';

interface BannerHeroProps {
  onSelectCategory: (category: ProductCategory | 'todas') => void;

  products?: Product[];
  onProductClick?: (product: Product) => void;
  onShopeeClick?: (product: Product, source?: string) => void;
  banners?: Banner[];
  isAdminMode?: boolean;
  onEditBanner?: (banner: Banner) => void;
  onDeleteBanner?: (bannerId: string) => void;
  onAddBannerTrigger?: (banner?: Banner) => void;
  hiddenSlideIds?: string[];
}

export const BannerHero: React.FC<BannerHeroProps> = ({
  onSelectCategory,
  products = [],
  onProductClick,
  onShopeeClick,
  banners,
  isAdminMode = false,
  onEditBanner,
  onDeleteBanner,
  onAddBannerTrigger,
  hiddenSlideIds = []
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const dynamicSlides = React.useMemo(() => {
    const baseBanners = banners || [];
    const slides = [...baseBanners];

    // Take up to 7 recently added or featured products to show in the carousel
    const featuredOrRecent = products.slice(0, 7);
    featuredOrRecent.forEach((prod, index) => {
      const slideId = `prod-slide-${index}-${prod.id}`;
      if (!hiddenSlideIds.includes(slideId)) {
        slides.push({
          id: slideId,
          badge: 'NOVIDADE NA VITRINE',
          badgeColor: 'bg-emerald-600 text-white',
          title: prod.title,
          subtitle: prod.shortDescription || 'Oferta imperdível verificada com frete grátis e garantia Shopee.',
          ctaText: `Melhor Preço ${formatBRL(prod.price)}`,
          categoryTarget: prod.category,
          bgGradient: 'from-stone-900 via-amber-900 to-stone-950',
          image: prod.imageUrl,
          highlightBadge: prod.couponAvailable || 'Frete Grátis',
          productObject: prod
        } as any);
      }
    });

    return slides;
  }, [banners, products, hiddenSlideIds]);


  useEffect(() => {
    const timer = setInterval(() => {
      if (dynamicSlides.length > 0) { setCurrentSlide((prev) => (prev + 1) % dynamicSlides.length); }
    }, 10000);
    return () => clearInterval(timer);
  }, [dynamicSlides.length]);

  if (dynamicSlides.length === 0) {
    if (isAdminMode) {
      return (
        <section className="relative overflow-hidden bg-stone-900 text-white min-h-[200px] flex items-center justify-center border-2 border-dashed border-stone-700 mx-4 sm:mx-6 lg:mx-8 my-8 rounded-3xl">
          <button
            onClick={onAddBannerTrigger}
            className="flex flex-col items-center gap-3 text-stone-400 hover:text-white transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center">
              <Plus className="w-8 h-8" />
            </div>
            <span className="font-bold text-lg">Adicionar Novo Quadro (Banner)</span>
          </button>
        </section>
      );
    }
    return null;
  }

  const banner = dynamicSlides[currentSlide] || dynamicSlides[0];

  const handleAction = () => {
    const prod = (banner as any).productObject || products.find(p => p.id === banner.id || p.title === banner.title);
    if (prod) {
      if (onShopeeClick) {
        onShopeeClick(prod, 'Hero Banner');
      } else if (onProductClick) {
        onProductClick(prod);
      }
    } else if (banner.categoryTarget) {
      onSelectCategory(banner.categoryTarget);
    }
  };

  return (
    <section className="relative overflow-hidden bg-stone-900 text-white">
      <div className={`relative min-h-[360px] sm:min-h-[400px] flex items-center bg-gradient-to-r ${banner.bgGradient} transition-all duration-700`}>
        {/* Decorative ambient elements */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />

        {isAdminMode && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-2">
            {onAddBannerTrigger && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddBannerTrigger(banner as Banner);
                }}
                className="px-3 py-2 bg-emerald-700/90 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 backdrop-blur-md border border-white/10 transition-colors shadow-lg cursor-pointer"
                title="Inserir Novo"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Inserir Novo</span>
              </button>
            )}
            {true && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEditBanner) onEditBanner(banner);
                  }}
                  className="px-3 py-2 bg-stone-900/80 hover:bg-stone-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 backdrop-blur-md border border-white/10 transition-colors shadow-lg cursor-pointer"
                  title="Editar Quadro"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Editar</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDeleteBanner) {
                      onDeleteBanner(banner.id);
                    }
                  }}
                  className="px-3 py-2 bg-rose-900/80 hover:bg-rose-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 backdrop-blur-md border border-white/10 transition-colors shadow-lg cursor-pointer"
                  title="Excluir Quadro"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Excluir</span>
                </button>
              </>
            )}
          </div>
        )}
        <div 
          onClick={handleAction}
          className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 lg:opacity-40 hidden md:block cursor-pointer hover:opacity-50 transition-opacity"
        >
          <img 
            src={banner.image} 
            alt={banner.title} 
            className="w-full h-full object-cover mix-blend-luminosity mask-gradient"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative z-10 w-full">
          <div className="max-w-2xl">
            
            {/* Category / Promo Pill */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${banner.badgeColor}`}>
                {banner.badge}
              </span>
              <span className="text-xs text-amber-200/90 font-medium flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                {banner.highlightBadge}
              </span>
            </div>

            {/* Title */}
            <h1 
              onClick={handleAction}
              className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-sans cursor-pointer hover:text-amber-200 transition-colors"
            >
              {banner.title}
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-stone-300 text-sm sm:text-base leading-relaxed line-clamp-2">
              {banner.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={handleAction}
                className="px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-xl hover:shadow-amber-500/30 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{banner.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Carousel controls */}
        <div className="absolute bottom-4 right-4 sm:right-8 flex items-center gap-2 z-20">
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? dynamicSlides.length - 1 : prev - 1))}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1 px-1">
            {dynamicSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-6 bg-amber-400' : 'w-2 bg-white/40'
                }`}
                aria-label={`Ir para slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % dynamicSlides.length)}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

