const fs = require('fs');
let code = fs.readFileSync('src/components/BannerHero.tsx', 'utf8');

code = code.replace(
  '{!(banner as any).productObject && (',
  '{true && ('
);

fs.writeFileSync('src/components/BannerHero.tsx', code);
