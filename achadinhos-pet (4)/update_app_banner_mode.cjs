const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('isBannerEditMode')) {
  code = code.replace(
    'const [bannerToEdit, setBannerToEdit] = useState<Banner | null>(null);',
    'const [bannerToEdit, setBannerToEdit] = useState<Banner | null>(null);\n  const [isBannerEditMode, setIsBannerEditMode] = useState(false);'
  );
}

code = code.replace(
  'onClick={() => setIsBannerManagerOpen(true)}',
  'onClick={() => setIsBannerEditMode(!isBannerEditMode)}'
);

code = code.replace(
  '<Sparkles className="w-4 h-4" />',
  '{isBannerEditMode ? <Sparkles className="w-4 h-4 text-amber-200" /> : <Sparkles className="w-4 h-4" />}'
);

code = code.replace(
  'Gerenciar Quadros / Banners',
  '{isBannerEditMode ? "Modo de Edição Ativo (Clique no quadro)" : "Gerenciar Quadros / Banners"}'
);

code = code.replace(
  'isAdminMode={isAdminLogged}',
  'isAdminMode={isAdminLogged && isBannerEditMode}'
);

fs.writeFileSync('src/App.tsx', code);
