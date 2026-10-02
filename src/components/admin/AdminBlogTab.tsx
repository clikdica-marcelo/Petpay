import React, { useState } from 'react';
import { BlogPost, Product } from '../../types';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  Save,
  X,
  FileText,
  Clock,
  Tag
} from 'lucide-react';

interface AdminBlogTabProps {
  posts: BlogPost[];
  onAddPost: (post: BlogPost) => void;
  onUpdatePost: (post: BlogPost) => void;
  onDeletePost: (postId: string) => void;
  onPreviewPost: (post: BlogPost) => void;
  allProducts: Product[];
}

export const AdminBlogTab: React.FC<AdminBlogTabProps> = ({
  posts,
  onAddPost,
  onUpdatePost,
  onDeletePost,
  onPreviewPost,
  allProducts
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<BlogPost>>({});

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleStartEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData(post);
    setIsEditing(true);
  };

  const handleStartNew = () => {
    setSelectedPost(null);
    setFormData({
      id: `post-${Date.now()}`,
      slug: `novo-artigo-${Date.now()}`,
      title: '',
      subtitle: '',
      excerpt: '',
      category: 'Saúde & Bem-Estar',
      readTime: '3 min',
      publishDate: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
      author: {
        name: 'Equipe Achadinhos Pet',
        role: 'Curadoria & Bem-Estar Pet'
      },
      coverImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80',
      tags: ['Saúde', 'Cuidados', 'Dicas'],
      recommendedProductIds: ['pet-saude-001'],
      featured: false,
      seoDescription: '',
      seoKeywords: ['pet', 'cuidados pet', 'dicas'],
      contentSections: [
        {
          type: 'paragraph',
          text: 'Comece a escrever seu artigo aqui...'
        }
      ]
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert('Por favor, informe o título do artigo.');
      return;
    }

    const postToSave: BlogPost = {
      id: formData.id || `post-${Date.now()}`,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: formData.title || '',
      subtitle: formData.subtitle || '',
      excerpt: formData.excerpt || '',
      category: formData.category || 'Saúde & Bem-Estar',
      readTime: formData.readTime || '3 min',
      publishDate: formData.publishDate || new Date().toLocaleDateString('pt-BR'),
      author: formData.author || { name: 'Equipe Achadinhos Pet', role: 'Especialista Pet' },
      coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80',
      tags: formData.tags || ['pet'],
      recommendedProductIds: formData.recommendedProductIds || [],
      featured: !!formData.featured,
      seoDescription: formData.seoDescription || formData.excerpt || '',
      seoKeywords: formData.seoKeywords || ['pet'],
      contentSections: formData.contentSections || [
        { type: 'paragraph', text: formData.excerpt || '' }
      ]
    };

    if (selectedPost) {
      onUpdatePost(postToSave);
      showToast('Artigo atualizado com sucesso!');
    } else {
      onAddPost(postToSave);
      showToast('Novo artigo publicado com sucesso!');
    }

    setIsEditing(false);
    setSelectedPost(null);
  };

  const handleToggleFeatured = (post: BlogPost) => {
    const updated = { ...post, featured: !post.featured };
    onUpdatePost(updated);
    showToast(`Destaque ${updated.featured ? 'ativado' : 'desativado'} para "${post.title.slice(0, 25)}..."`);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
        <div>
          <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <span>Gestão do Blog & Conteúdo Pet</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Crie e gerencie matérias com alta curiosidade e gatilhos de conversão para afiliados.
          </p>
        </div>

        <button
          onClick={handleStartNew}
          className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Escrever Nova Matéria</span>
        </button>
      </div>

      {/* Editor Modal / Drawer */}
      {isEditing && (
        <div className="p-6 rounded-2xl bg-white border border-amber-300 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-700" />
              <span>{selectedPost ? 'Editar Matéria' : 'Nova Matéria do Blog'}</span>
            </h4>
            <button
              onClick={() => setIsEditing(false)}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Título da Matéria (Chamativo)</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: O Segredo Felino que Evita o Veterinário..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Categoria</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Saúde Felina, Comportamento, Nutrição..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tempo de Leitura</label>
                <input
                  type="text"
                  value={formData.readTime || ''}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  placeholder="Ex: 4 min"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Subtítulo Explicativo</label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Ex: Entenda o instinto ancestral do deserto..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Resumo Curto (Aparece nos Cards)</label>
                <textarea
                  rows={2}
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Um pequeno parágrafo atraente que desperte curiosidade..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">URL da Imagem de Capa</label>
                <input
                  type="text"
                  value={formData.coverImage || ''}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-700"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={!!formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded text-amber-800 focus:ring-amber-700"
                />
                <label htmlFor="featured-check" className="text-xs font-bold text-stone-800 cursor-pointer">
                  Marcar como Matéria de Capa / Destaque Principal
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Artigo</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="p-4 bg-stone-50/70 border-b border-stone-200 text-xs font-bold text-stone-600 flex items-center justify-between">
          <span>Artigos Cadastrados ({posts.length})</span>
          <span className="text-[11px] text-stone-400 font-normal">Exibidos na Home e no Blog</span>
        </div>

        <div className="divide-y divide-stone-100">
          {posts.map((post) => (
            <div 
              key={post.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-1">
                    <span className="font-bold text-amber-800">{post.category}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                    {post.featured && (
                      <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        ★ Em Destaque
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => onPreviewPost(post)}
                  className="p-2 rounded-xl text-stone-600 hover:text-amber-800 hover:bg-stone-100 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Visualizar Artigo"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden md:inline">Ver</span>
                </button>
                <button
                  onClick={() => handleToggleFeatured(post)}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    post.featured 
                      ? 'bg-amber-100 text-amber-900' 
                      : 'text-stone-500 hover:bg-stone-100'
                  }`}
                  title={post.featured ? 'Remover do destaque principal' : 'Tornar destaque principal'}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden md:inline">{post.featured ? 'Destaque' : 'Destacar'}</span>
                </button>
                <button
                  onClick={() => handleStartEdit(post)}
                  className="p-2 rounded-xl text-stone-600 hover:text-blue-700 hover:bg-stone-100 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Editar Artigo"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                {posts.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Tem certeza que deseja excluir o artigo "${post.title}"?`)) {
                        onDeletePost(post.id);
                        showToast('Artigo excluído.');
                      }
                    }}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 text-xs transition-colors cursor-pointer"
                    title="Excluir Artigo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
