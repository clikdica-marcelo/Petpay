import React from 'react';
import { 
  BarChart3, 
  Smartphone, 
  Laptop, 
  RefreshCw, 
  TrendingUp, 
  DollarSign, 
  MousePointerClick 
} from 'lucide-react';
import { AffiliateSettings } from '../../types';

interface AdminAnalyticsTabProps {
  analyticsData: any;
  loadingAnalytics: boolean;
  onRefreshAnalytics: () => void;
  affiliateSettings: AffiliateSettings;
}

export const AdminAnalyticsTab: React.FC<AdminAnalyticsTabProps> = ({
  analyticsData,
  loadingAnalytics,
  onRefreshAnalytics,
  affiliateSettings,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Cliques Totais em Produtos
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-200/70 text-amber-800 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-stone-900">
            {analyticsData?.totalClicks || 0}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Rastreamento de interesse por oferta da vitrine
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Retorno Estimado
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-200/70 text-emerald-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-950">
            R$ {analyticsData?.totalEstimatedCommission?.toFixed(2) || '0.00'}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Taxa média de conversão em {affiliateSettings.commissionRateEstimate || 8.5}%
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-stone-100 border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Perfil de Dispositivos
            </span>
            <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs font-bold text-stone-800">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-stone-200">
              <Smartphone className="w-4 h-4 text-amber-700" />
              Mobile: {analyticsData?.deviceCounts?.mobile || 0}
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-stone-200">
              <Laptop className="w-4 h-4 text-stone-700" />
              Desktop: {analyticsData?.deviceCounts?.desktop || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Click Log Table */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-700" />
              <span>Últimos Cliques Registrados (Logs em Tempo Real)</span>
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Eventos recentes de redirecionamento para lojas parceiras.
            </p>
          </div>

          <button
            onClick={onRefreshAnalytics}
            disabled={loadingAnalytics}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 bg-white hover:bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-300 flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingAnalytics ? 'animate-spin' : ''}`} />
            <span>Atualizar Logs</span>
          </button>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-stone-100/70 border-b border-stone-200 font-bold text-stone-600">
              <tr>
                <th className="p-3">Produto</th>
                <th className="p-3">Origem</th>
                <th className="p-3 text-center">Dispositivo</th>
                <th className="p-3">Comissão Est.</th>
                <th className="p-3 text-right">Data/Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {analyticsData?.recentLogs && analyticsData.recentLogs.length > 0 ? (
                analyticsData.recentLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="p-3 font-semibold text-stone-900 truncate max-w-xs">
                      {log.productTitle}
                    </td>
                    <td className="p-3 text-stone-600 font-mono text-[11px]">
                      {log.referrer || 'Direto'}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded uppercase text-[10px] font-bold bg-stone-100 text-stone-700">
                        {log.deviceType}
                      </span>
                    </td>
                    <td className="p-3 font-extrabold text-emerald-800">
                      R$ {log.estimatedCommission?.toFixed(2) || '0.00'}
                    </td>
                    <td className="p-3 text-stone-400 text-[11px] text-right">
                      {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-stone-400">
                    Nenhum clique registrado ainda nesta sessão.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
