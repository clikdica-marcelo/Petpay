import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Check, 
  ArrowRight,
  Palette,
  X
} from 'lucide-react';
import { Banner, ProductCategory } from '../../types';
import { OFFICIAL_CATEGORIES } from '../../data/mockProducts';

interface AdminBannersTabProps {
  banners: Banner[];
  onAddBanner?: (banner: Banner) => void;
  onUpdateBanner?: (banner: Banner) => void;
  onDeleteBanner?: (bannerId: string) => void;
}

export const AdminBannersTab: React.FC<AdminBannersTabProps> = ({
  banners = [],
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
}) => {
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCtaText, setFormCtaText] = useState('Ver Ofertas');
  const [formImage, setFormImage] = useState('');
  const [formBadge, setFormBadge] = useState('Destaque da Semana');
  const [formBadgeColor, setFormBadgeColor] = useState('bg-emerald-600 text-white');
  const [formBgGradient, setFormBgGradient] = useState('from-stone-900 via-amber-900 to-stone-950');
  const [formHighlightBadge, setFormHighlightBadge] = useState('Até 40% OFF');
  const [formCategoryTarget, setFormCategoryTarget] = useState<ProductCategory | undefined>(undefined);

  const handleStartEdit = (b: Banner) => {
    setEditingBanner(b);
    setIsCreatingNew(false);
    setFormTitle(b.title);
    setFormSubtitle(b.subtitle);
    setFormCtaText(b.ctaText);
    setFormImage(b.image);
    setFormBadge(b.badge || 'Destaque');
    setFormBadgeColor(b.badgeColor || 'bg-emerald-600 text-white');
    setFormBgGradient(b.bgGradient || 'from-stone-900 via-amber-900 to-stone-950');
    setFormHighlightBadge(b.highlightBadge || '');
    setFormCategoryTarget(b.categoryTarget);
  };

  const handleStartCreate = () => {
    setEditingBanner(null);
    setIsCreatingNew(true);
    setFormTitle('');
    setFormSubtitle('');
    setFormCtaText('Ver Ofertas');
    setFormImage('https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80');
    setFormBadge('Campanha Especial');
    setFormBadgeColor('bg-amber-600 text-white');
    setFormBgGradient('from-stone-900 via-amber-950 to-stone-900');
    setFormHighlightBadge('Frete Grátis');
    setFormCategoryTarget(undefined);
  };

  const handleCancelForm = () => {
    setEditingBanner(null);
    setIsCreatingNew(false);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingBanner && onUpdateBanner) {
      onUpdateBanner({
        ...editingBanner,
        title: formTitle.trim(),
        subtitle: formSubtitle.trim(),
        ctaText: formCtaText.trim() || 'Ver Ofertas',
        image: formImage.trim() || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80',
        badge: formBadge.trim(),
        badgeColor: formBadgeColor,
        bgGradient: formBgGradient,
        highlightBadge: formHighlightBadge.trim(),
        categoryTarget: formCategoryTarget as any,
      });
    } else if (onAddBanner) {
      const newBanner: Banner = {
        id: `banner-${Date.now()}`,
        title: formTitle.trim(),
        subtitle: formSubtitle.trim(),
        ctaText: formCtaText.trim() || 'Ver Ofertas',
        image: formImage.trim() || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80',
        badge: formBadge.trim(),
        badgeColor: formBadgeColor,
        bgGradient: formBgGradient,
        highlightBadge: formHighlightBadge.trim(),
        categoryTarget: formCategoryTarget as any,
      };
      onAddBanner(newBanner);
    }

    handleCancelForm();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-700" />
            <span>Banners & Destaques da Vitrine</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
              {banners.length} ativos
            </span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Personalize os slides rotativos do topo com fotos, títulos e filtros por categoria.
          </p>
        </div>

        {!isCreatingNew && !editingBanner && (
          <button
            onClick={handleStartCreate}
            className="px-3.5 py-2 bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Banner</span>
          </button>
        )}
      </div>

      {/* Editor / Form if creating or editing */}
      {(isCreatingNew || editingBanner) && (
        <form onSubmit={handleSaveForm} className="bg-white p-6 rounded-2xl border-2 border-amber-500/60 shadow-md space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{editingBanner ? 'Editar Banner' : 'Criar Novo Banner'}</span>
            </h4>
            <button
              type="button"
              onClick={handleCancelForm}
              className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-stone-800 block mb-1">Título Principal *</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ex: Tudo para Cães e Gatos"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-amber-700"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">Subtítulo / Chamada</label>
              <input
                type="text"
                value={formSubtitle}
                onChange={(e) => setFormSubtitle(e.target.value)}
                placeholder="Ex: As melhores ofertas selecionadas com frete rápido"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-stone-800 block mb-1">Texto do Botão (CTA)</label>
              <input
                type="text"
                value={formCtaText}
                onChange={(e) => setFormCtaText(e.target.value)}
                placeholder="Ex: Ver Ofertas"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-700"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">Badge Superior</label>
              <input
                type="text"
                value={formBadge}
                onChange={(e) => setFormBadge(e.target.value)}
                placeholder="Ex: Destaque da Semana"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">Selo de Desconto / Oferta</label>
              <input
                type="text"
                value={formHighlightBadge}
                onChange={(e) => setFormHighlightBadge(e.target.value)}
                placeholder="Ex: Até 50% OFF"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">URL da Foto de Fundo</label>
            <input
              type="url"
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-800 block mb-1">Filtro de Categoria (Ao Clicar)</label>
              <select
                value={formCategoryTarget || ''}
                onChange={(e) => setFormCategoryTarget((e.target.value as ProductCategory) || undefined)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-amber-700 cursor-pointer"
              >
                <option value="">(Nenhum - Todos os Produtos)</option>
                {OFFICIAL_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">Degradê de Fundo (Tailwind)</label>
              <select
                value={formBgGradient}
                onChange={(e) => setFormBgGradient(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-amber-700 cursor-pointer"
              >
                <option value="from-stone-900 via-amber-900 to-stone-950">Âmbar & Stone Escuro (Padrão)</option>
                <option value="from-amber-800 via-stone-900 to-amber-950">Dourado Intenso & Preto</option>
                <option value="from-emerald-900 via-stone-900 to-emerald-950">Verde Saúde & Floresta</option>
                <option value="from-indigo-950 via-purple-950 to-stone-900">Noite & Conforto</option>
              </select>
            </div>
          </div>

          {/* Banner Live Preview */}
          <div className="p-3 bg-stone-100 rounded-xl">
            <span className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">
              Pré-visualização do Banner:
            </span>
            <div className={`p-4 rounded-xl text-white bg-gradient-to-r ${formBgGradient} flex items-center justify-between gap-4 overflow-hidden relative shadow-inner`}>
              <div className="relative z-10 space-y-1 max-w-sm">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {formBadge || 'Badge'}
                </span>
                <h5 className="font-bold text-sm text-white">{formTitle || 'Título do Banner'}</h5>
                <p className="text-[11px] text-stone-300">{formSubtitle || 'Subtítulo ilustrativo'}</p>
                <span className="inline-block px-3 py-1 bg-amber-600 font-bold text-[10px] rounded-lg mt-1">
                  {formCtaText}
                </span>
              </div>
              {formImage && (
                <img
                  src={formImage}
                  alt="Preview"
                  className="w-20 h-20 rounded-xl object-cover border border-white/20 shrink-0"
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancelForm}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingBanner ? 'Salvar Alterações' : 'Criar Banner'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Existing Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((b) => (
          <div
            key={b.id}
            className="p-5 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  {b.badge || 'Destaque'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(b)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                    title="Editar banner"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {onDeleteBanner && banners.length > 1 && (
                    <button
                      onClick={() => onDeleteBanner(b.id)}
                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                      title="Excluir banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <h4 className="font-bold text-stone-900 text-sm">{b.title}</h4>
              <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">{b.subtitle}</p>
            </div>

            {/* Visual thumbnail */}
            <div className={`p-3 rounded-xl bg-gradient-to-r ${b.bgGradient} text-white flex items-center justify-between text-xs`}>
              <span className="font-bold text-amber-300">{b.ctaText || 'Ver Ofertas'}</span>
              {b.image && (
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-12 h-12 rounded-lg object-cover border border-white/20"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
