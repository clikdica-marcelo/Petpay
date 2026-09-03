const fs = require('fs');
let code = fs.readFileSync('src/components/BannerHero.tsx', 'utf8');

// Add Plus to imports
code = code.replace(
  '  Trash2\n} from \'lucide-react\';',
  '  Trash2,\n  Plus\n} from \'lucide-react\';'
);

// Add to props interface
code = code.replace(
  '  onDeleteBanner?: (bannerId: string) => void;\n}',
  '  onDeleteBanner?: (bannerId: string) => void;\n  onAddBannerTrigger?: () => void;\n}'
);

// Add to destructured props
code = code.replace(
  '  onDeleteBanner\n}) => {',
  '  onDeleteBanner,\n  onAddBannerTrigger\n}) => {'
);

// Update rendering logic
const emptyState = `  if (dynamicSlides.length === 0) {
    if (isAdminMode) {
      return (
        <section className="relative overflow-hidden bg-stone-900 text-white min-h-[200px] flex items-center justify-center border-2 border-dashed border-stone-700 mx-4 sm:mx-6 lg:mx-8 my-8 rounded-3xl">
          <button
            onClick={onAddBannerTrigger}
            className="flex flex-col items-center gap-3 text-stone-400 hover:text-white transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center">
              <Plus className="w-8 h-8" />
            </div>
            <span className="font-bold text-lg">Adicionar Novo Quadro (Banner)</span>
          </button>
        </section>
      );
    }
    return null;
  }`;

code = code.replace(
  '  if (dynamicSlides.length === 0) return null;',
  emptyState
);

const adminControls = `        {isAdminMode && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-2">
            {onAddBannerTrigger && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddBannerTrigger();
                }}
                className="px-3 py-2 bg-emerald-700/90 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 backdrop-blur-md border border-white/10 transition-colors shadow-lg cursor-pointer"
                title="Inserir Novo"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Inserir Novo</span>
              </button>
            )}
            {!(banner as any).productObject && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEditBanner) onEditBanner(banner);
                  }}
                  className="px-3 py-2 bg-stone-900/80 hover:bg-stone-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 backdrop-blur-md border border-white/10 transition-colors shadow-lg cursor-pointer"
                  title="Editar Quadro"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Editar</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDeleteBanner) {
                      onDeleteBanner(banner.id);
                    }
                  }}
                  className="px-3 py-2 bg-rose-900/80 hover:bg-rose-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 backdrop-blur-md border border-white/10 transition-colors shadow-lg cursor-pointer"
                  title="Excluir Quadro"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Excluir</span>
                </button>
              </>
            )}
          </div>
        )}`;

code = code.replace(
  /\{isAdminMode && \!\(banner as any\)\.productObject && \([\s\S]*?\}\)/,
  adminControls
);

fs.writeFileSync('src/components/BannerHero.tsx', code);
