const fs = require('fs');
let code = fs.readFileSync('src/components/BannerHero.tsx', 'utf8');

const correctImports = `import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Percent, 
  Truck, 
  ShieldCheck, 
  Flame, 
  Tag, 
  ChevronLeft, 
  ChevronRight, 
  PackageCheck,
  Utensils,
  BedDouble,
  Sparkles,
  Edit2,
  Trash2
} from 'lucide-react';
import { ProductCategory, Product, Banner } from '../types';
import { DEFAULT_BANNERS } from '../data/mockProducts';

interface BannerHeroProps {`;

code = code.replace(/import React[\s\S]*?interface BannerHeroProps \{/, correctImports);
fs.writeFileSync('src/components/BannerHero.tsx', code);
