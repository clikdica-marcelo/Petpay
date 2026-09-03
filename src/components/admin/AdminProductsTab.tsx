import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Layers, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Tag, 
  Filter, 
  X,
  Sparkles
} from 'lucide-react';
import { Product, ProductCategory } from '../../types';
import { OFFICIAL_CATEGORIES, CATEGORY_LABELS } from '../../data/mockProducts';
import { formatBRL } from '../../utils/currency';

interface AdminProductsTabProps {
  products: Product[];
  onOpenAddProduct: () => void;
  onOpenBulkImport: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  products,
  onOpenAddProduct,
  onOpenBulkImport,
  onEditProduct,
  onDeleteProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        !term || 
        p.title.toLowerCase().includes(term) ||
        (p.sellerName && p.sellerName.toLowerCase().includes(term)) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(term));

      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleDeleteConfirm = (id: string) => {
    onDeleteProduct(id);
    setProductToDelete(null);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Action Header & Search Controls */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-700" />
              <span>Catálogo de Produtos</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                {products.length} itens cadastrados
              </span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Pesquise, filtre, edite preços ou remova produtos da vitrine oficial.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddProduct}
              className="px-3.5 py-2 bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Produto</span>
            </button>
            <button
              onClick={onOpenBulkImport}
              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs border border-amber-500/30 transition-colors cursor-pointer"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Importar Lote</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-stone-100">
          {/* Search field */}
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por título, loja parceira ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-700 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 focus:bg-white focus:outline-none focus:border-amber-700 cursor-pointer transition-colors"
            >
              <option value="all">Todas as Categorias ({products.length})</option>
              {OFFICIAL_CATEGORIES.map((cat) => {
                const count = products.filter((p) => p.category === cat.id).length;
                return (
                  <option key={cat.id} value={cat.id}>
                    {cat.shortLabel || cat.label} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
          <span>
            Exibindo <strong>{filteredProducts.length}</strong> de {products.length} produtos
          </span>
          {(searchTerm || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="text-amber-800 hover:underline font-semibold cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Delete confirmation alert dialog if active */}
      {productToDelete && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="text-xs">
            <strong>Confirma a exclusão deste produto?</strong>
            <p className="text-rose-700 text-[11px]">
              O item será removido da vitrine imediatamente.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setProductToDelete(null)}
              className="px-3 py-1.5 bg-white border border-rose-200 text-stone-700 hover:bg-stone-50 font-bold text-xs rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleDeleteConfirm(productToDelete)}
              className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-lg cursor-pointer"
            >
              Sim, Excluir
            </button>
          </div>
        </div>
      )}

      {/* Products Table Container */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 font-bold text-stone-600">
              <tr>
                <th className="p-3 w-14 text-center">Foto</th>
                <th className="p-3">Título & Loja</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Preço</th>
                <th className="p-3 text-center">Destaques</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const catInfo = CATEGORY_LABELS[p.category] || { label: p.category, shortLabel: p.category };
                  return (
                    <tr key={p.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="p-3 text-center">
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=150&q=80';
                          }}
                          className="w-11 h-11 rounded-xl object-cover border border-stone-200 mx-auto shadow-2xs"
                        />
                      </td>
                      <td className="p-3 max-w-xs">
                        <div className="font-bold text-stone-900 truncate" title={p.title}>
                          {p.title}
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                          <span>{p.sellerName || 'Loja Parceira'}</span>
                          {p.shopeeUrl && (
                            <a
                              href={p.shopeeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-amber-700 hover:text-amber-900 inline-flex items-center"
                              title="Ver na loja"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-md bg-stone-100 text-stone-700 font-semibold text-[11px] border border-stone-200/60 whitespace-nowrap">
                          {catInfo.shortLabel || catInfo.label}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-extrabold text-amber-900">
                          {formatBRL(p.price)}
                        </div>
                        {p.originalPrice && Number(p.originalPrice) > Number(p.price) && (
                          <div className="text-[10px] text-stone-400 line-through">
                            {formatBRL(p.originalPrice)}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          {p.freeShipping && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800" title="Frete Grátis">
                              Frete Free
                            </span>
                          )}
                          {p.isFlashDeal && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800" title="Oferta Relâmpago">
                              ⚡ Flash
                            </span>
                          )}
                          {p.couponAvailable && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-600" title={`Cupom: ${p.couponAvailable}`}>
                              🏷️ {p.couponAvailable}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEditProduct(p)}
                            className="px-2.5 py-1.5 text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 rounded-lg cursor-pointer transition-colors flex items-center gap-1 font-bold text-xs"
                            title="Editar informações do produto"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(p.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                            title="Remover produto do catálogo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    <Package className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="font-semibold text-stone-600">Nenhum produto encontrado</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Tente ajustar sua busca ou mudar a categoria selecionada.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
