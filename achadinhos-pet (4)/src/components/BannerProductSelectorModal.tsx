import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { X, Search, CheckCircle2 } from 'lucide-react';
import { formatBRL } from '../utils/currency';

interface BannerProductSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const BannerProductSelectorModal: React.FC<BannerProductSelectorModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const lower = searchTerm.toLowerCase();
    return products.filter(p => p.title.toLowerCase().includes(lower) || p.shortDescription?.toLowerCase().includes(lower));
  }, [products, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100 bg-stone-50/50">
          <div>
            <h3 className="text-xl font-bold text-stone-900">Selecionar Produto</h3>
            <p className="text-sm text-stone-500 mt-1">Escolha um produto para adicionar automaticamente à vitrine rotativa.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-stone-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar produto por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-stone-500">
              Nenhum produto encontrado.
            </div>
          ) : (
            filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="w-full flex items-center gap-4 p-3 rounded-2xl border border-stone-100 hover:border-amber-200 hover:bg-amber-50/50 transition-all text-left group"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                  <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-stone-900 truncate">{product.title}</h4>
                  <p className="text-sm text-stone-500 truncate">{product.shortDescription}</p>
                </div>
                <div className="shrink-0 text-right pr-2">
                  <span className="block font-bold text-emerald-600">
                    {formatBRL(product.price)}
                  </span>
                  <span className="text-xs text-stone-400 flex items-center justify-end gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" /> Selecionar
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
