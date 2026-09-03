const fs = require('fs');
let code = fs.readFileSync('src/components/BannerHero.tsx', 'utf8');

code = code.replace(
  /  \/\/ Build dynamic slides combining custom banners and recent products[\s\S]*?return slides;\n  \}, \[banners, products\]\);/,
  `  const dynamicSlides = React.useMemo(() => {
    return banners || [];
  }, [banners]);`
);

fs.writeFileSync('src/components/BannerHero.tsx', code);
