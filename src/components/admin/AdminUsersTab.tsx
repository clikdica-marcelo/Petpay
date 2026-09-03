import React, { useState } from 'react';
import { Users, RefreshCw, Search, ShieldCheck, Heart, UserCheck } from 'lucide-react';
import { UserAccount } from '../../types';

interface AdminUsersTabProps {
  registeredUsers: UserAccount[];
  loadingUsers: boolean;
  onRefreshUsers: () => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  registeredUsers,
  loadingUsers,
  onRefreshUsers,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = registeredUsers.filter((u) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.petName && u.petName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-700" />
            <span>Membros & Tutores Cadastrados</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
              {registeredUsers.length} membros
            </span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            O cadastro de clientes na loja é opcional. Abaixo estão os tutores que criaram perfil.
          </p>
        </div>

        <button
          onClick={onRefreshUsers}
          disabled={loadingUsers}
          className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin' : ''}`} />
          <span>Atualizar Lista</span>
        </button>
      </div>

      {/* Search in members */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar membro por nome, e-mail ou nome do pet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-700"
        />
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Tutor / Usuário</th>
                <th className="py-3 px-4">E-mail</th>
                <th className="py-3 px-4">Função</th>
                <th className="py-3 px-4">Pet Cadastrado</th>
                <th className="py-3 px-4 text-right">Data de Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filtered.length > 0 ? (
                filtered.map((u) => {
                  const isAdmin = u.role === 'admin' || u.email === 'clikdica@gmail.com';
                  return (
                    <tr key={u.id} className="hover:bg-amber-50/20 transition-colors">
                      <td className="py-3 px-4 font-bold text-stone-900 flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs text-white shrink-0 ${
                            isAdmin ? 'bg-amber-700' : 'bg-emerald-600'
                          }`}
                        >
                          {isAdmin ? '👑' : '🐾'}
                        </div>
                        <span className="truncate max-w-xs">{u.name || 'Tutor Pet'}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-600">
                        {u.email}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isAdmin ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300">
                            Administrador
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Membro VIP
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[11px] whitespace-nowrap">
                        {u.petName ? (
                          <span className="font-semibold text-stone-800 flex items-center gap-1">
                            <span>{u.petType === 'cat' ? '🐱' : u.petType === 'dog' ? '🐶' : '🐾'}</span>
                            <span>{u.petName}</span>
                          </span>
                        ) : (
                          <span className="text-stone-400 italic">Não informado</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-stone-500 text-[11px] text-right whitespace-nowrap">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-stone-400">
                    Nenhum membro encontrado.
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
