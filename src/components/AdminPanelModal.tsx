import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ArrowLeft, 
  Home, 
  Package, 
  PlusCircle, 
  Image as ImageIcon, 
  BarChart3, 
  Users, 
  Settings, 
  Layers,
  Sparkles,
  ChevronRight,
  Cloud
} from 'lucide-react';
import { Product, AffiliateSettings, Banner, UserAccount } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';

// Sub-components
import { AdminOverview, AdminSection } from './admin/AdminOverview';
import { AdminProductsTab } from './admin/AdminProductsTab';
import { AdminAddProductTab } from './admin/AdminAddProductTab';
import { AdminBannersTab } from './admin/AdminBannersTab';
import { AdminAnalyticsTab } from './admin/AdminAnalyticsTab';
import { AdminUsersTab } from './admin/AdminUsersTab';
import { AdminSettingsTab } from './admin/AdminSettingsTab';
import { AdminSupabaseTab } from './admin/AdminSupabaseTab';
import { BulkImportModal } from './BulkImportModal';
import { EditProductModal } from './EditProductModal';
import { 
  checkSupabaseStatus as checkSupabaseStatusUtil, 
  syncAllProductsToCloud, 
  loadProductsFromCloud, 
  SUPABASE_SQL_SCHEMA 
} from '../utils/supabaseClient';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onImportProducts?: (products: Product[]) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  affiliateSettings: AffiliateSettings;
  onUpdateSettings: (settings: AffiliateSettings) => void;
  banners?: Banner[];
  onAddBanner?: (banner: Banner) => void;
  onUpdateBanner?: (banner: Banner) => void;
  onDeleteBanner?: (bannerId: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onImportProducts,
  onUpdateProduct,
  onDeleteProduct,
  affiliateSettings,
  onUpdateSettings,
  banners = [],
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
}) => {
  // Navigation: Starts in the main overview hub
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  // Shared Data States
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [sqlSchema, setSqlSchema] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Supabase Status
  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean;
    connected: boolean;
    url?: string | null;
    totalProducts?: number;
    message?: string;
    needTable?: boolean;
    needPolicy?: boolean;
    source?: string;
  } | null>(null);
  const [isCheckingSupabase, setIsCheckingSupabase] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [isLoadingFromSupabase, setIsLoadingFromSupabase] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sub-modals
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch data on open
  useEffect(() => {
    if (isOpen) {
      fetchAnalytics();
      fetchSupabaseDocs();
      checkSupabaseStatus();
      fetchUsers();
    }
  }, [isOpen]);

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchSupabaseDocs = async () => {
    try {
      const res = await fetch('/api/docs/supabase-schema');
      const data = await res.json();
      if (data?.sqlSchema) {
        setSqlSchema(data.sqlSchema);
      }
    } catch (err) {
      console.error('Error fetching Supabase docs:', err);
    }
  };

  const checkSupabaseStatus = async () => {
    setIsCheckingSupabase(true);
    try {
      const status = await checkSupabaseStatusUtil();
      setSupabaseStatus(status);
    } catch (err: any) {
      setSupabaseStatus({
        configured: false,
        connected: false,
        message: 'Erro ao verificar comunicação com o Supabase: ' + (err?.message || err),
      });
    } finally {
      setIsCheckingSupabase(false);
    }
  };

  const handleSyncAllToSupabase = async () => {
    setIsSyncingSupabase(true);
    try {
      const res = await syncAllProductsToCloud(products);
      if (res.success) {
        setSyncFeedback({
          type: 'success',
          text: `Sincronização concluída com sucesso! ${res.count} produtos sincronizados com o Supabase.`,
        });
        checkSupabaseStatus();
      } else {
        setSyncFeedback({
          type: 'error',
          text: `Erro ao sincronizar: ${res.error || 'Verifique se a tabela "products" foi criada no Supabase.'}`,
        });
      }
    } catch (err: any) {
      setSyncFeedback({
        type: 'error',
        text: `Falha na sincronização: ${err?.message || err}`,
      });
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  const handleReloadFromSupabase = async () => {
    setIsLoadingFromSupabase(true);
    try {
      const res = await loadProductsFromCloud();
      if (res.success && res.products && res.products.length > 0) {
        if (onImportProducts) {
          onImportProducts(res.products);
        }
        setSyncFeedback({
          type: 'success',
          text: `${res.products.length} produtos carregados diretamente do Supabase na nuvem!`,
        });
        checkSupabaseStatus();
      } else {
        setSyncFeedback({
          type: 'error',
          text: 'Nenhum produto encontrado no Supabase ou conexão indisponível.',
        });
      }
    } catch (err: any) {
      setSyncFeedback({
        type: 'error',
        text: `Erro ao carregar do Supabase: ${err?.message || err}`,
      });
    } finally {
      setIsLoadingFromSupabase(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/auth/users');
      const data = await res.json();
      if (data?.success && Array.isArray(data.users)) {
        setRegisteredUsers(data.users);
      }
    } catch (err) {
      console.error('Error loading registered users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDownloadBackupJson = () => {
    try {
      const jsonStr = JSON.stringify(products, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `achadinhos_pet_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error generating backup:', e);
    }
  };

  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (onImportProducts) {
            onImportProducts(parsed);
          } else {
            parsed.forEach((p) => onAddProduct(p));
          }
          setSyncFeedback({
            type: 'success',
            text: `Backup importado com sucesso! ${parsed.length} produtos adicionados ao catálogo.`,
          });
        } else {
          alert('Arquivo JSON inválido. Deve conter uma lista de produtos.');
        }
      } catch (err) {
        alert('Erro ao ler arquivo de backup JSON.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRestoreStarterCatalog = () => {
    if (confirm('Deseja restaurar o catálogo de produtos padrão da vitrine?')) {
      if (onImportProducts) {
        onImportProducts(INITIAL_PRODUCTS);
      } else {
        INITIAL_PRODUCTS.forEach((p) => onAddProduct(p));
      }
      setSyncFeedback({
        type: 'success',
        text: 'Catálogo padrão da loja restaurado com sucesso!',
      });
    }
  };

  if (!isOpen) return null;

  const sectionLabels: Record<AdminSection, string> = {
    overview: 'Página Principal',
    products: 'Catálogo de Produtos',
    add_product: 'Cadastrar Produto',
    banners: 'Banners da Vitrine',
    analytics: 'Métricas & Tráfego',
    users: 'Membros & Tutores',
    supabase: 'Banco Supabase & Nuvem',
    settings: 'Configurações',
  };

  const navButtons = [
    { id: 'overview' as AdminSection, label: 'Início', icon: Home },
    { id: 'products' as AdminSection, label: 'Produtos', icon: Package, count: products.length },
    { id: 'banners' as AdminSection, label: 'Banners', icon: ImageIcon, count: banners.length },
    { id: 'analytics' as AdminSection, label: 'Métricas', icon: BarChart3 },
    { id: 'users' as AdminSection, label: 'Membros', icon: Users, count: registeredUsers.length },
    { id: 'supabase' as AdminSection, label: 'Supabase', icon: Cloud, isLive: supabaseStatus?.connected },
    { id: 'settings' as AdminSection, label: 'Ajustes', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-stone-100 rounded-3xl w-full max-w-6xl h-[94vh] flex flex-col shadow-2xl border border-stone-300 overflow-hidden">
        
        {/* Top Header & Navigation Bar */}
        <div className="bg-white border-b border-stone-200 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-2xs">
          
          {/* Left: Title or Back to Home button */}
          <div className="flex items-center gap-3">
            {activeSection !== 'overview' ? (
              <button
                onClick={() => setActiveSection('overview')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 font-bold text-xs cursor-pointer transition-all hover:-translate-x-0.5 shadow-2xs"
                title="Voltar para a tela inicial do Painel"
              >
                <ArrowLeft className="w-4 h-4 text-amber-700" />
                <span>Voltar à Página Principal</span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-700 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4 text-amber-200" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-stone-900 leading-tight">
                    Painel Administrativo da Vitrine
                  </h2>
                  <p className="text-[11px] text-stone-500 hidden sm:block">
                    Gestão central de produtos, banners, métricas e banco de dados
                  </p>
                </div>
              </div>
            )}

            {/* Breadcrumb if inside sub-page */}
            {activeSection !== 'overview' && (
              <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-500 font-medium pl-2 border-l border-stone-200">
                <span>Início</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-bold text-stone-800">{sectionLabels[activeSection]}</span>
              </div>
            )}
          </div>

          {/* Right: Quick Tab Pills & Close Button */}
          <div className="flex items-center justify-between sm:justify-end gap-2 overflow-x-auto pb-1 sm:pb-0">
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/80">
              {navButtons.map((btn) => {
                const Icon = btn.icon;
                const isActive = activeSection === btn.id;
                return (
                  <button
                    key={btn.id}
                    onClick={() => setActiveSection(btn.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-700 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{btn.label}</span>
                    {btn.isLive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                    )}
                    {typeof btn.count === 'number' && btn.count > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? 'bg-amber-800 text-amber-100' : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {btn.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer shrink-0 ml-1"
              title="Fechar Painel Administrativo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {syncFeedback && (
          <div className={`px-6 py-2.5 flex items-center justify-between text-xs font-bold shrink-0 ${
            syncFeedback.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border-b border-emerald-200' 
              : 'bg-rose-50 text-rose-900 border-b border-rose-200'
          }`}>
            <span>{syncFeedback.text}</span>
            <button 
              onClick={() => setSyncFeedback(null)}
              className="px-2 py-0.5 rounded text-[10px] bg-black/5 hover:bg-black/10 cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Scrollable Content View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeSection === 'overview' && (
            <AdminOverview
              products={products}
              banners={banners}
              registeredUsers={registeredUsers}
              analyticsData={analyticsData}
              supabaseStatus={supabaseStatus}
              onNavigate={(sec) => setActiveSection(sec)}
              onOpenBulkImport={() => setIsBulkImportOpen(true)}
              onDownloadBackup={handleDownloadBackupJson}
            />
          )}

          {activeSection === 'products' && (
            <AdminProductsTab
              products={products}
              onOpenAddProduct={() => setActiveSection('add_product')}
              onOpenBulkImport={() => setIsBulkImportOpen(true)}
              onEditProduct={(p) => setEditingProduct(p)}
              onDeleteProduct={onDeleteProduct}
            />
          )}

          {activeSection === 'add_product' && (
            <AdminAddProductTab
              onAddProduct={onAddProduct}
              onOpenBulkImport={() => setIsBulkImportOpen(true)}
              onSuccessNavigate={() => setActiveSection('products')}
              onBackToProducts={() => setActiveSection('products')}
            />
          )}

          {activeSection === 'banners' && (
            <AdminBannersTab
              banners={banners}
              onAddBanner={onAddBanner}
              onUpdateBanner={onUpdateBanner}
              onDeleteBanner={onDeleteBanner}
            />
          )}

          {activeSection === 'analytics' && (
            <AdminAnalyticsTab
              analyticsData={analyticsData}
              loadingAnalytics={loadingAnalytics}
              onRefreshAnalytics={fetchAnalytics}
              affiliateSettings={affiliateSettings}
            />
          )}

          {activeSection === 'users' && (
            <AdminUsersTab
              registeredUsers={registeredUsers}
              loadingUsers={loadingUsers}
              onRefreshUsers={fetchUsers}
            />
          )}

          {activeSection === 'supabase' && (
            <AdminSupabaseTab
              products={products}
              supabaseStatus={supabaseStatus}
              isCheckingSupabase={isCheckingSupabase}
              onCheckSupabaseStatus={checkSupabaseStatus}
              isSyncingSupabase={isSyncingSupabase}
              onSyncAllToSupabase={handleSyncAllToSupabase}
              isLoadingFromSupabase={isLoadingFromSupabase}
              onReloadFromSupabase={handleReloadFromSupabase}
              syncFeedback={syncFeedback}
              onClearSyncFeedback={() => setSyncFeedback(null)}
              onDownloadBackup={handleDownloadBackupJson}
              onImportBackupFile={handleImportBackupFile}
              onRestoreStarterCatalog={handleRestoreStarterCatalog}
              sqlSchema={sqlSchema || SUPABASE_SQL_SCHEMA}
              onSaveCredentials={() => {
                checkSupabaseStatus();
              }}
            />
          )}

          {activeSection === 'settings' && (
            <AdminSettingsTab
              affiliateSettings={affiliateSettings}
              onUpdateSettings={onUpdateSettings}
              products={products}
              supabaseStatus={supabaseStatus}
              onDownloadBackup={handleDownloadBackupJson}
              onImportBackupFile={handleImportBackupFile}
              onRestoreStarterCatalog={handleRestoreStarterCatalog}
              sqlSchema={sqlSchema || SUPABASE_SQL_SCHEMA}
              onNavigateToSupabase={() => setActiveSection('supabase')}
            />
          )}
        </div>

        {/* Edit Product Modal */}
        {editingProduct && (
          <EditProductModal
            isOpen={Boolean(editingProduct)}
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={(updated) => {
              onUpdateProduct(updated);
              setEditingProduct(null);
            }}
          />
        )}

        {/* Bulk Import Modal */}
        {isBulkImportOpen && (
          <BulkImportModal
            isOpen={isBulkImportOpen}
            onClose={() => setIsBulkImportOpen(false)}
            onImportProducts={(imported) => {
              if (onImportProducts) {
                onImportProducts(imported);
              } else {
                imported.forEach((p) => onAddProduct(p));
              }
              setIsBulkImportOpen(false);
              setActiveSection('products');
            }}
          />
        )}
      </div>
    </div>
  );
};
