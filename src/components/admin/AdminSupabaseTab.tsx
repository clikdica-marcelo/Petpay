import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { Product } from '../../types';

interface AdminSupabaseTabProps {
  products: Product[];
  supabaseStatus: {
    configured: boolean;
    connected: boolean;
    url?: string | null;
    totalProducts?: number;
    message?: string;
  } | null;
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
  sqlSchema: string;
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
  sqlSchema,
}) => {
  const [copiedSql, setCopiedSql] = useState(false);

  const handleCopySql = () => {
    if (!sqlSchema) return;
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-6 text-xs animate-in fade-in duration-150">
      {/* Feedback Alert if any */}
      {syncFeedback && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3 border ${
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
      <div className="p-5 rounded-2xl border bg-white shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                supabaseStatus?.connected
                  ? 'bg-emerald-100 text-emerald-700'
                  : supabaseStatus?.configured
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
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
                {supabaseStatus?.message ||
                  (isCheckingSupabase ? 'Verificando conexão...' : 'Verifique o status do seu banco de dados.')}
              </p>
            </div>
          </div>

          <button
            onClick={onCheckSupabaseStatus}
            disabled={isCheckingSupabase}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingSupabase ? 'animate-spin' : ''}`} />
            <span>Verificar Conexão</span>
          </button>
        </div>

        {/* Quick Action Buttons for Sync */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
          <button
            onClick={onSyncAllToSupabase}
            disabled={isSyncingSupabase}
            className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSyncingSupabase ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Enviando produtos para a nuvem...</span>
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4" />
                <span>Salvar Tudo no Supabase ({products.length} itens)</span>
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
                <span>Carregando do banco...</span>
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

      {/* Backup & Restore Tools */}
      <div className="p-5 rounded-2xl border bg-white shadow-2xs space-y-4">
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

      {/* SQL Script Box */}
      <div className="p-5 rounded-2xl border bg-stone-900 text-stone-300 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white text-xs">
              Script SQL para Criação da Tabela no Supabase
            </span>
          </div>

          <button
            onClick={handleCopySql}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-stone-700 self-start sm:self-auto"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? 'Copiado!' : 'Copiar SQL'}</span>
          </button>
        </div>

        <p className="text-[11px] text-stone-400">
          Abra o <strong>SQL Editor</strong> no painel do seu Supabase, cole o código abaixo e clique em <strong>Run</strong>.
        </p>

        <pre className="p-3 bg-stone-950 rounded-xl font-mono text-[10px] text-amber-200/90 overflow-x-auto max-h-48 border border-stone-800">
          {sqlSchema || '-- Carregando schema SQL...'}
        </pre>
      </div>
    </div>
  );
};
