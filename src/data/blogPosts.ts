import { BlogPost } from '../types';
import coverCatFountain from '../assets/images/cat_water_fountain_blog_1790904070783.jpg';

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-segredo-felino-agua-corrente',
    slug: 'o-segredo-felino-que-evita-o-veterinario-agua-corrente',
    title: 'O Segredo Felino que Evita o Veterinário: Por Que Seu Gato Ignora a Água Parada?',
    subtitle: 'Descubra o instinto ancestral do deserto que faz os gatos rejeitarem a tigela comum, o perigo silencioso das doenças renais e o truque simples para fazê-lo beber até 3x mais água.',
    excerpt: 'Seu gato prefere beber água da torneira da pia ou molhar a pata no seu copo do que tocar na tigela dele? Não é birra nem mania: é biologia pura. Entenda como essa curiosidade ancestral pode poupar milhares de reais em tratamentos veterinários.',
    category: 'Saúde & Comportamento Felino',
    readTime: '4 min',
    publishDate: '01 de Outubro de 2026',
    author: {
      name: 'Redação Achadinhos Pet',
      role: 'Curadoria de Saúde & Bem-Estar Pet',
      avatarUrl: 'https://i.imgur.com/g4qHahz.png'
    },
    coverImage: coverCatFountain,
    tags: ['Gatos', 'Saúde Renal', 'Água Corrente', 'Bebedouros Pet', 'Dicas Veterinárias'],
    recommendedProductIds: ['pet-saude-001'],
    featured: true,
    viewsCount: 1420,
    likesCount: 384,
    seoDescription: 'Por que gatos não bebem água na tigela? Entenda o instinto ancestral do deserto, os riscos renais e como fazer seu gato beber 3x mais água com fontes de água corrente.',
    seoKeywords: [
      'gato não bebe água',
      'fonte para gato',
      'problema renal gatos',
      'bebedouro elétrico gato',
      'por que gatos bebem da pia',
      'saúde felina'
    ],
    contentSections: [
      {
        type: 'paragraph',
        text: 'Você já passou pela cena: colocou água fresca e limpa na tigela de inox do seu gato, mas minutos depois ele está em cima da pia do banheiro, miando e esperando você abrir a torneira? Ou pior: você percebe que a água do pote fica praticamente intocada o dia inteiro.'
      },
      {
        type: 'paragraph',
        text: 'Muitos tutores acham que se trata de uma simples "mania engraçadinha" ou birra de felino mimado. Mas a medicina veterinária moderna e os estudos de comportamento revelam algo muito mais sério: trata-se de um instinto de sobrevivência ancestral que, se ignorado, pode colocar a vida do seu bichano em risco silencioso.'
      },
      {
        type: 'callout',
        calloutType: 'warning',
        title: 'O Alerta Clínico: O Risco Silencioso dos Rins Felinos',
        text: 'Doenças renais crônicas e obstruções urinárias por cálculo (FUS/FLUTD) estão entre as três maiores causas de emergência e óbito em gatos adultos e idosos. Uma internação veterinária com desobstrução uretral e exames custa com facilidade entre R$ 1.500 e R$ 4.500 no Brasil — e mais de 80% desses casos poderiam ser prevenidos com ingestão hídrica abundante no dia a dia.'
      },
      {
        type: 'heading2',
        title: '1. O Segredo do Deserto: De Onde Vem Esse Comportamento?'
      },
      {
        type: 'paragraph',
        text: 'Os ancestrais de todos os gatos domésticos — o gato-bravo-africano (*Felis lybica*) — viviam em regiões áridas e desérticas do norte da África e Oriente Médio. Naquele habitat inóspito, fontes de água parada em poças eram extremamente perigosas, servindo de criadouro para bactérias patogênicas, parasitas mortais e carcaças em decomposição.'
      },
      {
        type: 'paragraph',
        text: 'Ao longo de milhares de anos de evolução, o cérebro dos felinos gravou um comando rígido de preservação: **água estagnada = veneno potencial; água em movimento = fonte corrente oxigenada, fresca e segura**.'
      },
      {
        type: 'quote',
        text: 'Para o cérebro de um gato, a água parada na tigelinha de chão não parece límpida. Parece perigo. Quando ele ouve o som de água correndo ou vê gotículas se movendo, seu gatilho neural de sede é imediatamente despertado.'
      },
      {
        type: 'heading2',
        title: '2. Por Que a Tigela Comum Causa Estresse e Rejeição?'
      },
      {
        type: 'paragraph',
        text: 'Além do instinto primitivo, existem fatores físicos e sensoriais que fazem os felinos detestarem comedouros e bebedouros convencionais:'
      },
      {
        type: 'tips_list',
        title: 'Os 3 Grandes Vilões da Tigela Tradicional:',
        items: [
          'Fadiga dos Bigodes (Whisker Stress): Os bigodes dos gatos (vibrissas) possuem terminações nervosas ultra-sensíveis. Tigelas estreitas e fundas esbarram nos bigodes toda vez que o animal tenta beber, gerando desconforto sensorial intenso.',
          'Dificuldade Visual com Superfície Parada: A visão felina é especialista em detectar movimento, mas míope para objetos estáticos a menos de 25 cm. Eles não enxergam onde a lâmina d\'água começa e muitas vezes molham o focinho por acidente, assustando-se.',
          'Contaminação por Pelos e Poeira: Em poucas horas no chão, a água parada acumula micropartículas de poeira e saliva que formam um biofilme escorregadio invisível, que o olfato apurado do gato rejeita.'
        ]
      },
      {
        type: 'product_highlight',
        productId: 'pet-saude-001',
        title: 'Achadinho Testado & Aprovado: Fonte Bebedouro Elétrica Ultra Silenciosa',
        text: 'Este é o modelo mais recomendado por médicos veterinários: possui sistema de filtragem contínua por carvão ativado, bomba submersa silenciosa que não assusta o pet e cascata de água oxigenada permanente.'
      },
      {
        type: 'heading2',
        title: '3. As 4 Regras de Ouro para Fazer Seu Gato Beber Mais Água Hoje'
      },
      {
        type: 'paragraph',
        text: 'Se você quer blindar o sistema renal do seu companheiro de quatro patas e evitar visitas traumáticas à clínica veterinária, adote estas quatro regras simples na sua casa:'
      },
      {
        type: 'tips_list',
        title: 'Plano de Ação Imediato:',
        items: [
          'Regra da Separação Geográfica: NUNCA coloque a água colada na comida ou ao lado da caixa de areia. Na natureza, felinos nunca bebem perto de onde caçam ou defecam. Mantenha os bebedouros em cômodos diferentes ou a pelo menos 2 metros de distância.',
          'Adote Água em Movimento: Troque a tigela estática por uma fonte de água elétrica com filtro purificador. O som sutil da água e o fluxo contínuo despertam a curiosidade e aumentam a ingestão em até 300%.',
          'Espalhe Múltiplos Pontos pela Casa: Gatos são preguiçosos por conveniência territorial. Ter 2 ou 3 pontos de hidratação no trajeto dele garante que ele beba água com muito mais frequência.',
          'Incorpore Sachês e Petiscos Úmidos: A ração seca comum contém apenas cerca de 10% de umidade, enquanto a dieta natural da presa teria 70%. Oferecer ração úmida (sachê) ou caldinho sem tempero todo dia é remédio preventivo diário.'
        ]
      },
      {
        type: 'callout',
        calloutType: 'success',
        title: 'Economia Inteligente: Prevenção vs. Emergência',
        text: 'Uma fonte purificadora de qualidade custa menos de R$ 70,00 e consome meros 1.5 Watts de energia (menos de R$ 2,00 por mês na sua conta de luz). Em contrapartida, uma única sessão de desobstrução uretral e exame ultrassonográfico veterinário passa facilmente de R$ 1.500. É o melhor investimento que você pode fazer pelo seu pet.'
      },
      {
        type: 'product_highlight',
        productId: 'pet-saude-001',
        title: 'Garanta a Fonte Purificadora com Desconto na Shopee Oficial',
        text: 'Clique abaixo para garantir o seu modelo com frete grátis, garantia de entrega e filtro de carvão ativado incluso. Seu gato sentirá a diferença no primeiro dia.'
      },
      {
        type: 'faq',
        title: 'Perguntas Frequentes de Tutores (FAQ)',
        faqAnswers: [
          {
            question: 'Quanto de água meu gato precisa beber por dia?',
            answer: 'A recomendação média veterinária é de 50ml a 60ml de água para cada 1 kg de peso corporal por dia. Um gato de 4 kg deve consumir cerca de 200ml a 240ml diariamente (somando água líquida e a umidade dos sachês).'
          },
          {
            question: 'A fonte elétrica gasta muita energia ou faz barulho?',
            answer: 'Os modelos modernos utilizam bombas submersas de baixíssima voltagem (1.5W a 2.5W), que consomem centavos de energia por mês e operam abaixo de 20 decibéis — mais silenciosas que o barulho de folhas ao vento.'
          },
          {
            question: 'De quanto em quanto tempo devo limpar a fonte e trocar o filtro?',
            answer: 'A troca total da água e higienização da carcaça plástica deve ser feita semanalmente. O refil do filtro de carvão ativado e algodão deve ser substituído a cada 30 a 45 dias para assegurar retenção de impurezas.'
          }
        ]
      }
    ]
  },
  {
    id: 'post-ansiedade-separacao-brinquedos',
    slug: 'o-que-seu-pet-faz-quando-voce-sai-de-casa',
    title: 'O Que Seu Pet Realmente Faz Quando Você Sai de Casa? (E Como Evitar o Estresse)',
    subtitle: 'Destruição de móveis, latidos sem parar ou sono depressivo? Saiba como identificar a ansiedade de separação e enriquecer o ambiente do seu cão ou gato.',
    excerpt: 'Você fecha a porta e fica com o coração apertado? Descubra como os brinquedos inteligentes e petiscos funcionais transformam as horas de solidão em momentos de diversão autônoma.',
    category: 'Comportamento & Bem-Estar',
    readTime: '3 min',
    publishDate: '28 de Setembro de 2026',
    author: {
      name: 'Equipe Achadinhos Pet',
      role: 'Curadoria de Cuidados & Dicas',
      avatarUrl: 'https://i.imgur.com/g4qHahz.png'
    },
    coverImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Cães', 'Gatos', 'Ansiedade de Separação', 'Brinquedos Interativos'],
    recommendedProductIds: ['pet-saude-001'],
    featured: false,
    viewsCount: 930,
    likesCount: 215,
    seoDescription: 'Descubra como combater a ansiedade de separação em cães e gatos com enriquecimento ambiental e dispensadores automáticos.',
    seoKeywords: ['ansiedade de separação pet', 'brinquedo interativo cachorro', 'gato sozinho em casa'],
    contentSections: [
      {
        type: 'paragraph',
        text: 'Para um pet, a sua saída pode parecer uma eternidade. Sem estímulos adequados, o tédio rapidamente se converte em ansiedade crônica, manifestada em destruição de sofás, calçados e latidos excessivos que incomodam vizinhos.'
      },
      {
        type: 'heading2',
        title: 'O Conceito de Enriquecimento Ambiental'
      },
      {
        type: 'paragraph',
        text: 'Pets precisam gastar energia física e mental. Quando deixamos dispensadores inteligentes com petiscos ou água fresca, o cérebro deles foca no desafio de forrageamento alimentar, exatamente como fariam na vida selvagem.'
      }
    ]
  }
];
