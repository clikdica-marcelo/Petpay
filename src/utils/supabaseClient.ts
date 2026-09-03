import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product } from '../types';

export interface SupabaseConfig {
  url: string;
  key: string;
  isConfigured: boolean;
  source: 'env' | 'vite_env' | 'localStorage' | 'none';
}

export interface SupabaseStatusResult {
  configured: boolean;
  connected: boolean;
  totalProducts?: number;
  message: string;
  url?: string | null;
  source?: string;
  needTable?: boolean;
  needPolicy?: boolean;
}

// 1. Get current Supabase credentials from any available source
export function getSupabaseCredentials(): { url: string; key: string; source: SupabaseConfig['source'] } {
  // Priority 1: User-configured in localStorage (from Admin UI)
  try {
    const localUrl = localStorage.getItem('pet_achadinhos_supabase_url')?.trim();
    const localKey = localStorage.getItem('pet_achadinhos_supabase_key')?.trim();
    if (localUrl && localKey) {
      return { url: localUrl, key: localKey, source: 'localStorage' };
    }
  } catch (e) {
    // Ignore storage issues
  }

  // Priority 2: Injected via vite.config.ts define (process.env or import.meta.env)
  const metaEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};
  const metaUrl = (metaEnv.VITE_SUPABASE_URL || metaEnv.SUPABASE_URL)?.trim();
  const metaKey = (metaEnv.VITE_SUPABASE_KEY || metaEnv.VITE_SUPABASE_ANON_KEY || metaEnv.SUPABASE_KEY || metaEnv.SUPABASE_ANON_KEY)?.trim();

  if (metaUrl && metaKey) {
    return { url: metaUrl, key: metaKey, source: 'vite_env' };
  }

  // Priority 3: process.env (replaced by Vite define at build time for Vercel)
  try {
    const procUrl = (typeof process !== 'undefined' && process.env ? process.env.SUPABASE_URL : '')?.trim();
    const procKey = (typeof process !== 'undefined' && process.env ? (process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY) : '')?.trim();
    if (procUrl && procKey) {
      return { url: procUrl, key: procKey, source: 'env' };
    }
  } catch (e) {
    // Ignore
  }

  return { url: '', key: '', source: 'none' };
}

// 2. Save credentials manually via Admin UI
export function saveSupabaseCredentials(url: string, key: string) {
  const cleanUrl = url.trim();
  const cleanKey = key.trim();
  if (cleanUrl && cleanKey) {
    localStorage.setItem('pet_achadinhos_supabase_url', cleanUrl);
    localStorage.setItem('pet_achadinhos_supabase_key', cleanKey);
  } else {
    localStorage.removeItem('pet_achadinhos_supabase_url');
    localStorage.removeItem('pet_achadinhos_supabase_key');
  }
  // Reset cached client
  cachedClient = null;
}

// 3. Singleton Supabase Client
let cachedClient: SupabaseClient | null = null;
let lastClientKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key) return null;

  const cacheKey = `${url}:${key}`;
  if (cachedClient && lastClientKey === cacheKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    lastClientKey = cacheKey;
    return cachedClient;
  } catch (err) {
    console.warn('[Supabase Client] Failed to initialize createClient:', err);
    return null;
  }
}

// 4. Map DB Row -> Product
export function mapDbRowToProduct(row: any): Product {
  return {
    id: String(row.id),
    title: row.title || 'Produto Sem Título',
    shortDescription: row.short_description || row.shortDescription || '',
    fullDescription: row.full_description || row.fullDescription || row.description || '',
    price: Number(row.price) || 0,
    originalPrice: row.original_price ? Number(row.original_price) : (row.originalPrice ? Number(row.originalPrice) : undefined),
    discountPercent: Number(row.discount_percent || row.discountPercent) || 0,
    rating: Number(row.rating) || 4.8,
    reviewsCount: Number(row.reviews_count || row.reviewsCount) || 0,
    salesCount: Number(row.sales_count || row.salesCount) || 0,
    imageUrl: row.image_url || row.imageUrl || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800',
    additionalImages: Array.isArray(row.additional_images) ? row.additional_images : (Array.isArray(row.additionalImages) ? row.additionalImages : []),
    category: row.category || 'alimentacao',
    shopeeUrl: row.product_url || row.shopee_url || row.shopeeUrl || row.url || '',
    affiliateUrl: row.store_url || row.affiliate_url || row.affiliateUrl || row.product_url || row.shopee_url || '',
    tags: Array.isArray(row.tags) ? row.tags : [],
    badges: Array.isArray(row.badges) ? row.badges : [],
    isFeatured: !!(row.is_featured ?? row.isFeatured),
    isFlashDeal: !!(row.is_flash_deal ?? row.isFlashDeal),
    highlights: {
      idealFor: row.ideal_for || row.highlights?.idealFor || '',
      whyBuy: row.why_buy || row.highlights?.whyBuy || '',
      tips: row.care_tips || row.highlights?.tips || ''
    },
    sellerName: row.seller_name || row.sellerName || 'Loja Oficial Shopee',
    freeShipping: row.free_shipping ?? row.freeShipping ?? true,
    couponAvailable: row.coupon_code || row.couponAvailable || ''
  };
}

// 5. Map Product -> DB Row
export function mapProductToDbRow(p: Product): Record<string, any> {
  const parseNum = (v: any) => {
    if (typeof v === 'number') return v;
    if (!v) return 0;
    const clean = String(v).replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : Number(num.toFixed(2));
  };

  const link = p.affiliateUrl || p.shopeeUrl || '';

  return {
    id: String(p.id),
    title: p.title || 'Novo Produto',
    short_description: p.shortDescription || '',
    full_description: p.fullDescription || '',
    description: p.fullDescription || p.shortDescription || '',
    price: parseNum(p.price),
    original_price: p.originalPrice ? parseNum(p.originalPrice) : null,
    discount_percent: Number(p.discountPercent) || 0,
    rating: Number(p.rating) || 4.8,
    reviews_count: Number(p.reviewsCount) || 0,
    sales_count: Number(p.salesCount) || 0,
    image_url: p.imageUrl || '',
    additional_images: Array.isArray(p.additionalImages) ? p.additionalImages : [],
    category: p.category || 'alimentacao',
    product_url: link,
    store_url: link,
    affiliate_url: link,
    shopee_url: link,
    tags: Array.isArray(p.tags) ? p.tags : [],
    badges: Array.isArray(p.badges) ? p.badges : [],
    is_featured: !!p.isFeatured,
    is_flash_deal: !!p.isFlashDeal,
    ideal_for: p.highlights?.idealFor || '',
    why_buy: p.highlights?.whyBuy || '',
    care_tips: p.highlights?.tips || '',
    seller_name: p.sellerName || 'Loja Oficial Shopee',
    seller_location: p.sellerLocation || 'Brasil',
    free_shipping: !!p.freeShipping,
    coupon_code: p.couponAvailable || '',
    updated_at: new Date().toISOString()
  };
}

// 6. Resilient Direct Upsert in Browser
async function resilientDirectUpsert(client: SupabaseClient, rawRows: any[]): Promise<{ success: boolean; error?: any }> {
  if (!rawRows || rawRows.length === 0) return { success: true };

  let currentRows = rawRows.map(r => ({ ...r }));
  const maxAttempts = 15;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { error } = await client
      .from('products')
      .upsert(currentRows, { onConflict: 'id' });

    if (!error) {
      return { success: true };
    }

    // Check if column missing in Supabase schema: e.g. "Could not find the 'xyz' column of 'products'"
    const match = error.message?.match(/column[s]? ['"]?([a-zA-Z0-9_]+)['"]? of ['"]?products['"]?/i) ||
                  error.message?.match(/column ['"]?([a-zA-Z0-9_]+)['"]? does not exist/i);

    if (match && match[1]) {
      const col = match[1];
      currentRows = currentRows.map(row => {
        const copy = { ...row };
        delete copy[col];
        return copy;
      });
      continue;
    }

    return { success: false, error };
  }

  return { success: false, error: new Error('Excedido número de tentativas de ajuste de colunas.') };
}

// 7. Check Supabase Connection (Tries Server first, then direct Supabase)
export async function checkSupabaseStatus(): Promise<SupabaseStatusResult> {
  // Step A: If running in preview mode with Express server, check backend first
  try {
    const res = await fetch('/api/supabase/status');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.configured && data.connected) {
        return data;
      }
    }
  } catch (e) {
    // Server route unavailable (e.g. Vercel static build), continue to direct check
  }

  // Step B: Direct Browser Connection via Supabase JS SDK
  const { url, key, source } = getSupabaseCredentials();
  if (!url || !key) {
    return {
      configured: false,
      connected: false,
      message: 'Credenciais não encontradas. Configure SUPABASE_URL e SUPABASE_KEY na Vercel ou insira manualmente abaixo.',
      url: null,
      source: 'none',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      configured: false,
      connected: false,
      message: 'Falha ao inicializar o cliente Supabase. Verifique a formatação da URL.',
      url,
      source,
    };
  }

  try {
    const { count, error } = await client
      .from('products')
      .select('id', { count: 'exact', head: true });

    if (!error) {
      return {
        configured: true,
        connected: true,
        totalProducts: count ?? 0,
        message: `Conexão direta ativa na nuvem! ${count ?? 0} produtos encontrados no Supabase.`,
        url,
        source: source === 'localStorage' ? 'Configuração Manual (Admin)' : 'Variáveis Vercel/Ambiente',
      };
    }

    // Specific Supabase error codes
    if (error.code === '42P01') {
      return {
        configured: true,
        connected: false,
        needTable: true,
        message: 'Conectado ao Supabase, mas a tabela "products" ainda não existe. Execute o Script SQL abaixo no Supabase.',
        url,
        source,
      };
    }

    if (error.code === '42501') {
      return {
        configured: true,
        connected: false,
        needPolicy: true,
        message: 'Permissão negada (RLS). Execute o comando das Políticas (POLICIES) no SQL Editor do Supabase.',
        url,
        source,
      };
    }

    return {
      configured: true,
      connected: false,
      message: `Erro na resposta do Supabase: ${error.message} (${error.code || 'Sem código'})`,
      url,
      source,
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      message: `Falha de rede ao contatar o Supabase: ${err.message || err}`,
      url,
      source,
    };
  }
}

// 8. Fetch products (Supabase direct or /api/products)
export async function loadProductsFromCloud(): Promise<{ success: boolean; products: Product[]; source: 'supabase' | 'api' | 'none'; error?: string }> {
  // Try direct Supabase query first if client is configured
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return {
          success: true,
          products: data.map(mapDbRowToProduct),
          source: 'supabase',
        };
      }
    } catch (err) {
      console.warn('[Supabase Client] Direct fetch error:', err);
    }
  }

  // Fallback: try server API
  try {
    const res = await fetch('/api/products');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json && json.success && Array.isArray(json.products) && json.products.length > 0) {
        return {
          success: true,
          products: json.products,
          source: json.source || 'api',
        };
      }
    }
  } catch (e) {
    // Server API not reachable
  }

  return { success: false, products: [], source: 'none' };
}

// 9. Upsert single product directly to Supabase
export async function syncProductToCloud(product: Product): Promise<boolean> {
  let directSuccess = false;
  const client = getSupabaseClient();
  if (client) {
    try {
      const row = mapProductToDbRow(product);
      const res = await resilientDirectUpsert(client, [row]);
      directSuccess = res.success;
    } catch (e) {
      console.warn('[Supabase Client] Direct product sync error:', e);
    }
  }

  // Also notify server API if available
  try {
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    }).catch(() => {});
  } catch (e) {
    // Ignore
  }

  return directSuccess;
}

// 10. Delete single product
export async function deleteProductFromCloud(productId: string): Promise<boolean> {
  let directSuccess = false;
  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('products').delete().eq('id', productId);
      directSuccess = !error;
    } catch (e) {
      console.warn('[Supabase Client] Direct delete error:', e);
    }
  }

  try {
    fetch(`/api/products/${encodeURIComponent(productId)}`, {
      method: 'DELETE',
    }).catch(() => {});
  } catch (e) {
    // Ignore
  }

  return directSuccess;
}

// 11. Batch Sync All Products to Supabase
export async function syncAllProductsToCloud(products: Product[]): Promise<{ success: boolean; count: number; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    // Fallback: try server API sync
    try {
      const res = await fetch('/api/supabase/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products }),
      });
      if (res.ok) {
        const data = await res.json();
        return { success: !!data.success, count: data.count || products.length, error: data.error };
      }
    } catch (e: any) {
      return { success: false, count: 0, error: 'Supabase não configurado e servidor offline.' };
    }
    return { success: false, count: 0, error: 'Supabase não configurado. Adicione a URL e a Chave.' };
  }

  try {
    const rows = products.map(mapProductToDbRow);
    const chunkSize = 25;
    let synced = 0;

    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const res = await resilientDirectUpsert(client, chunk);
      if (!res.success) {
        return {
          success: false,
          count: synced,
          error: res.error?.message || 'Falha ao inserir produtos no Supabase.',
        };
      }
      synced += chunk.length;
    }

    // Also trigger server sync in background if available
    fetch('/api/supabase/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products }),
    }).catch(() => {});

    return { success: true, count: synced };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || 'Erro inesperado na sincronização.' };
  }
}

// 12. Complete SQL Schema for User
export const SUPABASE_SQL_SCHEMA = `-- ============================================================
-- PORTAL DE ACHADINHOS E OFERTAS PET - SUPABASE POSTGRESQL SCHEMA
-- Execute este script no SQL Editor do seu painel Supabase
-- ============================================================

-- 1. Criar Tabela de Produtos (Compatível com IDs de texto e UUIDs)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  discount_percent INTEGER DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 4.8,
  reviews_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  image_url TEXT NOT NULL,
  additional_images TEXT[] DEFAULT '{}',
  category VARCHAR(64) NOT NULL,
  product_url TEXT,
  store_url TEXT,
  affiliate_url TEXT,
  shopee_url TEXT,
  tags TEXT[] DEFAULT '{}',
  badges TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_flash_deal BOOLEAN DEFAULT false,
  ideal_for TEXT,
  why_buy TEXT,
  care_tips TEXT,
  seller_name VARCHAR(120),
  seller_location VARCHAR(120),
  free_shipping BOOLEAN DEFAULT false,
  coupon_code VARCHAR(32),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Se a tabela já existia sem algumas colunas, execute os comandos abaixo para garantir:
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS affiliate_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS shopee_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS store_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS full_description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS care_tips TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ideal_for TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS why_buy TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seller_name VARCHAR(120);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seller_location VARCHAR(120);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS free_shipping BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(32);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_flash_deal BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_percent INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS additional_images TEXT[] DEFAULT '{}';

-- 2. Índices de busca rápida
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Acesso Público (Permite o site na Vercel ler e salvar produtos)
DROP POLICY IF EXISTS "Permitir Leitura Pública de Produtos" ON public.products;
CREATE POLICY "Permitir Leitura Pública de Produtos" 
  ON public.products FOR SELECT 
  TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "Permitir Inserção e Edição de Produtos" ON public.products;
CREATE POLICY "Permitir Inserção e Edição de Produtos" 
  ON public.products FOR ALL 
  TO anon, authenticated 
  USING (true) 
  WITH CHECK (true);

-- Recarregar cache de esquema do Supabase
NOTIFY pgrst, 'reload schema';
`;
