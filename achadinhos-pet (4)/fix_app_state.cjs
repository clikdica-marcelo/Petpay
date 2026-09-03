const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The missing state variables that got wiped out:
const missingStates = `
  const [affiliateSettings, setAffiliateSettings] = useState<AffiliateSettings>({
    affiliateId: 'campanha_pet_12345',
    subIdPrefix: 'achadinhospet',
    autoAppendAffiliateTag: true,
    defaultUtmSource: 'achadinhos_pet_portal',
    commissionRateEstimate: 8.5,
    storeName: 'Achadinhos Pet',
    storeDomain: 'achadinhospet.com.br',
    contactEmail: 'contato@achadinhospet.com.br'
  });

  // Modal dialog states
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLogged, setIsAdminLogged] = useState(false);
  const [isBannerManagerOpen, setIsBannerManagerOpen] = useState(false);
  const [bannerToEdit, setBannerToEdit] = useState<Banner | null>(null);
  const [isBannerEditMode, setIsBannerEditMode] = useState(false);

  const [hiddenDynamicSlides, setHiddenDynamicSlides] = useState<string[]>(() => {
    const saved = localStorage.getItem('pet_achadinhos_hidden_slides');
    return saved ? JSON.parse(saved) : [];
  });
  const [prefillBanner, setPrefillBanner] = useState<Banner | null>(null);
  const [clickToast, setClickToast] = useState<{ visible: boolean; productName: string } | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
`;

code = code.replace(
  '  // Open product details modal',
  missingStates + '\n  // Open product details modal'
);

fs.writeFileSync('src/App.tsx', code);
