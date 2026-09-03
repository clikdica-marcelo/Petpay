const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const missingFunctions = `
  const handleToggleFavorite = (product: Product) => {
    setFavorites(prev => {
      const isFav = prev.some(p => p.id === product.id);
      if (isFav) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleShopeeClick = (product: Product, source: string) => {
    setClickToast({ visible: true, productName: product.title });
    setTimeout(() => setClickToast(null), 3000);

    const affiliateUrl = product.affiliateUrl || product.link;
    window.open(affiliateUrl, '_blank');
  };
`;

code = code.replace(
  '  // Product CRUD actions for Admin',
  missingFunctions + '\n  // Product CRUD actions for Admin'
);

fs.writeFileSync('src/App.tsx', code);
