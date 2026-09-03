export type ProductCategory = 
  | 'alimentacao'
  | 'cuidados_especiais'
  | 'saude_bem_estar'
  | 'cama_banheiro'
  | 'acessorios'
  | 'outros';

export interface Product {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number | string;
  originalPrice?: number | string;
  discountPercent?: number;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  imageUrl: string;
  additionalImages?: string[];
  category: ProductCategory;
  shopeeUrl: string;
  affiliateUrl: string;
  tags: string[];
  badges: string[];
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  highlights?: {
    idealFor: string;
    whyBuy: string;
    tips?: string;
  };
  aiInsights?: {
    idealFor: string;
    whyBuy: string;
    tips?: string;
    recommendedComplementId?: string;
  };
  sellerName?: string;
  sellerLocation?: string;
  freeShipping?: boolean;
  couponAvailable?: string;
}

export interface ClickLog {
  id: string;
  productId: string;
  productTitle: string;
  timestamp: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  referrer?: string;
  categoryUsed?: ProductCategory;
  affiliateCodeUsed: string;
  estimatedCommission: number;
}

export interface PetProfile {
  id: string;
  name: string;
  species?: string;
  categoryInterest?: ProductCategory;
  favoriteCategory?: ProductCategory;
  breed: string;
  age: string;
  size: 'pequeno' | 'medio' | 'grande' | 'mini';
  specialNeeds?: string;
}

export interface AffiliateSettings {
  affiliateId: string;
  subIdPrefix: string;
  autoAppendAffiliateTag: boolean;
  defaultUtmSource: string;
  commissionRateEstimate: number; // e.g. 8.5%
  storeName: string;
  storeDomain: string;
  contactEmail: string;
}

export interface CuratedKit {
  id: string;
  title: string;
  subtitle: string;
  category: ProductCategory;
  tag: string;
  iconName: string;
  productIds: string[];
  savingsTotal: number;
}

export interface Banner {
  productObject?: Product;
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  ctaText: string;
  categoryTarget: ProductCategory;
  bgGradient: string;
  image: string;
  highlightBadge: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  petName?: string;
  petType?: 'dog' | 'cat' | 'both' | 'other';
  createdAt: string;
}



