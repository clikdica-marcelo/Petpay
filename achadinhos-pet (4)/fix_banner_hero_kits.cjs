const fs = require('fs');
let code = fs.readFileSync('src/components/BannerHero.tsx', 'utf8');

code = code.replace(
  '  onScrollToKits?: () => void;',
  ''
);

code = code.replace(
  '  onScrollToKits,\n',
  ''
);

code = code.replace(
  '  onScrollToKits,\n',
  ''
);

const kitBtnRegex = /\{onScrollToKits && \([\s\S]*?\}\)/;
code = code.replace(kitBtnRegex, '');

fs.writeFileSync('src/components/BannerHero.tsx', code);
