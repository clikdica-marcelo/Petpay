const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const toolbar = `{isAdminLogged && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-end">
          <button
            onClick={() => setIsBannerEditMode(!isBannerEditMode)}
            className={\`flex items-center gap-2 px-4 py-2 text-white text-sm font-bold rounded-full transition-colors shadow-sm \${isBannerEditMode ? 'bg-amber-700 hover:bg-amber-600 ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-100' : 'bg-amber-900 hover:bg-amber-800'}\`}
            title="Editar vitrine"
          >
            <Sparkles className={\`w-4 h-4 \${isBannerEditMode ? 'text-amber-200' : ''}\`} />
            {isBannerEditMode ? "Sair da Edição" : "Editar vitrine"}
          </button>
        </div>
      )}`;

code = code.replace(
  /\{isAdminLogged && \([\s\S]*?\}\)/,
  toolbar
);

code = code.replace(
  '        onEditBanner={(b) => { setBannerToEdit(b); setIsBannerManagerOpen(true); }}',
  '        onEditBanner={(b) => { setBannerToEdit(b); setIsBannerManagerOpen(true); }}\n        onAddBannerTrigger={() => { setBannerToEdit(null); setIsBannerManagerOpen(true); }}'
);

fs.writeFileSync('src/App.tsx', code);
