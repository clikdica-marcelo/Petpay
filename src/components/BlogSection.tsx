import React from 'react';
import { BlogPost } from '../types';
import { PetAchadinhosLogo } from './PetAchadinhosLogo';
import { 
  BookOpen, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Flame, 
  ChevronRight,
  Heart,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

interface BlogSectionProps {
  posts: BlogPost[];
  onOpenPost: (post: BlogPost) => void;
  onOpenAllPosts?: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  posts,
  onOpenPost,
  onOpenAllPosts
}) => {
  if (!posts || posts.length === 0) return null;

  const featuredPost = posts.find(p => p.featured) || posts[0];
  const otherPosts = posts.filter(p => p.id !== featuredPost.id).slice(0, 3);

  return (
    <section className="bg-white py-14 border-b border-stone-200" id="blog-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-amber-800 uppercase tracking-wider mb-1.5">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Blog & Dicas Pet</span>
              <span className="text-stone-300">·</span>
              <span className="text-rose-600 font-extrabold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-rose-600" />
                Matéria em Destaque
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Curiosidades, Saúde & Segredos Pet
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
              Conteúdos práticos, respaldados por veterinários, para cuidar melhor do seu pet e economizar nas escolhas certas.
            </p>
          </div>

          {onOpenAllPosts && posts.length > 1 && (
            <button
              onClick={onOpenAllPosts}
              className="text-xs sm:text-sm font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1.5 cursor-pointer self-start md:self-auto group"
            >
              <span>Ver todos os artigos ({posts.length})</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* Featured Debut Post - Magazine Style Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Hero Article Card */}
          <div 
            onClick={() => onOpenPost(featuredPost)}
            className="lg:col-span-8 bg-stone-900 text-white rounded-3xl overflow-hidden shadow-lg border border-stone-800 hover:border-amber-500/60 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="relative aspect-video sm:aspect-[21/9] lg:aspect-[16/8] overflow-hidden">
              <img 
                src={featuredPost.coverImage} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
              
              {/* Badge Over Image */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500 text-stone-950 shadow-md">
                  Estreia do Blog
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                  {featuredPost.readTime}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-2">
                  <span>{featuredPost.category}</span>
                  <span className="text-stone-600">·</span>
                  <span className="text-stone-400">{featuredPost.publishDate}</span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug group-hover:text-amber-300 transition-colors">
                  {featuredPost.title}
                </h3>

                <p className="text-stone-300 text-xs sm:text-sm mt-3 leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 p-1 shadow-xs flex items-center justify-center shrink-0">
                    <PetAchadinhosLogo size="xs" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white leading-none">{featuredPost.author.name}</p>
                      <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded-full border border-amber-500/30">
                        Oficial
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-0.5">{featuredPost.author.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                  <span>Ler Matéria Completa</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Posts Column */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            {otherPosts.map((post) => (
              <div 
                key={post.id}
                onClick={() => onOpenPost(post)}
                className="bg-stone-50 hover:bg-amber-50/40 rounded-2xl p-4 border border-stone-200 hover:border-amber-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-stone-500 mb-1.5 font-medium">
                    <span className="font-bold text-amber-800">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base leading-snug group-hover:text-amber-900 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-1.5 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-amber-800 font-bold">
                  <span>Continuar lendo</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}

            {/* Newsletter or Curated Tips Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-100/90 to-amber-50 border border-amber-200 text-amber-950 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <h4 className="font-bold text-xs uppercase tracking-wider">Curadoria Semanal Grátis</h4>
              </div>
              <p className="text-xs leading-relaxed text-amber-900">
                Novas matérias, achadinhos e cupons verificados são publicados toda semana aqui no <strong>Achadinhos Pet</strong>!
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
