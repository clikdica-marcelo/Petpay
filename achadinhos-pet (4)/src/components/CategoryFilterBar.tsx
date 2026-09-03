import React from 'react';
import { 
  Flame, 
  Sparkles, 
  Trophy, 
  Star, 
  Zap, 
  TrendingUp,
  Utensils,
  HeartPulse,
  BedDouble,
  Package,
  Shirt,
  Grid,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { ProductCategory } from '../types';
import { OFFICIAL_CATEGORIES } from '../data/mockProducts';

export type CuratedFilterType = 'todos' | 'promocoes' | 'mais_vendidos' | '5_estrelas' | 'novidades' | 'entrega_rapida';

interface CategoryFilterBarProps {
  selectedCategory: ProductCategory | 'todas';
  onSelectCategory: (category: ProductCategory | 'todas') => void;
  activeFilter: CuratedFilterType;
  onSelectFilter: (filter: CuratedFilterType) => void;
  counts: {
    promocoes: number;
    mais_vendidos: number;
    estrelas: number;
    novidades: number;
    entrega_rapida: number;
  };
  totalProductsCount?: number;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  activeFilter,
  onSelectFilter,
  counts,
  totalProductsCount
}) => {
  const getCategoryIcon = (id: ProductCategory) => {
    switch (id) {
      case 'alimentacao':
        return <Utensils className="w-4 h-4" />;
      case 'cuidados_especiais':
        return <Sparkles className="w-4 h-4" />;
      case 'saude_bem_estar':
        return <HeartPulse className="w-4 h-4" />;
      case 'cama_banheiro':
        return <BedDouble className="w-4 h-4" />;
      case 'acessorios':
        return <Package className="w-4 h-4" />;
      case 'outros':
        return <Grid className="w-4 h-4" />;
      default:
        return <Grid className="w-4 h-4" />;
    }
  };

  const highlightFilters: {
    id: CuratedFilterType;
    label: string;
    icon: React.ReactNode;
    count: number;
    activeColor: string;
  }[] = [
    {
      id: 'promocoes',
      label: 'Super Promoções',
      icon: <Flame className="w-3.5 h-3.5 text-rose-500" />,
      count: counts.promocoes,
      activeColor: 'bg-rose-50 border-rose-400 text-rose-800 ring-1 ring-rose-300'
    },
    {
      id: 'mais_vendidos',
      label: 'Mais Vendidos',
      icon: <Trophy className="w-3.5 h-3.5 text-amber-500" />,
      count: counts.mais_vendidos,
      activeColor: 'bg-amber-50 border-amber-400 text-amber-900 ring-1 ring-amber-300'
    },
    {
      id: '5_estrelas',
      label: 'Nota 5.0',
      icon: <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />,
      count: counts.estrelas,
      activeColor: 'bg-amber-50 border-amber-400 text-amber-900 ring-1 ring-amber-300'
    },
    {
      id: 'novidades',
      label: 'Novidades',
      icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />,
      count: counts.novidades,
      activeColor: 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-1 ring-emerald-300'
    },
    {
      id: 'entrega_rapida',
      label: 'Entrega Rápida',
      icon: <Zap className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />,
      count: counts.entrega_rapida,
      activeColor: 'bg-sky-50 border-sky-400 text-sky-900 ring-1 ring-sky-300'
    }
  ];

  const hasActiveFilters = selectedCategory !== 'todas' || activeFilter !== 'todos';

  const resetAll = () => {
    onSelectCategory('todas');
    onSelectFilter('todos');
  };

  return (
    <section id="vitrine-catalogo" className="bg-white border-b border-stone-200 shadow-2xs sticky top-[61px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 space-y-2.5">
        
        {/* Row 1: Categorias Principais (Abas Elegantes) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {/* Todas as Categorias */}
          <button
            onClick={() => onSelectCategory('todas')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedCategory === 'todas'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Todas as Categorias</span>
          </button>

          {/* Categorias Oficiais */}
          {OFFICIAL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-800 text-white font-bold shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
                title={cat.description}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.shortLabel || cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Filtros de Destaque & Oportunidades (Sem duplicação de "Todos") */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 scrollbar-none flex-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider hidden sm:flex items-center gap-1 shrink-0 mr-1">
              <SlidersHorizontal className="w-3 h-3 text-stone-400" />
              Filtrar por:
            </span>

            {highlightFilters.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => onSelectFilter(isActive ? 'todos' : f.id)}
                  className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isActive
                      ? f.activeColor
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <span>{f.icon}</span>
                  <span>{f.label}</span>
                  {f.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive 
                        ? 'bg-white/80 text-stone-900 shadow-2xs' 
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {f.count}
                    </span>
                  )}
                  {isActive && (
                    <X className="w-3 h-3 text-stone-500 hover:text-stone-800 ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Botão para limpar filtros ativos */}
          {hasActiveFilters && (
            <button
              onClick={resetAll}
              className="text-xs text-stone-500 hover:text-rose-600 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-stone-100 transition-colors shrink-0 cursor-pointer"
              title="Limpar todos os filtros"
            >
              <X className="w-3 h-3" />
              <span className="hidden md:inline">Limpar Filtros</span>
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
