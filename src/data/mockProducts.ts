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
    id: 'pet-saude-001',
    title: 'Fonte Bebedouro Elétrica Bivolt 2.5L Filtro Carvão Ativado Ultra Silenciosa',
    shortDescription: 'Água corrente e oxigenada com bomba ultra silenciosa e filtro triplo purificador.',
    fullDescription: 'Estimula pets a beberem até 3x mais água, prevenindo problemas renais e urinários. Sistema de bomba de 1.5W econômica e ultra silenciosa (< 20dB) com LED indicador de nível e filtro de carvão ativado.',
    price: 68.90,
    originalPrice: 119.00,
    discountPercent: 42,
    rating: 4.9,
    reviewsCount: 2200,
    salesCount: 7400,
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6f8gc8db7fr71@resize_w900_nl.webp',
    category: 'saude_bem_estar',
    shopeeUrl: 'https://s.shopee.com.br/5VVm7yZBAa',
    affiliateUrl: 'https://s.shopee.com.br/5VVm7yZBAa',
    tags: ['Prevenção Renal', 'Bomba Silenciosa', 'Filtro Carvão Ativado', 'Bivolt'],
    badges: ['Top Saúde Pet', 'Frete Grátis'],
    isFeatured: true,
    isFlashDeal: true,
    aiInsights: {
      idealFor: 'Pets que não bebem água parada e tutores preocupados com a saúde renal.',
      whyBuy: 'Item número #1 em recomendação veterinária para hidratação preventiva.',
      tips: 'Troque o refil do filtro de carvão ativado a cada 30 dias para máxima pureza.'
    },
    sellerName: 'AquaPet Brasil',
    sellerLocation: 'Belo Horizonte - MG',
    freeShipping: true
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
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=1200&q=80',
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
