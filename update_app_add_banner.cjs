const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const toolbar = `{isAdminLogged && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-end gap-3">
          {isBannerEditMode && (
            <button
              onClick={() => { setBannerToEdit(null); setIsBannerManagerOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white text-sm font-bold rounded-full hover:bg-emerald-600 transition-colors shadow-sm animate-in fade-in zoom-in"
              title="Adicionar Novo Quadro"
            >
              <Sparkles className="w-4 h-4" />
              Adicionar Novo Quadro
            </button>
          )}
          <button
            onClick={() => setIsBannerEditMode(!isBannerEditMode)}
            className={\`flex items-center gap-2 px-4 py-2 text-white text-sm font-bold rounded-full transition-colors shadow-sm \${isBannerEditMode ? 'bg-amber-700 hover:bg-amber-600 ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-100' : 'bg-amber-900 hover:bg-amber-800'}\`}
            title="Gerenciar Banners do Hero"
          >
            {isBannerEditMode ? <Sparkles className="w-4 h-4 text-amber-200" /> : <Sparkles className="w-4 h-4" />}
            {isBannerEditMode ? "Modo de Edição Ativo" : "Gerenciar Quadros / Banners"}
          </button>
        </div>
      )}`;

code = code.replace(
  /\{isAdminLogged && \([\s\S]*?\}\)/,
  toolbar
);

fs.writeFileSync('src/App.tsx', code);
