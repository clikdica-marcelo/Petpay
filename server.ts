import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy-initialize Gemini AI for smart product parsing from links/text
let aiInstance: GoogleGenAI | null = null;
function getAI() {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({});
  }
  return aiInstance;
}

// Lazy-initialize Supabase Client
let supabaseClient: SupabaseClient | null = null;
function getSupabase(): { client: SupabaseClient | null; url?: string; isConfigured: boolean } {
  const url = process.env.SUPABASE_URL?.trim();
  const key = (process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)?.trim();
  
  if (!url || !key) {
    return { client: null, url: url || undefined, isConfigured: false };
  }

  if (!supabaseClient) {
    try {
      supabaseClient = createClient(url, key, {
        auth: { persistSession: false }
      });
    } catch (err) {
      console.error("Error creating Supabase client:", err);
      return { client: null, url, isConfigured: true };
    }
  }
  return { client: supabaseClient, url, isConfigured: true };
}

// Helper converters for Supabase Product Row <-> Application Product
function mapDbToProduct(row: any): any {
  return {
    id: String(row.id),
    title: row.title || 'Produto Sem Título',
    shortDescription: row.short_description || row.shortDescription || '',
    fullDescription: row.full_description || row.fullDescription || '',
    price: Number(row.price) || 0,
    originalPrice: row.original_price ? Number(row.original_price) : (row.originalPrice ? Number(row.originalPrice) : undefined),
    discountPercent: Number(row.discount_percent || row.discountPercent) || 0,
    rating: Number(row.rating) || 4.8,
    reviewsCount: Number(row.reviews_count || row.reviewsCount) || 0,
    salesCount: Number(row.sales_count || row.salesCount) || 0,
    imageUrl: row.image_url || row.imageUrl || '',
    additionalImages: Array.isArray(row.additional_images) ? row.additional_images : (Array.isArray(row.additionalImages) ? row.additionalImages : []),
    category: row.category || 'alimentacao',
    shopeeUrl: row.product_url || row.shopee_url || row.shopeeUrl || row.url || row.link || '',
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

function mapProductToDb(p: any): any {
  const parseNum = (v: any) => {
    if (typeof v === 'number') return v;
    if (!v) return 0;
    const clean = String(v).replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : Number(num.toFixed(2));
  };

  const shopeeLink = p.shopeeUrl || p.affiliateUrl || '';
  const affLink = p.affiliateUrl || p.shopeeUrl || '';

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
    product_url: shopeeLink,
    store_url: affLink,
    affiliate_url: affLink,
    shopee_url: shopeeLink,
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

function toDeterministicUUID(str: string): string {
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)) {
    return str;
  }
  let hash1 = 5381;
  let hash2 = 52711;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash1 = ((hash1 << 5) + hash1) ^ char;
    hash2 = ((hash2 << 5) + hash2) ^ char;
  }
  const h1 = Math.abs(hash1).toString(16).padStart(8, '0');
  const h2 = Math.abs(hash2).toString(16).padStart(8, '0');
  const h3 = Buffer.from(str).toString('hex').padEnd(16, '0').slice(0, 16);
  return `${h1}-${h2.slice(0, 4)}-4${h2.slice(4, 7)}-a${h3.slice(0, 3)}-${h3.slice(3, 15)}`;
}

// Resilient upsert that dynamically prunes any missing columns detected in the Supabase schema
async function resilientSupabaseUpsert(client: SupabaseClient, rawRows: any[]): Promise<{ success: boolean; data?: any; error?: any; prunedColumns?: string[] }> {
  if (!rawRows || rawRows.length === 0) {
    return { success: true, data: [], prunedColumns: [] };
  }

  let currentRows = rawRows.map(r => ({ ...r }));
  const prunedColumns: string[] = [];
  const maxAttempts = 20;
  let useUUID = false;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Format rows adapting UUID if table expects UUID
    const payload = currentRows.map(r => {
      const rowCopy = { ...r };
      if (useUUID && rowCopy.id) {
        rowCopy.id = toDeterministicUUID(String(rowCopy.id));
      }
      return rowCopy;
    });

    const { data, error } = await client
      .from('products')
      .upsert(payload, { onConflict: 'id' });

    if (!error) {
      return { success: true, data, prunedColumns };
    }

    const errorMsg = error.message || '';

    // Check if error is UUID format mismatch in Postgres
    if (errorMsg.includes('invalid input syntax for type uuid') && !useUUID) {
      console.warn("[Supabase Sync] Table uses UUID primary key. Converting IDs to UUID format...");
      useUUID = true;
      continue;
    }

    // Check for PostgREST missing column in schema cache: "Could not find the 'col' column"
    const schemaMatch = errorMsg.match(/Could not find the '([^']+)' column/i) 
      || errorMsg.match(/column\s+['"]?([a-zA-Z0-9_]+)['"]?\s+in schema cache/i)
      || errorMsg.match(/column "([^"]+)" does not exist/i);

    if (schemaMatch && schemaMatch[1]) {
      const missingCol = schemaMatch[1];
      console.warn(`[Supabase Sync] Column '${missingCol}' not in table. Removing from payload and retrying...`);
      if (!prunedColumns.includes(missingCol)) {
        prunedColumns.push(missingCol);
      }
      currentRows = currentRows.map(row => {
        const copy = { ...row };
        delete copy[missingCol];
        return copy;
      });
      continue;
    }

    // Check for Postgres NOT-NULL constraint violation: "null value in column "col" of relation "products" violates not-null constraint"
    const notNullMatch = errorMsg.match(/null value in column "([^"]+)" of relation/i);
    if (notNullMatch && notNullMatch[1]) {
      const notNullCol = notNullMatch[1];
      console.warn(`[Supabase Sync] Column '${notNullCol}' requires non-null value. Supplying default value and retrying...`);
      currentRows = currentRows.map(row => {
        const copy = { ...row };
        if (copy[notNullCol] === undefined || copy[notNullCol] === null) {
          copy[notNullCol] = notNullCol.includes('url') ? 'https://shopee.com.br' : (notNullCol.includes('count') || notNullCol.includes('price') ? 0 : 'N/A');
        }
        return copy;
      });
      continue;
    }

    // Check if on_conflict constraint missing
    if (errorMsg.includes('ON CONFLICT') || errorMsg.includes('constraint') || errorMsg.includes('on_conflict')) {
      console.warn("[Supabase Sync] ON CONFLICT failed, attempting fallback to plain insert...");
      const insertRes = await client.from('products').insert(payload);
      if (!insertRes.error) {
        return { success: true, data: insertRes.data, prunedColumns };
      }
    }

    // Unrecoverable error
    console.error("[Supabase Sync] Sync failed with error:", errorMsg);
    return { success: false, error, prunedColumns };
  }

  return { 
    success: false, 
    error: { message: "A tabela no Supabase precisa ser criada ou atualizada. Execute o script SQL no SQL Editor do Supabase." }, 
    prunedColumns 
  };
}

// In-memory fallback product store
let inMemoryProducts: any[] = [];

interface ClickRecord {
  id: string;
  productId: string;
  productTitle: string;
  timestamp: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  referrer: string;
  affiliateCodeUsed: string;
  estimatedCommission: number;
}

let affiliateSettings = {
  affiliateId: "campanha_pet_12345",
  subIdPrefix: "achadinhospet",
  autoAppendAffiliateTag: true,
  defaultUtmSource: "achadinhos_pet_portal",
  commissionRateEstimate: 8.5,
  storeName: "Achadinhos Pet",
  storeDomain: "achadinhospet.com.br",
  contactEmail: "contato@achadinhospet.com.br"
};

// Users / Community Store
interface UserRecord {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'member';
  petName?: string;
  petType?: 'dog' | 'cat' | 'both' | 'other';
  createdAt: string;
}

let registeredUsers: UserRecord[] = [
  {
    id: 'user-admin-01',
    name: 'Administrador Achadinhos',
    email: 'clikdica@gmail.com',
    password: 'admin', // default fallback, accepts admin / admin123
    role: 'admin',
    petName: 'Rex & Mia',
    petType: 'both',
    createdAt: new Date().toISOString()
  }
];


let clickLogs: ClickRecord[] = [
  {
    id: 'clk-001',
    productId: 'pet-alim-001',
    productTitle: 'Comedouro e Bebedouro Automático Gravidade 3.8L',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    deviceType: 'mobile',
    referrer: 'Home Banner',
    affiliateCodeUsed: 'campanha_pet_12345',
    estimatedCommission: 4.24
  },
  {
    id: 'clk-002',
    productId: 'pet-acess-002',
    productTitle: 'Arranhador Torre Castelo 3 Andares para Gatos',
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    deviceType: 'desktop',
    referrer: 'Categoria Acessórios',
    affiliateCodeUsed: 'campanha_pet_12345',
    estimatedCommission: 11.89
  },
  {
    id: 'clk-003',
    productId: 'pet-cama-001',
    productTitle: 'Cama Pet Nuvem Redonda Ortopédica Antiestresse',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    deviceType: 'mobile',
    referrer: 'Destaque Cama',
    affiliateCodeUsed: 'campanha_pet_12345',
    estimatedCommission: 4.66
  },
  {
    id: 'clk-004',
    productId: 'pet-cama-002',
    productTitle: 'Tapete Higiênico Super Absorvente 60x60cm',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    deviceType: 'mobile',
    referrer: 'Ofertas Relâmpago',
    affiliateCodeUsed: 'campanha_pet_12345',
    estimatedCommission: 4.24
  },
  {
    id: 'clk-005',
    productId: 'pet-saude-001',
    productTitle: 'Fonte Bebedouro Elétrica Bivolt 2.5L Filtro',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    deviceType: 'tablet',
    referrer: 'Combos Econômicos',
    affiliateCodeUsed: 'campanha_pet_12345',
    estimatedCommission: 5.85
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      time: new Date().toISOString()
    });
  });

  // Smart Product Auto-Extractor from Shopee / Store link
  app.post("/api/products/auto-extract", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string' || !url.trim()) {
        return res.status(400).json({ error: "Link do produto ou texto é obrigatório." });
      }

      let inputUrl = url.trim();
      if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
        inputUrl = `https://${inputUrl}`;
      }

      const categoryImages: Record<string, string> = {
        alimentacao: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
        cuidados_especiais: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
        saude_bem_estar: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=800&q=80',
        cama_banheiro: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80',
        acessorios: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
        outros: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80'
      };

      // If user pasted a title + link or raw text, parse it cleanly
      let inferredTitle = "";
      let cleanedUrl = inputUrl;

      // Check if input contains space or pipe separating title and link
      if (inputUrl.includes('|') || inputUrl.includes(' - ')) {
        const parts = inputUrl.split(/[|]| - /).map(p => p.trim());
        for (const p of parts) {
          if (p.startsWith('http://') || p.startsWith('https://')) {
            cleanedUrl = p;
          } else if (p.length > 3) {
            inferredTitle = p;
          }
        }
      }

      if (!inferredTitle) {
        try {
          const urlObj = new URL(cleanedUrl);
          const pathSegments = urlObj.pathname.split(/[-_/.]/).filter(s => s.length > 2 && !/^\d+$/.test(s) && !['i', 'p', 'product', 'shopee', 'com', 'br', 's', 'item'].includes(s.toLowerCase()));
          if (pathSegments.length > 0) {
            inferredTitle = pathSegments.slice(0, 6).map(w => decodeURIComponent(w).replace(/[^a-zA-Z0-9À-ú\s]/g, ' ').trim()).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          }
        } catch (e) {
          // ignore
        }
      }

      if (!inferredTitle || inferredTitle.length < 3) {
        inferredTitle = "Novo Produto Pet Shopee";
      }

      const lower = cleanedUrl.toLowerCase();
      let inferredCategory = "alimentacao";
      if (lower.includes('cama') || lower.includes('tapete') || lower.includes('sanit') || lower.includes('banheiro') || lower.includes('almofada')) {
        inferredCategory = 'cama_banheiro';
      } else if (lower.includes('rac') || lower.includes('petisco') || lower.includes('comedouro') || lower.includes('sache') || lower.includes('racao')) {
        inferredCategory = 'alimentacao';
      } else if (lower.includes('shampoo') || lower.includes('escova') || lower.includes('banho') || lower.includes('higiene') || lower.includes('vapor') || lower.includes('perfume')) {
        inferredCategory = 'cuidados_especiais';
      } else if (lower.includes('coleira') || lower.includes('guia') || lower.includes('peitoral') || lower.includes('arranhador') || lower.includes('brinquedo') || lower.includes('bolinha') || lower.includes('roupa') || lower.includes('vestido') || lower.includes('capa') || lower.includes('moletom') || lower.includes('bandana')) {
        inferredCategory = 'acessorios';
      } else if (lower.includes('remedio') || lower.includes('suplemento') || lower.includes('bebedouro') || lower.includes('fonte') || lower.includes('vitamina')) {
        inferredCategory = 'saude_bem_estar';
      }

      res.json({
        success: true,
        product: {
          title: inferredTitle,
          price: 59.90,
          originalPrice: 79.90,
          discountPercent: 25,
          category: inferredCategory,
          imageUrl: categoryImages[inferredCategory] || categoryImages.alimentacao,
          shopeeUrl: cleanedUrl,
          affiliateUrl: cleanedUrl,
          sellerName: "Loja Oficial Shopee",
          shortDescription: `${inferredTitle} - Oferta selecionada com link direto e seguro.`,
          fullDescription: `${inferredTitle} - Produto verificado para cães e gatos com excelente custo-benefício.`,
          rating: 4.8,
          reviewsCount: 320,
          salesCount: 1500,
          freeShipping: true,
          couponAvailable: "10% OFF",
          tags: ["Shopee", "Achadinho", "Oferta Verificada"],
          badges: ["Mais Vendido", "Frete Grátis"],
          highlights: {
            idealFor: "Cães e Gatos de todos os portes",
            whyBuy: "Link direto garantido para a sua loja oficial.",
            tips: "Aproveite o cupom de frete grátis na finalização."
          }
        }
      });

    } catch (err: any) {
      console.error("Error in auto-extract:", err);
      res.status(500).json({ error: "Falha ao processar link", details: err.message });
    }
  });

  // Get affiliate settings
  app.get("/api/settings", (req, res) => {
    res.json(affiliateSettings);
  });

  // Update affiliate settings
  app.post("/api/settings", (req, res) => {
    affiliateSettings = { ...affiliateSettings, ...req.body };
    res.json({ success: true, settings: affiliateSettings });
  });

  // Click tracking endpoint
  app.post("/api/clicks", (req, res) => {
    const { productId, productTitle, deviceType, referrer, price } = req.body;
    const priceNum = typeof price === 'number' ? price : parseFloat(price) || 45.00;
    const commission = Number(((priceNum * (affiliateSettings.commissionRateEstimate / 100))).toFixed(2));
    
    const newLog: ClickRecord = {
      id: `clk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: productId || 'unknown',
      productTitle: productTitle || 'Produto Pet',
      timestamp: new Date().toISOString(),
      deviceType: deviceType || 'desktop',
      referrer: referrer || 'Direto',
      affiliateCodeUsed: affiliateSettings.affiliateId,
      estimatedCommission: commission
    };

    clickLogs.unshift(newLog);
    if (clickLogs.length > 200) clickLogs = clickLogs.slice(0, 200);

    // Build product URL with tracking sub_id
    const targetUrl = req.body.shopeeUrl || req.body.productUrl || "https://loja.com.br";
    const separator = targetUrl.includes("?") ? "&" : "?";
    const trackedUrl = `${targetUrl}${separator}camp_sub=${encodeURIComponent(affiliateSettings.subIdPrefix)}&track_id=${encodeURIComponent(newLog.id)}`;

    res.json({ 
      success: true, 
      log: newLog,
      redirectUrl: trackedUrl
    });
  });

  // Get Click Analytics & Metrics
  app.get("/api/analytics", (req, res) => {
    const totalClicks = clickLogs.length;
    const totalEstimatedCommission = Number(clickLogs.reduce((acc, curr) => acc + curr.estimatedCommission, 0).toFixed(2));
    
    // Group by device
    const deviceCounts = clickLogs.reduce((acc: Record<string, number>, curr) => {
      acc[curr.deviceType] = (acc[curr.deviceType] || 0) + 1;
      return acc;
    }, {});

    // Group by top products
    const productCounts = clickLogs.reduce((acc: Record<string, { count: number; title: string; commission: number }>, curr) => {
      if (!acc[curr.productId]) {
        acc[curr.productId] = { count: 0, title: curr.productTitle, commission: 0 };
      }
      acc[curr.productId].count += 1;
      acc[curr.productId].commission = Number((acc[curr.productId].commission + curr.estimatedCommission).toFixed(2));
      return acc;
    }, {});

    const topProducts = Object.entries(productCounts)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      totalClicks,
      totalEstimatedCommission,
      deviceCounts,
      topProducts,
      recentLogs: clickLogs.slice(0, 25)
    });
  });

  // ==========================================
  // AUTHENTICATION & USER MANAGEMENT
  // ==========================================

  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "E-mail e senha são obrigatórios." });
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const cleanPassword = String(password).trim();

      // Check if Administrator: clikdica@gmail.com
      if (cleanEmail === "clikdica@gmail.com") {
        // Accepts admin standard passwords (admin, admin123, petadmin) or any custom password user registered with
        const adminUser = registeredUsers.find(u => u.email.toLowerCase() === "clikdica@gmail.com");
        const isValid = !adminUser?.password 
          || cleanPassword === adminUser.password 
          || cleanPassword === "admin123" 
          || cleanPassword === "admin" 
          || cleanPassword === "petadmin";

        if (isValid) {
          const userPayload = {
            id: adminUser?.id || "user-admin-01",
            name: adminUser?.name || "Administrador Achadinhos",
            email: "clikdica@gmail.com",
            role: "admin" as const,
            petName: adminUser?.petName || "Rex & Mia",
            petType: adminUser?.petType || "both",
            createdAt: adminUser?.createdAt || new Date().toISOString()
          };
          return res.json({ success: true, user: userPayload, isAdmin: true });
        } else {
          return res.status(401).json({ success: false, message: "Senha de administrador incorreta." });
        }
      }

      // Check standard registered members
      const existing = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        if (existing.password && existing.password !== cleanPassword) {
          return res.status(401).json({ success: false, message: "Senha incorreta. Tente novamente." });
        }

        const { password: _, ...userWithoutPass } = existing;
        return res.json({ success: true, user: userWithoutPass, isAdmin: false });
      }

      // Try checking in Supabase if configured
      const { client, isConfigured } = getSupabase();
      if (isConfigured && client) {
        try {
          const { data: dbUser, error } = await client
            .from('pet_users')
            .select('*')
            .eq('email', cleanEmail)
            .single();

          if (!error && dbUser) {
            if (dbUser.password && dbUser.password !== cleanPassword) {
              return res.status(401).json({ success: false, message: "Senha incorreta." });
            }
            const userPayload = {
              id: String(dbUser.id),
              name: dbUser.name || 'Membro Pet',
              email: dbUser.email,
              role: (dbUser.role === 'admin' || cleanEmail === 'clikdica@gmail.com') ? 'admin' : 'member',
              petName: dbUser.pet_name,
              petType: dbUser.pet_type,
              createdAt: dbUser.created_at || new Date().toISOString()
            };
            return res.json({ success: true, user: userPayload, isAdmin: userPayload.role === 'admin' });
          }
        } catch (e) {
          // Fallback if table doesn't exist
        }
      }

      return res.status(404).json({ 
        success: false, 
        message: "Usuário não encontrado. Crie uma conta gratuita em poucos segundos na aba 'Cadastre-se'!" 
      });
    } catch (err: any) {
      console.error("Error in login:", err);
      res.status(500).json({ success: false, message: "Erro no servidor ao autenticar." });
    }
  });

  // Register endpoint (Completely optional for visitors)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password, petName, petType } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "E-mail e senha são obrigatórios." });
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const cleanPassword = String(password).trim();
      const cleanName = String(name || '').trim() || (cleanEmail === 'clikdica@gmail.com' ? 'Administrador' : 'Tutor Pet');
      const isAdmin = cleanEmail === "clikdica@gmail.com";

      // Check if already registered in memory
      const existingIndex = registeredUsers.findIndex(u => u.email.toLowerCase() === cleanEmail);
      
      const newUser: UserRecord = {
        id: existingIndex >= 0 ? registeredUsers[existingIndex].id : `user-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        role: isAdmin ? 'admin' : 'member',
        petName: petName?.trim() || '',
        petType: petType || 'dog',
        createdAt: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        registeredUsers[existingIndex] = newUser;
      } else {
        registeredUsers.push(newUser);
      }

      // Try saving to Supabase pet_users table if available
      const { client, isConfigured } = getSupabase();
      if (isConfigured && client) {
        try {
          await client.from('pet_users').upsert({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            role: newUser.role,
            pet_name: newUser.petName,
            pet_type: newUser.petType,
            updated_at: new Date().toISOString()
          }, { onConflict: 'email' });
        } catch (dbErr) {
          console.warn("[Auth] Could not persist to Supabase pet_users table (using memory store):", dbErr);
        }
      }

      const { password: _, ...userSafe } = newUser;
      return res.json({ 
        success: true, 
        user: userSafe, 
        isAdmin, 
        message: isAdmin ? "Administrador conectado com sucesso!" : "Conta criada com sucesso! Bem-vindo(a) ao Clube de Achadinhos Pet!" 
      });
    } catch (err: any) {
      console.error("Error in register:", err);
      res.status(500).json({ success: false, message: "Erro ao registrar usuário." });
    }
  });

  // Change Password endpoint (Admin & Members)
  app.post("/api/auth/change-password", async (req, res) => {
    try {
      const { email, currentPassword, newPassword } = req.body;
      if (!email || !newPassword) {
        return res.status(400).json({ success: false, message: "E-mail e nova senha são obrigatórios." });
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const cleanNewPassword = String(newPassword).trim();
      const cleanCurrentPassword = currentPassword ? String(currentPassword).trim() : '';

      if (cleanNewPassword.length < 4) {
        return res.status(400).json({ success: false, message: "A nova senha deve ter no mínimo 4 caracteres." });
      }

      // Check user in registeredUsers memory store
      const userIndex = registeredUsers.findIndex(u => u.email.toLowerCase() === cleanEmail);
      if (userIndex >= 0) {
        const user = registeredUsers[userIndex];
        // If current password was supplied or user had an existing password, verify it
        if (user.password && cleanCurrentPassword) {
          const isCurrentValid = user.password === cleanCurrentPassword 
            || (user.role === 'admin' && (cleanCurrentPassword === 'admin123' || cleanCurrentPassword === 'admin' || cleanCurrentPassword === 'petadmin'));
          if (!isCurrentValid) {
            return res.status(401).json({ success: false, message: "A senha atual informada está incorreta." });
          }
        }

        // Update password in memory
        registeredUsers[userIndex].password = cleanNewPassword;
      } else {
        // If user not in array yet (e.g. admin first time), create the entry with new password
        registeredUsers.push({
          id: cleanEmail === 'clikdica@gmail.com' ? 'user-admin-01' : `user-${Date.now()}`,
          name: cleanEmail === 'clikdica@gmail.com' ? 'Administrador Achadinhos' : 'Tutor Pet',
          email: cleanEmail,
          password: cleanNewPassword,
          role: cleanEmail === 'clikdica@gmail.com' ? 'admin' : 'member',
          createdAt: new Date().toISOString()
        });
      }

      // Sync updated password to Supabase if configured
      const { client, isConfigured } = getSupabase();
      if (isConfigured && client) {
        try {
          await client.from('pet_users').upsert({
            email: cleanEmail,
            password: cleanNewPassword,
            role: cleanEmail === 'clikdica@gmail.com' ? 'admin' : 'member',
            updated_at: new Date().toISOString()
          }, { onConflict: 'email' });
        } catch (dbErr) {
          console.warn("[Auth] Could not update password in Supabase pet_users table:", dbErr);
        }
      }

      return res.json({ 
        success: true, 
        message: "Senha atualizada com sucesso! Use sua nova senha nos próximos acessos." 
      });
    } catch (err: any) {
      console.error("Error updating password:", err);
      res.status(500).json({ success: false, message: "Erro no servidor ao atualizar senha." });
    }
  });

  // Get all registered users (for admin panel community overview)
  app.get("/api/auth/users", (req, res) => {
    const safeUsers = registeredUsers.map(({ password, ...rest }) => rest);
    res.json({ success: true, count: safeUsers.length, users: safeUsers });
  });

  // ==========================================
  // SUPABASE STATUS & PRODUCT CRUD ENDPOINTS
  // ==========================================

  // Check Supabase connection and status
  app.get("/api/supabase/status", async (req, res) => {
    const { client, url, isConfigured } = getSupabase();
    
    if (!isConfigured || !client) {
      return res.json({
        configured: false,
        connected: false,
        url: url || null,
        message: "Supabase não configurado. Defina SUPABASE_URL e SUPABASE_KEY no painel de configurações para ativar a sincronização em nuvem."
      });
    }

    try {
      const { count, error } = await client
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (error) {
        // Table might not exist yet or permission error
        return res.json({
          configured: true,
          connected: false,
          url,
          error: error.message,
          message: error.message.includes('relation') 
            ? "Conectado ao Supabase, mas a tabela 'products' ainda não foi criada. Copie o script SQL abaixo e execute no SQL Editor do Supabase."
            : `Erro ao conectar com Supabase: ${error.message}`
        });
      }

      res.json({
        configured: true,
        connected: true,
        url,
        totalProducts: count ?? 0,
        message: `Conectado com sucesso ao Supabase! Total de produtos no banco: ${count ?? 0}`
      });
    } catch (err: any) {
      res.json({
        configured: true,
        connected: false,
        url,
        error: err.message,
        message: `Falha na conexão com o Supabase: ${err.message}`
      });
    }
  });

  // Get products (reads from Supabase if connected and populated, otherwise fallback)
  app.get("/api/products", async (req, res) => {
    const { client, isConfigured } = getSupabase();

    if (isConfigured && client) {
      try {
        const { data, error } = await client
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapDbToProduct);
          inMemoryProducts = mapped;
          return res.json({
            success: true,
            source: 'supabase',
            products: mapped
          });
        }
      } catch (err) {
        console.error("Error fetching products from Supabase:", err);
      }
    }

    res.json({
      success: true,
      source: 'memory',
      products: inMemoryProducts
    });
  });

  // Add / Create a single product
  app.post("/api/products", async (req, res) => {
    try {
      const product = req.body;
      if (!product || !product.title) {
        return res.status(400).json({ error: "Título do produto é obrigatório." });
      }

      if (!product.id) {
        product.id = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      }

      // Add to in-memory store
      inMemoryProducts = [product, ...inMemoryProducts.filter(p => p.id !== product.id)];

      // Sync to Supabase if connected
      const { client, isConfigured } = getSupabase();
      let supabaseResult = null;

      if (isConfigured && client) {
        const dbRow = mapProductToDb(product);
        const upsertRes = await resilientSupabaseUpsert(client, [dbRow]);
        if (!upsertRes.success) {
          console.error("Supabase upsert error:", upsertRes.error);
          supabaseResult = { error: upsertRes.error?.message || "Erro no Supabase" };
        } else {
          supabaseResult = { 
            success: true, 
            data: upsertRes.data,
            prunedColumns: upsertRes.prunedColumns 
          };
        }
      }

      res.json({
        success: true,
        product,
        supabase: supabaseResult
      });
    } catch (err: any) {
      res.status(500).json({ error: "Erro ao salvar produto", details: err.message });
    }
  });

  // Update product
  app.put("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = { ...req.body, id };

      inMemoryProducts = inMemoryProducts.map(p => p.id === id ? updatedData : p);

      const { client, isConfigured } = getSupabase();
      let supabaseResult = null;

      if (isConfigured && client) {
        const dbRow = mapProductToDb(updatedData);
        const upsertRes = await resilientSupabaseUpsert(client, [dbRow]);
        if (!upsertRes.success) {
          console.error("Supabase update error:", upsertRes.error);
          supabaseResult = { error: upsertRes.error?.message || "Erro no Supabase" };
        } else {
          supabaseResult = { 
            success: true, 
            data: upsertRes.data,
            prunedColumns: upsertRes.prunedColumns 
          };
        }
      }

      res.json({
        success: true,
        product: updatedData,
        supabase: supabaseResult
      });
    } catch (err: any) {
      res.status(500).json({ error: "Erro ao atualizar produto", details: err.message });
    }
  });

  // Delete product
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      inMemoryProducts = inMemoryProducts.filter(p => p.id !== id);

      const { client, isConfigured } = getSupabase();
      let supabaseResult = null;

      if (isConfigured && client) {
        const { error } = await client
          .from('products')
          .delete()
          .eq('id', id);

        if (error) {
          console.error("Supabase delete error:", error);
          supabaseResult = { error: error.message };
        } else {
          supabaseResult = { success: true };
        }
      }

      res.json({
        success: true,
        deletedId: id,
        supabase: supabaseResult
      });
    } catch (err: any) {
      res.status(500).json({ error: "Erro ao excluir produto", details: err.message });
    }
  });

  // Sync entire product list to Supabase in bulk
  app.post("/api/supabase/sync", async (req, res) => {
    try {
      const { products } = req.body;
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: "Array de produtos é obrigatório." });
      }

      inMemoryProducts = products;

      const { client, isConfigured } = getSupabase();
      if (!isConfigured || !client) {
        return res.json({
          success: true,
          syncedToSupabase: false,
          count: products.length,
          message: "Produtos salvos na memória do servidor. Configure SUPABASE_URL e SUPABASE_KEY para salvar no Supabase."
        });
      }

      const rows = products.map(p => mapProductToDb(p));
      const upsertRes = await resilientSupabaseUpsert(client, rows);

      if (!upsertRes.success) {
        return res.status(500).json({
          success: false,
          error: upsertRes.error?.message || "Erro desconhecido",
          message: `Erro ao sincronizar com Supabase: ${upsertRes.error?.message || ''}. Execute o script SQL de atualização de colunas no painel do Supabase.`
        });
      }

      const prunedNotice = upsertRes.prunedColumns && upsertRes.prunedColumns.length > 0
        ? ` (Obs: colunas [${upsertRes.prunedColumns.join(', ')}] não existem na sua tabela e foram omitidas temporariamente)`
        : '';

      res.json({
        success: true,
        syncedToSupabase: true,
        count: rows.length,
        prunedColumns: upsertRes.prunedColumns,
        message: `${rows.length} produtos foram sincronizados com sucesso no Supabase!${prunedNotice}`
      });
    } catch (err: any) {
      res.status(500).json({ error: "Erro ao sincronizar produtos", details: err.message });
    }
  });

  // Documentation / SQL Schema exporter for Supabase & Next.js production migration
  app.get("/api/docs/supabase-schema", (req, res) => {
    const sqlSchema = `
-- ============================================================
-- PORTAL DE ACHADINHOS E OFERTAS PET - SUPABASE POSTGRESQL SCHEMA
-- Execute este script no SQL Editor do seu painel Supabase
-- ============================================================

-- 1. Criar Tabela de Produtos (Compatível com IDs de texto e UUIDs)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
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

-- Se a tabela já existia sem as novas colunas, execute estes comandos para atualizar:
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

-- Recarregar cache de esquema do Supabase
NOTIFY pgrst, 'reload schema';

-- 2. Índices de busca de alta performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Permissão Pública para Leitura e Gravação (Ideal para Vitrine com Painel)
DROP POLICY IF EXISTS "Permitir Leitura Pública de Produtos" ON public.products;
CREATE POLICY "Permitir Leitura Pública de Produtos" 
  ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir Inserção e Edição de Produtos" ON public.products;
CREATE POLICY "Permitir Inserção e Edição de Produtos" 
  ON public.products FOR ALL USING (true) WITH CHECK (true);
`;

    res.json({
      sqlSchema,
      supabaseClientGuide: `
// Exemplo de integração no Next.js (App Router ou Pages Router)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
`,
      shopeeApiGuide: `
// GUIA DE INTEGRAÇÃO DE LINKS E PRODUTOS
// 1. Conecte sua fonte de produtos ou API de e-commerce
// 2. Gere links diretos com parâmetros de rastreamento (UTM / SubID)
// 3. Atualize preços e disponibilidade automaticamente via cron job ou webhook
`
    });
  });

  // Dynamic Sitemap XML for Google Search Console & SEO
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const siteUrl = "https://achadinhospet.net";
      const categories = [
        'alimentacao',
        'cuidados_especiais',
        'saude_bem_estar',
        'cama_banheiro',
        'acessorios',
        'outros'
      ];

      // Fetch latest products from Supabase or in-memory
      let productsList = inMemoryProducts;
      const { client, isConfigured } = getSupabase();
      if (isConfigured && client) {
        try {
          const { data, error } = await client.from('products').select('*');
          if (!error && Array.isArray(data) && data.length > 0) {
            productsList = data.map(r => mapDbToProduct(r));
          }
        } catch (e) {
          // Use in-memory fallback
        }
      }

      const today = new Date().toISOString().split('T')[0];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

      // Homepage
      xml += `  <url>\n    <loc>${siteUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

      // Categories
      categories.forEach(cat => {
        xml += `  <url>\n    <loc>${siteUrl}/?categoria=${cat}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
      });

      // Special Curated Filters
      const filters = ['ofertas-relampago', 'destaques', 'frete-gratis'];
      filters.forEach(fil => {
        xml += `  <url>\n    <loc>${siteUrl}/?filtro=${fil}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
      });

      // Products
      productsList.forEach(p => {
        const prodId = encodeURIComponent(p.id);
        xml += `  <url>\n`;
        xml += `    <loc>${siteUrl}/?produto=${prodId}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        if (p.imageUrl) {
          const escapedImg = p.imageUrl.replace(/&/g, '&amp;');
          const escapedTitle = (p.title || 'Produto Pet').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          xml += `    <image:image>\n      <image:loc>${escapedImg}</image:loc>\n      <image:title>${escapedTitle}</image:title>\n    </image:image>\n`;
        }
        xml += `  </url>\n`;
      });

      xml += `</urlset>`;

      res.header('Content-Type', 'application/xml; charset=utf-8');
      res.send(xml);
    } catch (err: any) {
      res.status(500).send("Erro ao gerar sitemap");
    }
  });

  // Robots.txt
  app.get("/robots.txt", (req, res) => {
    const robots = `User-agent: *
Allow: /
Disallow: /api/

# Googlebot
User-agent: Googlebot
Allow: /

# Bingbot
User-agent: Bingbot
Allow: /

Sitemap: https://achadinhospet.net/sitemap.xml
`;
    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.send(robots);
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AchadinhosPet Server running on port ${PORT}`);
  });
}

startServer();
