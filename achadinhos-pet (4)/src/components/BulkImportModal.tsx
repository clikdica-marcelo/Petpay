import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  Layers, 
  ArrowRight,
  ListPlus,
  HelpCircle,
  Copy
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { OFFICIAL_CATEGORIES } from '../data/mockProducts';
import { formatBRL, parseBRL } from '../utils/currency';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportProducts: (products: Product[]) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onImportProducts
}) => {
  const [importMode, setImportMode] = useState<'quick_links' | 'csv' | 'json'>('quick_links');
  const [rawText, setRawText] = useState('');
  const [defaultCategory, setDefaultCategory] = useState<ProductCategory>('alimentacao');
  const [previewProducts, setPreviewProducts] = useState<Product[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState<number | null>(null);

  if (!isOpen) return null;

  // Example CSV Template
  const sampleCsv = `Título;Preço;LinkShopee;FotoURL;Categoria;Desconto%
Ração Golden Special Cães 15kg;149.90;https://shopee.com.br/produto/1;https://images.unsplash.com/photo-1589924691995-400dc9ecc119;alimentacao;25
Escova Removedora a Vapor Pet;38.90;https://shopee.com.br/produto/2;https://images.unsplash.com/photo-1516734212186-a967f81ad0d7;cuidados_especiais;40
Caminha Nuvem Redonda Pet 60cm;64.90;https://shopee.com.br/produto/3;https://images.unsplash.com/photo-1541599540903-216a46ca1dc0;cama_banheiro;30
Fonte de Água Automática 2L;79.90;https://shopee.com.br/produto/4;https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a;saude_bem_estar;20`;

  // Example Quick Links Template
  const sampleQuickLinks = `https://shopee.com.br/produto/123 | Ração Golden Especial 15kg | 149.90 | alimentacao
https://shopee.com.br/produto/456 | Escova a Vapor para Cães e Gatos | 39.90 | cuidados_especiais
https://shopee.com.br/produto/789 | Caminha Nuvem Super Confortável | 59.90 | cama_banheiro
https://shopee.com.br/produto/101 | Coleira Peitoral Antipuxão | 29.90 | acessorios`;

  // Parse Text based on selected mode
  const handleParse = () => {
    setParseError(null);
    setPreviewProducts([]);

    if (!rawText.trim()) {
      setParseError('Cole os dados no campo de texto para processar.');
      return;
    }

    try {
      const generated: Product[] = [];

      if (importMode === 'quick_links') {
        const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

        lines.forEach((line, idx) => {
          const parts = line.split(/[|;]/).map(p => p.trim());
          
          let shopeeUrl = '';
          let title = '';
          let price = 49.90;
          let category: ProductCategory = defaultCategory;

          if (parts.length >= 3) {
            shopeeUrl = parts[0];
            title = parts[1];
            price = typeof parseBRL(parts[2]) === 'number' ? (parseBRL(parts[2]) as number) : 49.90;
            if (parts[3] && OFFICIAL_CATEGORIES.some(c => c.id === parts[3])) {
              category = parts[3] as ProductCategory;
            }
          } else if (parts.length === 2) {
            if (parts[0].startsWith('http')) {
              shopeeUrl = parts[0];
              title = parts[1];
            } else {
              title = parts[0];
              price = typeof parseBRL(parts[1]) === 'number' ? (parseBRL(parts[1]) as number) : 49.90;
            }
          } else if (parts.length === 1) {
            if (parts[0].startsWith('http')) {
              shopeeUrl = parts[0];
              title = `Achadinho Pet Selecionado #${idx + 1}`;
            } else {
              title = parts[0];
            }
          }

          if (!title) title = `Achadinho Pet #${idx + 1}`;
          if (!shopeeUrl) shopeeUrl = 'https://shopee.com.br';

          const defaultImgs: Record<ProductCategory, string> = {
            alimentacao: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
            cuidados_especiais: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
            saude_bem_estar: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=800&q=80',
            cama_banheiro: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80',
            acessorios: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
            outros: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80'
          };

          generated.push({
            id: `bulk_${Date.now()}_${idx}`,
            title,
            shortDescription: `${title} - Oferta selecionada com melhor preço e garantia Shopee.`,
            fullDescription: `${title} - Produto verificado de alta qualidade, ideal para cuidados e bem-estar do seu pet.`,
            price,
            originalPrice: Number((price * 1.35).toFixed(2)),
            discountPercent: 26,
            rating: Number((4.7 + Math.random() * 0.3).toFixed(1)),
            reviewsCount: Math.floor(120 + Math.random() * 850),
            salesCount: Math.floor(1000 + Math.random() * 4000),
            imageUrl: defaultImgs[category] || defaultImgs.alimentacao,
            shopeeUrl,
            affiliateUrl: shopeeUrl,
            category,
            badges: ['Oferta Verificada', 'Curadoria Pet'],
            tags: ['Promoção', 'Shopee', 'Cães & Gatos'],
            sellerName: 'Loja Oficial Shopee',
            freeShipping: true,
            isFlashDeal: Math.random() > 0.6,
            couponAvailable: '10% OFF',
            highlights: {
              idealFor: 'Uso diário com alta durabilidade',
              whyBuy: 'Excelente custo-benefício, entrega rápida e garantia oficial.',
              tips: 'Verifique as especificações do fabricante antes do uso.'
            }
          });
        });

      } else if (importMode === 'csv') {
        const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) {
          setParseError('O arquivo CSV precisa conter cabeçalho e pelo menos 1 linha de produto.');
          return;
        }

        const delimiter = lines[0].includes(';') ? ';' : lines[0].includes('\t') ? '\t' : ',';
        const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());

        const titleIdx = headers.findIndex(h => h.includes('título') || h.includes('titulo') || h.includes('title') || h.includes('nome'));
        const priceIdx = headers.findIndex(h => h.includes('preço') || h.includes('preco') || h.includes('price') || h.includes('valor'));
        const linkIdx = headers.findIndex(h => h.includes('link') || h.includes('shopee') || h.includes('url'));
        const imgIdx = headers.findIndex(h => h.includes('foto') || h.includes('image') || h.includes('img'));
        const catIdx = headers.findIndex(h => h.includes('categoria') || h.includes('category') || h.includes('departamento'));

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(delimiter).map(c => c.trim());
          if (cols.length < 2) continue;

          const title = titleIdx !== -1 ? cols[titleIdx] : cols[0];
          const rawPrice = priceIdx !== -1 ? cols[priceIdx] : cols[1];
          const parsedPrice = parseBRL(rawPrice);
          const price = typeof parsedPrice === 'number' ? parsedPrice : 49.90;
          const link = linkIdx !== -1 ? cols[linkIdx] : 'https://shopee.com.br';
          const img = imgIdx !== -1 && cols[imgIdx] ? cols[imgIdx] : 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80';
          
          let cat = defaultCategory;
          if (catIdx !== -1 && cols[catIdx]) {
            const rawCat = cols[catIdx].toLowerCase();
            const matched = OFFICIAL_CATEGORIES.find(c => c.id === rawCat || rawCat.includes(c.shortLabel.toLowerCase()));
            if (matched) cat = matched.id;
          }

          generated.push({
            id: `csv_${Date.now()}_${i}`,
            title: title || `Produto CSV #${i}`,
            shortDescription: `${title} - Importado em lote com garantia e cupons.`,
            fullDescription: `${title} - Produto verificado de alta qualidade disponível com preço promocional.`,
            price,
            originalPrice: Number((price * 1.3).toFixed(2)),
            discountPercent: 23,
            rating: 4.8,
            reviewsCount: 340,
            salesCount: 1800,
            imageUrl: img,
            shopeeUrl: link,
            affiliateUrl: link,
            category: cat,
            badges: ['Mais Vendido', 'Importado'],
            tags: ['Shopee', 'Cães & Gatos'],
            sellerName: 'Vendedor Verificado',
            freeShipping: true,
            highlights: {
              idealFor: 'Praticidade para tutores',
              whyBuy: 'Preço competitivo, ótimo acabamento e entrega confiável.',
              tips: 'Uso recomendado conforme instruções do produto.'
            }
          });
        }

      } else if (importMode === 'json') {
        const parsed = JSON.parse(rawText);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        
        list.forEach((item, idx) => {
          const title = item.title || item.nome || `Produto #${idx + 1}`;
          const link = item.shopeeUrl || item.link || item.affiliateUrl || 'https://shopee.com.br';
          generated.push({
            id: item.id || `json_${Date.now()}_${idx}`,
            title,
            shortDescription: item.shortDescription || item.descricao || `${title} - Selecionado na curadoria.`,
            fullDescription: item.fullDescription || `${title} - Produto completo com avaliações verificadas.`,
            price: parseBRL(item.price ?? item.preco) || 49.90,
            originalPrice: item.originalPrice || item.preco_original ? parseBRL(item.originalPrice || item.preco_original) : (item.price ? Number((Number(parseBRL(item.price) || 49.90) * 1.3).toFixed(2)) : 65),
            discountPercent: Number(item.discountPercent || item.desconto || 20),
            rating: Number(item.rating || item.avaliacao || 4.8),
            reviewsCount: Number(item.reviewsCount || 200),
            salesCount: Number(item.salesCount || 1200),
            imageUrl: item.imageUrl || item.foto || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
            shopeeUrl: link,
            affiliateUrl: item.affiliateUrl || link,
            category: (item.category && OFFICIAL_CATEGORIES.some(c => c.id === item.category)) ? item.category : defaultCategory,
            badges: item.badges || ['Oferta Shopee'],
            tags: item.tags || ['Achadinhos'],
            sellerName: item.sellerName || 'Loja Oficial Shopee',
            freeShipping: item.freeShipping !== undefined ? item.freeShipping : true
          });
        });
      }

      if (generated.length === 0) {
        setParseError('Nenhum produto válido foi identificado no formato inserido.');
      } else {
        setPreviewProducts(generated);
      }
    } catch (err: any) {
      setParseError(`Erro ao interpretar dados: ${err.message || 'Verifique a formatação'}`);
    }
  };

  const handleConfirmImport = () => {
    if (previewProducts.length > 0) {
      onImportProducts(previewProducts);
      setImportedCount(previewProducts.length);
      setTimeout(() => {
        setImportedCount(null);
        setPreviewProducts([]);
        setRawText('');
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 text-stone-800 flex flex-col relative">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white rounded-t-3xl flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shadow-inner">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>Importação Coletiva de Produtos (Lote)</span>
                <span className="text-[10px] bg-amber-500 text-stone-950 font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Rápido & Prático
                </span>
              </h2>
              <p className="text-xs text-stone-300">
                Insira dezenas de produtos da Shopee de uma única vez via Links Rápidos, CSV/Planilha ou JSON
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto text-xs">
          
          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
            <button
              onClick={() => { setImportMode('quick_links'); setRawText(''); setPreviewProducts([]); }}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                importMode === 'quick_links'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <ListPlus className="w-4 h-4" />
              <span>1. Lista Rápida (Link | Título | Preço)</span>
            </button>

            <button
              onClick={() => { setImportMode('csv'); setRawText(sampleCsv); setPreviewProducts([]); }}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                importMode === 'csv'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>2. CSV / Planilha Excel</span>
            </button>

            <button
              onClick={() => { setImportMode('json'); setRawText(''); setPreviewProducts([]); }}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                importMode === 'json'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>3. Código JSON</span>
            </button>
          </div>

          {/* Guidelines Box based on mode */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-stone-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-700" />
                {importMode === 'quick_links' && 'Como usar a Lista Rápida (Mais Prático):'}
                {importMode === 'csv' && 'Como importar via CSV / Excel:'}
                {importMode === 'json' && 'Como importar via JSON Estruturado:'}
              </span>
              <button
                onClick={() => {
                  if (importMode === 'quick_links') setRawText(sampleQuickLinks);
                  if (importMode === 'csv') setRawText(sampleCsv);
                  if (importMode === 'json') setRawText(JSON.stringify(previewProducts.length ? previewProducts : [
                    { title: "Ração Royal Canin 10kg", price: 189.90, category: "alimentacao", shopeeUrl: "https://shopee.com.br/1" },
                    { title: "Fonte de Água Inox Pet", price: 89.90, category: "saude_bem_estar", shopeeUrl: "https://shopee.com.br/2" }
                  ], null, 2));
                }}
                className="text-amber-800 hover:text-amber-950 font-bold underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                Preencher com Exemplo
              </button>
            </div>

            {importMode === 'quick_links' && (
              <p className="text-[11px] leading-relaxed text-stone-600">
                Cole uma linha por produto. Você pode colar no formato: <br />
                <code className="bg-white px-2 py-0.5 rounded border border-amber-300 font-mono text-amber-950">
                  LinkDoProduto | Nome do Produto | Preço | categoria_opcional
                </code>
              </p>
            )}

            {importMode === 'csv' && (
              <p className="text-[11px] leading-relaxed text-stone-600">
                Copie as colunas de sua planilha Excel ou Google Sheets (separadas por ponto e vírgula ou vírgula) contendo as colunas: <br />
                <code className="bg-white px-2 py-0.5 rounded border border-amber-300 font-mono text-amber-950">
                  Título;Preço;LinkShopee;FotoURL;Categoria;Desconto%
                </code>
              </p>
            )}

            {importMode === 'json' && (
              <p className="text-[11px] leading-relaxed text-stone-600">
                Cole uma array de objetos com as propriedades <code className="bg-white px-1.5 py-0.5 rounded border font-mono">title</code>, <code className="bg-white px-1.5 py-0.5 rounded border font-mono">price</code>, <code className="bg-white px-1.5 py-0.5 rounded border font-mono">shopeeUrl</code>, etc.
              </p>
            )}
          </div>

          {/* Default Category Fallback Selector */}
          <div className="flex items-center gap-3">
            <label className="font-bold text-stone-700 shrink-0">
              Departamento Padrão (se não especificado):
            </label>
            <select
              value={defaultCategory}
              onChange={(e) => setDefaultCategory(e.target.value as ProductCategory)}
              className="p-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold text-stone-800 focus:outline-none focus:border-amber-700"
            >
              {OFFICIAL_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Text Area Input */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 block">
              Cole abaixo a lista de produtos:
            </label>
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={importMode === 'quick_links' ? sampleQuickLinks : importMode === 'csv' ? sampleCsv : '[ { "title": "Exemplo", "price": 49.90 } ]'}
              className="w-full p-3 font-mono text-xs bg-stone-50 border border-stone-300 rounded-2xl focus:bg-white focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
            />
          </div>

          {/* Process Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleParse}
              className="px-5 py-2.5 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Processar e Visualizar Produtos</span>
            </button>

            {previewProducts.length > 0 && (
              <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {previewProducts.length} produtos prontos para inserção!
              </span>
            )}
          </div>

          {/* Parse Error Notification */}
          {parseError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Preview Table */}
          {previewProducts.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-stone-900 flex items-center justify-between">
                <span>Prévia dos Produtos a Inserir ({previewProducts.length})</span>
                <span className="text-[11px] text-stone-500 font-normal">
                  Revise antes de salvar no catálogo
                </span>
              </h3>

              <div className="border border-stone-200 rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="bg-stone-100 border-b border-stone-200 font-bold text-stone-600">
                    <tr>
                      <th className="p-2.5">Título</th>
                      <th className="p-2.5">Preço</th>
                      <th className="p-2.5">Categoria</th>
                      <th className="p-2.5">Link Shopee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {previewProducts.map((p, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/50">
                        <td className="p-2.5 font-semibold text-stone-900 truncate max-w-xs">{p.title}</td>
                        <td className="p-2.5 font-bold text-amber-900">{formatBRL(p.price)}</td>
                        <td className="p-2.5 text-stone-600">{p.category}</td>
                        <td className="p-2.5 text-stone-400 font-mono truncate max-w-xs">{p.shopeeUrl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {importedCount !== null && (
            <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-2 font-bold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Sucesso! {importedCount} produtos foram adicionados ao catálogo com sucesso!</span>
            </div>
          )}

        </div>

        {/* Footer CTAs */}
        <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 rounded-b-3xl flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirmImport}
            disabled={previewProducts.length === 0}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Salvar {previewProducts.length} Produtos no Catálogo</span>
          </button>
        </div>

      </div>
    </div>
  );
};
