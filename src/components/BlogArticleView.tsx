import React, { useState, useEffect } from 'react';
import { BlogPost, Product } from '../types';
import { formatBRL } from '../utils/currency';
import { PetAchadinhosLogo } from './PetAchadinhosLogo';
import { 
  ArrowLeft, 
  Heart, 
  Check, 
  ExternalLink, 
  Sparkles, 
  AlertTriangle, 
  Info, 
  Lightbulb, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Star,
  Copy,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Flame,
  X
} from 'lucide-react';

interface BlogArticleViewProps {
  post: BlogPost;
  allProducts: Product[];
  onBack: () => void;
  onOpenProductDetails: (product: Product) => void;
  onSelectCategory?: (category: any) => void;
}

export const BlogArticleView: React.FC<BlogArticleViewProps> = ({
  post,
  allProducts,
  onBack,
  onOpenProductDetails,
  onSelectCategory
}) => {
  const [likesCount, setLikesCount] = useState(post.likesCount || 384);
  const [hasLiked, setHasLiked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFloatingBarDismissed, setIsFloatingBarDismissed] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(false);

  // Find linked products from recommendations
  const recommendedProducts = (post.recommendedProductIds || [])
    .map(id => allProducts.find(p => p.id === id))
    .filter((p): p is Product => !!p);

  const mainProduct = recommendedProducts[0] || allProducts.find(p => p.id === 'pet-saude-001') || allProducts[0];

  // Scroll to top and set SEO
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update document title and dynamic meta tags for SEO
    const prevTitle = document.title;
    document.title = `${post.title} – Achadinhos Pet Blog`;

    // Inject Article Schema.org structured data
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'article-structured-data';
    schemaScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': post.title,
      'description': post.seoDescription || post.excerpt,
      'image': post.coverImage.startsWith('http') ? post.coverImage : `https://achadinhospet.net${post.coverImage}`,
      'datePublished': '2026-10-01T08:00:00+00:00',
      'dateModified': '2026-10-01T08:00:00+00:00',
      'author': {
        '@type': 'Person',
        'name': post.author.name,
        'jobTitle': post.author.role
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Achadinhos Pet',
        'url': 'https://achadinhospet.net/',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://achadinhospet.net/logo.png'
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `https://achadinhospet.net/blog/${post.slug}`
      }
    });
    document.head.appendChild(schemaScript);

    // Scroll listener to reveal floating purchase bar after 300px of reading
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowFloatingBar(true);
      } else {
        setShowFloatingBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.title = prevTitle;
      window.removeEventListener('scroll', handleScroll);
      const existing = document.getElementById('article-structured-data');
      if (existing) {
        document.head.removeChild(existing);
      }
    };
  }, [post]);

  const handleLike = () => {
    if (!hasLiked) {
      setLikesCount(prev => prev + 1);
      setHasLiked(true);
      showToast('Obrigado pelo seu feedback! 🐾');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyLink = () => {
    const url = `https://achadinhospet.net/blog/${post.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedLink(true);
    showToast('Link do artigo copiado para a área de transferência!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Direct affiliate click to Shopee
  const handleBuyOnShopee = (prod: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const destination = prod.affiliateUrl || prod.shopeeUrl;
    window.open(destination, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="min-h-screen bg-stone-50 pb-24 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-xl border border-stone-800 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Navigation Bar */}
      <div className="bg-white border-b border-stone-200 sticky top-[57px] sm:top-16 z-30 shadow-2xs">
        <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-amber-800 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar</span>
            <span className="hidden sm:inline">para o Portal</span>
          </button>

          {/* Quick Action: Direct link to featured product or copy article link */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {mainProduct && (
              <button
                onClick={(e) => handleBuyOnShopee(mainProduct, e)}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Ir direto para a oferta na Shopee"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ver Produto na Shopee</span>
                <span className="sm:hidden">Ver na Shopee</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </button>
            )}

            <button
              onClick={handleCopyLink}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copiar link do artigo"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copiado' : 'Copiar Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Article Header */}
      <header className="max-w-4xl mx-auto px-3.5 sm:px-6 pt-6 sm:pt-8 pb-5 sm:pb-6">
        {/* Metadata */}
        <div className="flex items-center flex-wrap gap-2 text-xs text-stone-500 font-medium mb-2.5 sm:mb-3">
          <span className="font-bold text-amber-800 uppercase tracking-wider text-[11px] sm:text-xs">{post.category}</span>
          <span className="text-stone-300">·</span>
          <span>{post.publishDate}</span>
          <span className="text-stone-300">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{post.readTime} de leitura</span>
          </span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-xl sm:text-3xl lg:text-[40px] font-black text-stone-900 tracking-tight leading-[1.2] mb-3 sm:mb-4">
          {post.title}
        </h1>
        <p className="text-sm sm:text-lg text-stone-600 leading-relaxed font-normal">
          {post.subtitle}
        </p>

        {/* Author byline */}
        <div className="mt-6 pt-6 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Logo do site Achadinhospet.net */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex items-center justify-center p-1.5 ring-2 ring-amber-100/70">
                <PetAchadinhosLogo size="sm" />
              </div>
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <p className="text-sm sm:text-base font-bold text-stone-900 leading-none">{post.author.name}</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/70">
                  <CheckCircle2 className="w-3 h-3 text-amber-600" />
                  achadinhospet.net
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">{post.author.role}</p>
            </div>
          </div>

          {/* Quick Reading Metrics */}
          <div className="text-left sm:text-right">
            <span className="text-xs text-stone-500 font-medium block">Curadoria & Análise Editorial</span>
            <p className="text-[11px] text-emerald-700 font-bold flex items-center sm:justify-end gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Conteúdo Verificado por Achadinhos Pet</span>
            </p>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8">
        <div className="overflow-hidden rounded-2xl bg-stone-100 shadow-md border border-stone-200">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-auto max-h-[500px] object-cover" 
          />
        </div>
        <p className="text-[11px] text-stone-400 mt-2 text-center italic">
          Gatos possuem atração instintiva natural por água em movimento: correnteza simboliza pureza e sobrevivência.
        </p>
      </div>

      {/* Article Body Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 text-stone-800 text-base sm:text-lg leading-relaxed font-sans">
        {post.contentSections.map((section, idx) => {
          switch (section.type) {
            case 'paragraph':
              return (
                <p key={idx} className="text-stone-700 leading-relaxed">
                  {section.text}
                </p>
              );

            case 'heading2':
              return (
                <h2 key={idx} className="text-xl sm:text-2xl font-black text-stone-900 pt-6 pb-1 tracking-tight border-b border-stone-200">
                  {section.title}
                </h2>
              );

            case 'heading3':
              return (
                <h3 key={idx} className="text-lg sm:text-xl font-bold text-stone-900 pt-4 pb-1 tracking-tight">
                  {section.title}
                </h3>
              );

            case 'quote':
              return (
                <blockquote key={idx} className="border-l-4 border-amber-600 bg-amber-50/70 p-5 rounded-r-2xl my-6 text-stone-800 italic text-base sm:text-lg leading-relaxed shadow-2xs">
                  "{section.text}"
                </blockquote>
              );

            case 'callout':
              const isWarn = section.calloutType === 'warning';
              const isSuccess = section.calloutType === 'success';
              return (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border my-6 space-y-2 ${
                    isWarn 
                      ? 'bg-rose-50/70 border-rose-200 text-rose-950' 
                      : isSuccess 
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-sm sm:text-base">
                    {isWarn ? (
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    ) : isSuccess ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Info className="w-5 h-5 text-amber-700 shrink-0" />
                    )}
                    <span>{section.title}</span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-stone-700">
                    {section.text}
                  </p>
                </div>
              );

            case 'tips_list':
              return (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs my-6 space-y-3">
                  {section.title && (
                    <h4 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span>{section.title}</span>
                    </h4>
                  )}
                  <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                    {section.items?.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0"></span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );

            case 'product_highlight':
              const prod = allProducts.find(p => p.id === section.productId);
              if (!prod) return null;
              return (
                <div 
                  key={idx} 
                  className="my-8 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/30 rounded-3xl border-2 border-orange-400/50 p-5 sm:p-7 shadow-lg transition-all hover:border-orange-500 relative overflow-hidden"
                >
                  {/* Highlight Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-200/80">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-900 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-orange-200">
                        <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                        <span>Achadinho Recomendado nesta Matéria</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Truck className="w-3 h-3 text-emerald-600" />
                        <span>Frete Grátis Disponível</span>
                      </span>
                      <span className="text-[10px] font-bold bg-[#ee4d2d]/10 text-[#ee4d2d] px-2 py-0.5 rounded-full border border-[#ee4d2d]/20">
                        Shopee Oficial
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                    {/* Product Image */}
                    <div className="sm:col-span-5 overflow-hidden rounded-2xl bg-white border border-stone-200 aspect-square sm:aspect-auto sm:h-52 relative group">
                      <img 
                        src={prod.imageUrl} 
                        alt={prod.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      {prod.discountPercent && (
                        <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-black text-xs px-2 py-0.5 rounded-md shadow-xs">
                          -{prod.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Product Details & Direct Shopee Purchase Action */}
                    <div className="sm:col-span-7 space-y-2.5 flex flex-col justify-between">
                      <div>
                        <h4 className="font-black text-stone-900 text-base sm:text-xl leading-snug">
                          {prod.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-1.5">
                          {section.text || prod.shortDescription}
                        </p>

                        <div className="flex items-center gap-2 pt-2 text-xs">
                          <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{prod.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-stone-300">·</span>
                          <span className="text-stone-500 font-medium">Mais de {prod.salesCount} vendidos</span>
                        </div>
                      </div>

                      {/* Pricing & Direct CTA */}
                      <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                        <div>
                          {prod.originalPrice && (
                            <span className="text-xs text-stone-400 line-through block">
                              De {formatBRL(prod.originalPrice)}
                            </span>
                          )}
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl sm:text-3xl font-black text-amber-900">
                              {formatBRL(prod.price)}
                            </span>
                            <span className="text-[11px] text-emerald-700 font-bold">no Pix ou Cartão</span>
                          </div>
                        </div>

                        {/* HIGH CONVERSION SHOPEE AFFILIATE BUTTON */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenProductDetails(prod)}
                            className="px-3 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
                          >
                            Ver Fotos
                          </button>
                          
                          <button
                            onClick={(e) => handleBuyOnShopee(prod, e)}
                            className="flex-1 sm:flex-initial px-5 py-3 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:from-[#d73211] hover:to-[#ee4d2d] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                            title="Ir para a loja oficial do produto na Shopee com o melhor preço"
                          >
                            <ShoppingBag className="w-4 h-4 fill-white" />
                            <span>Comprar na Shopee Oficial</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                          </button>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center gap-3 text-[11px] text-stone-500">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Garantia de Entrega Shopee</span>
                        </span>
                        <span>•</span>
                        <span>Envio Rápido</span>
                      </div>
                    </div>
                  </div>
                </div>
              );

            case 'faq':
              return (
                <div key={idx} className="my-8 space-y-4">
                  <h3 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    <span>{section.title || 'Dúvidas Frequentes'}</span>
                  </h3>
                  <div className="space-y-3">
                    {section.faqAnswers?.map((item, faqIdx) => (
                      <div key={faqIdx} className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-2xs space-y-1.5">
                        <p className="font-bold text-stone-900 text-sm sm:text-base">
                          {item.question}
                        </p>
                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}

        {/* Feedback & Likes Bar (No WhatsApp) */}
        <div className="my-10 p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-stone-900 text-sm">Esta matéria foi útil para você?</h4>
            <p className="text-xs text-stone-500">Curadoria independente com base nas melhores práticas veterinárias e ofertas reais.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                hasLiked 
                  ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-600 text-rose-600' : 'text-stone-500'}`} />
              <span>{likesCount} Curtiram</span>
            </button>

            {mainProduct && (
              <button
                onClick={(e) => handleBuyOnShopee(mainProduct, e)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#ee4d2d] hover:bg-[#d73211] text-white flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Ver Oferta na Shopee</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tags footer */}
        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span className="font-bold text-stone-700">Tags:</span>
          {post.tags.map((t, idx) => (
            <span key={idx} className="bg-stone-100 text-stone-600 px-2.5 py-1 rounded-md">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Recommended Products Carousel / Grid at bottom */}
      {recommendedProducts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-16 pt-10 border-t border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Curadoria Verificada</span>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Produtos Citados Nesta Matéria
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Clique para comprar diretamente na loja oficial da Shopee com frete grátis e segurança.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedProducts.map(prod => (
              <div 
                key={prod.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs hover:border-orange-400 transition-all flex flex-col justify-between"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 relative">
                    <img src={prod.imageUrl} alt={prod.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    {prod.discountPercent && (
                      <span className="absolute top-1.5 left-1.5 bg-rose-600 text-white font-bold text-[10px] px-1.5 py-0.2 rounded">
                        -{prod.discountPercent}%
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        {prod.couponAvailable || 'Frete Grátis'}
                      </span>
                      <span className="text-[10px] font-semibold text-[#ee4d2d] bg-orange-50 px-1.5 py-0.5 rounded">
                        Shopee
                      </span>
                    </div>
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                      {prod.title}
                    </h4>
                    <div className="mt-1.5 flex items-baseline gap-2">
                      <span className="text-sm sm:text-base text-amber-900 font-black">
                        {formatBRL(prod.price)}
                      </span>
                      {prod.originalPrice && (
                        <span className="text-[11px] text-stone-400 line-through">
                          {formatBRL(prod.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenProductDetails(prod)}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer px-2 py-1"
                  >
                    Ver detalhes
                  </button>

                  <button
                    onClick={(e) => handleBuyOnShopee(prod, e)}
                    className="px-4 py-2 bg-[#ee4d2d] hover:bg-[#d73211] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Comprar na Shopee</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Back to Home CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Catálogo de Achadinhos</span>
        </button>
      </div>

      {/* FLOATING STICKY READER BAR (Direct Shopee Affiliate Conversion Widget) */}
      {showFloatingBar && !isFloatingBarDismissed && mainProduct && (
        <aside 
          aria-label="Produto sugerido na matéria"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 bg-white/95 backdrop-blur-md rounded-2xl p-3 border-2 border-orange-400/80 shadow-2xl animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 relative">
              <img src={mainProduct.imageUrl} alt={mainProduct.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              {mainProduct.discountPercent && (
                <span className="absolute top-1 left-1 bg-rose-600 text-white font-black text-[9px] px-1 py-0.2 rounded">
                  -{mainProduct.discountPercent}%
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-[10px] text-orange-700 font-bold">
                <Sparkles className="w-3 h-3 text-orange-500" />
                <span>Recomendado no Artigo</span>
              </div>
              <h5 className="font-bold text-stone-900 text-xs truncate leading-snug">
                {mainProduct.title}
              </h5>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-sm font-black text-[#ee4d2d]">
                  {formatBRL(mainProduct.price)}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">Frete Grátis</span>
              </div>
            </div>

            <button
              onClick={() => setIsFloatingBarDismissed(true)}
              className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer self-start"
              title="Fechar barra"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2 pt-2 border-t border-stone-100 flex items-center gap-2">
            <button
              onClick={(e) => handleBuyOnShopee(mainProduct, e)}
              className="w-full py-2 bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:from-[#d73211] hover:to-[#ee4d2d] text-white text-xs font-black rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Comprar na Shopee Oficial</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </aside>
      )}
    </article>
  );
};
