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
  'Qual a quantidade ideal de ração por dia para meu cachorro de médio porte?',
  'Meu gato não quer beber água, o que posso fazer?',
  'Quais alimentos caseiros são seguros para dar ao pet?',
  'Como saber se meu pet está com dor ou desconforto articular?'
];

export const PetHealthSection: React.FC<PetHealthSectionProps> = ({
  allProducts,
  onOpenProductDetails
}) => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Olá! Sou o assistente especialista em saúde e bem-estar pet 🐾. Como posso ajudar você a cuidar melhor do seu cão ou gato hoje? Pode perguntar sobre alimentação, comportamento ou cuidados!'
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isThinking) return;

    const userText = question.trim();
    setQuestion('');
    setChatHistory((prev) => [...prev, { role: 'user', text: userText }]);
    setIsThinking(true);

    // Simulate smart veterinary assistant AI response
    setTimeout(() => {
      let reply = 'Com base em diretrizes veterinárias gerais, é muito importante mantermos uma rotina de exames periódicos e observarmos qualquer alteração no apetite ou energia do seu pet. ';
      
      const lower = userText.toLowerCase();
      if (lower.includes('agua') || lower.includes('beber') || lower.includes('gato')) {
        reply = 'Para incentivar a hidratação em gatos e cães, experimente trocar a água com frequência para mantê-la sempre fresca, usar fontes de água corrente e adicionar um pouco de sachê de qualidade ou caldo de carne caseiro sem tempero.';
      } else if (lower.includes('racao') || lower.includes('quantidade') || lower.includes('comer') || lower.includes('comida')) {
        reply = 'A quantidade ideal de ração varia de acordo com o peso, idade e nível de atividade física do pet (geralmente descrita no verso do pacote). Para animais castrados, o metabolismo costuma diminuir cerca de 20%, exigindo atenção para evitar o sobrepeso.';
      } else if (lower.includes('alimento') || lower.includes('caseiro') || lower.includes('pode dar')) {
        reply = 'Alimentos seguros em pequenas quantidades (sem sal, alho ou cebola) incluem: frango cozido desfiado, cenoura cozida, abóbora e chuchu. Nunca ofereça chocolate, uva, macadâmia, café ou doces com xilitol.';
      } else if (lower.includes('dor') || lower.includes('articular') || lower.includes('senior') || lower.includes('idoso')) {
        reply = 'Sinais de dor articular incluem dificuldade para subir no sofá, relutância em caminhar ou lambedura insistente nas patas. Tapetes antiderrapantes em pisos lisos e suplementos à base de condroitina e glucosamina ajudam muito no conforto.';
      } else {
        reply = `Essa é uma excelente dúvida sobre "${userText}". O ideal é manter visitas regulares ao veterinário de confiança e garantir água fresca, enriquecimento ambiental e alimentação de alta qualidade.`;
      }

      setChatHistory((prev) => [...prev, { role: 'assistant', text: reply }]);
      setIsThinking(false);
    }, 1200);
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
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-amber-800 text-white rounded-tr-xs' 
                        : 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs shadow-2xs'
                    }`}>
                      {msg.text}
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
