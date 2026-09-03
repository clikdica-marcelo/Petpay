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

export const INITIAL_PRODUCTS: Product[] = [
  // 1. ALIMENTAÇÃO (Ração, Petiscos etc.)
  {
    id: 'pet-alim-001',
    title: 'Comedouro e Bebedouro Automático Gravidade 3.8L para Pets',
    shortDescription: 'Alimentador inteligente que mantém ração e água fresca por até 7 dias sem eletricidade.',
    fullDescription: 'Dispensador automático fabricado em polipropileno de grau alimentício, atóxico e livre de BPA. Sistema anti-vazamento com base antiderrapante emborrachada. Ideal para tutores que passam o dia fora ou viajam no final de semana.',
    price: 49.90,
    originalPrice: 89.90,
    discountPercent: 44,
    rating: 4.9,
    reviewsCount: 1420,
    salesCount: 5200,
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'alimentacao',
    shopeeUrl: 'https://loja.com.br/produto/pet-alim-001',
    affiliateUrl: 'https://oferta.link/pet-comedouro-auto-01',
    tags: ['Automático', 'Sem Eletricidade', 'Alimentação', 'Alta Capacidade', 'Livre de BPA'],
    badges: ['Mais Vendido', 'Frete Grátis', 'Cupom 10%'],
    isFeatured: true,
    isFlashDeal: true,
    aiInsights: {
      idealFor: 'Tutores com rotina corrida e pets que precisam de horários regulares de alimentação.',
      whyBuy: 'Excelente custo-benefício com mais de 5 mil avaliações positivas comprovadas e material higiênico.',
      tips: 'Lave o reservatório a cada 4 dias para garantir a água sempre cristalina e evitar resíduos.',
      recommendedComplementId: 'pet-saude-001'
    },
    sellerName: 'PetTech Brasil Oficial',
    sellerLocation: 'São Paulo - SP',
    freeShipping: true,
    couponAvailable: 'PET10OFF'
  },
  {
    id: 'pet-alim-002',
    title: 'Petisco Bifinho Dental Snack Anti-Tártaro 500g Sabor Carne e Ervas',
    shortDescription: 'Snack mastigável funcional que auxilia no controle do tártaro e mau hálito.',
    fullDescription: 'Bifinhos enriquecidos com hexametafosfato de sódio, que previne a formação de placa bacteriana nos dentes. Textura ideal para mastigação saudável sem agredir as gengivas.',
    price: 26.90,
    originalPrice: 45.00,
    discountPercent: 40,
    rating: 4.8,
    reviewsCount: 890,
    salesCount: 3400,
    imageUrl: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80',
    category: 'alimentacao',
    shopeeUrl: 'https://loja.com.br/produto/pet-alim-002',
    affiliateUrl: 'https://oferta.link/pet-snack-dental-02',
    tags: ['Anti-Tártaro', 'Petiscos', 'Hálito Fresco', 'Snack Funcional'],
    badges: ['Promoção', 'Frete Grátis'],
    isFeatured: false,
    isFlashDeal: true,
    aiInsights: {
      idealFor: 'Pets que acumulam placa bacteriana e precisam de recompensas saudáveis no adestramento.',
      whyBuy: 'Une agrado diário com saúde bucal preventiva por um preço muito acessível.'
    },
    sellerName: 'NutriPet Premium',
    sellerLocation: 'Campinas - SP',
    freeShipping: true
  },
  {
    id: 'pet-alim-003',
    title: 'Kit 12 Sachês Ração Úmida Gourmet em Molho Mix Sabores 85g',
    shortDescription: 'Alimento completo e balanceado super palatável para hidratação extra.',
    fullDescription: 'Sachês ricos em água, proteínas nobres e vitaminas essenciais. Perfeitos para misturar na ração seca ou servir como agrado especial com alta aceitação até pelos pets mais exigentes.',
    price: 34.90,
    originalPrice: 58.00,
    discountPercent: 40,
    rating: 4.9,
    reviewsCount: 1650,
    salesCount: 6800,
    imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
    category: 'alimentacao',
    shopeeUrl: 'https://loja.com.br/produto/pet-alim-003',
    affiliateUrl: 'https://oferta.link/pet-saches-mix-03',
    tags: ['Ração Úmida', 'Hidratação', 'Gourmet', 'Mix de Sabores'],
    badges: ['Top Avaliado', 'Frete Grátis'],
    isFeatured: true,
    aiInsights: {
      idealFor: 'Pets que bebem pouca água ou têm paladar exigente.',
      whyBuy: 'Fornece hidratação involuntária essencial para prevenir complicações urinárias.'
    },
    sellerName: 'GourmetPet Oficial',
    sellerLocation: 'São Paulo - SP',
    freeShipping: true
  },

  // 2. CUIDADOS ESPECIAIS
  {
    id: 'pet-cuidado-001',
    title: 'Escova Tira Pelos Autolimpante a Vapor com Função Massagem e Hidratação',
    shortDescription: 'Tecnologia inovadora a vapor que remove 95% dos pelos soltos sem puxar nem irritar a pele.',
    fullDescription: 'A escova a vapor recarregável via USB emite uma suave névoa que hidrata os fios enquanto desembaraça. Possui cerdas macias de silicone arredondadas e botão autolimpante traseiro que solta a placa de pelos em um só toque.',
    price: 38.90,
    originalPrice: 69.90,
    discountPercent: 44,
    rating: 4.9,
    reviewsCount: 2890,
    salesCount: 9400,
    imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
    category: 'cuidados_especiais',
    shopeeUrl: 'https://loja.com.br/produto/pet-cuidado-001',
    affiliateUrl: 'https://oferta.link/pet-escova-vapor-04',
    tags: ['A Vapor', 'Autolimpante', 'Recarregável USB', 'Silicone Macio', 'Tira Pelos'],
    badges: ['Viral na Web', 'Frete Grátis', 'Cupom Ativo'],
    isFeatured: true,
    isFlashDeal: true,
    aiInsights: {
      idealFor: 'Pets que soltam muitos pelos pela casa e sofrem com escovas de metal pontiagudas.',
      whyBuy: 'Reduz a queda de pelos em estofados e roupas, transformando a escovação em momento relaxante.'
    },
    sellerName: 'InovaPet Tech',
    sellerLocation: 'São Paulo - SP',
    freeShipping: true,
    couponAvailable: 'VAPOR10'
  },
  {
    id: 'pet-cuidado-002',
    title: 'Cortador de Unhas Pet com Iluminação LED Integrada e Trava de Segurança',
    shortDescription: 'Lâmina afiada em aço inox com luz LED que ilumina a linha de corte para evitar sangramentos.',
    fullDescription: 'Design anatômico com iluminação LED de alta intensidade para visualizar perfeitamente o vaso sanguíneo (veia) na unha do animal. Acompanha lixa retrátil embutida no cabo e recipiente coletor de unhas aparadas.',
    price: 29.90,
    originalPrice: 52.00,
    discountPercent: 42,
    rating: 4.8,
    reviewsCount: 1120,
    salesCount: 4200,
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    category: 'cuidados_especiais',
    shopeeUrl: 'https://loja.com.br/produto/pet-cuidado-002',
    affiliateUrl: 'https://oferta.link/pet-cortador-led-05',
    tags: ['Com Luz LED', 'Aço Inox', 'Segurança Total', 'Lixa Embutida'],
    badges: ['Segurança Pet'],
    aiInsights: {
      idealFor: 'Tutores que têm receio de cortar a unha do pet em casa e atingir a raiz.',
      whyBuy: 'Economiza visitas ao pet shop e dá total confiança com a luz de precisão.'
    },
    sellerName: 'CarePet Acessórios',
    sellerLocation: 'Curitiba - PR',
    freeShipping: false
  },
  {
    id: 'pet-cuidado-003',
    title: 'Shampoo e Condicionador 2 em 1 Neutro Vegano 500ml Hipoalergênico',
    shortDescription: 'Fórmula suave com extrato de camomila e óleo de coco que hidrata e dá brilho.',
    fullDescription: 'Cosmético pet livre de parabenos, petrolatos e corantes artificiais com pH balanceado específico para a pele sensível. Deixa pelagem macia, fácil de escovar e com perfume delicado duradouro.',
    price: 24.90,
    originalPrice: 42.00,
    discountPercent: 41,
    rating: 4.8,
    reviewsCount: 640,
    salesCount: 2100,
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    category: 'cuidados_especiais',
    shopeeUrl: 'https://loja.com.br/produto/pet-cuidado-003',
    affiliateUrl: 'https://oferta.link/pet-shampoo-vegano-06',
    tags: ['Vegano', 'Hipoalergênico', 'pH Neutro', 'Cheirinho Suave'],
    badges: ['Top Higiene'],
    aiInsights: {
      idealFor: 'Pets com pele sensível ou alergias que precisam de banhos regulares.',
      whyBuy: 'Rendimento excelente por ser concentrado, sem arder os olhos.'
    },
    sellerName: 'BioPet Cosméticos',
    sellerLocation: 'Curitiba - PR',
    freeShipping: false
  },

  // 3. SAÚDE E BEM-ESTAR
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
    imageUrl: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80',
    category: 'saude_bem_estar',
    shopeeUrl: 'https://loja.com.br/produto/pet-saude-001',
    affiliateUrl: 'https://oferta.link/pet-fonte-eletrica-07',
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
  },
  {
    id: 'pet-saude-002',
    title: 'Suplemento Vitamínico Condroprotetor Ômega 3 e Glucosamina 60 Tabletes',
    shortDescription: 'Fórmula completa para articulações fortes, mobilidade e brilho na pelagem.',
    fullDescription: 'Suplemento palatável com sabor carne, contendo Ômega 3, 6, Glucosamina e Condroitina. Indicado para fortalecimento ósseo, alívio de rigidez articular e vitalidade em todas as idades.',
    price: 59.90,
    originalPrice: 98.00,
    discountPercent: 39,
    rating: 4.9,
    reviewsCount: 980,
    salesCount: 3100,
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    category: 'saude_bem_estar',
    shopeeUrl: 'https://loja.com.br/produto/pet-saude-002',
    affiliateUrl: 'https://oferta.link/pet-suplemento-omega-08',
    tags: ['Articulações', 'Ômega 3', 'Condroitina', 'Pelagem Saudável'],
    badges: ['Recomendado por Veterinários', 'Frete Grátis'],
    isFeatured: false,
    aiInsights: {
      idealFor: 'Pets idosos, raças propensas a displasia e animais em crescimento.',
      whyBuy: 'Tabletes altamente palatáveis que os pets ingerem como se fossem petiscos.'
    },
    sellerName: 'VetPharma Nutrição',
    sellerLocation: 'Ribeirão Preto - SP',
    freeShipping: true
  },
  {
    id: 'pet-saude-003',
    title: 'Calmante Natural Fitoterápico Gotas Anti-Stress e Ansiedade 30ml',
    shortDescription: 'Composto natural de maracujá, valeriana e camomila para dias de fogos e viagens.',
    fullDescription: 'Solução oral 100% natural formulada para acalmar momentos de estresse por tempestades, fogos de artifício, visitas ou viagens de carro. Não causa sonolência excessiva nem dependência.',
    price: 28.50,
    originalPrice: 49.00,
    discountPercent: 42,
    rating: 4.7,
    reviewsCount: 750,
    salesCount: 2600,
    imageUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80',
    category: 'saude_bem_estar',
    shopeeUrl: 'https://loja.com.br/produto/pet-saude-003',
    affiliateUrl: 'https://oferta.link/pet-calmante-natural-09',
    tags: ['Fitoterápico', 'Anti-Stress', 'Sem Sedativos', 'Efeito Rápido'],
    badges: ['Alívio Rápido'],
    aiInsights: {
      idealFor: 'Pets com ansiedade de separação, medo de trovões ou agitação em viagens.',
      whyBuy: 'Alternativa segura e não medicamentosa para tranquilizar o animal sem dopar.'
    },
    sellerName: 'ErvasPet Fitoterapia',
    sellerLocation: 'Florianópolis - SC',
    freeShipping: false
  },

  // 4. CAMA E BANHEIRO
  {
    id: 'pet-cama-001',
    title: 'Cama Pet Nuvem Redonda Ortopédica Antiestresse Lavável (Vários Tamanhos)',
    shortDescription: 'Caminha macia com borda elevada que proporciona sensação de segurança e aconchego.',
    fullDescription: 'Cama estilo Donut com enchimento siliconado de alta densidade e revestimento de pelúcia longa sintética super suave. Fundo antiderrapante impermeável e zíper para lavagem facilitada na máquina.',
    price: 54.90,
    originalPrice: 95.00,
    discountPercent: 42,
    rating: 4.9,
    reviewsCount: 3120,
    salesCount: 8900,
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    category: 'cama_banheiro',
    shopeeUrl: 'https://loja.com.br/produto/pet-cama-001',
    affiliateUrl: 'https://oferta.link/pet-cama-nuvem-10',
    tags: ['Lavável na Máquina', 'Anti-Ansiedade', 'Ortopédica', 'Pelúcia Premium'],
    badges: ['Top Avaliado', 'Frete Grátis'],
    isFeatured: true,
    isFlashDeal: true,
    aiInsights: {
      idealFor: 'Pets ansiosos, filhotes e pets que adoram se aninhar e dormir encolhidinhos.',
      whyBuy: 'Design terapêutico que abraça o corpo do animal, diminuindo a agitação noturna.',
      tips: 'Escolha um tamanho que seja 15cm maior que o comprimento do seu pet esticado.'
    },
    sellerName: 'Sonho Pet Store',
    sellerLocation: 'São Paulo - SP',
    freeShipping: true
  },
  {
    id: 'pet-cama-002',
    title: 'Tapete Higiênico Super Absorvente 60x60cm (Pacote com 30 Unidades) Carvão de Bambu',
    shortDescription: 'Elimina odor de urina na hora com tecnologia de gel ultra rápido e atrativo.',
    fullDescription: 'Tapete higiênico premium com 6 camadas de absorção ultra rápida e carvão vegetal ativado que neutraliza cheiros por até 48 horas. Bordas anti-vazamento e fitas adesivas para fixação firme no piso.',
    price: 49.90,
    originalPrice: 85.00,
    discountPercent: 41,
    rating: 4.9,
    reviewsCount: 3900,
    salesCount: 12400,
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    category: 'cama_banheiro',
    shopeeUrl: 'https://loja.com.br/produto/pet-cama-002',
    affiliateUrl: 'https://oferta.link/pet-tapete-higienico-11',
    tags: ['Carvão Ativado', 'Sem Cheiro', 'Absorção em 3 Segundos', 'Adesivo Forte'],
    badges: ['Campeão de Vendas', 'Frete Grátis'],
    isFeatured: true,
    isFlashDeal: true,
    aiInsights: {
      idealFor: 'Apartamentos e casas com pets em treinamento sanitário e áreas internas.',
      whyBuy: 'O tom cinza do carvão disfarça manchas e a absorção rápida impede patas molhadas.'
    },
    sellerName: 'CleanPet Mega Store',
    sellerLocation: 'São Paulo - SP',
    freeShipping: true,
    couponAvailable: 'TAPETE5'
  },
  {
    id: 'pet-cama-003',
    title: 'Caixa de Areia Banheiro Fechado com Porta Vai-Vem e Filtro Antiodor',
    shortDescription: 'Privacidade total para o pet com contenção de odores e pá higiênica inclusa.',
    fullDescription: 'Banheiro fechado com trava de encaixe fácil, alça de transporte superior e filtro de carvão ativado no teto. Evita que areia seja jogada para fora durante a escavação.',
    price: 79.90,
    originalPrice: 129.00,
    discountPercent: 38,
    rating: 4.8,
    reviewsCount: 1420,
    salesCount: 4100,
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    category: 'cama_banheiro',
    shopeeUrl: 'https://loja.com.br/produto/pet-cama-003',
    affiliateUrl: 'https://oferta.link/pet-banheiro-fechado-12',
    tags: ['Filtro de Carvão', 'Zero Areia Fora', 'Porta Vai-Vem', 'Fácil Higienização'],
    badges: ['Casa Sem Odor', 'Frete Grátis'],
    isFeatured: false,
    aiInsights: {
      idealFor: 'Ambientes fechados, apartamentos e tutores que querem casa sem cheiro de areia.',
      whyBuy: 'O teto fechado com filtro neutraliza 90% do cheiro e impede areia espalhada no chão.'
    },
    sellerName: 'SanitPet Oficial',
    sellerLocation: 'Joinville - SC',
    freeShipping: true
  },

  // 5. ACESSÓRIOS
  {
    id: 'pet-acess-001',
    title: 'Coleira Peitoral Antipuxão Ergonômica com Alça de Controle e Guia',
    shortDescription: 'Distribui a pressão no peito sem estrangular o pescoço e sem machucar a traqueia.',
    fullDescription: 'Peitoral estilo colete respirável com fechos reforçados em nylon militar e argola frontal anti-puxão. Possui alça superior reforçada para controle rápido em situações de emergência e costuras refletivas.',
    price: 45.90,
    originalPrice: 79.90,
    discountPercent: 43,
    rating: 4.9,
    reviewsCount: 1680,
    salesCount: 4800,
    imageUrl: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80',
    category: 'acessorios',
    shopeeUrl: 'https://loja.com.br/produto/pet-acess-001',
    affiliateUrl: 'https://oferta.link/pet-peitoral-ergonomico-13',
    tags: ['Anti-Puxão', 'Alça de Segurança', 'Costura Refletiva', 'Tecido Respirável'],
    badges: ['Recomendado por Adestradores', 'Frete Grátis'],
    isFeatured: true,
    aiInsights: {
      idealFor: 'Pets que puxam a guia durante o passeio e tutores buscando passeios prazerosos.',
      whyBuy: 'A fivela frontal desvia o centro de gravidade quando o pet traciona, educando sem dor.'
    },
    sellerName: 'AlphaPet Acessórios',
    sellerLocation: 'São Paulo - SP',
    freeShipping: true
  },
  {
    id: 'pet-acess-002',
    title: 'Arranhador Torre Castelo 3 Andares com Rede e Bolinha com Mola',
    shortDescription: 'Playground completo com postes revestidos de sisal natural e pelúcia ultra macia.',
    fullDescription: 'Torre de arranhar reforçada com 120cm de altura, 3 plataformas elevadas, casinha aconchegante e rede suspensa. Estimula os instintos naturais, alivia estresse e protege seus estofados.',
    price: 139.90,
    originalPrice: 229.00,
    discountPercent: 39,
    rating: 4.8,
    reviewsCount: 890,
    salesCount: 2310,
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    category: 'acessorios',
    shopeeUrl: 'https://loja.com.br/produto/pet-acess-002',
    affiliateUrl: 'https://oferta.link/pet-arranhador-torre-14',
    tags: ['Sisal Natural', 'Anti-Estresse', '3 Andares', 'Pelúcia Premium'],
    badges: ['Oferta Relâmpago', 'Frete Grátis'],
    isFeatured: true,
    isFlashDeal: true,
    aiInsights: {
      idealFor: 'Gatos em ambientes internos que precisam gastar energia verticalmente.',
      whyBuy: 'Salva móveis e sofás, proporcionando refúgio seguro em locais altos.'
    },
    sellerName: 'Mundo Pet Acessórios',
    sellerLocation: 'Curitiba - PR',
    freeShipping: true
  },
  {
    id: 'pet-acess-003',
    title: 'Kit 10 Brinquedos Interativos Pet Mordedores e Pelúcia com Apito',
    shortDescription: 'Variedade de cordas odontológicas e pelúcias que limpam os dentes e distraem.',
    fullDescription: 'Kit completo com cordas de algodão trançado 100% natural, bolas de borracha texturizadas para massagem gengival e bichinhos de pelúcia com apito interno.',
    price: 39.90,
    originalPrice: 79.90,
    discountPercent: 50,
    rating: 4.8,
    reviewsCount: 1840,
    salesCount: 6100,
    imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
    category: 'acessorios',
    shopeeUrl: 'https://loja.com.br/produto/pet-acess-003',
    affiliateUrl: 'https://oferta.link/pet-kit-brinquedos-15',
    tags: ['Kit Econômico', 'Algodão Natural', 'Limpeza de Tártaro', 'Diversão'],
    badges: ['50% OFF', 'Frete Grátis'],
    isFeatured: true,
    isFlashDeal: true,
    aiInsights: {
      idealFor: 'Pets com energia acumulada e filhotes em fase de roer objetos da casa.',
      whyBuy: 'Custo por brinquedo sai por menos de R$ 4,00 cada, com alta durabilidade.'
    },
    sellerName: 'PlayPet Distribuidora',
    sellerLocation: 'Blumenau - SC',
    freeShipping: true,
    couponAvailable: 'BRINCA10'
  },
  {
    id: 'pet-acess-004',
    title: 'Guia Retrátil 5 Metros com Trava de Segurança e Fita Refletiva',
    shortDescription: 'Liberdade e controle com mecanismo de travamento suave em um clique.',
    fullDescription: 'Estrutura ergonômica em ABS de alta resistência com cabo emborrachado confortável. Fita de nylon reforçada que suporta tração de até 25kg com costura refletiva para passeios noturnos seguros.',
    price: 32.50,
    originalPrice: 58.00,
    discountPercent: 44,
    rating: 4.7,
    reviewsCount: 650,
    salesCount: 1980,
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80',
    category: 'acessorios',
    shopeeUrl: 'https://loja.com.br/produto/pet-acess-004',
    affiliateUrl: 'https://oferta.link/pet-guia-retratil-16',
    tags: ['Passeio Seguro', 'Fita Refletiva', 'Trava Rápida', 'Até 25kg'],
    badges: ['Preço Baixo'],
    aiInsights: {
      idealFor: 'Passeios em parques e calçadas amplas, oferecendo raio de exploração sem perder o controle.',
      whyBuy: 'Mola de aço interna resistente anti-emperramento por menos da metade do preço convencional.'
    },
    sellerName: 'PetVenture Brasil',
    sellerLocation: 'Campinas - SP',
    freeShipping: false
  },

  // 6. ROUPAS E ACESSÓRIOS (Integrados em Acessórios & Estilo)
  {
    id: 'pet-roupa-001',
    title: 'Capa de Chuva Impermeável com Capuz Refletivo e Abertura para Guia',
    shortDescription: 'Proteção total contra chuva e vento com faixas refletivas de alta visibilidade.',
    fullDescription: 'Confeccionada em tecido impermeável de alta densidade, forro respirável e fechos de velcro ajustáveis no peito e abdômen. Possui abertura especial no dorso para encaixe fácil da coleira ou peitoral.',
    price: 39.90,
    originalPrice: 65.00,
    discountPercent: 38,
    rating: 4.8,
    reviewsCount: 820,
    salesCount: 2900,
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    category: 'acessorios',
    shopeeUrl: 'https://loja.com.br/produto/pet-roupa-001',
    affiliateUrl: 'https://oferta.link/pet-capa-chuva-17',
    tags: ['Impermeável', 'Faixas Refletivas', 'Fácil de Vestir', 'Abertura para Guia'],
    badges: ['Tendência', 'Frete Grátis'],
    isFeatured: true,
    aiInsights: {
      idealFor: 'Passeios em dias chuvosos ou frios, evitando pelagem molhada e cheiro forte.',
      whyBuy: 'Material resistente à água que seca rápido e não incomoda a movimentação do pet.'
    },
    sellerName: 'FashionPet Brasil',
    sellerLocation: 'São Paulo - SP',
    freeShipping: true
  },
  {
    id: 'pet-roupa-002',
    title: 'Moletom Quentinho com Capuz e Forro Macio para Pets (Diversas Cores)',
    shortDescription: 'Roupinha estilosa e confortável em algodão térmico para dias de frio e meia-estação.',
    fullDescription: 'Moletom com acabamento canelado nos punhos e barra para caimento perfeito. Tecido super confortável que mantém a temperatura corporal do animal sem restringir caminhadas ou brincadeiras.',
    price: 29.90,
    originalPrice: 48.00,
    discountPercent: 38,
    rating: 4.9,
    reviewsCount: 1100,
    salesCount: 3600,
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    category: 'acessorios',
    shopeeUrl: 'https://loja.com.br/produto/pet-roupa-002',
    affiliateUrl: 'https://oferta.link/pet-moletom-quente-18',
    tags: ['Inverno Pet', '100% Algodão', 'Com Capuz', 'Lavável na Máquina'],
    badges: ['Mais Vendido Inverno'],
    aiInsights: {
      idealFor: 'Pets de pelo curto, filhotes e idosos que sentem mais frio nas noites de outono e inverno.',
      whyBuy: 'Protege contra mudanças bruscas de temperatura com muito estilo e toque aveludado.'
    },
    sellerName: 'PetStyle Wear',
    sellerLocation: 'Gramado - RS',
    freeShipping: false
  },
  {
    id: 'pet-roupa-003',
    title: 'Kit 4 Bandanas Estilosas com Estampas Modernas Dupla Face',
    shortDescription: 'Acessório charmoso em tecido macio de algodão para fotos e passeios.',
    fullDescription: 'Kit com 4 bandanas triangulares em padrões contemporâneos. Tecido leve que não esquenta o pescoço e pode ser lavado repetidamente sem desbotar.',
    price: 22.90,
    originalPrice: 38.00,
    discountPercent: 40,
    rating: 4.8,
    reviewsCount: 540,
    salesCount: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80',
    category: 'acessorios',
    shopeeUrl: 'https://loja.com.br/produto/pet-roupa-003',
    affiliateUrl: 'https://oferta.link/pet-kit-bandanas-19',
    tags: ['Bandana Pet', 'Dupla Face', 'Kit com 4', 'Algodão Leve'],
    badges: ['Charmoso'],
    aiInsights: {
      idealFor: 'Sessões de fotos, aniversários pets e passeios de fim de semana.',
      whyBuy: 'Preço unitário muito baixo com 4 opções diferentes de looks.'
    },
    sellerName: 'CharmePet Store',
    sellerLocation: 'Belo Horizonte - MG',
    freeShipping: false
  },

  // 7. OUTROS
  {
    id: 'pet-outros-001',
    title: 'Mochila Astronauta Panorâmica Respirável para Transporte de Pets',
    shortDescription: 'Cúpula transparente de visão 180° com 9 orifícios de ventilação e esteira interna.',
    fullDescription: 'Mochila ergonômica com cúpula acrílica transparente e tecido impermeável Oxford. Proporciona ventilação abundante, alças acolchoadas ajustáveis para os ombros e presilha interna de segurança para coleira.',
    price: 99.90,
    originalPrice: 169.00,
    discountPercent: 41,
    rating: 4.9,
    reviewsCount: 1950,
    salesCount: 5400,
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    category: 'outros',
    shopeeUrl: 'https://loja.com.br/produto/pet-outros-001',
    affiliateUrl: 'https://oferta.link/pet-mochila-astronauta-20',
    tags: ['Mochila Astronauta', 'Visão Panorâmica', 'Super Ventilada', 'Transporte Seguro'],
    badges: ['Viral de Vendas', 'Frete Grátis'],
    isFeatured: true,
    isFlashDeal: true,
    aiInsights: {
      idealFor: 'Passeios ao ar livre, idas ao veterinário e viagens onde o pet gosta de observar a paisagem.',
      whyBuy: 'Distribui o peso uniformemente nas costas do tutor e reduz o estresse do animal no trajeto.'
    },
    sellerName: 'ViajePet Brasil',
    sellerLocation: 'São Paulo - SP',
    freeShipping: true
  },
  {
    id: 'pet-outros-002',
    title: 'Cinto de Segurança Veicular Universal com Mola Amortecedora para Pets',
    shortDescription: 'Fita de nylon reforçada com engate universal para travar o pet no cinto do carro.',
    fullDescription: 'Projetado com mola de amortecimento elástica que absorve o impacto de freadas bruscas. Mosquetão giratório 360° em liga de zinco que se conecta ao peitoral do animal, atendendo às normas de trânsito.',
    price: 18.90,
    originalPrice: 32.00,
    discountPercent: 41,
    rating: 4.9,
    reviewsCount: 2400,
    salesCount: 8200,
    imageUrl: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80',
    category: 'outros',
    shopeeUrl: 'https://loja.com.br/produto/pet-outros-002',
    affiliateUrl: 'https://oferta.link/pet-cinto-carro-21',
    tags: ['Segurança no Carro', 'Mola Anti-Impacto', 'Engate Universal', 'Nylon Militar'],
    badges: ['Item Obrigatório'],
    aiInsights: {
      idealFor: 'Qualquer tutor que transporta pets no banco traseiro do carro.',
      whyBuy: 'Evita multas de trânsito e protege o pet contra acidentes e quedas nas curvas.'
    },
    sellerName: 'AutoPet Segurança',
    sellerLocation: 'Santo André - SP',
    freeShipping: false
  },
  {
    id: 'pet-outros-003',
    title: 'Rolo Removedor de Pelos Reutilizável com Depósito Autolimpante',
    shortDescription: 'Remove pelos de sofás, tapetes e roupas sem precisar de refil adesivo.',
    fullDescription: 'Tecnologia de atrito eletrostático com escovas bidirecionais que capturam pelos e fiapos instantaneamente, guardando-os no compartimento traseiro com abertura em um clique.',
    price: 27.90,
    originalPrice: 46.00,
    discountPercent: 39,
    rating: 4.8,
    reviewsCount: 1780,
    salesCount: 6500,
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    category: 'outros',
    shopeeUrl: 'https://loja.com.br/produto/pet-outros-003',
    affiliateUrl: 'https://oferta.link/pet-rolo-tira-pelos-22',
    tags: ['Sem Refil', 'Eletrostático', 'Depósito Interno', 'Ecológico'],
    badges: ['Campeão de Praticidade'],
    aiInsights: {
      idealFor: 'Casas com sofás de tecido, tapetes e camas com acúmulo de pelos.',
      whyBuy: 'Dura anos sem custos recorrentes de fitas adesivas descartáveis.'
    },
    sellerName: 'CleanHome Utilidades',
    sellerLocation: 'São Paulo - SP',
    freeShipping: true
  }
];

export const CURATED_KITS: CuratedKit[] = [
  {
    id: 'kit-nutri-saude',
    title: 'Kit Alimentação & Hidratação Plena',
    subtitle: 'Comedouro automático + fonte elétrica de água corrente com filtro.',
    category: 'alimentacao',
    tag: 'Mais Vendido',
    iconName: 'Utensils',
    productIds: ['pet-alim-001', 'pet-saude-001', 'pet-alim-002'],
    savingsTotal: 95.00
  },
  {
    id: 'kit-conforto-sono',
    title: 'Kit Sono Tranquilo & Banheiro Limpo',
    subtitle: 'Caminha nuvem ortopédica + tapete higiênico de carvão anti-odores.',
    category: 'cama_banheiro',
    tag: 'Conforto Máximo',
    iconName: 'BedDouble',
    productIds: ['pet-cama-001', 'pet-cama-002', 'pet-saude-003'],
    savingsTotal: 82.00
  },
  {
    id: 'kit-passeio-seguro',
    title: 'Kit Passeio Seguro & Estilo',
    subtitle: 'Peitoral antipuxão ergonômico + capa de chuva refletiva + cinto veicular.',
    category: 'acessorios',
    tag: 'Destaque Segurança',
    iconName: 'Package',
    productIds: ['pet-acess-001', 'pet-roupa-001', 'pet-outros-002'],
    savingsTotal: 58.00
  },
  {
    id: 'kit-spa-cuidados',
    title: 'Kit Spa & Higiene em Casa',
    subtitle: 'Escova a vapor autolimpante + cortador com LED + shampoo hipoalergênico.',
    category: 'cuidados_especiais',
    tag: 'Higiene Completa',
    iconName: 'Sparkles',
    productIds: ['pet-cuidado-001', 'pet-cuidado-002', 'pet-cuidado-003'],
    savingsTotal: 65.00
  }
];

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'banner-1',
    badge: 'OFERTAS EM DESTAQUE',
    badgeColor: 'bg-amber-500 text-white',
    title: 'Semana Pet: Até 50% OFF em Alimentação e Conforto',
    subtitle: 'Comedouros automáticos, petiscos odontológicos e caminhas ortopédicas com cupons e Frete Grátis.',
    ctaText: 'Ver Produtos de Alimentação',
    categoryTarget: 'alimentacao',
    bgGradient: 'from-amber-900 via-stone-900 to-stone-950',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    highlightBadge: 'Cupons Válidos Hoje'
  },
  {
    id: 'banner-2',
    badge: 'CUIDADOS ESPECIAIS & BEM-ESTAR',
    badgeColor: 'bg-amber-600 text-white',
    title: 'Escovas a Vapor & Fontes Purificadoras Elétricas',
    subtitle: 'Itens essenciais para a higiene diária, hidratação contínua e bem-estar do seu pet.',
    ctaText: 'Explorar Cuidados Especiais',
    categoryTarget: 'cuidados_especiais',
    bgGradient: 'from-amber-950 via-stone-900 to-stone-950',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    highlightBadge: 'Top Higiene Pet'
  },
  {
    id: 'banner-3',
    badge: 'CAMA & BANHEIRO',
    badgeColor: 'bg-amber-700 text-white',
    title: 'Caminhas Nuvem Antiestresse & Banheiros Antiodor',
    subtitle: 'Conforto térmico, tapetes higiênicos de carvão ativado e descanso seguro para seu melhor amigo.',
    ctaText: 'Ver Cama e Banheiro',
    categoryTarget: 'cama_banheiro',
    bgGradient: 'from-stone-900 via-amber-950 to-stone-950',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    highlightBadge: 'Super Descontos'
  }
];

