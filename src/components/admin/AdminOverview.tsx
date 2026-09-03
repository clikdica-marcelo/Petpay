import React from 'react';
import { 
  Package, 
  PlusCircle, 
  Layers, 
  Image as ImageIcon, 
  BarChart3, 
  Users, 
  Settings, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Cloud, 
  Download, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Product, Banner, UserAccount } from '../../types';

export type AdminSection = 
  | 'overview' 
  | 'products' 
  | 'add_product' 
  | 'banners' 
  | 'analytics' 
  | 'users' 
  | 'settings';

interface AdminOverviewProps {
  products: Product[];
  banners?: Banner[];
  registeredUsers: UserAccount[];
  analyticsData: any;
  supabaseStatus: {
    configured: boolean;
    connected: boolean;
    url?: string | null;
    totalProducts?: number;
    message?: string;
  } | null;
  onNavigate: (section: AdminSection) => void;
  onOpenBulkImport: () => void;
  onDownloadBackup: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  products,
  banners = [],
  registeredUsers,
  analyticsData,
  supabaseStatus,
  onNavigate,
  onOpenBulkImport,
  onDownloadBackup,
}) => {
  const modules = [
    {
      id: 'products' as AdminSection,
      title: 'Catálogo de Produtos',
      description: 'Gerencie a vitrine, cadastre novos produtos, importe em lote, edite preços e categorias.',
      badge: `${products.length} produtos cadastrados`,
      icon: Package,
      iconColor: 'text-amber-700 bg-amber-100',
      actionLabel: 'Abrir Produtos',
    },
    {
      id: 'bulk_import' as any,
      title: 'Importação em Lote / Planilha',
      description: 'Importe dezenas de produtos colando múltiplos links ou importando arquivo JSON.',
      badge: 'Alta Produtividade',
      icon: Layers,
      iconColor: 'text-stone-800 bg-stone-100',
      actionLabel: 'Abrir Importador ⚡',
      isCustomAction: true,
      onClick: onOpenBulkImport,
    },
    {
      id: 'banners' as AdminSection,
      title: 'Banners & Carrossel da Home',
      description: 'Personalize os banners rotativos do topo com chamadas, descontos e cores temáticas.',
      badge: `${banners.length} banners ativos`,
      icon: ImageIcon,
      iconColor: 'text-stone-700 bg-stone-100',
      actionLabel: 'Gerenciar Banners',
    },
    {
      id: 'analytics' as AdminSection,
      title: 'Métricas & Tráfego de Afiliado',
      description: 'Acompanhe cliques em tempo real, conversões estimadas e perfil de dispositivos.',
      badge: `${analyticsData?.totalClicks || 0} cliques registrados`,
      icon: BarChart3,
      iconColor: 'text-amber-800 bg-amber-100',
      actionLabel: 'Ver Métricas',
    },
    {
      id: 'users' as AdminSection,
      title: 'Membros & Comunidade Pet',
      description: 'Veja os tutores cadastrados, animais de estimação informados e datas de acesso.',
      badge: `${registeredUsers.length} membros`,
      icon: Users,
      iconColor: 'text-stone-700 bg-stone-100',
      actionLabel: 'Ver Membros',
    },
    {
      id: 'settings' as AdminSection,
      title: 'Configurações & Segurança',
      description: 'IDs de parceiro, taxa de comissão estimada e alteração de senha de administrador.',
      badge: 'Admin clikdica@gmail.com',
      icon: Settings,
      iconColor: 'text-stone-700 bg-stone-100',
      actionLabel: 'Configurações',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Executive Welcome & Key Stats Summary */}
      <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Painel Administrativo Oficial
              </span>
              {supabaseStatus?.connected ? (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Nuvem Sincronizada
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Armazenamento Local
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Centro de Gestão da Vitrine Pet
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
              Acesse abaixo os módulos de gerenciamento de produtos, banners promocionais, métricas de tráfego e configurações do sistema.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('products')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:scale-105"
            >
              <Package className="w-4 h-4" />
              <span>Ver Produtos</span>
            </button>
            <button
              onClick={onOpenBulkImport}
              className="px-4 py-2 bg-stone-700/80 hover:bg-stone-700 text-amber-200 border border-amber-500/30 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Importar Lote</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-700/60">
          <div 
            onClick={() => onNavigate('products')}
            className="p-3.5 rounded-xl bg-stone-800/60 border border-stone-700/60 hover:bg-stone-800 cursor-pointer transition-colors"
          >
            <span className="text-[11px] font-semibold text-stone-400 block mb-1">
              Catálogo Ativo
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-400">
              {products.length}
            </div>
            <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
              Produtos cadastrados →
            </span>
          </div>

          <div 
            onClick={() => onNavigate('analytics')}
            className="p-3.5 rounded-xl bg-stone-800/60 border border-stone-700/60 hover:bg-stone-800 cursor-pointer transition-colors"
          >
            <span className="text-[11px] font-semibold text-stone-400 block mb-1">
              Cliques Registrados
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-200">
              {analyticsData?.totalClicks || 0}
            </div>
            <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
              Ver relatório de cliques →
            </span>
          </div>

          <div 
            onClick={() => onNavigate('banners')}
            className="p-3.5 rounded-xl bg-stone-800/60 border border-stone-700/60 hover:bg-stone-800 cursor-pointer transition-colors"
          >
            <span className="text-[11px] font-semibold text-stone-400 block mb-1">
              Banners Ativos
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-300">
              {banners.length}
            </div>
            <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
              Carrossel da vitrine →
            </span>
          </div>

          <div 
            onClick={() => onNavigate('users')}
            className="p-3.5 rounded-xl bg-stone-800/60 border border-stone-700/60 hover:bg-stone-800 cursor-pointer transition-colors"
          >
            <span className="text-[11px] font-semibold text-stone-400 block mb-1">
              Membros Tutores
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-white">
              {registeredUsers.length}
            </div>
            <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
              Comunidade cadastrada →
            </span>
          </div>
        </div>
      </div>

      {/* Main Hub: Grid of Function Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-stone-900">
              Módulos e Funções do Painel
            </h4>
            <p className="text-xs text-stone-500">
              Selecione qualquer ferramenta para gerenciar a vitrine. Você poderá retornar a esta tela principal a qualquer momento.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => {
                  if (m.isCustomAction && m.onClick) {
                    m.onClick();
                  } else {
                    onNavigate(m.id);
                  }
                }}
                className="group p-5 bg-white rounded-2xl border border-stone-200/90 hover:border-amber-500/50 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.iconColor} transition-transform group-hover:scale-110`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200/60">
                      {m.badge}
                    </span>
                  </div>

                  <h5 className="font-bold text-stone-900 text-sm group-hover:text-amber-800 transition-colors">
                    {m.title}
                  </h5>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-950">
                  <span>{m.actionLabel}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Footer Strip */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Sincronização em nuvem 100% automática a cada alteração de produtos.</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={onDownloadBackup}
            className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-700 font-semibold rounded-lg border border-stone-300 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Baixar Backup JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};
