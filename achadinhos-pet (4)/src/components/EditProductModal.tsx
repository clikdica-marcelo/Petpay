import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Tag, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  DollarSign, 
  FileText, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { OFFICIAL_CATEGORIES, CATEGORY_LABELS } from '../data/mockProducts';
import { formatBRL, parseBRL, numberToBRLInput } from '../utils/currency';

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        price: numberToBRLInput(product.price),
        originalPrice: product.originalPrice ? numberToBRLInput(product.originalPrice) : undefined
      });
      setSavedSuccess(false);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    const price: number | string = parseBRL(formData.price) || product.price;

    const rawOrig = formData.originalPrice !== undefined && formData.originalPrice !== null ? String(formData.originalPrice).trim() : '';
    const originalPrice: number | string | undefined = rawOrig === '' 
      ? (typeof price === 'number' ? Number((price * 1.3).toFixed(2)) : undefined) 
      : parseBRL(rawOrig);

    const discount = (typeof price === 'number' && typeof originalPrice === 'number' && originalPrice > price) 
      ? Math.round(((originalPrice - price) / originalPrice) * 100) 
      : (formData.discountPercent || 20);

    const updated: Product = {
      ...product,
      title: formData.title.trim(),
      price,
      originalPrice,
      discountPercent: discount,
      category: formData.category || product.category,
      imageUrl: formData.imageUrl?.trim() || product.imageUrl,
      shopeeUrl: formData.shopeeUrl?.trim() || product.shopeeUrl,
      affiliateUrl: formData.affiliateUrl?.trim() || formData.shopeeUrl?.trim() || product.affiliateUrl,
      sellerName: formData.sellerName?.trim() || product.sellerName || 'Loja Oficial Shopee',
      shortDescription: formData.shortDescription?.trim() || product.shortDescription,
      fullDescription: formData.fullDescription?.trim() || product.fullDescription,
      freeShipping: formData.freeShipping !== undefined ? formData.freeShipping : product.freeShipping,
      isFlashDeal: formData.isFlashDeal !== undefined ? formData.isFlashDeal : product.isFlashDeal,
      couponAvailable: formData.couponAvailable?.trim() || product.couponAvailable
    };

    onSave(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-60 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 text-stone-800 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-t-3xl flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Editar Detalhes do Produto</h3>
              <p className="text-xs text-stone-400">Atualize título, preço, link de afiliado, foto e categoria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs flex-1 overflow-y-auto">
          
          {/* Title */}
          <div>
            <label className="font-bold text-stone-800 block mb-1">Título do Produto:</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
            />
          </div>

          {/* Price & Original Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-stone-800">Preço Atual (Padrão BR: 49,90 ou 1.250,50):</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, price: 'Preços Variados' })}
                  className="text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                >
                  + Inserir "Preços Variados"
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: 49,90 ou 1.250,50"
                  value={formData.price ?? ''}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-3 pr-24 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-amber-900 focus:bg-white focus:outline-none focus:border-amber-700"
                />
                {formData.price && (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 pointer-events-none">
                    {formatBRL(formData.price)}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-stone-400 mt-1">
                Centavos com <strong>vírgula (,)</strong> e milhares com <strong>ponto (.)</strong>
              </p>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">Preço Original / De (R$):</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: 69,90"
                  value={formData.originalPrice ?? ''}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full pl-3 pr-24 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-600 focus:bg-white focus:outline-none focus:border-amber-700 font-medium"
                />
                {formData.originalPrice && (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200 pointer-events-none">
                    {formatBRL(formData.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-stone-400 mt-1">
                Preço 'De' antes do desconto
              </p>
            </div>
          </div>

          {/* Department / Category & Seller */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-800 block mb-1">Departamento / Categoria:</label>
              <select
                value={formData.category || 'alimentacao'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-amber-700"
              >
                {OFFICIAL_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">Nome do Vendedor / Loja:</label>
              <input
                type="text"
                value={formData.sellerName || ''}
                onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                placeholder="Ex: Loja Oficial Shopee"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          {/* Shopee URL & Image URL */}
          <div className="space-y-3">
            <div>
              <label className="font-bold text-stone-800 block mb-1">Link do Produto (Shopee / Loja):</label>
              <input
                type="url"
                value={formData.shopeeUrl || ''}
                onChange={(e) => setFormData({ ...formData, shopeeUrl: e.target.value, affiliateUrl: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:border-amber-700"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">URL da Imagem / Foto:</label>
              <div className="flex items-center gap-3">
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:border-amber-700"
                />
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-10 h-10 rounded-lg object-cover border border-stone-300 shrink-0"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=200&q=80'; }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-3">
            <div>
              <label className="font-bold text-stone-800 block mb-1">Descrição Curta:</label>
              <input
                type="text"
                value={formData.shortDescription || ''}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-700"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">Descrição Completa:</label>
              <textarea
                rows={3}
                value={formData.fullDescription || ''}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          {/* Flags / Checkboxes */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-stone-200">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={formData.freeShipping ?? true}
                onChange={(e) => setFormData({ ...formData, freeShipping: e.target.checked })}
                className="rounded text-amber-700 focus:ring-amber-700"
              />
              <span>Frete Grátis Disponível</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={formData.isFlashDeal ?? false}
                onChange={(e) => setFormData({ ...formData, isFlashDeal: e.target.checked })}
                className="rounded text-amber-700 focus:ring-amber-700"
              />
              <span>Oferta Relâmpago (Flash Deal)</span>
            </label>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Produto atualizado com sucesso!</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm cursor-pointer transition-all"
            >
              <Save className="w-4 h-4 text-amber-200" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
