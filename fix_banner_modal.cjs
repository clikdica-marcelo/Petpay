const fs = require('fs');
let code = fs.readFileSync('src/components/BannerManagerModal.tsx', 'utf8');

code = code.replace(
  '  editingBanner?: Banner | null;',
  '  editingBanner?: Banner | null;\n  prefillBanner?: Banner | null;'
);

code = code.replace(
  '  editingBanner: externalEditingBanner,\n  setEditingBanner: externalSetEditingBanner,',
  '  editingBanner: externalEditingBanner,\n  setEditingBanner: externalSetEditingBanner,\n  prefillBanner,'
);

const newEffect = `  // Sync external banner to form
  React.useEffect(() => {
    if (externalEditingBanner) {
      setBannerForm({ ...externalEditingBanner });
    } else if (prefillBanner) {
      setBannerForm({ ...prefillBanner, id: '' });
    } else {
      setBannerForm({
        title: '', subtitle: '', ctaText: '', image: '', categoryTarget: undefined, discountBadge: '', badgeColor: 'bg-emerald-600 text-white', bgGradient: 'from-stone-900 via-amber-900 to-stone-950',
      });
    }
  }, [externalEditingBanner, prefillBanner]);`;

code = code.replace(
  /  \/\/ Sync external banner to form[\s\S]*?\}, \[externalEditingBanner\]\);/,
  newEffect
);

fs.writeFileSync('src/components/BannerManagerModal.tsx', code);
