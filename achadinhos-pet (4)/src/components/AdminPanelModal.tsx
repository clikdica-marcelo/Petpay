import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Settings, 
  BarChart3, 
  Package, 
  Database, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw,
  Smartphone,
  Laptop,
  Tablet,
  TrendingUp,
  FileCode2,
  DollarSign,
  Layers,
  FileSpreadsheet,
  Loader2,
  Wand2,
  Zap,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  RotateCcw,
  Users,
  UserCheck,
  ShieldCheck,
  Heart,
  KeyRound,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Product, AffiliateSettings, ClickLog, ProductCategory, Banner, UserAccount } from '../types';

import { OFFICIAL_CATEGORIES, CATEGORY_LABELS, INITIAL_PRODUCTS } from '../data/mockProducts';
import { BulkImportModal } from './BulkImportModal';
import { EditProductModal } from './EditProductModal';
import { formatBRL, parseBRL, numberToBRLInput } from '../utils/currency';

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
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'users' | 'settings' | 'supabase_docs'>('analytics');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [sqlSchema, setSqlSchema] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Admin Password Management state
  const [adminCurrentPassword, setAdminCurrentPassword] = useState('');
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passFeedback, setPassFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);


  // Supabase live status & sync
  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean;
    connected: boolean;
    url?: string | null;
    totalProducts?: number;
    message?: string;
    error?: string;
  } | null>(null);
  const [isCheckingSupabase, setIsCheckingSupabase] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rawTitleInput, setRawTitleInput] = useState("");
  const [rawPriceInput, setRawPriceInput] = useState("");
  const [rawCategoryInput, setRawCategoryInput] = useState<string>("alimentacao");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const [rawShopeeUrl, setRawShopeeUrl] = useState('');
  const [rawImageUrl, setRawImageUrl] = useState('');
  const [rawShortDesc, setRawShortDesc] = useState('');
  const [rawFullDesc, setRawFullDesc] = useState('');
  const [rawSellerName, setRawSellerName] = useState('Loja Oficial Shopee');
  const [rawFreeShipping, setRawFreeShipping] = useState(true);
  const [rawFlashDeal, setRawFlashDeal] = useState(false);
  const [rawCoupon, setRawCoupon] = useState('10% OFF');
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [autoExtractSuccess, setAutoExtractSuccess] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  // Auto extract handler from Shopee link
  const handleAutoExtractFromUrl = async (urlToExtract?: string) => {
    const target = urlToExtract || rawShopeeUrl;
    if (!target.trim()) {
      setExtractError('Insira o link do produto da Shopee ou loja parceira primeiro.');
      return;
    }

    setIsExtracting(true);
    setExtractError(null);
    setAutoExtractSuccess(false);

    try {
      const res = await fetch('/api/products/auto-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target.trim() })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Falha ao analisar link');
      }

      const p = data.product;
      if (p.title) {
        setRawTitleInput(p.title);
        setRawShortDesc(`${p.title} - Oferta imperdível verificada com garantia.`);
        setRawFullDesc(`${p.title} - Produto verificado de alta qualidade, ideal para cuidados e bem-estar do seu pet.`);
      }
      if (p.price) {
        setRawPriceInput(numberToBRLInput(p.price));
      }
      if (p.category) {
        setRawCategoryInput(p.category as ProductCategory);
      }
      if (p.imageUrl) {
        setRawImageUrl(p.imageUrl);
      }
      if (p.sellerName) {
        setRawSellerName(p.sellerName);
      }
      if (target) {
        setRawShopeeUrl(target);
      }

      setAutoExtractSuccess(true);
      setTimeout(() => setAutoExtractSuccess(false), 3500);
    } catch (err: any) {
      console.error(err);
      setExtractError(err.message || 'Não foi possível preencher automaticamente.');
    } finally {
      setIsExtracting(false);
    }
  };

  // Settings form
  const [tempSettings, setTempSettings] = useState<AffiliateSettings>(affiliateSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    setTempSettings(affiliateSettings);
  }, [affiliateSettings]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/auth/users');
      const data = await res.json();
      if (data && data.success && Array.isArray(data.users)) {
        setRegisteredUsers(data.users);
      }
    } catch (err) {
      console.error('Error loading registered users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAnalytics();
      fetchSupabaseDocs();
      checkSupabaseStatus();
      fetchUsers();
    }
  }, [isOpen]);


  const checkSupabaseStatus = async () => {
    setIsCheckingSupabase(true);
    try {
      const res = await fetch('/api/supabase/status');
      const data = await res.json();
      setSupabaseStatus(data);
    } catch (err: any) {
      setSupabaseStatus({
        configured: false,
        connected: false,
        message: 'Não foi possível verificar o status do Supabase.'
      });
    } finally {
      setIsCheckingSupabase(false);
    }
  };

  const handleSyncAllToSupabase = async () => {
    setIsSyncingSupabase(true);
    setSyncFeedback(null);
    try {
      const res = await fetch('/api/supabase/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Falha ao sincronizar');
      }
      setSyncFeedback({
        type: 'success',
        text: data.message || `${products.length} produtos sincronizados com sucesso no Supabase!`
      });
      checkSupabaseStatus();
    } catch (err: any) {
      setSyncFeedback({
        type: 'error',
        text: err.message || 'Erro ao sincronizar com o Supabase.'
      });
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  const handleReloadFromSupabase = async () => {
    setIsCheckingSupabase(true);
    setSyncFeedback(null);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data && data.success && Array.isArray(data.products)) {
        if (onImportProducts) {
          onImportProducts(data.products);
        }
        setSyncFeedback({
          type: 'success',
          text: `Catálogo recarregado com sucesso! (${data.products.length} produtos recebidos).`
        });
      }
    } catch (err: any) {
      setSyncFeedback({
        type: 'error',
        text: 'Erro ao recarregar produtos do Supabase.'
      });
    } finally {
      setIsCheckingSupabase(false);
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
      console.error(e);
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
            parsed.forEach(p => onAddProduct(p));
          }
          setSyncFeedback({
            type: 'success',
            text: `Backup importado com sucesso! ${parsed.length} produtos adicionados ao catálogo.`
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
    if (confirm('Deseja restaurar o catálogo de produtos padrão da loja?')) {
      if (onImportProducts) {
        onImportProducts(INITIAL_PRODUCTS);
      } else {
        INITIAL_PRODUCTS.forEach(p => onAddProduct(p));
      }
      setSyncFeedback({
        type: 'success',
        text: 'Catálogo padrão da loja restaurado com sucesso!'
      });
    }
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchSupabaseDocs = async () => {
    try {
      const res = await fetch('/api/docs/supabase-schema');
      const data = await res.json();
      setSqlSchema(data.sqlSchema);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = () => {
    onUpdateSettings(tempSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleAdminChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassFeedback(null);

    if (!adminNewPassword.trim()) {
      setPassFeedback({ type: 'error', text: 'Informe a nova senha desejada.' });
      return;
    }

    if (adminNewPassword.trim().length < 4) {
      setPassFeedback({ type: 'error', text: 'A nova senha deve ter no mínimo 4 caracteres.' });
      return;
    }

    if (adminNewPassword !== adminConfirmPassword) {
      setPassFeedback({ type: 'error', text: 'A confirmação de senha não coincide com a nova senha.' });
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'clikdica@gmail.com',
          currentPassword: adminCurrentPassword.trim() || undefined,
          newPassword: adminNewPassword.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setPassFeedback({ type: 'success', text: 'Senha do administrador alterada com sucesso! Guarde-a com segurança.' });
        setAdminCurrentPassword('');
        setAdminNewPassword('');
        setAdminConfirmPassword('');
      } else {
        setPassFeedback({ type: 'error', text: data.message || 'Falha ao atualizar a senha.' });
      }
    } catch (err: any) {
      setPassFeedback({ type: 'error', text: 'Erro ao conectar com o servidor para atualizar a senha.' });
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawTitleInput.trim()) return;

    setCreatingProduct(true);
    const priceVal: number | string = parseBRL(rawPriceInput) || 49.90;
    const originalVal = typeof priceVal === 'number' ? Number((priceVal * 1.35).toFixed(2)) : undefined;
    
    const newProd: Product = {
      id: `pet-prod-${Date.now()}`,
      title: rawTitleInput.trim(),
      shortDescription: rawShortDesc.trim() || `Excelente opção de ${CATEGORY_LABELS[rawCategoryInput]?.shortLabel || 'Pet'}, com alta durabilidade e conforto.`,
      fullDescription: rawFullDesc.trim() || `Item selecionado com foco em praticidade, segurança e bem-estar. Fabricado com materiais de qualidade e avaliado com nota máxima por compradores.`,
      price: priceVal,
      originalPrice: originalVal,
      discountPercent: 25,
      rating: 4.8,
      reviewsCount: 85,
      salesCount: 230,
      imageUrl: rawImageUrl.trim() || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
      category: rawCategoryInput,
      shopeeUrl: rawShopeeUrl.trim() || 'https://shopee.com.br',
      affiliateUrl: rawShopeeUrl.trim() || 'https://shopee.com.br',
      tags: ['Loja Oficial', 'Pet', CATEGORY_LABELS[rawCategoryInput]?.shortLabel || 'Oferta', 'Destaque'],
      badges: rawFlashDeal ? ['Oferta Relâmpago', 'Frete Grátis'] : ['Mais Vendido', 'Frete Grátis'],
      isFlashDeal: rawFlashDeal,
      freeShipping: rawFreeShipping,
      couponAvailable: rawCoupon.trim() || '10% OFF',
      highlights: {
        idealFor: `Tutores que buscam praticidade e qualidade para seus pets.`,
        whyBuy: `Ótima avaliação de compradores e preço promocional verificado.`,
        tips: `Higienize conforme orientações do fabricante para maior vida útil.`
      },
      sellerName: rawSellerName.trim() || 'Loja Oficial Verificada'
    };

    onAddProduct(newProd);
    setRawTitleInput('');
    setRawShortDesc('');
    setRawFullDesc('');
    setRawShopeeUrl('');
    setRawImageUrl('');
    setCreatingProduct(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 relative text-stone-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-700 flex items-center justify-center text-white">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Painel Administrativo da Vitrine
              </h2>
              <p className="text-xs text-stone-400">
                Gerenciamento de Produtos, Catálogo de Achadinhos e Integração Supabase
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 gap-2 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3.5 px-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'analytics' ? 'border-amber-700 text-amber-900 bg-white' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Métricas & Tráfego de Produtos</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3.5 px-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'products' ? 'border-amber-700 text-amber-900 bg-white' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Catálogo de Produtos ({products.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('users');
              fetchUsers();
            }}
            className={`py-3.5 px-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'users' ? 'border-amber-700 text-amber-900 bg-white' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Membros Cadastrados ({registeredUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 px-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'settings' ? 'border-amber-700 text-amber-900 bg-white' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações da Vitrine</span>
          </button>


          <button
            onClick={() => setActiveTab('supabase_docs')}
            className={`py-3.5 px-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'supabase_docs' ? 'border-amber-700 text-amber-900 bg-white' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase & Banco de Dados</span>
            {supabaseStatus?.connected ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Supabase Conectado" />
            ) : supabaseStatus?.configured ? (
              <span className="w-2 h-2 rounded-full bg-amber-500" title="Aguardando tabela no Supabase" />
            ) : null}
          </button>

        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          
          {/* 1. ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/80">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                    Cliques Totais em Produtos
                  </span>
                  <div className="text-3xl font-extrabold text-stone-900">
                    {analyticsData?.totalClicks || 0}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Rastreamento de interesse por oferta
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                    Desempenho Estimado
                  </span>
                  <div className="text-3xl font-extrabold text-emerald-900">
                    R$ {analyticsData?.totalEstimatedCommission?.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Taxa média de conversão em {tempSettings.commissionRateEstimate}%
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-100 border border-stone-200">
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-1">
                    Dispositivos dos Usuários
                  </span>
                  <div className="flex items-center gap-3 mt-2 text-xs font-medium">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-4 h-4 text-amber-700" />
                      Mobile: {analyticsData?.deviceCounts?.mobile || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Laptop className="w-4 h-4 text-stone-700" />
                      Desktop: {analyticsData?.deviceCounts?.desktop || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Click Log Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-stone-900">
                    Últimos Cliques Registrados (Logs em Tempo Real)
                  </h3>
                  <button
                    onClick={fetchAnalytics}
                    className="text-xs font-medium text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingAnalytics ? 'animate-spin' : ''}`} />
                    Atualizar Logs
                  </button>
                </div>

                <div className="border border-stone-200 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-200 font-bold text-stone-600">
                      <tr>
                        <th className="p-3">Produto</th>
                        <th className="p-3">Origem</th>
                        <th className="p-3">Dispositivo</th>
                        <th className="p-3">Comissão Est.</th>
                        <th className="p-3">Data/Hora</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {analyticsData?.recentLogs?.map((log: any) => (
                        <tr key={log.id} className="hover:bg-stone-50">
                          <td className="p-3 font-semibold text-stone-900 truncate max-w-xs">{log.productTitle}</td>
                          <td className="p-3 text-stone-600">{log.referrer}</td>
                          <td className="p-3 text-stone-600 uppercase text-[10px]">{log.deviceType}</td>
                          <td className="p-3 font-bold text-emerald-700">R$ {log.estimatedCommission?.toFixed(2)}</td>
                          <td className="p-3 text-stone-400 text-[11px]">{new Date(log.timestamp).toLocaleTimeString('pt-BR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. PRODUCTS CATALOG TAB */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Quick Product Addition Card */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <Plus className="w-4 h-4 text-amber-700" />
                    <span>Cadastrar Produtos no Catálogo</span>
                  </div>

                  {/* Collective Import Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsBulkImportOpen(true)}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto border border-amber-500/40 transition-all hover:scale-105"
                  >
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>⚡ Importação Coletiva (Lote / Planilha)</span>
                  </button>
                </div>
                <p className="text-xs text-stone-600">
                  Cole o link do produto na Shopee para <strong>preencher tudo automaticamente</strong> ou cadastre manualmente pelos campos abaixo.
                </p>

                {/* SIMPLE & EXACT PRODUCT ADD FORM REQUESTED BY USER */}
                <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      <Plus className="w-4 h-4 text-amber-700" />
                      <span>Adicionar Produto</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsBulkImportOpen(true)}
                      className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Importação em Lote</span>
                    </button>
                  </div>

                  <form onSubmit={handleCreateProduct} className="space-y-4">
                    {/* Link de Afiliado */}
                    <div>
                      <label className="text-xs font-bold text-stone-900 block mb-1">
                        Link de Afiliado *
                      </label>
                      <input
                        type="url"
                        placeholder="https://shopee.com.br/produto..."
                        value={rawShopeeUrl}
                        onChange={(e) => setRawShopeeUrl(e.target.value)}
                        required
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:border-amber-700"
                      />
                      <p className="text-[11px] text-stone-500 mt-1">
                        Cole o link de afiliado direto da Shopee ou loja parceira
                      </p>
                    </div>

                    {/* Título */}
                    <div>
                      <label className="text-xs font-bold text-stone-900 block mb-1">
                        Título *
                      </label>
                      <input
                        type="text"
                        placeholder="Nome do produto"
                        value={rawTitleInput}
                        onChange={(e) => setRawTitleInput(e.target.value)}
                        required
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-700 font-semibold"
                      />
                    </div>

                    {/* URL da Imagem com Preview */}
                    <div>
                      <label className="text-xs font-bold text-stone-900 block mb-1">
                        URL da Imagem / Foto *
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="url"
                          placeholder="https://..."
                          value={rawImageUrl}
                          onChange={(e) => setRawImageUrl(e.target.value)}
                          className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono focus:outline-none focus:border-amber-700"
                        />
                        {rawImageUrl && (
                          <img
                            src={rawImageUrl}
                            alt="Preview"
                            className="w-10 h-10 rounded-lg object-cover border border-stone-300 shrink-0"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=200&q=80'; }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Preços */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-stone-900">
                            Preço Atual (Padrão BR: 49,90 ou 1.250,50) *
                          </label>
                          <button
                            type="button"
                            onClick={() => setRawPriceInput('Preços Variados')}
                            className="text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                          >
                            + Inserir "Preços Variados"
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Ex: 49,90 ou 1.250,50"
                            value={rawPriceInput}
                            onChange={(e) => setRawPriceInput(e.target.value)}
                            required
                            className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-amber-900 focus:outline-none focus:border-amber-700"
                          />
                          {rawPriceInput && (
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 pointer-events-none">
                              {formatBRL(rawPriceInput)}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">
                          Separe os centavos com <strong>vírgula (,)</strong> e milhares com <strong>ponto (.)</strong>
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-stone-900 block mb-1">
                          Preço Original Estimado (R$)
                        </label>
                        <input
                          type="text"
                          value={(() => {
                            const parsed = parseBRL(rawPriceInput);
                            return typeof parsed === 'number' && parsed > 0 ? formatBRL(parsed * 1.35) : 'N/A';
                          })()}
                          readOnly
                          className="w-full p-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-600 cursor-not-allowed"
                        />
                        <p className="text-[10px] text-stone-400 mt-1">
                          Calculado automaticamente com base de desconto (+35%)
                        </p>
                      </div>
                    </div>

                    {/* Loja e Categoria */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-stone-900 block mb-1">
                          Nome do Vendedor / Loja
                        </label>
                        <input
                          type="text"
                          value={rawSellerName}
                          onChange={(e) => setRawSellerName(e.target.value)}
                          placeholder="Ex: Loja Oficial Shopee"
                          className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-700"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-stone-900 block mb-1">
                          Categoria / Departamento
                        </label>
                        <select
                          value={rawCategoryInput}
                          onChange={(e) => setRawCategoryInput(e.target.value as ProductCategory)}
                          className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-700"
                        >
                          <option value="alimentacao">Alimentação</option>
                          <option value="cuidados_especiais">Cuidados Especiais</option>
                          <option value="saude_bem_estar">Saúde e Bem-Estar</option>
                          <option value="cama_banheiro">Cama e Banheiro</option>
                          <option value="acessorios">Acessórios & Estilo</option>
                          <option value="outros">Outros</option>
                        </select>
                      </div>
                    </div>

                    {/* Descrições */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-stone-900 block mb-1">Descrição Curta:</label>
                        <input
                          type="text"
                          value={rawShortDesc}
                          onChange={(e) => setRawShortDesc(e.target.value)}
                          placeholder="Ex: Alimento super premium para cães adultos..."
                          className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-700"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-stone-900 block mb-1">Descrição Completa:</label>
                        <textarea
                          rows={2}
                          value={rawFullDesc}
                          onChange={(e) => setRawFullDesc(e.target.value)}
                          placeholder="Detalhes completos do produto..."
                          className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-700"
                        />
                      </div>
                    </div>

                    {/* Flags / Checkboxes */}
                    <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-stone-200">
                      <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 text-xs">
                        <input
                          type="checkbox"
                          checked={rawFreeShipping}
                          onChange={(e) => setRawFreeShipping(e.target.checked)}
                          className="rounded text-amber-700 focus:ring-amber-700 w-4 h-4"
                        />
                        <span>Frete Grátis Disponível</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 text-xs">
                        <input
                          type="checkbox"
                          checked={rawFlashDeal}
                          onChange={(e) => setRawFlashDeal(e.target.checked)}
                          className="rounded text-amber-700 focus:ring-amber-700 w-4 h-4"
                        />
                        <span>Oferta Relâmpago (Flash Deal)</span>
                      </label>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={creatingProduct || !rawTitleInput.trim()}
                        className="w-full py-3 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
                      >
                        <Plus className="w-4 h-4 text-amber-300" />
                        <span>Adicionar Produto</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Product List Table */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden text-xs">
                <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                  <h4 className="font-bold text-stone-900">Produtos no Catálogo ({products.length})</h4>
                  <span className="text-stone-400 text-[11px]">Gerenciador do Catálogo</span>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-stone-100/70 border-b border-stone-200 font-bold text-stone-600">
                    <tr>
                      <th className="p-3">Foto</th>
                      <th className="p-3">Título</th>
                      <th className="p-3">Categoria</th>
                      <th className="p-3">Preço</th>
                      <th className="p-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50">
                        <td className="p-3">
                          <img src={p.imageUrl} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                        </td>
                        <td className="p-3 font-semibold text-stone-900 truncate max-w-xs">{p.title}</td>
                        <td className="p-3 text-stone-600">{CATEGORY_LABELS[p.category]?.label || p.category}</td>
                        <td className="p-3 font-bold text-amber-900">{formatBRL(p.price)}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingProduct(p)}
                              className="p-1.5 text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 rounded-lg cursor-pointer transition-colors flex items-center gap-1 font-semibold text-[11px]"
                              title="Editar informações do produto"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Editar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteProduct(p.id)}
                              className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                              title="Remover produto da vitrine"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* 3. SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="max-w-xl space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Identificador de Rastreamento / Parceiro (Partner ID)
                </label>
                <input
                  type="text"
                  value={tempSettings.affiliateId}
                  onChange={(e) => setTempSettings({ ...tempSettings, affiliateId: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Código de identificação de rastreamento ou parceiro para métricas de conversão.
                </p>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Prefixo de Campanha / Rastreamento (Tag / SubID)
                </label>
                <input
                  type="text"
                  value={tempSettings.subIdPrefix}
                  onChange={(e) => setTempSettings({ ...tempSettings, subIdPrefix: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Identificador para organizar e separar cliques nos relatórios de desempenho.
                </p>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Estimativa de Conversão / Retorno Médio (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={tempSettings.commissionRateEstimate}
                  onChange={(e) => setTempSettings({ ...tempSettings, commissionRateEstimate: parseFloat(e.target.value) || 8.5 })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Domínio Oficial do Portal
                </label>
                <input
                  type="text"
                  value={tempSettings.storeDomain}
                  onChange={(e) => setTempSettings({ ...tempSettings, storeDomain: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3">
                <button
                  onClick={handleSaveSettings}
                  className="px-6 py-2.5 bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {settingsSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  <span>{settingsSaved ? 'Configurações Salvas!' : 'Salvar Alterações'}</span>
                </button>
              </div>

              {/* Administrator Password Change Section */}
              <div className="mt-8 pt-6 border-t border-stone-200">
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">Alterar Senha do Administrador</h4>
                      <p className="text-stone-500 text-[11px]">
                        Conta: <strong className="text-stone-700">clikdica@gmail.com</strong>
                      </p>
                    </div>
                  </div>

                  {passFeedback && (
                    <div className={`mt-3 p-3 rounded-xl flex items-center gap-2 text-xs border ${
                      passFeedback.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                      {passFeedback.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{passFeedback.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleAdminChangePassword} className="mt-4 space-y-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1 text-[11px]">
                        Senha Atual (opcional para primeira troca):
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                        <input
                          type={showAdminPass ? 'text' : 'password'}
                          value={adminCurrentPassword}
                          onChange={(e) => setAdminCurrentPassword(e.target.value)}
                          placeholder="Digite a senha atual (ex: admin123)..."
                          className="w-full pl-9 pr-10 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPass(!showAdminPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                        >
                          {showAdminPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1 text-[11px]">
                          Nova Senha:
                        </label>
                        <input
                          type={showAdminPass ? 'text' : 'password'}
                          required
                          value={adminNewPassword}
                          onChange={(e) => setAdminNewPassword(e.target.value)}
                          placeholder="Mínimo 4 caracteres..."
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-600"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-stone-700 mb-1 text-[11px]">
                          Confirmar Nova Senha:
                        </label>
                        <input
                          type={showAdminPass ? 'text' : 'password'}
                          required
                          value={adminConfirmPassword}
                          onChange={(e) => setAdminConfirmPassword(e.target.value)}
                          placeholder="Repita a nova senha..."
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-600"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={isChangingPass}
                        className="px-5 py-2.5 bg-gradient-to-r from-stone-800 to-stone-900 hover:from-black hover:to-black text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isChangingPass ? 'Atualizando Senha...' : 'Salvar Nova Senha'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* 3.5. REGISTERED USERS & COMMUNITY TAB */}
          {activeTab === 'users' && (
            <div className="space-y-6 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 p-5 rounded-2xl border border-stone-200">
                <div>
                  <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-700" />
                    <span>Membros e Tutores Cadastrados ({registeredUsers.length})</span>
                  </h3>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    O cadastro é 100% opcional para os visitantes. Aqui você visualiza os tutores que escolheram criar uma conta.
                  </p>
                </div>
                <button
                  onClick={fetchUsers}
                  disabled={loadingUsers}
                  className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-700 font-bold rounded-xl border border-stone-300 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin' : ''}`} />
                  <span>Atualizar Lista</span>
                </button>
              </div>

              {/* Members Table */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Tutor / Usuário</th>
                        <th className="py-3 px-4">E-mail</th>
                        <th className="py-3 px-4">Função</th>
                        <th className="py-3 px-4">Pet Cadastrado</th>
                        <th className="py-3 px-4">Data de Cadastro</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {registeredUsers.length > 0 ? (
                        registeredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-amber-50/30 transition-colors">
                            <td className="py-3 px-4 font-bold text-stone-900 flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs text-white ${
                                u.role === 'admin' ? 'bg-amber-700' : 'bg-emerald-600'
                              }`}>
                                {u.role === 'admin' ? '👑' : '🐾'}
                              </div>
                              <span>{u.name || 'Tutor Pet'}</span>
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-stone-600">
                              {u.email}
                            </td>
                            <td className="py-3 px-4">
                              {u.role === 'admin' || u.email === 'clikdica@gmail.com' ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300">
                                  Administrador
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                  Membro VIP
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-[11px]">
                              {u.petName ? (
                                <span className="font-semibold text-stone-800">
                                  {u.petType === 'cat' ? '🐱 ' : u.petType === 'dog' ? '🐶 ' : '🐾 '}
                                  {u.petName}
                                </span>
                              ) : (
                                <span className="text-stone-400 italic">Não informado</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-stone-500 text-[11px]">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-stone-400">
                            Nenhum membro cadastrado ainda.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* 4. SUPABASE DATABASE & SYNC MANAGEMENT TAB */}
          {activeTab === 'supabase_docs' && (
            <div className="space-y-6 text-xs">
              
              {/* Feedback Alert if any */}
              {syncFeedback && (
                <div className={`p-4 rounded-2xl flex items-start gap-3 border ${
                  syncFeedback.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}>
                  {syncFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-xs">{syncFeedback.text}</p>
                  </div>
                  <button 
                    onClick={() => setSyncFeedback(null)} 
                    className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Live Supabase Connection Status Card */}
              <div className="p-5 rounded-2xl border bg-white shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      supabaseStatus?.connected 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : supabaseStatus?.configured 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-stone-100 text-stone-600'
                    }`}>
                      <Cloud className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                        <span>Status da Conexão Supabase</span>
                        {supabaseStatus?.connected ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Ativo & Conectado
                          </span>
                        ) : supabaseStatus?.configured ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Pendente Tabela SQL
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
                            Modo Local (LocalStorage)
                          </span>
                        )}
                      </h4>
                      <p className="text-stone-500 text-[11px] mt-0.5">
                        {supabaseStatus?.message || (isCheckingSupabase ? 'Verificando conexão...' : 'Verifique o status do seu banco de dados.')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={checkSupabaseStatus}
                    disabled={isCheckingSupabase}
                    className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isCheckingSupabase ? 'animate-spin' : ''}`} />
                    <span>Verificar Conexão</span>
                  </button>
                </div>

                {/* Quick Action Buttons for Sync */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                  <button
                    onClick={handleSyncAllToSupabase}
                    disabled={isSyncingSupabase}
                    className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSyncingSupabase ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Cloud className="w-4 h-4" />
                    )}
                    <span>Sincronizar {products.length} Produtos para o Supabase</span>
                  </button>

                  <button
                    onClick={handleReloadFromSupabase}
                    disabled={isCheckingSupabase}
                    className="p-3.5 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isCheckingSupabase ? 'animate-spin' : ''}`} />
                    <span>Baixar / Recarregar Produtos do Supabase</span>
                  </button>
                </div>
              </div>

              {/* Local Storage & JSON Backup Tools */}
              <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50 space-y-3">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-700" />
                  <span>Backup e Restauração de Produtos (Sem Perda de Dados)</span>
                </h4>
                <p className="text-stone-600 text-[11px]">
                  Você pode salvar uma cópia de segurança de todos os seus {products.length} produtos cadastrados em arquivo JSON ou restaurá-los a qualquer momento.
                </p>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    onClick={handleDownloadBackupJson}
                    className="px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-700" />
                    <span>Baixar Backup em JSON ({products.length} itens)</span>
                  </button>

                  <label className="px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Restaurar de Arquivo JSON</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportBackupFile}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={handleRestoreStarterCatalog}
                    className="px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-600 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                    <span>Restaurar Catálogo Padrão</span>
                  </button>
                </div>
              </div>

              {/* SQL Schema Ready to Paste in Supabase */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-950 flex items-center gap-2 text-sm">
                    <Database className="w-4 h-4 text-amber-700" />
                    <span>Script SQL para o Supabase (Criar Tabela Products)</span>
                  </h4>
                  <button
                    onClick={handleCopySql}
                    className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-[11px] rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copiado!' : 'Copiar SQL'}</span>
                  </button>
                </div>

                <p className="text-stone-700 text-[11px] leading-relaxed">
                  Para que os produtos sejam gravados no banco Supabase sem desaparecer:
                  <br />
                  1. Acesse seu painel no <strong>Supabase</strong> (<a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-amber-800 font-bold underline">supabase.com/dashboard</a>) e abra seu projeto.
                  <br />
                  2. Clique em <strong>SQL Editor</strong> no menu lateral esquerdo, cole o script abaixo e clique no botão verde <strong>"Run"</strong>.
                  <br />
                  3. Defina as variáveis <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono font-bold">SUPABASE_URL</code> e <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono font-bold">SUPABASE_KEY</code> nas configurações.
                  <br />
                  4. Clique no botão <strong>"Sincronizar Todos os Produtos para o Supabase"</strong> acima!
                </p>

                <div className="relative">
                  <pre className="p-4 bg-stone-900 text-amber-300 rounded-xl overflow-x-auto text-[11px] font-mono max-h-64 leading-relaxed">
                    {sqlSchema}
                  </pre>
                </div>
              </div>

            </div>
          )}


        </div>
      </div>

      {/* Edit Product Modal */}
      <EditProductModal
        product={editingProduct}
        isOpen={editingProduct !== null}
        onClose={() => setEditingProduct(null)}
        onSave={(updated) => {
          onUpdateProduct(updated);
          setEditingProduct(null);
        }}
      />

      {/* Collective / Bulk Import Modal */}
      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImportProducts={(newProds) => {
          if (onImportProducts) {
            onImportProducts(newProds);
          } else {
            newProds.forEach(p => onAddProduct(p));
          }
        }}
      />
    </div>
  );
};
