const fs = require('fs');
let code = fs.readFileSync('src/components/BannerManagerModal.tsx', 'utf8');

code = code.replace(
  /  if \(\!isOpen\) return null;\n\n  \/\/ Sync external banner to form\n  React.useEffect\(\(\) => \{[\s\S]*?\}, \[externalEditingBanner\]\);/,
  `  // Sync external banner to form
  React.useEffect(() => {
    if (externalEditingBanner) {
      setBannerForm({ ...externalEditingBanner });
    } else {
      setBannerForm({
        title: '', subtitle: '', ctaText: '', image: '', categoryTarget: undefined, discountBadge: '', badgeColor: 'bg-emerald-600 text-white', bgGradient: 'from-stone-900 via-amber-900 to-stone-950',
      });
    }
  }, [externalEditingBanner]);

  if (!isOpen) return null;`
);

fs.writeFileSync('src/components/BannerManagerModal.tsx', code);
