const fs = require('fs');
let code = fs.readFileSync('src/components/BannerHero.tsx', 'utf8');

const adminControls = `
        {isAdminMode && !(banner as any).productObject && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onEditBanner) onEditBanner(banner);
              }}
              className="px-3 py-2 bg-stone-900/80 hover:bg-stone-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 backdrop-blur-md border border-white/10 transition-colors shadow-lg cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
              Editar Quadro
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onDeleteBanner && window.confirm('Deseja realmente excluir este quadro?')) {
                  onDeleteBanner(banner.id);
                }
              }}
              className="px-3 py-2 bg-rose-900/80 hover:bg-rose-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 backdrop-blur-md border border-white/10 transition-colors shadow-lg cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          </div>
        )}
`;

code = code.replace(
  '        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 lg:opacity-40 pointer-events-none hidden md:block">',
  adminControls + '        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 lg:opacity-40 pointer-events-none hidden md:block">'
);

fs.writeFileSync('src/components/BannerHero.tsx', code);
