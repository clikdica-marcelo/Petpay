/**
 * Utilitários para formatação e manipulação de Moeda Brasileira (Real - R$)
 * Padrão Brasileiro: Ponto (.) para separar milhares e Vírgula (,) para centavos.
 */

/**
 * Formata um valor numérico ou textual para o padrão monetário brasileiro BRL (R$ 0.000,00).
 */
export function formatBRL(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') {
    return 'R$ 0,00';
  }

  // Se já for uma string não numérica (ex: "Preços Variados", "Sob Consulta")
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.toLowerCase().includes('preço') || trimmed.toLowerCase().includes('consulta') || trimmed.toLowerCase().includes('variad')) {
      return trimmed;
    }

    // Se começa com R$ e tem formato brasileiro válido
    if (/^R\$\s*[\d.,]+$/i.test(trimmed)) {
      const parsed = parseBRL(trimmed);
      if (typeof parsed === 'number') {
        return parsed.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      }
      return trimmed;
    }

    const parsed = parseBRL(trimmed);
    if (typeof parsed === 'number') {
      return parsed.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return trimmed;
  }

  if (typeof value === 'number') {
    if (isNaN(value)) return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return String(value);
}

/**
 * Converte um valor numérico para representação padrão no input (ex: 49.9 -> "49,90", 1250.5 -> "1.250,50").
 */
export function numberToBRLInput(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.toLowerCase().includes('preço') || trimmed.toLowerCase().includes('variad')) {
      return trimmed;
    }
    const num = parseBRL(trimmed);
    if (typeof num === 'number') {
      return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return trimmed;
  }
  if (typeof value === 'number') {
    if (isNaN(value)) return '';
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return String(value);
}

/**
 * Analisa e extrai um número com centavos respeitando o padrão brasileiro:
 * - Ponto (.) separa milhares (ex: 1.250,50 -> 1250.50)
 * - Vírgula (,) separa centavos (ex: 49,90 -> 49.90)
 * - Aceita também entradas com ponto decimal direto (ex: 49.90 -> 49.90)
 * - Mantém textos especiais (ex: "Preços Variados") como string
 */
export function parseBRL(input: string | number | undefined | null): number | string {
  if (input === undefined || input === null) return 0;
  if (typeof input === 'number') return isNaN(input) ? 0 : Number(input.toFixed(2));

  const trimmed = String(input).trim();
  if (!trimmed) return 0;

  // Se for texto descritivo
  if (trimmed.toLowerCase().includes('preço') || trimmed.toLowerCase().includes('variad') || trimmed.toLowerCase().includes('consult')) {
    return trimmed;
  }

  // Remove símbolos monetários e espaços
  let clean = trimmed.replace(/[R$r$\s]/g, '').trim();

  // Caso 1: Formato padrão brasileiro com milhares e centavos (ex: 1.250,50 ou 12.500,00)
  if (clean.includes('.') && clean.includes(',')) {
    // Remove todos os pontos de milhar e substitui a vírgula de centavos por ponto decimal
    clean = clean.replace(/\./g, '').replace(',', '.');
  } 
  // Caso 2: Contém apenas vírgula para os centavos (ex: 49,90 ou 1250,50 ou 0,99)
  else if (clean.includes(',')) {
    // Se houver múltiplas vírgulas acidentais, apenas a última é decimal
    const parts = clean.split(',');
    if (parts.length > 2) {
      const decimal = parts.pop();
      clean = parts.join('') + '.' + decimal;
    } else {
      clean = clean.replace(',', '.');
    }
  }
  // Caso 3: Contém apenas ponto (.)
  else if (clean.includes('.')) {
    const parts = clean.split('.');
    // Se houver múltiplos pontos (ex: 1.250.000)
    if (parts.length > 2) {
      clean = parts.join('');
    } else if (parts.length === 2) {
      // Se tiver exatamente 3 dígitos após o ponto (ex: 1.000 ou 50.000), pode ser milhar
      // Se tiver 1 ou 2 dígitos (ex: 49.9 ou 49.90), é decimal
      if (parts[1].length === 3 && parseInt(parts[0], 10) < 1000) {
        clean = parts[0] + parts[1]; // trata 1.000 como milhar
      }
      // caso contrário mantém ponto decimal (ex: 49.90)
    }
  }

  const num = parseFloat(clean);
  if (isNaN(num)) {
    return trimmed;
  }

  return Number(num.toFixed(2));
}
