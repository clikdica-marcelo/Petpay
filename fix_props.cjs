const fs = require('fs');
let code = fs.readFileSync('src/components/BannerHero.tsx', 'utf8');

code = code.replace(
  '  banners?: Banner[];\n}',
  '  banners?: Banner[];\n  isAdminMode?: boolean;\n  onEditBanner?: (banner: Banner) => void;\n  onDeleteBanner?: (bannerId: string) => void;\n}'
);

code = code.replace(
  '  banners\n}) => {',
  '  banners,\n  isAdminMode = false,\n  onEditBanner,\n  onDeleteBanner\n}) => {'
);

fs.writeFileSync('src/components/BannerHero.tsx', code);
