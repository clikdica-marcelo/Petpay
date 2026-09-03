const fs = require('fs');
let code = fs.readFileSync('src/components/BannerHero.tsx', 'utf8');

// Update Props
code = code.replace(
  '  onAddBannerTrigger?: () => void;',
  '  onAddBannerTrigger?: (banner?: Banner) => void;\n  hiddenSlideIds?: string[];'
);

code = code.replace(
  '  onAddBannerTrigger\n}) => {',
  '  onAddBannerTrigger,\n  hiddenSlideIds = []\n}) => {'
);

// Update Dynamic Slides logic
const dynamicSlidesLogic = `  const dynamicSlides = React.useMemo(() => {
    const baseBanners = banners || [];
    const slides = [...baseBanners];

    // Take up to 3 recently added or featured products to show in the carousel
    const featuredOrRecent = products.slice(0, 3);
    featuredOrRecent.forEach((prod, index) => {
      const slideId = \`prod-slide-\${index}-\${prod.id}\`;
      if (!hiddenSlideIds.includes(slideId)) {
        slides.push({
          id: slideId,
          badge: 'NOVIDADE NA VITRINE',
          badgeColor: 'bg-emerald-600 text-white',
          title: prod.title,
          subtitle: prod.shortDescription || 'Oferta imperdível verificada com frete grátis e garantia Shopee.',
          ctaText: \`Ver por \${typeof prod.price === 'number' ? \`R$ \${prod.price.toFixed(2)}\` : prod.price}\`,
          categoryTarget: prod.category,
          bgGradient: 'from-stone-900 via-amber-900 to-stone-950',
          image: prod.imageUrl,
          highlightBadge: prod.couponAvailable || 'Frete Grátis',
          productObject: prod
        } as any);
      }
    });

    return slides;
  }, [banners, products, hiddenSlideIds]);`;

code = code.replace(
  /  const dynamicSlides = React\.useMemo\(\(\) => \{\n    return banners \|\| \[\];\n  \}, \[banners\]\);/,
  dynamicSlidesLogic
);

// Allow edit/delete for productObject (remove condition)
code = code.replace(
  '{!(banner as any).productObject && (',
  '{true && (' // already did this but just in case
);

// Pass banner to Add button
code = code.replace(
  'onAddBannerTrigger();\n                }}',
  'onAddBannerTrigger(banner as Banner);\n                }}'
);

fs.writeFileSync('src/components/BannerHero.tsx', code);
