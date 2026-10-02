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
import { BlogSection } from './components/BlogSection';
import { BlogArticleView } from './components/BlogArticleView';
import { BlogCatalogModal } from './components/BlogCatalogModal';
import { Footer } from './components/Footer';
import { INITIAL_PRODUCTS, CATEGORY_LABELS, DEFAULT_BANNERS, PURGED_DEMO_PRODUCT_IDS } from './data/mockProducts';
import { INITIAL_BLOG_POSTS } from './data/blogPosts';
import { Product, ProductCategory, AffiliateSettings, Banner, UserAccount, BlogPost } from './types';
import { formatBRL } from './utils/currency';
import { deduplicateProducts, mergeProductsUnique } from './utils/productHelpers';
import { 
  loadProductsFromCloud, 
  syncProductToCloud, 
  deleteProductFromCloud, 
  syncAllProductsToCloud,
  saveBannersToCloud,
  loadBannersFromCloud,
  saveBlogPostsToCloud,
  loadBlogPostsFromCloud
} from './utils/supabaseClient';

const DELETED_IDS_STORAGE_KEY = 'achadinhospet_deleted_ids';

function getDeletedProductIds(): Set<string> {
  const ids = new Set<string>(PURGED_DEMO_PRODUCT_IDS);
  try {
    const saved = localStorage.getItem(DELETED_IDS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        parsed.forEach(id => ids.add(String(id)));
      }
    }
  } catch (e) {
    // ignore
  }
  return ids;
}

function recordDeletedProductId(id: string) {
  try {
    const current = getDeletedProductIds();
    current.add(id);
    localStorage.setItem(DELETED_IDS_STORAGE_KEY, JSON.stringify(Array.from(current)));
  } catch (e) {
    // ignore
  }
}

function removeDeletedProductId(id: string) {
  try {
    const current = getDeletedProductIds();
    current.delete(id);
    localStorage.setItem(DELETED_IDS_STORAGE_KEY, JSON.stringify(Array.from(current)));
  } catch (e) {
    // ignore
  }
}

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
  // Products state - only real registered products, strictly excluding deleted items
  const [products, setProducts] = useState<Product[]>(() => {
    const deletedIds = getDeletedProductIds();
    try {
      const saved = localStorage.getItem('achadinhospet_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Strictly filter out any deleted products or purged demo items
          const cleanSaved = deduplicateProducts(parsed).filter(p => !deletedIds.has(p.id));
          if (cleanSaved.length >= INITIAL_PRODUCTS.length) {
            return cleanSaved;
          } else {
            return mergeProductsUnique(cleanSaved, deduplicateProducts(INITIAL_PRODUCTS)).filter(p => !deletedIds.has(p.id));
          }
        }
      }
    } catch (e) {
      console.warn('Error reading stored products:', e);
    }
    return deduplicateProducts(INITIAL_PRODUCTS).filter(p => !deletedIds.has(p.id));
  });

  // Filters and navigation state
  const [curatedFilter, setCuratedFilter] = useState<CuratedFilterType>('todos');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'todas'>('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // User interactions state (Browser-local saved list, no login required)
  const [favorites, setFavorites] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('achadinhospet_favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return deduplicateProducts(parsed);
        }
      }
    } catch (e) {
      // fallback
    }
    return [];
  });

  // Sync products and favorites with localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem('achadinhospet_products', JSON.stringify(deduplicateProducts(products)));
    } catch (e) {
      console.warn('LocalStorage full or error saving products:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('achadinhospet_favorites', JSON.stringify(deduplicateProducts(favorites)));
    } catch (e) {
      console.warn('LocalStorage error saving favorites:', e);
    }
  }, [favorites]);

  // Initial load from cloud (Supabase, Server API or Static Fallback) on mount
  useEffect(() => {
    // 1. Products Sync
    loadProductsFromCloud()
      .then(res => {
        if (res.success && Array.isArray(res.products) && res.products.length > 0) {
          const deletedIds = getDeletedProductIds();
          const cleanCloud = res.products.filter(p => !deletedIds.has(p.id));
          if (cleanCloud.length > 0) {
            setProducts(cleanCloud);
            try {
              localStorage.setItem('achadinhospet_products', JSON.stringify(cleanCloud));
            } catch (e) {}
          }
        }
      })
      .catch(err => console.log('Error initializing products from cloud:', err));

    // 2. Banners Sync
    loadBannersFromCloud()
      .then(res => {
        if (res.success && Array.isArray(res.banners) && res.banners.length > 0) {
          setBanners(res.banners);
          try {
            localStorage.setItem('pet_achadinhos_banners', JSON.stringify(res.banners));
          } catch (e) {}
        }
      })
      .catch(() => {});

    // 3. Blog Posts Sync
    loadBlogPostsFromCloud()
      .then(res => {
        if (res.success && Array.isArray(res.blogPosts) && res.blogPosts.length > 0) {
          setBlogPosts(res.blogPosts);
          try {
            localStorage.setItem('achadinhospet_blog_posts', JSON.stringify(res.blogPosts));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('pet_achadinhos_banners');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasEditorial = parsed.some((b: Banner) => b.blogPostSlug || b.id === 'banner-blog-segredo-felino');
          if (!hasEditorial) {
            return [...DEFAULT_BANNERS.filter(b => b.blogPostSlug), ...parsed];
          }
          return parsed;
        }
      } catch (e) { /* fallback */ }
    }
    return DEFAULT_BANNERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('pet_achadinhos_banners', JSON.stringify(banners));
    } catch (e) {}
  }, [banners]);

  // Blog Posts State
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('achadinhospet_blog_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: BlogPost) => {
            if (p.id === 'post-segredo-felino-agua-corrente') {
              return {
                ...p,
                author: {
                  name: 'Redação Achadinhos Pet',
                  role: 'Curadoria de Saúde & Bem-Estar Pet',
                  avatarUrl: 'https://i.imgur.com/g4qHahz.png'
                },
                recommendedProductIds: ['pet-saude-001']
              };
            }
            return p;
          });
        }
      }
    } catch (e) {
      console.warn('Error reading stored blog posts:', e);
    }
    return INITIAL_BLOG_POSTS;
  });

  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [isBlogCatalogOpen, setIsBlogCatalogOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('achadinhospet_blog_posts', JSON.stringify(blogPosts));
    } catch (e) {
      console.warn('Error saving blog posts:', e);
    }
  }, [blogPosts]);

  // Handle URL /blog/:slug routing and popstate
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      if (path.startsWith('/blog/')) {
        const slug = path.replace('/blog/', '').replace(/\/$/, '');
        const found = blogPosts.find((p) => p.slug === slug);
        if (found) {
          setSelectedBlogPost(found);
        }
      } else {
        setSelectedBlogPost(null);
      }
    };

    handleUrlRoute();

    const onPopState = () => {
      handleUrlRoute();
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [blogPosts]);

  const handleOpenBlogPost = (post: BlogPost) => {
    setSelectedBlogPost(post);
    try {
      window.history.pushState({ postId: post.id }, '', `/blog/${post.slug}`);
    } catch (e) {
      // browser env
    }
  };

  const handleOpenBlogPostBySlug = (slug: string) => {
    const post = blogPosts.find(p => p.slug === slug || p.id === slug);
    if (post) {
      handleOpenBlogPost(post);
    }
  };

  const handleBackFromBlog = () => {
    setSelectedBlogPost(null);
    try {
      window.history.pushState(null, '', '/');
    } catch (e) {
      // browser env
    }
  };

  const handleAddBlogPost = (newPost: BlogPost) => {
    setBlogPosts(prev => {
      const updated = [newPost, ...prev.filter(p => p.id !== newPost.id)];
      saveBlogPostsToCloud(updated);
      return updated;
    });
  };

  const handleUpdateBlogPost = (updatedPost: BlogPost) => {
    setBlogPosts(prev => {
      const updated = prev.map(p => p.id === updatedPost.id ? updatedPost : p);
      saveBlogPostsToCloud(updated);
      return updated;
    });
    if (selectedBlogPost?.id === updatedPost.id) {
      setSelectedBlogPost(updatedPost);
    }
  };

  const handleDeleteBlogPost = (postId: string) => {
    setBlogPosts(prev => {
      const updated = prev.filter(p => p.id !== postId);
      saveBlogPostsToCloud(updated);
      return updated;
    });
    if (selectedBlogPost?.id === postId) {
      handleBackFromBlog();
    }
  };

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
    setBanners((prev) => {
      const updated = [newBanner, ...prev];
      saveBannersToCloud(updated);
      return updated;
    });
  };

  const handleUpdateBanner = (updatedBanner: Banner) => {
    setBanners((prev) => {
      const exists = prev.some(b => b.id === updatedBanner.id);
      let updated: Banner[];
      if (exists) {
        updated = prev.map((b) => b.id === updatedBanner.id ? updatedBanner : b);
      } else {
        const newBanner = { ...updatedBanner, id: updatedBanner.id || `banner-${Date.now()}` };
        updated = [newBanner, ...prev];
      }
      saveBannersToCloud(updated);
      return updated;
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
      setBanners((prev) => {
        const updated = prev.filter((b) => b.id !== bannerId);
        saveBannersToCloud(updated);
        return updated;
      });
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
      return deduplicateProducts([...prev, product]);
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
    removeDeletedProductId(newProd.id);
    setProducts((prev) => deduplicateProducts([newProd, ...prev.filter(p => p.id !== newProd.id)]));
    syncProductToCloud(newProd);
  };

  const handleBulkImportProducts = (newProds: Product[]) => {
    newProds.forEach(p => removeDeletedProductId(p.id));
    setProducts((prev) => {
      const merged = mergeProductsUnique(prev, newProds);
      syncAllProductsToCloud(merged);
      return merged;
    });
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => deduplicateProducts(prev.map((p) => (p.id === updated.id ? updated : p))));
    syncProductToCloud(updated);
  };

  const handleDeleteProduct = (productId: string) => {
    recordDeletedProductId(productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setFavorites((prev) => prev.filter((p) => p.id !== productId));
    deleteProductFromCloud(productId);
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
    const matched = products.filter((p) => {
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
    return deduplicateProducts(matched);
  }, [products, curatedFilter, selectedCategory, searchQuery]);

  // Flash deals subset for highlighting
  const flashDeals = useMemo(() => {
    const rawDeals = products.filter((p) => p.isFlashDeal || (p.discountPercent && p.discountPercent >= 40));
    return deduplicateProducts(rawDeals).slice(0, 4);
  }, [products]);


  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden w-full">
      
      {/* Clean Sticky Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenBlog={() => setIsBlogCatalogOpen(true)}
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

      {/* Main View: Article Reader or Home Catalog */}
      {selectedBlogPost ? (
        <BlogArticleView
          post={selectedBlogPost}
          allProducts={products}
          onBack={handleBackFromBlog}
          onOpenProductDetails={handleOpenDetails}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            handleBackFromBlog();
          }}
        />
      ) : (
        <>
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
        onOpenBlogPostSlug={handleOpenBlogPostBySlug}
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
      <main className="flex-1 max-w-7xl mx-auto px-3.5 sm:px-6 py-6 sm:py-8 w-full">
        
        {/* Flash Deals Highlight Strip (when on home/todas) */}
        {selectedCategory === 'todas' && curatedFilter === 'todos' && !searchQuery && flashDeals.length > 0 && (
          <section className="mb-8 sm:mb-10 p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-800 to-amber-950 text-white shadow-md border border-amber-700/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 sm:p-2 rounded-xl bg-amber-400/20 text-amber-300">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-bounce" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                      Ofertas Relâmpago do Dia
                    </h2>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold bg-rose-600 px-2 py-0.5 rounded-full text-white">
                      Tempo Limitado
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-amber-200">
                    Descontos de até 50% verificados e com cupons ativos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCuratedFilter('promocoes')}
                className="text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl self-start sm:self-auto"
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

      {/* Blog & Dicas Pet Section (Featuring Inaugural Post) */}
      <BlogSection
        posts={blogPosts}
        onOpenPost={handleOpenBlogPost}
        onOpenAllPosts={() => setIsBlogCatalogOpen(true)}
      />

      {/* Health & Wellness AI Section */}
      <div id="health-section">
        <PetHealthSection
          allProducts={products}
          onOpenProductDetails={handleOpenDetails}
        />
      </div>
    </>
  )}

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (selectedBlogPost) {
            handleBackFromBlog();
          }
        }}
        onOpenBlog={() => setIsBlogCatalogOpen(true)}
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
        blogPosts={blogPosts}
        onAddBlogPost={handleAddBlogPost}
        onUpdateBlogPost={handleUpdateBlogPost}
        onDeleteBlogPost={handleDeleteBlogPost}
        onPreviewBlogPost={(p) => {
          setIsAdminOpen(false);
          handleOpenBlogPost(p);
        }}
      />

      {/* Blog Catalog Modal */}
      <BlogCatalogModal
        isOpen={isBlogCatalogOpen}
        onClose={() => setIsBlogCatalogOpen(false)}
        posts={blogPosts}
        onSelectPost={handleOpenBlogPost}
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
