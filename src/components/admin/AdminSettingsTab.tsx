import React, { useState } from 'react';
import { 
  Settings, 
  KeyRound, 
  Save, 
  Check, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  Cloud,
  Database,
  Download,
  Upload,
  RotateCcw,
  Copy,
  Code,
  Search,
  Globe,
  ExternalLink
} from 'lucide-react';
import { AffiliateSettings, Product } from '../../types';

interface AdminSettingsTabProps {
  affiliateSettings: AffiliateSettings;
  onUpdateSettings: (settings: AffiliateSettings) => void;
  products?: Product[];
  supabaseStatus?: {
    configured: boolean;
    connected: boolean;
    url?: string | null;
    totalProducts?: number;
    message?: string;
  } | null;
  onDownloadBackup?: () => void;
  onImportBackupFile?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRestoreStarterCatalog?: () => void;
  sqlSchema?: string;
  onNavigateToSupabase?: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  affiliateSettings,
  onUpdateSettings,
  products = [],
  supabaseStatus,
  onDownloadBackup,
  onImportBackupFile,
  onRestoreStarterCatalog,
  sqlSchema,
  onNavigateToSupabase,
}) => {
  const [tempSettings, setTempSettings] = useState<AffiliateSettings>(affiliateSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [copiedRobots, setCopiedRobots] = useState(false);

  const handleCopySql = () => {
    if (!sqlSchema) return;
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleCopySitemapUrl = () => {
    const sitemapUrl = `${window.location.origin}/sitemap.xml`;
    navigator.clipboard.writeText(sitemapUrl);
    setCopiedSitemap(true);
    setTimeout(() => setCopiedSitemap(false), 2500);
  };

  const handleCopyRobotsUrl = () => {
    const robotsUrl = `${window.location.origin}/robots.txt`;
    navigator.clipboard.writeText(robotsUrl);
    setCopiedRobots(true);
    setTimeout(() => setCopiedRobots(false), 2500);
  };

  // Password change state
  const [adminOldPassword, setAdminOldPassword] = useState('');
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSaveSettings = () => {
    onUpdateSettings(tempSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleAdminChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeStatus(null);

    if (!adminNewPassword || adminNewPassword.length < 6) {
      setPasswordChangeStatus({
        type: 'error',
        text: 'A nova senha deve possuir pelo menos 6 caracteres.',
      });
      return;
    }

    if (adminNewPassword !== adminConfirmPassword) {
      setPasswordChangeStatus({
        type: 'error',
        text: 'A confirmação de senha não confere com a nova senha digitada.',
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/auth/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'clikdica@gmail.com',
          currentPassword: adminOldPassword,
          newPassword: adminNewPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Falha ao atualizar a senha.');
      }
      setPasswordChangeStatus({
        type: 'success',
        text: 'Senha do administrador alterada com sucesso!',
      });
      setAdminOldPassword('');
      setAdminNewPassword('');
      setAdminConfirmPassword('');
    } catch (err: any) {
      setPasswordChangeStatus({
        type: 'error',
        text: err.message || 'Erro de conexão ao alterar a senha.',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 text-xs animate-in fade-in duration-150">
      {/* General Settings */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-100 pb-3">
          <Settings className="w-4 h-4 text-amber-700" />
          <span>Configurações do Portal & Rastreamento</span>
        </h4>

        <div>
          <label className="font-bold text-stone-800 block mb-1">
            Identificador de Parceiro Shopee (Partner ID)
          </label>
          <input
            type="text"
            value={tempSettings.affiliateId}
            onChange={(e) => setTempSettings({ ...tempSettings, affiliateId: e.target.value })}
            className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-700"
          />
          <p className="text-[11px] text-stone-400 mt-1">
            Código de identificação de parceiro para vincular às comissões.
          </p>
        </div>

        <div>
          <label className="font-bold text-stone-800 block mb-1">
            Prefixo de Campanha (Tag / SubID)
          </label>
          <input
            type="text"
            value={tempSettings.subIdPrefix}
            onChange={(e) => setTempSettings({ ...tempSettings, subIdPrefix: e.target.value })}
            className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-700"
          />
          <p className="text-[11px] text-stone-400 mt-1">
            Identificador para separar cliques nos relatórios de desempenho.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-stone-800 block mb-1">
              Estimativa Média de Comissão (%)
            </label>
            <input
              type="number"
              step="0.5"
              value={tempSettings.commissionRateEstimate}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  commissionRateEstimate: parseFloat(e.target.value) || 8.5,
                })
              }
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-700"
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
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-700"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2.5 bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            {settingsSaved ? <Check className="w-4 h-4 text-amber-200" /> : <Save className="w-4 h-4" />}
            <span>{settingsSaved ? 'Configurações Salvas!' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>

      {/* Administrator Password Change Section */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-bold text-stone-900 text-sm">
              Segurança & Senha do Administrador
            </h5>
            <p className="text-[11px] text-stone-500">
              Conta: <strong className="text-stone-700">clikdica@gmail.com</strong>
            </p>
          </div>
        </div>

        {passwordChangeStatus && (
          <div
            className={`p-3 rounded-xl flex items-center gap-2 text-xs border ${
              passwordChangeStatus.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {passwordChangeStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{passwordChangeStatus.text}</span>
          </div>
        )}

        <form onSubmit={handleAdminChangePassword} className="space-y-3">
          <div>
            <label className="font-bold text-stone-700 block mb-1">
              Senha Atual
            </label>
            <div className="relative">
              <input
                type={showAdminPassword ? 'text' : 'password'}
                required
                placeholder="Digite a senha atual"
                value={adminOldPassword}
                onChange={(e) => setAdminOldPassword(e.target.value)}
                className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs pr-10 focus:outline-none focus:border-amber-700"
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Nova Senha (Mínimo 6 dígitos)
              </label>
              <input
                type={showAdminPassword ? 'text' : 'password'}
                required
                placeholder="Nova senha"
                value={adminNewPassword}
                onChange={(e) => setAdminNewPassword(e.target.value)}
                className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-700"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Confirmar Nova Senha
              </label>
              <input
                type={showAdminPassword ? 'text' : 'password'}
                required
                placeholder="Repita a nova senha"
                value={adminConfirmPassword}
                onChange={(e) => setAdminConfirmPassword(e.target.value)}
                className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs border border-amber-500/30 transition-colors"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>{isChangingPassword ? 'Atualizando senha...' : 'Salvar Nova Senha'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Cloud Database & Automatic Sync Status */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-amber-700" />
          <h4 className="font-bold text-stone-900 text-sm">
            Banco de Dados & Sincronização Automática
          </h4>
        </div>
        <p className="text-stone-500 text-xs">
          A sincronização de produtos ocorre de forma <strong>100% automática</strong> em segundo plano a cada criação, edição ou remoção de produtos, sem necessidade de intervenção manual.
        </p>

        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-3 h-3 rounded-full shrink-0 ${supabaseStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <div>
              <span className="font-bold text-stone-800 block">
                {supabaseStatus?.connected ? 'Supabase Conectado & Sincronizado' : 'Modo Armazenamento Local Ativo'}
              </span>
              <span className="text-[11px] text-stone-500">
                {supabaseStatus?.connected 
                  ? `Conexão ativa na nuvem. ${products.length} itens sincronizados.`
                  : 'Os produtos estão salvos com segurança no navegador e na memória.'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {supabaseStatus?.connected ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Automático
              </span>
            ) : null}
            {onNavigateToSupabase && (
              <button
                type="button"
                onClick={onNavigateToSupabase}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-bold text-xs cursor-pointer transition-colors shadow-2xs"
              >
                {supabaseStatus?.connected ? 'Configurar Conexão' : 'Conectar Supabase →'}
              </button>
            )}
          </div>
        </div>

        {/* Backup & Restore Tools */}
        {(onDownloadBackup || onImportBackupFile || onRestoreStarterCatalog) && (
          <div className="pt-3 border-t border-stone-100 space-y-3">
            <h5 className="font-bold text-stone-800 text-xs flex items-center gap-1.5">
              <Database className="w-4 h-4 text-stone-500" />
              <span>Backup em Arquivo JSON & Restauração</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {onDownloadBackup && (
                <button
                  type="button"
                  onClick={onDownloadBackup}
                  className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-xs"
                >
                  <Download className="w-3.5 h-3.5 text-stone-600" />
                  <span>Baixar Backup</span>
                </button>
              )}

              {onImportBackupFile && (
                <label className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-xs text-center">
                  <Upload className="w-3.5 h-3.5 text-stone-600" />
                  <span>Restaurar JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={onImportBackupFile}
                    className="hidden"
                  />
                </label>
              )}

              {onRestoreStarterCatalog && (
                <button
                  type="button"
                  onClick={onRestoreStarterCatalog}
                  className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                  <span>Catálogo Padrão</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Optional SQL Schema Accordion/Box */}
        {sqlSchema && (
          <div className="pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-semibold text-stone-700 text-xs flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-amber-600" />
                Script SQL da Tabela (Supabase)
              </span>
              <button
                type="button"
                onClick={handleCopySql}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedSql ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSql ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="p-3 bg-stone-900 text-amber-200/90 rounded-xl font-mono text-[10px] overflow-x-auto max-h-32 border border-stone-800">
              {sqlSchema}
            </pre>
          </div>
        )}
      </div>

      {/* SEO, Google Search Console & Sitemap */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <Search className="w-5 h-5 text-amber-700" />
          <div>
            <h4 className="font-bold text-stone-900 text-sm">
              SEO & Indexação no Google Search Console
            </h4>
            <p className="text-[11px] text-stone-500">
              Arquivos otimizados para busca orgânica, ranqueamento de ofertas e indexação pelo Googlebot.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Sitemap Box */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-700" />
                  Sitemap XML
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  Google & Bing
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Lista todas as categorias, páginas e {products.length} produtos para os robôs do Google.
              </p>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={handleCopySitemapUrl}
                className="flex-1 px-2.5 py-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                {copiedSitemap ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSitemap ? 'URL Copiada!' : 'Copiar URL do Sitemap'}</span>
              </button>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg flex items-center justify-center transition-colors shadow-2xs"
                title="Abrir sitemap.xml"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Robots.txt Box */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  Robots.txt
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Liberado
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Instrui os rastreadores a indexar todas as ofertas públicas e aponta o sitemap.
              </p>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={handleCopyRobotsUrl}
                className="flex-1 px-2.5 py-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                {copiedRobots ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedRobots ? 'URL Copiada!' : 'Copiar URL Robots'}</span>
              </button>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg flex items-center justify-center transition-colors shadow-2xs"
                title="Abrir robots.txt"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Search Console Guide Box */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-950 space-y-1.5">
          <span className="font-bold block text-amber-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
            Como enviar ao Google Search Console:
          </span>
          <ol className="list-decimal pl-4 space-y-1 text-amber-900/90 leading-relaxed">
            <li>Acesse o <strong>Google Search Console</strong> com sua conta Google.</li>
            <li>Adicione a propriedade com o domínio oficial do seu site: <code>https://achadinhospet.net</code>.</li>
            <li>No menu lateral, clique em <strong>Sitemaps</strong>.</li>
            <li>No campo de envio, digite <code>sitemap.xml</code> e clique em <strong>Enviar</strong>.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
