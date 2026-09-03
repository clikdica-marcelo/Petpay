import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Database, 
  RefreshCw, 
  Download, 
  Upload, 
  RotateCcw, 
  Copy, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  Code,
  X,
  Key,
  Globe,
  ShieldCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Product } from '../../types';
import { 
  getSupabaseCredentials, 
  saveSupabaseCredentials, 
  SUPABASE_SQL_SCHEMA, 
  SupabaseStatusResult 
} from '../../utils/supabaseClient';

interface AdminSupabaseTabProps {
  products: Product[];
  supabaseStatus: SupabaseStatusResult | null;
  isCheckingSupabase: boolean;
  onCheckSupabaseStatus: () => void;
  isSyncingSupabase: boolean;
  onSyncAllToSupabase: () => void;
  isLoadingFromSupabase: boolean;
  onReloadFromSupabase: () => void;
  syncFeedback: { type: 'success' | 'error'; text: string } | null;
  onClearSyncFeedback: () => void;
  onDownloadBackup: () => void;
  onImportBackupFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRestoreStarterCatalog: () => void;
  sqlSchema?: string;
  onSaveCredentials?: (url: string, key: string) => void;
}

export const AdminSupabaseTab: React.FC<AdminSupabaseTabProps> = ({
  products,
  supabaseStatus,
  isCheckingSupabase,
  onCheckSupabaseStatus,
  isSyncingSupabase,
  onSyncAllToSupabase,
  isLoadingFromSupabase,
  onReloadFromSupabase,
  syncFeedback,
  onClearSyncFeedback,
  onDownloadBackup,
  onImportBackupFile,
  onRestoreStarterCatalog,
  sqlSchema = SUPABASE_SQL_SCHEMA,
  onSaveCredentials,
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [isSavedLocal, setIsSavedLocal] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Initialize input fields with detected credentials
  useEffect(() => {
    const creds = getSupabaseCredentials();
    if (creds.url) setInputUrl(creds.url);
    if (creds.key) setInputKey(creds.key);
  }, [supabaseStatus]);

  const handleCopySql = () => {
    const scriptToCopy = sqlSchema || SUPABASE_SQL_SCHEMA;
    navigator.clipboard.writeText(scriptToCopy);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSaveAndTest = () => {
    saveSupabaseCredentials(inputUrl, inputKey);
    setIsSavedLocal(true);
    setTimeout(() => setIsSavedLocal(false), 3000);
    if (onSaveCredentials) {
      onSaveCredentials(inputUrl, inputKey);
    }
    onCheckSupabaseStatus();
  };

  const activeSchema = sqlSchema || SUPABASE_SQL_SCHEMA;

  return (
    <div className="space-y-6 text-xs animate-in fade-in duration-150">
      {/* Feedback Alert if any */}
      {syncFeedback && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3 border shadow-xs ${
            syncFeedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {syncFeedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-bold text-xs">{syncFeedback.text}</p>
          </div>
          <button
            onClick={onClearSyncFeedback}
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
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                supabaseStatus?.connected
                  ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500/20'
                  : supabaseStatus?.configured
                  ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-500/20'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-stone-900 text-sm">
                  Status da Conexão Supabase
                </h4>
                {supabaseStatus?.connected ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Ativo & Conectado à Nuvem
                  </span>
                ) : supabaseStatus?.needTable ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                    Tabela Não Encontrada (Criar via SQL)
                  </span>
                ) : supabaseStatus?.configured ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                    Chaves Detectadas · Verificando
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-stone-100 text-stone-700 border border-stone-300">
                    Modo Local (Aguardando Conexão)
                  </span>
                )}
              </div>
              <p className="text-stone-600 text-[11px] mt-1 leading-relaxed">
                {supabaseStatus?.message ||
                  (isCheckingSupabase ? 'Verificando comunicação com o banco de dados...' : 'Acompanhe a sincronização dos produtos entre o preview e a Vercel.')}
              </p>
              {supabaseStatus?.url && (
                <p className="text-[10px] font-mono text-stone-400 mt-0.5 truncate max-w-md">
                  URL: {supabaseStatus.url}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onCheckSupabaseStatus}
            disabled={isCheckingSupabase}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 self-start sm:self-auto transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingSupabase ? 'animate-spin text-amber-600' : ''}`} />
            <span>{isCheckingSupabase ? 'Testando...' : 'Verificar Conexão'}</span>
          </button>
        </div>

        {/* Quick Action Buttons for Sync */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-100">
          <button
            onClick={onSyncAllToSupabase}
            disabled={isSyncingSupabase}
            className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isSyncingSupabase ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Enviando produtos para a nuvem...</span>
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4" />
                <span>Sincronizar Tudo para o Supabase ({products.length} itens)</span>
              </>
            )}
          </button>

          <button
            onClick={onReloadFromSupabase}
            disabled={isLoadingFromSupabase}
            className="p-3.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold rounded-xl flex items-center justify-center gap-2 border border-amber-500/30 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoadingFromSupabase ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Carregando do banco de dados...</span>
              </>
            ) : (
              <>
                <Database className="w-4 h-4 text-amber-400" />
                <span>Carregar Produtos do Supabase</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Manual Supabase Credentials Manager (Works both on Vercel and Preview) */}
      <div className="p-5 rounded-2xl border bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-700" />
            <h4 className="font-bold text-stone-900 text-sm">
              Configurar Chaves de Acesso do Supabase
            </h4>
          </div>
          <span className="text-[11px] text-stone-500">
            Funciona diretamente no navegador na Vercel e no Preview
          </span>
        </div>

        <p className="text-stone-600 text-xs leading-relaxed">
          Você pode usar as variáveis de ambiente na Vercel (<strong>SUPABASE_URL</strong> e <strong>SUPABASE_KEY</strong>) ou colar suas chaves diretamente abaixo para conectar instantaneamente:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-stone-700 block mb-1 text-xs">
              Project URL do Supabase
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="https://exemplo.supabase.co"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-stone-700 text-xs">
                Chave de API (Anon / Public ou Service Role)
              </label>
              <button
                type="button"
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="text-[10px] text-amber-800 font-bold hover:underline cursor-pointer"
              >
                {showKeyInput ? 'Ocultar chave' : 'Mostrar chave'}
              </button>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showKeyInput ? 'text' : 'password'}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>As chaves são salvas com criptografia padrão local no seu navegador.</span>
          </div>

          <button
            type="button"
            onClick={handleSaveAndTest}
            disabled={!inputUrl.trim() || !inputKey.trim()}
            className="px-5 py-2.5 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            {isSavedLocal ? (
              <>
                <Check className="w-4 h-4 text-amber-200" />
                <span>Salvo & Testando...</span>
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4" />
                <span>Salvar & Conectar Agora</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Passo a Passo para Conexão Impecável */}
      <div className="p-5 rounded-2xl border bg-amber-50/70 border-amber-200/80 space-y-3">
        <h4 className="font-bold text-amber-950 text-xs flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-700" />
          <span>Guia Rápido: 3 Passos para a Conexão Perfeita</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-amber-900">
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60">
            <span className="font-bold text-stone-900 block mb-1">1. Tabela no Supabase</span>
            Copie o Script SQL abaixo, abra o <strong>SQL Editor</strong> do seu Supabase e clique em <strong>Run</strong> para criar a tabela e liberar as políticas RLS.
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60">
            <span className="font-bold text-stone-900 block mb-1">2. Chaves na Vercel</span>
            Na Vercel, em <em>Settings &gt; Environment Variables</em>, adicione <code>SUPABASE_URL</code> e <code>SUPABASE_KEY</code>.
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60">
            <span className="font-bold text-stone-900 block mb-1">3. Redeploy na Vercel</span>
            Vá na aba <strong>Deployments</strong> da Vercel, clique nos três pontinhos <code>...</code> e selecione <strong>Redeploy</strong> (sem cache).
          </div>
        </div>
      </div>

      {/* SQL Script Box */}
      <div className="p-5 rounded-2xl border bg-stone-900 text-stone-300 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white text-xs">
              Script SQL para Criação da Tabela & Políticas (Supabase)
            </span>
          </div>

          <button
            onClick={handleCopySql}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-stone-700 self-start sm:self-auto transition-colors"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? 'Copiado para a Área de Transferência!' : 'Copiar Script SQL'}</span>
          </button>
        </div>

        <p className="text-[11px] text-stone-400">
          Abra o <strong>SQL Editor</strong> no painel do seu Supabase, cole o código abaixo e clique em <strong>Run</strong>. Este script cria a tabela, todos os campos compatíveis e as permissões públicas necessárias para a vitrine ler e cadastrar produtos.
        </p>

        <pre className="p-3 bg-stone-950 rounded-xl font-mono text-[10px] text-amber-200/90 overflow-x-auto max-h-56 border border-stone-800 leading-relaxed select-all">
          {activeSchema}
        </pre>
      </div>

      {/* Backup & Restore Tools */}
      <div className="p-5 rounded-2xl border bg-white shadow-xs space-y-4">
        <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-700" />
          <span>Segurança, Backup em Arquivo JSON & Restauração</span>
        </h4>
        <p className="text-stone-500 text-xs">
          Faça download de cópias completas do catálogo para guardar no computador ou transferir para outro ambiente.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={onDownloadBackup}
            className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-stone-600" />
            <span>Baixar Backup JSON</span>
          </button>

          <label className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors text-center">
            <Upload className="w-4 h-4 text-stone-600" />
            <span>Restaurar de JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={onImportBackupFile}
              className="hidden"
            />
          </label>

          <button
            onClick={onRestoreStarterCatalog}
            className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-amber-700" />
            <span>Restaurar Catálogo Padrão</span>
          </button>
        </div>
      </div>
    </div>
  );
};
