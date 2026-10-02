import React, { useState } from 'react';
import { BlogPost } from '../types';
import { 
  X, 
  Search, 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Flame, 
  ChevronRight,
  Filter
} from 'lucide-react';

interface BlogCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}

export const BlogCatalogModal: React.FC<BlogCatalogModalProps> = ({
  isOpen,
  onClose,
  posts,
  onSelectPost
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  if (!isOpen) return null;

  const categories = ['todos', ...Array.from(new Set(posts.map(p => p.category)))];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'todos' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-900 tracking-tight">
                Blog Achadinhos Pet
              </h2>
              <p className="text-xs text-stone-500">
                Guias práticos, comportamento animal e saúde preventiva
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:px-6 bg-white border-b border-stone-200 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar matérias por tema, saúde felina, dicas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-700 text-stone-900"
            />
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-800 text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat === 'todos' ? 'Todas as Categorias' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-stone-500 space-y-2">
              <p className="text-sm font-semibold">Nenhuma matéria encontrada com esse filtro.</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('todos'); }}
                className="text-xs text-amber-800 hover:underline font-bold"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  onSelectPost(post);
                  onClose();
                }}
                className="p-4 sm:p-5 rounded-2xl border border-stone-200 hover:border-amber-500/50 bg-white hover:bg-amber-50/20 transition-all cursor-pointer group flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
              >
                <div className="flex gap-4 items-start sm:items-center">
                  <div className="w-20 h-20 sm:w-28 sm:h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                      <span className="font-bold text-amber-800">{post.category}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug group-hover:text-amber-800 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="sm:shrink-0 flex items-center justify-end">
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Ler matéria</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 text-center text-xs text-stone-500">
          Total de {filteredPosts.length} {filteredPosts.length === 1 ? 'matéria disponível' : 'matérias disponíveis'}
        </div>
      </div>
    </div>
  );
};
