import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { BannerHero } from './components/BannerHero';
import { CategoryFilterBar, CuratedFilterType } from './components/CategoryFilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { BannerManagerModal } from "./components/BannerManagerModal";
import { BannerProductSelectorModal } from "./components/BannerProductSelectorModal";
import { AdminAuthModal } from './components/AdminAuthModal';
import { AuthModal } from './components/AuthModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { PetHealthSection } from './components/PetHealthSection';
import { Footer } from './components/Footer';
import { INITIAL_PRODUCTS, CATEGORY_LABELS, DEFAULT_BANNERS } from './data/mockProducts';
import { Product, ProductCategory, AffiliateSettings, Banner, UserAccount } from './types';
import { formatBRL } from './utils/currency';

import { 
  ShoppingBag, 
  ExternalLink, 
  Flame, 
  ArrowRight,
  Sparkles,
  Tag,
  Trophy,
  Star,
  Zap,
  TrendingUp
} from 'lucide-react';

export default function App() {
  // Products state
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('achadinhospet_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Filters and navigation state
  const [curatedFilter, setCuratedFilter] = useState<CuratedFilterType>('todos');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'todas'>('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // User interactions state (Browser-local saved list, no login required)
  const [favorites, setFavorites] = useState<Product[]>(() => {
    const saved = localStorage.getItem('achadinhospet_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync products and favorites with localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem('achadinhospet_products', JSON.stringify(products));
    } catch (e) {
      console.warn('LocalStorage full or error saving products:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('achadinhospet_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('LocalStorage error saving favorites:', e);
    }
  }, [favorites]);

  // Initial load from server/Supabase on mount
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.products) && data.products.length > 0) {
          if (data.source === 'supabase') {
            setProducts(data.products);
          } else {
            // Memory source: if local storage was empty or default, use server products
            setProducts(prev => prev && prev.length > 0 ? prev : data.products);
          }
        }
      })
      .catch(err => console.log('Error initializing products from API:', err));
  }, []);

  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('pet_achadinhos_banners');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return DEFAULT_BANNERS;
  });

  useEffect(() => {
    localStorage.setItem('pet_achadinhos_banners', JSON.stringify(banners));
  }, [banners]);

  const handleSelectProductForBanner = (product: Product) => {
    const newBanner: Banner = {
      id: `banner-${Date.now()}`,
      title: product.title,
      subtitle: product.shortDescription || 'Oferta imperdível verificada com frete grátis e garantia Shopee.',
      ctaText: `Melhor Preço ${formatBRL(product.price)}`,
      image: product.imageUrl,
      categoryTarget: product.category,
      badge: product.couponAvailable || 'Frete Grátis',
      badgeColor: 'bg-emerald-600 text-white',
      bgGradient: 'from-stone-900 via-amber-900 to-stone-950',
      highlightBadge: product.couponAvailable || 'Destaque', productObject: product
    };
    handleAddBanner(newBanner);
    setIsProductSelectorOpen(false);
  };

  const handleAddBanner = (newBanner: Banner) => {
    setBanners((prev) => [newBanner, ...prev]);
  };

  const handleUpdateBanner = (updatedBanner: Banner) => {
    setBanners((prev) => {
      const exists = prev.some(b => b.id === updatedBanner.id);
      if (exists) {
        return prev.map((b) => b.id === updatedBanner.id ? updatedBanner : b);
      } else {
        const newBanner = { ...updatedBanner, id: `banner-${Date.now()}` };
        return [newBanner, ...prev];
      }
    });
  };

  const handleDeleteBanner = (bannerId: string) => {
    if (bannerId.startsWith('prod-slide-')) {
      setHiddenDynamicSlides(prev => {
        const updated = [...prev, bannerId];
        localStorage.setItem('pet_achadinhos_hidden_slides', JSON.stringify(updated));
        return updated;
      });
    } else {
      setBanners((prev) => prev.filter((b) => b.id !== bannerId));
    }
  };


  const [affiliateSettings, setAffiliateSettings] = useState<AffiliateSettings>({
    affiliateId: 'campanha_pet_12345',
    subIdPrefix: 'achadinhospet',
    autoAppendAffiliateTag: true,
    defaultUtmSource: 'achadinhos_pet_portal',
    commissionRateEstimate: 8.5,
    storeName: 'Achadinhos Pet',
    storeDomain: 'achadinhospet.com.br',
    contactEmail: 'contato@achadinhospet.com.br'
  });

  // Modal dialog states
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLogged, setIsAdminLogged] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Registered / logged-in user state (optional for visitors, required for admin)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('achadinhospet_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Keep admin status synced with currentUser
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('achadinhospet_user', JSON.stringify(currentUser));
      if (currentUser.role === 'admin' || currentUser.email === 'clikdica@gmail.com') {
        setIsAdminLogged(true);
      }
    } else {
      localStorage.removeItem('achadinhospet_user');
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    if (user.role === 'admin' || user.email === 'clikdica@gmail.com') {
      setIsAdminLogged(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminLogged(false);
    setIsBannerEditMode(false);
  };

  const [isBannerManagerOpen, setIsBannerManagerOpen] = useState(false);
  const [bannerToEdit, setBannerToEdit] = useState<Banner | null>(null);
  const [isBannerEditMode, setIsBannerEditMode] = useState(false);
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);

  const [hiddenDynamicSlides, setHiddenDynamicSlides] = useState<string[]>(() => {
    const saved = localStorage.getItem('pet_achadinhos_hidden_slides');
    return saved ? JSON.parse(saved) : [];
  });
  const [prefillBanner, setPrefillBanner] = useState<Banner | null>(null);
  const [clickToast, setClickToast] = useState<{ visible: boolean; productName: string } | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Open product details modal
  const handleOpenDetails = (product: Product) => {
    setSelectedProductDetails(product);
    setIsDetailsOpen(true);
  };


  const handleToggleFavorite = (product: Product) => {
    setFavorites(prev => {
      const isFav = prev.some(p => p.id === product.id);
      if (isFav) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleShopeeClick = (product: Product, source: string) => {
    setClickToast({ visible: true, productName: product.title });
    setTimeout(() => setClickToast(null), 3000);

    const affiliateUrl = product.affiliateUrl;
    window.open(affiliateUrl, '_blank');
  };

  // Product CRUD actions for Admin
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProd)
    }).catch(err => console.error('Error syncing new product to server:', err));
  };

  const handleBulkImportProducts = (newProds: Product[]) => {
    setProducts((prev) => {
      const merged = [...newProds, ...prev];
      fetch('/api/supabase/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: merged })
      }).catch(err => console.error('Error syncing bulk products to server:', err));
      return merged;
    });
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    fetch(`/api/products/${encodeURIComponent(updated.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).catch(err => console.error('Error updating product on server:', err));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    fetch(`/api/products/${encodeURIComponent(productId)}`, {
      method: 'DELETE'
    }).catch(err => console.error('Error deleting product on server:', err));
  };

  const handleUpdateSettings = async (newSettings: AffiliateSettings) => {
    setAffiliateSettings(newSettings);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Counts for Curated Highlight Bar
  const curatedCounts = useMemo(() => {
    return {
      promocoes: products.filter((p) => (p.discountPercent || 0) >= 20 || p.isFlashDeal).length,
      mais_vendidos: products.filter((p) => p.salesCount >= 3000 || p.badges.includes('Mais Vendido') || p.badges.includes('Campeão de Vendas')).length,
      estrelas: products.filter((p) => p.rating >= 4.8).length,
      novidades: products.filter((p) => p.tags.some(t => t.toLowerCase().includes('viral') || t.toLowerCase().includes('vapor') || t.toLowerCase().includes('elétrica') || t.toLowerCase().includes('automático'))).length,
      entrega_rapida: products.filter((p) => p.freeShipping).length
    };
  }, [products]);

  // Filter and sort catalog
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Curated Preset Filter
      if (curatedFilter === 'promocoes') {
        const hasGoodDiscount = (p.discountPercent || 0) >= 20 || p.isFlashDeal;
        if (!hasGoodDiscount) return false;
      } else if (curatedFilter === 'mais_vendidos') {
        const isHighSales = p.salesCount >= 3000 || p.badges.includes('Mais Vendido') || p.badges.includes('Campeão de Vendas');
        if (!isHighSales) return false;
      } else if (curatedFilter === '5_estrelas') {
        if (p.rating < 4.8) return false;
      } else if (curatedFilter === 'novidades') {
        const isNovelty = p.tags.some(t => t.toLowerCase().includes('viral') || t.toLowerCase().includes('vapor') || t.toLowerCase().includes('elétrica') || t.toLowerCase().includes('automático'));
        if (!isNovelty) return false;
      } else if (curatedFilter === 'entrega_rapida') {
        if (!p.freeShipping) return false;
      }

      // Category filter (Shopee Category)
      if (selectedCategory !== 'todas' && p.category !== selectedCategory) {
        return false;
      }
      // Search query with smart plural/singular and multi-word token matching
      if (searchQuery.trim()) {
        const queryTerms = searchQuery.toLowerCase().trim().split(/\s+/).map(term => {
          // simple singular/plural normalization in Portuguese
          if (term.endsWith('s') && term.length > 3) {
            return term.slice(0, -1);
          }
          return term;
        });

        const targetText = `${p.title} ${p.shortDescription} ${p.fullDescription} ${p.category} ${p.tags.join(' ')}`.toLowerCase();
        
        // Check if all query terms match anywhere in the product text
        const matchesAll = queryTerms.every(term => 
          targetText.includes(term) || targetText.includes(term + 's') || targetText.includes(term + 'es')
        );

        if (!matchesAll) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      // Default: mais populares / vendas
      return b.salesCount - a.salesCount;
    });
  }, [products, curatedFilter, selectedCategory, searchQuery]);

  // Flash deals subset for highlighting
  const flashDeals = useMemo(() => {
    return products.filter((p) => p.isFlashDeal || (p.discountPercent && p.discountPercent >= 40)).slice(0, 4);
  }, [products]);


  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Clean Sticky Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenAdmin={() => {
          if (isAdminLogged || currentUser?.role === 'admin') {
            setIsAdminOpen(true);
          } else {
            setIsAdminAuthOpen(true);
          }
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        isAdminUnlocked={isAdminLogged || currentUser?.role === 'admin'}
      />


      {/* Hero Banner Showcase (Quadro de Exposição Rotativo) */}
      {isAdminLogged && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-end">
          <button
            onClick={() => setIsBannerEditMode(!isBannerEditMode)}
            className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-bold rounded-full transition-colors shadow-sm ${isBannerEditMode ? 'bg-amber-700 hover:bg-amber-600 ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-100' : 'bg-amber-900 hover:bg-amber-800'}`}
            title="Editar vitrine"
          >
            <Sparkles className={`w-4 h-4 ${isBannerEditMode ? 'text-amber-200' : ''}`} />
            {isBannerEditMode ? "Sair da Edição" : "Editar vitrine"}
          </button>
        </div>
      )}
      <BannerHero
        isAdminMode={isAdminLogged && isBannerEditMode}
        onEditBanner={(b) => { setPrefillBanner(null); setBannerToEdit(b); setIsBannerManagerOpen(true); }}
        onAddBannerTrigger={() => { setIsProductSelectorOpen(true); }}
        onDeleteBanner={handleDeleteBanner}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        products={products}
        onProductClick={handleOpenDetails}
        onShopeeClick={handleShopeeClick}
        banners={banners}
        hiddenSlideIds={hiddenDynamicSlides}
      />

      {/* Department & Quick Filters Bar (Posicionada abaixo do quadro rotativo) */}
      <CategoryFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        activeFilter={curatedFilter}
        onSelectFilter={setCuratedFilter}
        counts={curatedCounts}
        totalProductsCount={filteredProducts.length}
      />

      {/* Main Catalog Container (Produtos listados imediatamente abaixo ao clicar) */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        
        {/* Flash Deals Highlight Strip (when on home/todas) */}
        {selectedCategory === 'todas' && curatedFilter === 'todos' && !searchQuery && flashDeals.length > 0 && (
          <section className="mb-10 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-800 to-amber-950 text-white shadow-md border border-amber-700/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
                  <Flame className="w-5 h-5 text-amber-300 animate-bounce" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      Ofertas Relâmpago do Dia
                    </h2>
                    <span className="text-[10px] uppercase font-bold bg-rose-600 px-2 py-0.5 rounded-full text-white">
                      Tempo Limitado
                    </span>
                  </div>
                  <p className="text-xs text-amber-200">
                    Descontos de até 50% verificados e com cupons ativos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCuratedFilter('promocoes')}
                className="text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl"
              >
                <span>Ver todas as promoções</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {flashDeals.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => handleShopeeClick(prod, 'Ofertas Relâmpago Strip')}
                  className="bg-white text-stone-900 rounded-2xl p-3.5 border border-stone-200 hover:border-amber-400 hover:shadow-lg cursor-pointer flex flex-col justify-between transition-all"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 mb-3">
                    <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                      -{prod.discountPercent}% OFF
                    </span>
                    <span className="absolute bottom-2 right-2 bg-stone-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      ⭐ {prod.rating.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 truncate mb-1">{prod.title}</h3>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-base font-black text-amber-900">
                        {typeof prod.price === 'number' ? `R$ ${prod.price.toFixed(2)}` : prod.price}
                      </span>
                      {prod.originalPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          {typeof prod.originalPrice === 'number' ? `R$ ${prod.originalPrice.toFixed(2)}` : prod.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShopeeClick(prod, 'Ofertas Relâmpago Strip');
                    }}
                    className="w-full py-2 bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>Melhor Preço</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section Title & Description */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                {curatedFilter === 'promocoes' && <Flame className="w-6 h-6 text-rose-600" />}
                {curatedFilter === 'mais_vendidos' && <Trophy className="w-6 h-6 text-amber-600" />}
                {curatedFilter === '5_estrelas' && <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />}
                {curatedFilter === 'novidades' && <TrendingUp className="w-6 h-6 text-emerald-600" />}
                {curatedFilter === 'entrega_rapida' && <Zap className="w-6 h-6 text-sky-600" />}
                {curatedFilter === 'todos' && <Tag className="w-5 h-5 text-amber-800" />}
                <span>
                  {curatedFilter === 'promocoes' && 'Super Promoções com Maiores Descontos'}
                  {curatedFilter === 'mais_vendidos' && 'Mais Vendidos & Favoritos dos Tutores'}
                  {curatedFilter === '5_estrelas' && 'Produtos Nota Máxima (Avaliação 4.8 a 5.0)'}
                  {curatedFilter === 'novidades' && 'Novidades, Inovações e Tendências Pet'}
                  {curatedFilter === 'entrega_rapida' && 'Entrega Rápida e Frete Grátis'}
                  {curatedFilter === 'todos' && (
                    selectedCategory === 'todas' 
                      ? 'Todos os Achadinhos Selecionados' 
                      : (CATEGORY_LABELS[selectedCategory]?.label || selectedCategory)
                  )}
                </span>
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Exibindo <strong>{filteredProducts.length}</strong> produtos validados com garantia e compra direta na loja oficial.
            </p>
          </div>

          {curatedFilter !== 'todos' && (
            <button
              onClick={() => setCuratedFilter('todos')}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 underline self-start sm:self-auto cursor-pointer"
            >
              Ver todos os achadinhos
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.some((f) => f.id === product.id)}
                onToggleFavorite={handleToggleFavorite}
                onOpenDetails={handleOpenDetails}
                onShopeeClick={handleShopeeClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto text-3xl">
              🐾
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              Nenhum produto encontrado com estes filtros
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Tente aumentar o limite de preço ou limpar a busca de texto para ver mais ofertas disponíveis.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('todas');
                setSearchQuery('');
                setCuratedFilter('todos');
              }}
              className="px-5 py-2.5 bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs rounded-full shadow-xs cursor-pointer"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}

      </main>

      {/* Health & Wellness AI Section */}
      <div id="health-section">
        <PetHealthSection
          allProducts={products}
          onOpenProductDetails={handleOpenDetails}
        />
      </div>

      {/* Footer */}
      <Footer
        onSelectCategory={setSelectedCategory}
        onOpenAdmin={() => {
          if (isAdminLogged || currentUser?.role === 'admin') {
            setIsAdminOpen(true);
          } else {
            setIsAdminAuthOpen(true);
          }
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
      />

      {/* Optional Member / User Account Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          handleLoginSuccess(user);
        }}
        onLogout={handleLogout}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Admin Password / Credentials Gatekeeper */}
      <BannerProductSelectorModal
        isOpen={isProductSelectorOpen}
        onClose={() => setIsProductSelectorOpen(false)}
        products={products}
        onSelectProduct={handleSelectProductForBanner}
      />

      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={(adminUser) => {
          setIsAdminAuthOpen(false);
          setIsAdminLogged(true);
          if (adminUser) {
            setCurrentUser(adminUser);
          } else {
            setCurrentUser({
              id: 'user-admin-01',
              name: 'Administrador Achadinhos',
              email: 'clikdica@gmail.com',
              role: 'admin',
              createdAt: new Date().toISOString()
            });
          }
          setIsAdminOpen(true);
        }}
      />


      {/* Modals */}
      <ProductDetailModal
        product={selectedProductDetails}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        isFavorite={favorites.some((f) => f.id === selectedProductDetails?.id)}
        onToggleFavorite={handleToggleFavorite}
        onShopeeClick={handleShopeeClick}
        allProducts={products}
        onSelectRelatedProduct={(rel) => setSelectedProductDetails(rel)}
      />

      <BannerManagerModal
        isOpen={isBannerManagerOpen}
        editingBanner={bannerToEdit}
        prefillBanner={prefillBanner}
        setEditingBanner={setBannerToEdit}
        onClose={() => { setIsBannerManagerOpen(false); setPrefillBanner(null); }}
        banners={banners}
        onAddBanner={handleAddBanner}
        onUpdateBanner={handleUpdateBanner}
        onDeleteBanner={handleDeleteBanner}
      />

      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onAddProduct={handleAddProduct}
        onImportProducts={handleBulkImportProducts}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        affiliateSettings={affiliateSettings}
        onUpdateSettings={handleUpdateSettings}
        banners={banners}
        onAddBanner={handleAddBanner}
        onUpdateBanner={handleUpdateBanner}
        onDeleteBanner={handleDeleteBanner}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleToggleFavorite}
        onClearFavorites={() => setFavorites([])}
        onShopeeClick={handleShopeeClick}
        onOpenProductDetails={handleOpenDetails}
      />

      {/* Toast Notification for Affiliate Tracking */}
      {clickToast && clickToast.visible && (
        <div className="fixed bottom-5 right-5 z-50 p-4 rounded-2xl bg-stone-900 text-white shadow-2xl border border-stone-700 flex items-center gap-3 animate-in slide-in-from-bottom-5 text-xs max-w-sm">
          <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white shrink-0">
            <ShoppingBag className="w-4 h-4 text-amber-200" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white truncate">Redirecionando para o produto...</p>
            <p className="text-[11px] text-stone-400 truncate">{clickToast.title}</p>
          </div>
          <a
            href={clickToast.redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-amber-400 hover:text-white"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

    </div>
  );
}
