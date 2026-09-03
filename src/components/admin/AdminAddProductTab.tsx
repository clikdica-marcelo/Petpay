import React, { useState } from 'react';
import { 
  Plus, 
  Sparkles, 
  Layers, 
  Wand2, 
  Image as ImageIcon, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { Product, ProductCategory } from '../../types';
import { OFFICIAL_CATEGORIES, CATEGORY_LABELS } from '../../data/mockProducts';
import { formatBRL, parseBRL, numberToBRLInput } from '../../utils/currency';

interface AdminAddProductTabProps {
  onAddProduct: (product: Product) => void;
  onOpenBulkImport: () => void;
  onSuccessNavigate?: () => void;
  onBackToProducts?: () => void;
}

export const AdminAddProductTab: React.FC<AdminAddProductTabProps> = ({
  onAddProduct,
  onOpenBulkImport,
  onSuccessNavigate,
  onBackToProducts,
}) => {
  const [rawShopeeUrl, setRawShopeeUrl] = useState('');
  const [rawTitleInput, setRawTitleInput] = useState('');
  const [rawPriceInput, setRawPriceInput] = useState('');
  const [rawCategoryInput, setRawCategoryInput] = useState<ProductCategory>('alimentacao');
  const [rawImageUrl, setRawImageUrl] = useState('');
  const [rawShortDesc, setRawShortDesc] = useState('');
  const [rawFullDesc, setRawFullDesc] = useState('');
  const [rawSellerName, setRawSellerName] = useState('Loja Oficial Shopee');
  const [rawFreeShipping, setRawFreeShipping] = useState(true);
  const [rawFlashDeal, setRawFlashDeal] = useState(false);
  const [rawCoupon, setRawCoupon] = useState('10% OFF');

  const [isExtracting, setIsExtracting] = useState(false);
  const [autoExtractSuccess, setAutoExtractSuccess] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAutoExtract = async () => {
    if (!rawShopeeUrl.trim()) {
      setExtractError('Por favor, insira o link do produto da Shopee primeiro.');
      return;
    }

    setIsExtracting(true);
    setExtractError(null);
    setAutoExtractSuccess(false);

    try {
      const res = await fetch('/api/products/auto-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: rawShopeeUrl.trim() })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Falha ao extrair dados do link.');
      }

      const p = data.product;
      if (p.title) {
        setRawTitleInput(p.title);
        setRawShortDesc(`${p.title} - Oferta verificada com procedência e garantia.`);
        setRawFullDesc(`${p.title} - Produto de alta qualidade recomendado para a rotina e conforto do seu pet.`);
      }
      if (p.price) {
        setRawPriceInput(numberToBRLInput(p.price));
      }
      if (p.category) {
        setRawCategoryInput(p.category as ProductCategory);
      }
      if (p.imageUrl) {
        setRawImageUrl(p.imageUrl);
      }
      if (p.sellerName) {
        setRawSellerName(p.sellerName);
      }

      setAutoExtractSuccess(true);
      setTimeout(() => setAutoExtractSuccess(false), 4000);
    } catch (err: any) {
      setExtractError(err.message || 'Não foi possível preencher automaticamente.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawTitleInput.trim()) return;

    setIsSubmitting(true);
    const priceVal = parseBRL(rawPriceInput) || 49.90;
    const originalVal = typeof priceVal === 'number' ? Number((priceVal * 1.35).toFixed(2)) : undefined;

    const newProd: Product = {
      id: `pet-prod-${Date.now()}`,
      title: rawTitleInput.trim(),
      shortDescription: rawShortDesc.trim() || `Excelente produto na categoria ${CATEGORY_LABELS[rawCategoryInput]?.shortLabel || 'Pet'}, com alta durabilidade.`,
      fullDescription: rawFullDesc.trim() || `Item verificado selecionado com foco em praticidade, segurança e bem-estar animal.`,
      price: priceVal,
      originalPrice: originalVal,
      discountPercent: 25,
      rating: 4.8,
      reviewsCount: 65,
      salesCount: 180,
      imageUrl: rawImageUrl.trim() || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
      category: rawCategoryInput,
      shopeeUrl: rawShopeeUrl.trim() || 'https://shopee.com.br',
      affiliateUrl: rawShopeeUrl.trim() || 'https://shopee.com.br',
      tags: ['Loja Oficial', 'Pet', CATEGORY_LABELS[rawCategoryInput]?.shortLabel || 'Oferta', 'Destaque'],
      badges: rawFlashDeal ? ['Oferta Relâmpago', 'Frete Grátis'] : ['Mais Vendido', 'Frete Grátis'],
      isFlashDeal: rawFlashDeal,
      freeShipping: rawFreeShipping,
      couponAvailable: rawCoupon.trim() || undefined,
      sellerName: rawSellerName.trim() || 'Loja Oficial Shopee',
      highlights: {
        idealFor: 'Tutores que buscam o melhor custo-benefício e comodidade para seus animais.',
        whyBuy: 'Excelente índice de recomendação por outros clientes e envio seguro.'
      }
    };

    onAddProduct(newProd);

    // Reset form
    setRawShopeeUrl('');
    setRawTitleInput('');
    setRawPriceInput('');
    setRawImageUrl('');
    setRawShortDesc('');
    setRawFullDesc('');
    setIsSubmitting(false);

    if (onSuccessNavigate) {
      onSuccessNavigate();
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-150">
      {/* Header card with batch import banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-700" />
            <span>Cadastrar Produto na Vitrine</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Insira o link da Shopee para preenchimento inteligente ou digite os dados manualmente.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {onBackToProducts && (
            <button
              type="button"
              onClick={onBackToProducts}
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Retornar à lista de produtos"
            >
              <ArrowLeft className="w-4 h-4 text-stone-500" />
              <span>Voltar aos Produtos</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenBulkImport}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs border border-amber-500/30 transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>⚡ Importar Lote</span>
          </button>
        </div>
      </div>

      {/* Auto-extraction Box */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <Wand2 className="w-4 h-4 text-amber-700" />
          <span>Preenchimento Automático via Link Shopee</span>
        </div>
        <p className="text-xs text-stone-600">
          Cole a URL do anúncio da Shopee. O sistema tentará extrair título, fotos e sugestão de preço automaticamente.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            placeholder="https://shopee.com.br/produto-exemplo-i.123456789..."
            value={rawShopeeUrl}
            onChange={(e) => setRawShopeeUrl(e.target.value)}
            className="flex-1 p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:border-amber-700"
          />
          <button
            type="button"
            onClick={handleAutoExtract}
            disabled={isExtracting || !rawShopeeUrl.trim()}
            className="px-5 py-2.5 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors shrink-0"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analisando Link...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Puxar Dados Automático</span>
              </>
            )}
          </button>
        </div>

        {autoExtractSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Campos preenchidos com sucesso a partir do link! Verifique e finalize abaixo.</span>
          </div>
        )}

        {extractError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{extractError}</span>
          </div>
        )}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-5 text-xs">
        <h4 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
          Informações do Produto
        </h4>

        {/* Título */}
        <div>
          <label className="font-bold text-stone-800 block mb-1">
            Título do Produto *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Coleira Peitoral Antipuxão com Guia Refletiva"
            value={rawTitleInput}
            onChange={(e) => setRawTitleInput(e.target.value)}
            className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-amber-700"
          />
        </div>

        {/* Categoria & Vendedor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-stone-800 block mb-1">
              Categoria / Departamento Oficial *
            </label>
            <select
              value={rawCategoryInput}
              onChange={(e) => setRawCategoryInput(e.target.value as ProductCategory)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-amber-700 cursor-pointer"
            >
              {OFFICIAL_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">
              Nome da Loja Parceira / Vendedor
            </label>
            <input
              type="text"
              placeholder="Ex: Loja Oficial Shopee"
              value={rawSellerName}
              onChange={(e) => setRawSellerName(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-700"
            />
          </div>
        </div>

        {/* Preço e Preço De */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-stone-800 block mb-1">
              Preço Promocional (R$) *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: 59,90"
              value={rawPriceInput}
              onChange={(e) => setRawPriceInput(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">
              Preço Original Estimado ("De")
            </label>
            <input
              type="text"
              readOnly
              value={(() => {
                const parsed = parseBRL(rawPriceInput);
                return typeof parsed === 'number' && parsed > 0 ? formatBRL(parsed * 1.35) : 'Calculado auto (+35%)';
              })()}
              className="w-full p-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-500 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Imagem URL com preview */}
        <div>
          <label className="font-bold text-stone-800 block mb-1">
            URL da Foto do Produto
          </label>
          <div className="flex items-center gap-3">
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo..."
              value={rawImageUrl}
              onChange={(e) => setRawImageUrl(e.target.value)}
              className="flex-1 p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:border-amber-700"
            />
            {rawImageUrl && (
              <img
                src={rawImageUrl}
                alt="Preview"
                className="w-12 h-12 rounded-xl object-cover border border-stone-300 shrink-0 shadow-2xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=150&q=80';
                }}
              />
            )}
          </div>
        </div>

        {/* Descrição Curta e Completa */}
        <div className="space-y-3">
          <div>
            <label className="font-bold text-stone-800 block mb-1">
              Descrição Curta (Resumo de 1 frase)
            </label>
            <input
              type="text"
              placeholder="Ex: Proporciona passeios seguros sem puxões com fita confortável."
              value={rawShortDesc}
              onChange={(e) => setRawShortDesc(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">
              Descrição Completa / Detalhes
            </label>
            <textarea
              rows={3}
              placeholder="Detalhes técnicos, materiais, recomendações..."
              value={rawFullDesc}
              onChange={(e) => setRawFullDesc(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-700"
            />
          </div>
        </div>

        {/* Checkboxes & Cupom */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-stone-100">
          <label className="flex items-center gap-2 font-semibold text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={rawFreeShipping}
              onChange={(e) => setRawFreeShipping(e.target.checked)}
              className="rounded text-amber-700 w-4 h-4"
            />
            <span>Frete Grátis</span>
          </label>

          <label className="flex items-center gap-2 font-semibold text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={rawFlashDeal}
              onChange={(e) => setRawFlashDeal(e.target.checked)}
              className="rounded text-amber-700 w-4 h-4"
            />
            <span>Oferta Relâmpago</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700 whitespace-nowrap">Cupom:</span>
            <input
              type="text"
              placeholder="10% OFF"
              value={rawCoupon}
              onChange={(e) => setRawCoupon(e.target.value)}
              className="w-full p-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
            />
          </div>
        </div>

        {/* Submit & Cancel */}
        <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
          {onBackToProducts && (
            <button
              type="button"
              onClick={onBackToProducts}
              className="w-full sm:w-auto px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all order-2 sm:order-1"
            >
              <ArrowLeft className="w-4 h-4 text-stone-500" />
              <span>Cancelar e Voltar aos Produtos</span>
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !rawTitleInput.trim()}
            className="w-full sm:flex-1 py-3 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all order-1 sm:order-2"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Confirmar e Publicar Produto na Vitrine</span>
          </button>
        </div>
      </form>
    </div>
  );
};
