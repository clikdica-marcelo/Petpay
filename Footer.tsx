import React from 'react';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Tag, 
  Truck, 
  ExternalLink, 
  Heart,
  HelpCircle,
  PackageCheck,
  User,
  Settings
} from 'lucide-react';
import { ProductCategory, UserAccount } from '../types';
import { OFFICIAL_CATEGORIES } from '../data/mockProducts';
import { PetAchadinhosLogo } from './PetAchadinhosLogo';

interface FooterProps {
  onSelectCategory: (category: ProductCategory | 'todas') => void;
  onOpenAdmin: () => void;
  onOpenAuth?: () => void;
  currentUser?: UserAccount | null;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAdmin,
  onOpenAuth,
  currentUser
}) => {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-12 pb-8 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          
          {/* Col 1: Brand & Affiliate Disclosure */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <PetAchadinhosLogo size="sm" />
              <span className="font-black text-lg text-white tracking-tight">
                Achadinhos <span className="text-amber-400">Pet</span>
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              O seu portal de achadinhos e vitrine de produtos Pet. Encontramos as melhores ofertas, avaliações reais e cupons de frete grátis para o seu pet.
            </p>
            <div className="pt-2 text-[11px] text-stone-500 space-y-1">
              <p className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Curadoria de Lojas Oficiais</span>
              </p>
              <p className="flex items-center gap-1">
                <PackageCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Ofertas Verificadas e Atualizadas</span>
              </p>
            </div>
          </div>

          {/* Col 2: Categories by Department */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Departamentos Pet
            </h4>
            <ul className="space-y-2 text-stone-400">
              {OFFICIAL_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button 
                    onClick={() => onSelectCategory(cat.id)} 
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
              <li>
                <button 
                  onClick={() => onSelectCategory('todas')} 
                  className="text-amber-400 hover:underline font-semibold cursor-pointer"
                >
                  Ver Todos os Departamentos →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Smart Tools & Navigation */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Recursos do Portal
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <span className="text-stone-400">
                  Cupons & Ofertas Relâmpago
                </span>
              </li>
              <li>
                <span className="text-stone-400">
                  Garantia de Compra e Entrega
                </span>
              </li>
              <li>
                <span className="text-stone-400">
                  Curadoria de Produtos 5 Estrelas
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Transparency Notice */}
          <div className="space-y-2 bg-stone-900/60 p-4 rounded-2xl border border-stone-800/80">
            <h4 className="font-bold text-amber-400 text-xs flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              Segurança & Garantia
            </h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Selecionamos e reunimos as melhores ofertas e produtos de lojas oficiais e vendedores verificados. O pagamento, envio, rastreio e garantia são realizados diretamente na loja oficial do produto com total segurança.
            </p>
          </div>

        </div>

        {/* Bottom Bar with discrete Member / Admin Access */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
          <p>© {new Date().getFullYear()} Achadinhos Pet. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Privacidade & Termos</span>
            <span>Catálogo Ativo</span>

            {/* Member Account / Login */}
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                title={currentUser ? `Conta: ${currentUser.email}` : "Entrar ou cadastrar-se"}
              >
                <User className="w-3 h-3 text-stone-400" />
                <span>{currentUser ? (currentUser.role === 'admin' ? 'Perfil Admin' : 'Minha Conta') : 'Área do Membro'}</span>
              </button>
            )}

            {/* Admin Management Button (apenas quando logado como admin) */}
            {currentUser?.role === 'admin' && (
              <button 
                onClick={onOpenAdmin}
                className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                title="Abrir Painel de Gestão do Site"
              >
                <Settings className="w-3 h-3" />
                <span>Gestão do Site</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
