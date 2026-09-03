const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import for BannerProductSelectorModal
const importRegex = /import \{ BannerManagerModal \} from "\.\/components\/BannerManagerModal";/;
code = code.replace(importRegex, 'import { BannerManagerModal } from "./components/BannerManagerModal";\nimport { BannerProductSelectorModal } from "./components/BannerProductSelectorModal";');

// 2. Add state for isProductSelectorOpen
const statesRegex = /const \[isBannerEditMode, setIsBannerEditMode\] = useState\(false\);/;
code = code.replace(statesRegex, 'const [isBannerEditMode, setIsBannerEditMode] = useState(false);\n  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);');

// 3. Add handleSelectProductForBanner
const handlersRegex = /const handleAddBanner = \(newBanner: Banner\) => \{/;
code = code.replace(handlersRegex, `const handleSelectProductForBanner = (product: Product) => {
    const newBanner: Banner = {
      id: \`banner-\${Date.now()}\`,
      title: product.title,
      subtitle: product.shortDescription || 'Oferta imperdível verificada com frete grátis e garantia Shopee.',
      ctaText: \`Ver por \${typeof product.price === 'number' ? \`R$ \${product.price.toFixed(2)}\` : product.price}\`,
      image: product.imageUrl,
      categoryTarget: product.category,
      discountBadge: product.couponAvailable || 'Frete Grátis',
      badgeColor: 'bg-emerald-600 text-white',
      bgGradient: 'from-stone-900 via-amber-900 to-stone-950',
      productObject: product
    };
    handleAddBanner(newBanner);
    setIsProductSelectorOpen(false);
  };

  const handleAddBanner = (newBanner: Banner) => {`);

// 4. Update <BannerHero />
const heroRegex = /onAddBannerTrigger=\{\(b\) => \{ setBannerToEdit\(null\); setPrefillBanner\(b \|\| null\); setIsBannerManagerOpen\(true\); \}\}/;
code = code.replace(heroRegex, 'onAddBannerTrigger={() => { setIsProductSelectorOpen(true); }}');

// 5. Add <BannerProductSelectorModal /> to JSX (at the end before AdminAuthModal or so)
const modalInsertPoint = /<AdminAuthModal/;
code = code.replace(modalInsertPoint, `<BannerProductSelectorModal
        isOpen={isProductSelectorOpen}
        onClose={() => setIsProductSelectorOpen(false)}
        products={products}
        onSelectProduct={handleSelectProductForBanner}
      />

      <AdminAuthModal`);

fs.writeFileSync('src/App.tsx', code);
