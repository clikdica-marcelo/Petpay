const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const scrollFuncRegex = /  const scrollToKits = \(\) => \{\n    const el = document\.getElementById\('curated-kits-section'\);\n    if \(el\) \{\n      el\.scrollIntoView\(\{ behavior: 'smooth' \}\);\n    \}\n  \};\n/;
code = code.replace(scrollFuncRegex, '');

code = code.replace(
  '        onScrollToKits={scrollToKits}\n',
  ''
);

fs.writeFileSync('src/App.tsx', code);
