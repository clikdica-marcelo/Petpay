const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'const [isBannerManagerOpen, setIsBannerManagerOpen] = useState(false);',
  'const [isBannerManagerOpen, setIsBannerManagerOpen] = useState(false);\n  const [bannerToEdit, setBannerToEdit] = useState<Banner | null>(null);'
);

code = code.replace(
  '      <BannerHero\n        onSelectCategory',
  '      <BannerHero\n        isAdminMode={isAdminLogged}\n        onEditBanner={(b) => { setBannerToEdit(b); setIsBannerManagerOpen(true); }}\n        onDeleteBanner={handleDeleteBanner}\n        onSelectCategory'
);

code = code.replace(
  '      <BannerManagerModal\n        isOpen={isBannerManagerOpen}',
  '      <BannerManagerModal\n        isOpen={isBannerManagerOpen}\n        editingBanner={bannerToEdit}\n        setEditingBanner={setBannerToEdit}'
);

fs.writeFileSync('src/App.tsx', code);
