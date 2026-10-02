import { Product } from '../types';

/**
 * Ensures a list of products has strictly unique, non-empty IDs.
 * Filters out null/undefined entries and eliminates any duplicates.
 */
export function deduplicateProducts(list: Product[] | undefined | null): Product[] {
  if (!Array.isArray(list)) return [];
  const seenIds = new Set<string>();
  const uniqueProducts: Product[] = [];

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (!item || typeof item !== 'object') continue;

    let id = item.id ? String(item.id).trim() : '';
    if (!id) {
      id = `prod-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`;
    }

    if (seenIds.has(id)) {
      // Skip duplicate product ID to avoid React duplicate key errors
      continue;
    }

    seenIds.add(id);
    uniqueProducts.push({
      ...item,
      id
    });
  }

  return uniqueProducts;
}

/**
 * Safely merges incoming products into an existing list without producing duplicate IDs.
 * Items in `incoming` with matching IDs will update items in `base`.
 * Truly new items from `incoming` are prepended to the top of the catalog.
 */
export function mergeProductsUnique(base: Product[] | undefined | null, incoming: Product[] | undefined | null): Product[] {
  const safeBase = deduplicateProducts(base);
  const safeIncoming = deduplicateProducts(incoming);

  if (safeIncoming.length === 0) return safeBase;
  if (safeBase.length === 0) return safeIncoming;

  const incomingMap = new Map<string, Product>();
  safeIncoming.forEach(p => incomingMap.set(p.id, p));

  // Update existing products with incoming updates where ID matches
  const updatedBase = safeBase.map(existing => {
    if (incomingMap.has(existing.id)) {
      const updated = incomingMap.get(existing.id)!;
      incomingMap.delete(existing.id); // mark as consumed
      return updated;
    }
    return existing;
  });

  // Any remaining items in incomingMap are brand new, prepend them
  const brandNew = Array.from(incomingMap.values());
  return deduplicateProducts([...brandNew, ...updatedBase]);
}
