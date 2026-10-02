import React, { useState } from 'react';
import { 
  HeartPulse, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ShieldCheck, 
  Apple, 
  Activity, 
  Stethoscope, 
  Lightbulb,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Product } from '../types';

interface PetHealthSectionProps {
  allProducts: Product[];
  onOpenProductDetails: (product: Product) => void;
}

const HEALTH_TIPS = [
  {
    id: 1,
    title: 'Alimentação Natural vs. Ração Super Premium',
    category: 'Nutrição',
    readTime: '3 min',
    summary: 'Descubra como balancear proteínas, carboidratos e suplementos essenciais para cães e gatos em cada fase da vida.',
    highlight: 'Dica: Evite alimentos condimentados e cebola/alho, que são tóxicos.'
  },
  {
    id: 2,
    title: 'Hidratação Ideal para Gatos',
    category: 'Bem-estar Feline',
    readTime: '2 min',
    summary: 'Gatos tendem a beber menos água do que o necessário. Fontes de água corrente e sachês diários previnem problemas renais.',
    highlight: 'Dica: Espalhe potes de água longe da caixa de areia.'
  },
  {
    id: 3,
    title: 'Prevenção de Tártaro e Saúde Bucal',
    category: 'Higiene',
    readTime: '4 min',
    summary: 'Escovação regular com pasta própria para pets e petiscos funcionais evitam gengivite e problemas cardíacos futuros.',
    highlight: 'Dica: Nunca use creme dental humano (flúor é tóxico).'
  },
  {
    id: 4,
    title: 'Cuidados com Pets Idosos (Senior)',
    category: 'Longevidade',
    readTime: '5 min',
    summary: 'Tapetes antiderrapantes, rampas e exames de sangue semestrais garantem uma velhice confortável e sem dores articulares.',
    highlight: 'Dica: Suplementos de condroitina ajudam nas articulações.'
  }
];

const PRESET_QUESTIONS = [
  'Como dar banho no meu cão em casa do jeito certo?',
  'Meu gato não quer beber água, o que posso fazer?',
  'Qual a quantidade ideal de ração por dia para cães e gatos?',
  'Quais alimentos caseiros são seguros e quais são proibidos?',
  'Como diminuir a queda de pelos e manter a higiene?'
];

export const PetHealthSection: React.FC<PetHealthSectionProps> = ({
  allProducts,
  onOpenProductDetails
}) => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Olá! Sou o assistente especialista em cuidados, nutrição e bem-estar do Achadinhos Pet 🐾.\n\nComo posso ajudar você hoje? Pergunte sobre passo a passo para banho, hidratação, quantidade de ração, queda de pelos, passeios ou dicas de higiene diária!'
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const getSmartFallbackResponse = (userText: string): string => {
    const lower = userText.toLowerCase();

    // 1. Banho em Cães
    if (lower.includes('banho') || lower.includes('lavar') || lower.includes('shampoo') || lower.includes('xampu') || lower.includes('cheiro')) {
      return `🚿 **Guia Prático: Como Dar Banho no Seu Cão em Casa com Segurança**

1. **Preparo Essencial:**
   • Coloque bolinhas de algodão seco nos ouvidos do cão antes de molhar para impedir entrada de água e prevenir otites.
   • Escove o pet antes do banho para remover pelos soltos e nós.

2. **Temperatura da Água:**
   • Use água **morna para fresca**. Água quente resseca a pele, causa caspa e coceira intensa.

3. **Passo a Passo da Lavagem:**
   • Molhe o corpo do pescoço para trás (deixe a cabeça por último).
   • Aplique xampu próprio para pets (ex: **Clorexidina Dug's** para prevenção de fungos e alergias ou xampu neutro para filhotes). NUNCA use sabonete humano.
   • Massageie bem as patinhas, barriga e axilas.
   • Enxágue 100% da espuma — restos de sabão são o principal motivo de alergias.
   • Para a cabeça, limpe com um pano úmido ou esponja macia, evitando olhos e focinho.

4. **Secagem Obrigatória:**
   • Retire o excesso com toalha e finalize com secador em **temperatura morna**, mantendo pelo menos 20 cm de distância.
   • ⚠️ **Atenção:** Nunca deixe o cão secar ao ar livre com pelos úmidos, pois a umidade acumulada cria fungos e mau odor.

💡 **Frequência recomendada:** A cada 15 a 30 dias para cães normais.`;
    }

    // 2. Gato que não bebe água / Hidratação
    if (lower.includes('agua') || lower.includes('beber') || lower.includes('gato') || lower.includes('hidrata') || lower.includes('rim') || lower.includes('renal')) {
      return `💧 **Plano de Ação: Como Fazer Seu Pet Beber até 3x Mais Água**

1. **Adote Água em Movimento:**
   • Felinos têm instinto ancestral que rejeita água parada. Uma **Fonte Bebedouro Elétrica com Filtro** estimula a curiosidade e aumenta a ingestão hídrica drasticamente.

2. **Regra da Separação:**
   • Nunca coloque o pote de água grudado no comedouro ou perto da caixa de areia. Mantenha os bebedouros em cômodos diferentes.

3. **Multiplique os Pontos de Água:**
   • Espalhe 2 a 3 tigelas de cerâmica ou inox largas pela casa para evitar que os bigodes encostem nas bordas (*fadiga dos bigodes*).

4. **Incorpore Alimentos Úmidos:**
   • Ofereça sachês ou patês de qualidade diariamente misturados com um pouquinho de água morna.

💡 **Meta diária:** Cerca de 50ml a 60ml de água para cada 1 kg de peso corporal.`;
    }

    // 3. Ração e Quantidade
    if (lower.includes('racao') || lower.includes('quantidade') || lower.includes('comer') || lower.includes('comida') || lower.includes('porcao') || lower.includes('peso')) {
      return `🥣 **Cálculo e Manejo de Ração para Cães e Gatos**

1. **Como Calcular a Porção:**
   • A quantidade exata em gramas sempre vem na tabela do verso da embalagem da ração, baseada no **peso atual do animal** e no nível de atividade física.
   • Para cães de pequeno porte (até 5kg): cerca de 70g a 110g/dia.
   • Para cães médios (10-15kg): cerca de 160g a 240g/dia.
   • Para cães grandes (25-35kg): cerca de 320g a 420g/dia.
   • Para gatos adultos (3-5kg): cerca de 45g a 65g/dia.

2. **Rotina de Alimentação:**
   • Divida a porção diária em **2 a 3 refeições** em horários fixos. Evite deixar o prato cheio o dia todo (a ração perde o aroma e atrai insetos).

3. **Animais Castrados:**
   • Reduza cerca de 15% a 20% da porção ou migre para uma linha *Castrados/Light* para evitar obesidade.

💡 **Dica de Ouro:** Ao trocar de ração, faça uma transição gradual misturando a antiga com a nova ao longo de 7 dias.`;
    }

    // 4. Alimentos Proibidos e Permitidos
    if (lower.includes('alimento') || lower.includes('caseiro') || lower.includes('pode dar') || lower.includes('fruta') || lower.includes('proibido') || lower.includes('toxico')) {
      return `🥩 **Guia Rápido: Alimentos Permitidos e Alimentos Proibidos**

✅ **Permitidos (com moderação e SEM NENHUM tempero, sal ou óleo):**
• Frango cozido desfiado (peito sem osso e sem pele)
• Cenoura cozida ou crua (excelente para roer)
• Abóbora, chuchu e abobrinha cozidos
• Maçã sem sementes e banana em rodelas pequenas

🚫 **PROIBIDOS e TÓXICOS (Nunca ofereça):**
• **Cebola, alho e cebolinha:** destroem os glóbulos vermelhos do sangue.
• **Chocolate e café:** contêm teobromina/cafeína (tóxico para o coração).
• **Uva e uva passa:** causam falência renal aguda súbita.
• **Ossos cozidos:** lascam facilmente e podem perfurar o esôfago ou estômago.
• **Doces com Xilitol:** causam queda drástica de glicose no sangue.`;
    }

    // 5. Queda de Pelos e Escovação
    if (lower.includes('pelo') || lower.includes('escova') || lower.includes('cair') || lower.includes('queda') || lower.includes('troca')) {
      return `✨ **Como Reduzir a Queda de Pelos e Manter a Casa Limpa**

1. **Escovação Frequente:**
   • Escove o pet de 2 a 4 vezes por semana. O uso de uma **Escova a Vapor Pet 3 em 1** retira até 90% dos pelos mortos sem puxar e sem espalhar pelos no ar.

2. **Nutrição Fortalecida:**
   • Rações Super Premium ricas em **Ômega 3 e 6, Biotina e Zinco** fortalecem os folículos e deixam a pelagem brilhante.

3. **Diferencie Queda Normal de Doença:**
   • Queda uniforme na troca de estação é normal. Se houver falhas circulares, vermelhidão ou caspas, use xampus dermatológicos (como Clorexidina ou Dermotrat Spray).`;
    }

    // Resposta padrão especializada e estruturada
    return `🐾 **Orientações Práticas do Especialista para "${userText}":**

1. **Passo Inicial:** Avalie a rotina diária do seu pet (horários de refeição, hidratação e enriquecimento ambiental).
2. **Higiene e Conforto:** Mantenha os comedouros e bebedouros higienizados e utilize produtos formulados exclusivamente para uso veterinário.
3. **Prevenção Diária:** Pequenos hábitos diários — como água corrente oxigenada, escovação periódica de pelos e proteção auricular no banho — evitam mais de 80% das visitas emergenciais.

💡 Se desejar orientações passo a passo sobre um procedimento específico (como banho, corte de unhas, limpeza de ouvidos ou adestramento), pode perguntar!`;
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isThinking) return;

    const userText = question.trim();
    setQuestion('');
    setChatHistory((prev) => [...prev, { role: 'user', text: userText }]);
    setIsThinking(true);

    try {
      const res = await fetch('/api/chat/pet-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userText,
          history: chatHistory.slice(-4)
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.reply) {
          setChatHistory((prev) => [...prev, { role: 'assistant', text: data.reply }]);
          setIsThinking(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend AI assistant unavailable, using expert fallback system:', err);
    }

    // Fallback if server is not reachable or without active key
    setTimeout(() => {
      const fallbackReply = getSmartFallbackResponse(userText);
      setChatHistory((prev) => [...prev, { role: 'assistant', text: fallbackReply }]);
      setIsThinking(false);
    }, 600);
  };

  const handlePresetClick = (q: string) => {
    setQuestion(q);
  };

  return (
    <section className="bg-gradient-to-b from-stone-100 to-amber-50/40 py-12 border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
            <HeartPulse className="w-4 h-4 text-emerald-700" />
            <span>Saúde & Bem-Estar Pet</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Guia de Cuidados & Assistente Pet
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Artigos especializados em nutrição e saúde animal, além de um espaço inteligente para tirar dúvidas rápidas sobre o seu pet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Expert Health Tips Grid */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-700" />
                <span>Dicas de Ouro dos Especialistas</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {HEALTH_TIPS.map((tip) => (
                <div 
                  key={tip.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs hover:border-amber-700/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {tip.category}
                      </span>
                      <span className="text-stone-400 font-medium">{tip.readTime} de leitura</span>
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm mb-1.5 leading-snug">
                      {tip.title}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed mb-3">
                      {tip.summary}
                    </p>
                  </div>

                  <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-xl p-2.5 text-[11px] text-emerald-900 font-medium flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{tip.highlight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: AI Pet Health Assistant Chat */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-md overflow-hidden flex flex-col h-[520px]">
              
              {/* Chat Header */}
              <div className="bg-stone-900 text-white px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold">Assistente Pet IA</h3>
                    <p className="text-[10px] text-amber-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Online • Tire dúvidas de cuidados
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-stone-800 text-stone-300 px-2.5 py-1 rounded-full border border-stone-700">
                  Guia Inteligente
                </span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50">
                {chatHistory.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.role === 'user' ? 'bg-amber-800 text-white' : 'bg-stone-900 text-amber-400'
                    }`}>
                      {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-amber-800 text-white rounded-tr-xs whitespace-pre-wrap' 
                        : 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs shadow-2xs'
                    }`}>
                      {msg.role === 'user' ? (
                        msg.text
                      ) : (
                        <div className="space-y-1.5">
                          {msg.text.split('\n').map((line, lIdx) => {
                            if (!line.trim()) return <div key={lIdx} className="h-1.5" />;
                            // Parse **bold** parts
                            const parts = line.split(/(\*\*.*?\*\*)/g);
                            return (
                              <p key={lIdx} className={line.startsWith('•') || line.startsWith('-') || /^\d+\./.test(line) ? 'pl-2 text-stone-700' : ''}>
                                {parts.map((part, pIdx) => {
                                  if (part.startsWith('**') && part.endsWith('**')) {
                                    return <strong key={pIdx} className="font-bold text-stone-900">{part.slice(2, -2)}</strong>;
                                  }
                                  return part;
                                })}
                              </p>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isThinking && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white text-stone-500 border border-stone-200 rounded-2xl rounded-tl-xs px-4 py-2.5 text-xs flex items-center gap-1.5 shadow-2xs">
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce delay-150"></span>
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce delay-300"></span>
                      <span className="text-[11px] ml-1">Consultando base veterinária...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Questions Chips */}
              <div className="px-4 py-2 bg-white border-t border-stone-200 overflow-x-auto flex gap-1.5 no-scrollbar">
                {PRESET_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetClick(q)}
                    className="text-[10px] bg-stone-100 hover:bg-amber-50 hover:text-amber-900 text-stone-700 px-2.5 py-1 rounded-full whitespace-nowrap border border-stone-200 transition-colors cursor-pointer shrink-0"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleAskAI} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Pergunte sobre ração, banho, comportamento..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-700 text-stone-900"
                />
                <button
                  type="submit"
                  disabled={!question.trim() || isThinking}
                  className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <span>Enviar</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
