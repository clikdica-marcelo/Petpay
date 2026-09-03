import React, { useState } from 'react';
import { Banner } from '../types';
import { X, Sparkles, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

interface BannerManagerModalProps {
  editingBanner?: Banner | null;
  prefillBanner?: Banner | null;
  setEditingBanner?: (b: Banner | null) => void;
  isOpen: boolean;
  onClose: () => void;
  banners: Banner[];
  onAddBanner: (banner: Banner) => void;
  onUpdateBanner: (banner: Banner) => void;
  onDeleteBanner: (bannerId: string) => void;
}

export const BannerManagerModal: React.FC<BannerManagerModalProps> = ({
  isOpen,
  onClose,
  banners,
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
  editingBanner: externalEditingBanner,
  setEditingBanner: externalSetEditingBanner,
  prefillBanner,
}) => {
  const [internalEditingBanner, setInternalEditingBanner] = useState<Banner | null>(null);
  const editingBanner = externalEditingBanner !== undefined ? externalEditingBanner : internalEditingBanner;
  const setEditingBanner = externalSetEditingBanner || setInternalEditingBanner;
  const [bannerForm, setBannerForm] = useState<Partial<Banner>>({
    title: '',
    subtitle: '',
    ctaText: '',
    image: '',
    categoryTarget: undefined,
    discountBadge: '',
    badgeColor: 'bg-emerald-600 text-white',
    bgGradient: 'from-stone-900 via-amber-900 to-stone-950',
  });

  // Sync external banner to form
  React.useEffect(() => {
    if (externalEditingBanner) {
      setBannerForm({ ...externalEditingBanner });
    } else if (prefillBanner) {
      setBannerForm({ ...prefillBanner, id: '' });
    } else {
      setBannerForm({
        title: '', subtitle: '', ctaText: '', image: '', categoryTarget: undefined, discountBadge: '', badgeColor: 'bg-emerald-600 text-white', bgGradient: 'from-stone-900 via-amber-900 to-stone-950',
      });
    }
  }, [externalEditingBanner, prefillBanner]);

  if (!isOpen) return null;

  const handleStartEditBanner = (b: Banner) => {
    setEditingBanner(b);
    setBannerForm({ ...b });
  };

  const handleSaveBanner = () => {
    if (!bannerForm.title || !bannerForm.image) {
      alert('Título e Imagem são obrigatórios para o Quadro/Banner.');
      return;
    }

    if (editingBanner) {
      onUpdateBanner({
        ...(editingBanner as Banner),
        ...bannerForm,
      } as Banner);
    } else {
      const newB: Banner = {
        ...(bannerForm as Banner),
        id: `banner-${Date.now()}`,
      };
      onAddBanner(newB);
    }

    setEditingBanner(null);
    setBannerForm({
      title: '',
      subtitle: '',
      ctaText: '',
      image: '',
      categoryTarget: undefined,
      discountBadge: '',
      badgeColor: 'bg-emerald-600 text-white',
      bgGradient: 'from-stone-900 via-amber-900 to-stone-950',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center border border-amber-200">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-900 tracking-tight">Quadros / Banners do Hero</h2>
              <p className="text-xs font-semibold text-stone-500 mt-0.5">Gerencie os banners rotativos da vitrine.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-stone-200 transition-colors text-stone-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Gerenciamento dos Quadros</h3>
                <p className="text-xs text-stone-500">Edite detalhes ou remova quadros promocionais da vitrine do topo.</p>
              </div>
            </div>

            {/* Edit Banner Form (shown when editing a banner) */}
            {editingBanner && (
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-stone-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Editar Quadro: <span className="text-amber-900">{editingBanner.title}</span>
                  </h4>
                  <button
                    onClick={() => {
                      setEditingBanner(null);
                      setBannerForm({
                        title: '',
                        subtitle: '',
                        ctaText: '',
                        image: '',
                        categoryTarget: undefined,
                        discountBadge: '',
                        badgeColor: 'bg-emerald-600 text-white',
                        bgGradient: 'from-stone-900 via-amber-900 to-stone-950',
                      });
                    }}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-700 underline cursor-pointer"
                  >
                    Cancelar Edição
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  
                  {/* Imagem (URL) */}
                  <div className="sm:col-span-2">
                    <label className="font-bold text-stone-800 block mb-1">URL da Imagem (Preferência sem fundo ou paisagem) *</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={bannerForm.image || ''}
                      onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                    {bannerForm.image && (
                      <div className="mt-2 relative w-full h-32 rounded-xl bg-stone-100 overflow-hidden border border-stone-200">
                        <img src={bannerForm.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Título Principal */}
                  <div>
                    <label className="font-bold text-stone-800 block mb-1">Título Principal *</label>
                    <input
                      type="text"
                      placeholder="Ex: Semana Tech"
                      value={bannerForm.title || ''}
                      onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Subtítulo */}
                  <div>
                    <label className="font-bold text-stone-800 block mb-1">Subtítulo (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ex: Até 50% de Desconto"
                      value={bannerForm.subtitle || ''}
                      onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Texto do Botão (CTA) */}
                  <div>
                    <label className="font-bold text-stone-800 block mb-1">Texto do Botão (CTA) (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ex: Melhor Preço R$ 83,59"
                      value={bannerForm.ctaText || ''}
                      onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Tag de Desconto (Badge) */}
                  <div>
                    <label className="font-bold text-stone-800 block mb-1">Tag de Desconto / Badge (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ex: MEGA OFERTA"
                      value={bannerForm.discountBadge || ''}
                      onChange={(e) => setBannerForm({ ...bannerForm, discountBadge: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Filtro de Categoria Alvo */}
                  <div>
                    <label className="font-bold text-stone-800 block mb-1">Filtro de Categoria (Ao Clicar)</label>
                    <select
                      value={bannerForm.categoryTarget || ''}
                      onChange={(e) => setBannerForm({ ...bannerForm, categoryTarget: e.target.value || undefined })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="">(Nenhum - Mantém Filtro Atual)</option>
                      <option value="Beleza & Cuidado Pessoal">Beleza & Cuidado Pessoal</option>
                      <option value="Eletrônicos & Acessórios">Eletrônicos & Acessórios</option>
                      <option value="Casa & Decoração">Casa & Decoração</option>
                      <option value="Moda & Acessórios">Moda & Acessórios</option>
                      <option value="Pets">Pets</option>
                      <option value="Infantil & Brinquedos">Infantil & Brinquedos</option>
                      <option value="Saúde & Bem-Estar">Saúde & Bem-Estar</option>
                      <option value="Esporte & Lazer">Esporte & Lazer</option>
                    </select>
                  </div>

                  {/* Cor de Fundo / Degradê */}
                  <div>
                    <label className="font-bold text-stone-800 block mb-1">Cor de Fundo (Classes Tailwind CSS)</label>
                    <input
                      type="text"
                      placeholder="Ex: from-blue-900 to-indigo-900"
                      value={bannerForm.bgGradient || ''}
                      onChange={(e) => setBannerForm({ ...bannerForm, bgGradient: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono text-[10px]"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="sm:col-span-2 pt-2">
                    <button
                      onClick={handleSaveBanner}
                      className="w-full py-3 bg-amber-900 hover:bg-amber-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Salvar Alterações do Quadro
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* Banners List */}
            <div>
              <h4 className="text-xs font-bold text-stone-800 mb-3">Quadros Cadastrados ({banners.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {banners.map((b) => (
                  <div key={b.id} className="relative rounded-2xl border border-stone-200 overflow-hidden bg-white shadow-sm flex flex-col group">
                    <div className="h-24 bg-stone-100 w-full relative">
                      <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-xs font-bold truncate">{b.title}</p>
                        {b.subtitle && <p className="text-stone-300 text-[10px] truncate">{b.subtitle}</p>}
                      </div>
                    </div>
                    <div className="p-3 text-[10px] flex items-center justify-between bg-white">
                      <div>
                        <p className="text-stone-500 font-semibold mb-0.5">Destino: <span className="text-stone-800">{b.categoryTarget || 'Todos'}</span></p>
                        <p className="font-mono text-stone-400 truncate max-w-[120px]">{b.bgGradient}</p>
                      </div>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEditBanner(b)}
                          className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (true) {
                              onDeleteBanner(b.id);
                            }
                          }}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors cursor-pointer"
                          title="Remover"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {banners.length === 0 && (
                  <div className="sm:col-span-2 p-6 text-center text-stone-400 text-xs bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                    Nenhum quadro cadastrado.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
