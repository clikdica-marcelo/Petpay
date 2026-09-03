const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add states
const newStates = `  const [hiddenDynamicSlides, setHiddenDynamicSlides] = useState<string[]>(() => {
    const saved = localStorage.getItem('pet_achadinhos_hidden_slides');
    return saved ? JSON.parse(saved) : [];
  });
  const [prefillBanner, setPrefillBanner] = useState<Banner | null>(null);`;

code = code.replace(
  '  const [isBannerEditMode, setIsBannerEditMode] = useState(false);',
  `  const [isBannerEditMode, setIsBannerEditMode] = useState(false);\n${newStates}`
);

// Update handlers
const updateHandlers = `  const handleUpdateBanner = (updatedBanner: Banner) => {
    setBanners((prev) => {
      const exists = prev.some(b => b.id === updatedBanner.id);
      if (exists) {
        return prev.map((b) => b.id === updatedBanner.id ? updatedBanner : b);
      } else {
        const newBanner = { ...updatedBanner, id: \`banner-\${Date.now()}\` };
        return [newBanner, ...prev];
      }
    });
  };

  const handleDeleteBanner = (bannerId: string) => {
    if (bannerId.startsWith('prod-slide-')) {
      setHiddenDynamicSlides(prev => {
        const updated = [...prev, bannerId];
        localStorage.setItem('pet_achadinhos_hidden_slides', JSON.stringify(updated));
        return updated;
      });
    } else {
      setBanners((prev) => prev.filter((b) => b.id !== bannerId));
    }
  };`;

code = code.replace(
  /  const handleUpdateBanner = \([\s\S]*?\}\);\n  \};/,
  updateHandlers
);

// Fix <BannerHero /> in render
const heroRegex = /<BannerHero[\s\S]*?\/>/;
const heroReplacement = `<BannerHero
        isAdminMode={isAdminLogged && isBannerEditMode}
        onEditBanner={(b) => { setPrefillBanner(null); setBannerToEdit(b); setIsBannerManagerOpen(true); }}
        onAddBannerTrigger={(b) => { setBannerToEdit(null); setPrefillBanner(b || null); setIsBannerManagerOpen(true); }}
        onDeleteBanner={handleDeleteBanner}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onScrollToKits={scrollToKits}
        products={products}
        onProductClick={handleOpenDetails}
        banners={banners}
        hiddenSlideIds={hiddenDynamicSlides}
      />`;

code = code.replace(heroRegex, heroReplacement);

// Fix <BannerManagerModal /> in render
const modalRegex = /<BannerManagerModal[\s\S]*?\/>/;
const modalReplacement = `<BannerManagerModal
        isOpen={isBannerManagerOpen}
        editingBanner={bannerToEdit}
        prefillBanner={prefillBanner}
        setEditingBanner={setBannerToEdit}
        onClose={() => { setIsBannerManagerOpen(false); setPrefillBanner(null); }}
        banners={banners}
        onAddBanner={handleAddBanner}
        onUpdateBanner={handleUpdateBanner}
        onDeleteBanner={handleDeleteBanner}
      />`;

code = code.replace(modalRegex, modalReplacement);

fs.writeFileSync('src/App.tsx', code);
