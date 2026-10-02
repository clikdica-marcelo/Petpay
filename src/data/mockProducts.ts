import { Product, CuratedKit, ProductCategory, Banner } from '../types';

export const OFFICIAL_CATEGORIES: {
  id: ProductCategory;
  label: string;
  shortLabel: string;
  description: string;
  iconName: string;
  badge: string;
}[] = [
  {
    id: 'alimentacao',
    label: 'Alimentação (Ração, Petiscos etc.)',
    shortLabel: 'Alimentação',
    description: 'Rações secas, rações úmidas, petiscos odontológicos, sachês e comedouros.',
    iconName: 'Utensils',
    badge: 'Mais Vendidos'
  },
  {
    id: 'cuidados_especiais',
    label: 'Cuidados Especiais',
    shortLabel: 'Cuidados Especiais',
    description: 'Escovas a vapor, cortadores com LED, shampoos e higiene diária.',
    iconName: 'Sparkles',
    badge: 'Higiene & Estética'
  },
  {
    id: 'saude_bem_estar',
    label: 'Saúde e Bem-Estar',
    shortLabel: 'Saúde e Bem-Estar',
    description: 'Fontes elétricas, suplementos, calmantes fitoterápicos e antiparasitários.',
    iconName: 'HeartPulse',
    badge: 'Recomendação Vet'
  },
  {
    id: 'cama_banheiro',
    label: 'Cama e Banheiro',
    shortLabel: 'Cama e Banheiro',
    description: 'Caminhas nuvem, caixas de areia antiodor, tapetes higiênicos e tocas.',
    iconName: 'BedDouble',
    badge: 'Conforto Máximo'
  },
  {
    id: 'acessorios',
    label: 'Acessórios & Estilo',
    shortLabel: 'Acessórios',
    description: 'Coleiras antipuxão, guias, brinquedos interativos, arranhadores, roupinhas e bandanas.',
    iconName: 'Package',
    badge: 'Alta Procura'
  },
  {
    id: 'outros',
    label: 'Outros',
    shortLabel: 'Outros',
    description: 'Mochilas astronauta, cintos veiculares, localizadores e utilidades.',
    iconName: 'Grid',
    badge: 'Inovações'
  }
];

export const CATEGORY_LABELS: Record<ProductCategory, { label: string; shortLabel: string; icon: string }> = {
  alimentacao: { label: 'Alimentação (Ração, Petiscos etc.)', shortLabel: 'Alimentação', icon: 'Utensils' },
  cuidados_especiais: { label: 'Cuidados Especiais', shortLabel: 'Cuidados Especiais', icon: 'Sparkles' },
  saude_bem_estar: { label: 'Saúde e Bem-Estar', shortLabel: 'Saúde e Bem-Estar', icon: 'HeartPulse' },
  cama_banheiro: { label: 'Cama e Banheiro', shortLabel: 'Cama e Banheiro', icon: 'BedDouble' },
  acessorios: { label: 'Acessórios & Estilo', shortLabel: 'Acessórios', icon: 'Package' },
  outros: { label: 'Outros', shortLabel: 'Outros', icon: 'Grid' }
};

export const PURGED_DEMO_PRODUCT_IDS: string[] = [
  'pet-alim-001', 'pet-alim-002', 'pet-alim-003', 'pet-alim-004', 'pet-alim-005', 'pet-alim-006',
  'pet-cuid-001', 'pet-cuid-002', 'pet-cuid-003', 'pet-cuid-004', 'pet-cuid-005', 'pet-cuid-006',
  'pet-cuidado-001', 'pet-cuidado-002', 'pet-cuidado-003',
  'pet-saude-002', 'pet-saude-003', 'pet-saude-004', 'pet-saude-005', 'pet-saude-006',
  'pet-cama-001', 'pet-cama-002', 'pet-cama-003', 'pet-cama-004', 'pet-cama-005', 'pet-cama-006',
  'pet-aces-001', 'pet-aces-002', 'pet-aces-003', 'pet-aces-004', 'pet-aces-005', 'pet-aces-006',
  'pet-acess-001', 'pet-roupa-001', 'pet-outros-001', 'pet-outros-002', 'pet-outros-003'
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "pet-prod-1790893209033",
    title: "Arranhador Adesivo Premium: Sofá, Cama e Móveis Para Gato - Protetor Pet",
    shortDescription: "Porque quem ama seu pet também cuida do lar: proteja seus móveis e deixe seu gatinho ainda mais feliz!",
    fullDescription: "Proteção prática e eficiente para os seus móveis:\n\n- Fácil de aplicar com adesivo super resistente.\n- Feito de carpete premium que atrai naturalmente os gatos.\n- Ideal para sofás, camas box, portas e mesas.\n- Design discreto que se adapta à decoração da sua casa.",
    price: 17.8,
    originalPrice: 24.03,
    discountPercent: 26,
    rating: 4.8,
    reviewsCount: 65,
    salesCount: 180,
    imageUrl: "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m9tfffijkvg990@resize_w900_nl.webp",
    category: "acessorios",
    shopeeUrl: "https://s.shopee.com.br/3qNXvR0Vvl",
    affiliateUrl: "https://s.shopee.com.br/3qNXvR0Vvl",
    tags: ["Loja Oficial", "Pet", "Acessórios", "Destaque"],
    badges: ["Mais Vendido", "Frete Grátis"],
    isFeatured: false,
    isFlashDeal: true,
    highlights: {
      idealFor: "Tutores que buscam o melhor custo-benefício e comodidade para seus animais.",
      whyBuy: "Excelente índice de recomendação por outros clientes e envio seguro.",
      tips: ""
    },
    sellerName: "RELVA GROUP",
    freeShipping: false,
    couponAvailable: "10% OFF"
  },
  {
    id: "pet-saude-001",
    title: "Newpet Fonte De Água Para Pet Gatos De Aço Inoxidável 3.2 L Alta qualidade",
    shortDescription: "Água corrente e oxigenada com bomba ultra silenciosa e filtro triplo purificador.",
    fullDescription: "Estimula pets a beberem até 3x mais água, prevenindo problemas renais e urinários. Sistema de bomba de 1.5W econômica e ultra silenciosa (< 20dB) com LED indicador de nível e filtro de carvão ativado.",
    price: 108.26,
    originalPrice: 119,
    discountPercent: 9,
    rating: 4.9,
    reviewsCount: 2200,
    salesCount: 7400,
    imageUrl: "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6f8gc8db7fr71@resize_w900_nl.webp",
    category: "saude_bem_estar",
    shopeeUrl: "https://s.shopee.com.br/5VVm7yZBAa",
    affiliateUrl: "https://s.shopee.com.br/5VVm7yZBAa",
    tags: ["Prevenção Renal", "Bomba Silenciosa", "Filtro Carvão Ativado", "Bivolt"],
    badges: ["Top Saúde Pet", "Frete Grátis"],
    isFeatured: true,
    isFlashDeal: true,
    highlights: {
      idealFor: "Pets que não bebem água parada e tutores preocupados com a saúde renal.",
      whyBuy: "Item número #1 em recomendação veterinária para hidratação preventiva.",
      tips: "Troque o refil do filtro de carvão ativado a cada 30 dias para máxima pureza."
    },
    sellerName: "LTS - BR",
    freeShipping: true,
    couponAvailable: ""
  },
  {
    id: "pet-prod-1790900298787",
    title: "Granulado Ipet Woods De Madeira Para Gatos - 20Kg",
    shortDescription: "Ipetwoods Granulado Madeira Gato – Versão econômica para maior durabilidade, 100% natural e biodegradável.",
    fullDescription: "O Granulado Ipet De Madeira Para Gatos Foi Desenvolvido Para Substituir A Tradicional Serragem, Oferecendo Mais Conforto, Pois Não Possuí Partículas Pontiagudas.",
    price: 76.43,
    originalPrice: 103.18,
    discountPercent: 25,
    rating: 4.8,
    reviewsCount: 65,
    salesCount: 180,
    imageUrl: "https://down-br.img.susercontent.com/file/sg-11134201-824hr-me67a07xbnczfa.webp",
    category: "outros",
    shopeeUrl: "https://s.shopee.com.br/4LJoeVenJf",
    affiliateUrl: "https://s.shopee.com.br/4LJoeVenJf",
    tags: ["Loja Oficial", "Pet", "Outros", "Destaque"],
    badges: ["Oferta Relâmpago", "Frete Grátis"],
    isFeatured: false,
    isFlashDeal: true,
    highlights: {
      idealFor: "Tutores que buscam o melhor custo-benefício e comodidade para seus animais.",
      whyBuy: "Excelente índice de recomendação por outros clientes e envio seguro.",
      tips: ""
    },
    sellerName: "PetCamp",
    freeShipping: true,
    couponAvailable: "10% OFF"
  },
  {
    id: "pet-prod-1790900103683",
    title: "Ração Golden Gatos Adultos Sabor Frango 10kg",
    shortDescription: "RAÇÃO GOLDEN GATOS ADULTOS SABOR FRANGO – NUTRIÇÃO E SABOR PARA O SEU FELINO",
    fullDescription: "Proporcione uma alimentação completa e equilibrada para o seu gato com a Ração Golden Gatos Adultos Sabor Frango. Formulada com proteínas de alta qualidade.",
    price: 138.61,
    originalPrice: 187.12,
    discountPercent: 25,
    rating: 4.8,
    reviewsCount: 65,
    salesCount: 180,
    imageUrl: "https://down-br.img.susercontent.com/file/sg-11134201-7rbkm-m5vlwrtag32v84@resize_w900_nl.webp",
    category: "alimentacao",
    shopeeUrl: "https://s.shopee.com.br/5LCLq5qO7x",
    affiliateUrl: "https://s.shopee.com.br/5LCLq5qO7x",
    tags: ["Loja Oficial", "Pet", "Alimentação", "Destaque"],
    badges: ["Oferta Relâmpago", "Frete Grátis"],
    isFeatured: false,
    isFlashDeal: true,
    highlights: {
      idealFor: "Tutores que buscam o melhor custo-benefício e comodidade para seus animais.",
      whyBuy: "Excelente índice de recomendação por outros clientes e envio seguro.",
      tips: ""
    },
    sellerName: "LeluPets",
    freeShipping: true,
    couponAvailable: "10% OFF"
  },
  {
    id: "pet-prod-1790892939963",
    title: "Clorexidina Dug's Shampoo World Veterinária para Cães & Gatos - 500 mL",
    shortDescription: "O Shampoo World Veterinária Dug's Clorexidina Cães & Gatos é indicado para a higienização e prevenção.",
    fullDescription: "Possui ação como um poderoso antisséptico, antisseborreico, fungicida e antiqueda. Oferece óleo de jojoba em sua composição.",
    price: 16.99,
    originalPrice: 22.94,
    discountPercent: 25,
    rating: 4.8,
    reviewsCount: 65,
    salesCount: 180,
    imageUrl: "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mghzxpnx80zp32@resize_w900_nl.webp",
    category: "cuidados_especiais",
    shopeeUrl: "https://s.shopee.com.br/30oQvVeBPA",
    affiliateUrl: "https://s.shopee.com.br/30oQvVeBPA",
    tags: ["Loja Oficial", "Pet", "Cuidados Especiais", "Destaque"],
    badges: ["Oferta Relâmpago", "Frete Grátis"],
    isFeatured: false,
    isFlashDeal: true,
    highlights: {
      idealFor: "Tutores que buscam o melhor custo-benefício e comodidade para seus animais.",
      whyBuy: "Excelente índice de recomendação por outros clientes e envio seguro.",
      tips: ""
    },
    sellerName: "mypetone",
    freeShipping: false,
    couponAvailable: "10% OFF"
  },
  {
    id: "pet-prod-1787455554679",
    title: "Medicamento Dermotrat Aerosol Antibacteriano, antifúngico e anti-inflamatório Cães e Gatos",
    shortDescription: "Pode ser utilizado em cães e gatos. Indicado no tratamento de lesões cutâneas, elimina fungos e bactérias.",
    fullDescription: "Dermotrat Aerosol é indicado para tratamento auxiliar das lesões cutâneas de várias etiologias em cães e gatos.",
    price: 94.05,
    originalPrice: 124.4,
    discountPercent: 24,
    rating: 4.8,
    reviewsCount: 85,
    salesCount: 230,
    imageUrl: "https://down-br.img.susercontent.com/file/sg-11134201-8258k-mq3nojyi82drca.webp",
    category: "saude_bem_estar",
    shopeeUrl: "https://s.shopee.com.br/4LJoe0IKFB",
    affiliateUrl: "https://s.shopee.com.br/4LJoe0IKFB",
    tags: ["Loja Oficial", "Pet", "Saúde e Bem-Estar", "Destaque"],
    badges: ["Oferta Relâmpago", "Frete Grátis"],
    isFeatured: false,
    isFlashDeal: true,
    highlights: {
      idealFor: "Tutores que buscam praticidade e qualidade para seus pets.",
      whyBuy: "Ótima avaliação de compradores e preço promocional verificado.",
      tips: "Higienize conforme orientações do fabricante para maior vida útil."
    },
    sellerName: "Petyard - Rio de Janeiro",
    freeShipping: false,
    couponAvailable: "10% OFF"
  },
  {
    id: "pet-prod-1787940317175",
    title: "Kit 2 Shampoo World Veterinária Dug's Clorexidina Cães & Gatos - 500",
    shortDescription: "Shampoo World Veterinária Dug's Clorexidina Cães & Gatos é indicado para a higienização, prevenção e auxílio terapêutico.",
    fullDescription: "Kit com 2 unidades de Shampoo Clorexidina 500ml para tratamento continuado da pele e pelagem de cães e gatos.",
    price: 27.88,
    originalPrice: 37.64,
    discountPercent: 25,
    rating: 4.8,
    reviewsCount: 85,
    salesCount: 230,
    imageUrl: "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mghzzl2ln4lc26.webp",
    category: "cuidados_especiais",
    shopeeUrl: "https://s.shopee.com.br/8plLMqQWbU",
    affiliateUrl: "https://s.shopee.com.br/8plLMqQWbU",
    tags: ["Loja Oficial", "Pet", "Cuidados Especiais", "Destaque"],
    badges: ["Oferta Relâmpago", "Frete Grátis"],
    isFeatured: false,
    isFlashDeal: true,
    highlights: {
      idealFor: "Tutores que buscam praticidade e qualidade para seus pets.",
      whyBuy: "Ótima avaliação de compradores e preço promocional verificado.",
      tips: "Higienize conforme orientações do fabricante para maior vida útil."
    },
    sellerName: "mypetone",
    freeShipping: false,
    couponAvailable: "10% OFF"
  },
  {
    id: "pet-prod-1787800428088",
    title: "Escova A Vapor Pet 3 em 1 Remove Pelos Pente Massageador Para Cães e Gatos",
    shortDescription: "Escova Pet 3 em 1 com Spray – Remova Pelos, Massageie e Higienize com Mais Facilidade",
    fullDescription: "A Escova Pet 3 em 1 foi desenvolvida para remover os pelos soltos, proporcionar uma massagem relaxante e auxiliar na higienização através do spray.",
    price: 23.31,
    originalPrice: 31.47,
    discountPercent: 25,
    rating: 4.8,
    reviewsCount: 85,
    salesCount: 230,
    imageUrl: "https://down-br.img.susercontent.com/file/br-11134201-820l7-mqx4vo6tnfnr8e@resize_w900_nl.webp",
    category: "cuidados_especiais",
    shopeeUrl: "https://s.shopee.com.br/3g3CdDQRXw",
    affiliateUrl: "https://s.shopee.com.br/3g3CdDQRXw",
    tags: ["Loja Oficial", "Pet", "Cuidados Especiais", "Destaque"],
    badges: ["Oferta Relâmpago", "Frete Grátis"],
    isFeatured: false,
    isFlashDeal: true,
    highlights: {
      idealFor: "Tutores que buscam praticidade e qualidade para seus pets.",
      whyBuy: "Ótima avaliação de compradores e preço promocional verificado.",
      tips: "Higienize conforme orientações do fabricante para maior vida útil."
    },
    sellerName: "Loja Oficial Shopee",
    freeShipping: true,
    couponAvailable: "10% OFF"
  }
];

export const CURATED_KITS: CuratedKit[] = [];

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'banner-blog-segredo-felino',
    badge: '🔥 MATÉRIA EM ALTA • GUIA FELINO',
    badgeColor: 'bg-amber-600 text-white',
    title: 'O Segredo Felino que Evita o Veterinário: Por que seu gato ignora água parada?',
    subtitle: 'Descubra o instinto ancestral do deserto, os riscos renais e como fazer seu gato beber até 3x mais água hoje mesmo.',
    ctaText: 'Descobrir o Segredo Felino →',
    categoryTarget: 'saude_bem_estar',
    bgGradient: 'from-stone-950 via-stone-900 to-amber-950',
    image: '/cat_water_fountain_blog.jpg',
    highlightBadge: 'Destaque Editorial da Redação',
    blogPostSlug: 'o-segredo-felino-que-evita-o-veterinario-agua-corrente'
  },
  {
    id: 'banner-fonte-silenciosa',
    badge: 'DESTAQUE EM SAÚDE & BEM-ESTAR',
    badgeColor: 'bg-orange-600 text-white',
    title: 'Fonte Bebedouro Elétrica Ultra Silenciosa Bivolt',
    subtitle: 'Água corrente e filtrada por carvão ativado. Estimula seu pet a beber 3x mais água e previne problemas renais.',
    ctaText: 'Ver Oferta na Shopee Oficial',
    categoryTarget: 'saude_bem_estar',
    bgGradient: 'from-stone-900 via-stone-950 to-stone-900',
    image: 'https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6f8gc8db7fr71@resize_w900_nl.webp',
    highlightBadge: 'Oferta Oficial Shopee'
  }
];
