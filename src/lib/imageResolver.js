/**
 * imageResolver.js
 *
 * Central automatic image mapping system for Veda Beauty.
 * Resolves product images and shade images from the public folder
 * based on brand + product name — NO manual URL assignment required.
 */

import { getMarsImages } from './marsImages';
import { BRAND_IMAGE_MAP } from './brandImageMap';
import { getMarsShadeFolder } from './marsShadeMap';

/** Generic fallback shown when no image resolves */
export const FALLBACK_IMAGE = '/favicon.jpeg';

// ─── Name Normalisers ────────────────────────────────────────────────────────

/** Normalise a string to UPPER CASE and trim whitespace */
const toUpper = (s) => (s || '').trim().toUpperCase();

/** Convert a name to a URL slug (lowercase, hyphens) */
const toSlug = (s) =>
  (s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Check if a brand name contains a given keyword */
const isBrand = (brandRaw, keyword) =>
  (brandRaw || '').toLowerCase().includes(keyword.toLowerCase());

/** Encode URI path correctly preserving slashes */
export const encodePath = (p) => {
  if (!p || p.startsWith('http') || p.startsWith('data:')) return p;
  return p.split('/').map(encodeURIComponent).join('/').replace(/%3A/g, ':');
};

/** Get lowercase tokens of a string for robust matching */
const getTokens = (str) => {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
};

/** Clean special characters from a string for exact comparison */
const normalizeStr = (str) => {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .trim();
};

/** Fuzzy/Token matching resolver for brand files */
export function findBestImageCandidates(brandKey, productName) {
  const files = BRAND_IMAGE_MAP[brandKey];
  if (!files || files.length === 0) return [];

  const dbTokens = getTokens(productName);
  const dbNorm = normalizeStr(productName);
  if (dbTokens.length === 0) return [];

  const scored = files.map(file => {
    const filenameNoExt = file.replace(/\.[^/.]+$/, "");
    const fileNorm = normalizeStr(filenameNoExt);
    const fileTokens = getTokens(filenameNoExt);

    let score = 0;

    // 1. Exact normalized string matching (e.g. "bananapowder" === "bananapowder")
    if (dbNorm === fileNorm) {
      score += 100;
    } else if (fileNorm.includes(dbNorm) || dbNorm.includes(fileNorm)) {
      score += 50;
    }

    // 2. Token intersection count
    let tokenMatches = 0;
    dbTokens.forEach(t => {
      const match = fileTokens.some(ft => {
        if (ft === t) return true;
        if (ft.length > 3 && t.length > 3) {
          return ft.startsWith(t) || t.startsWith(ft);
        }
        return false;
      });
      if (match) tokenMatches++;
    });

    score += tokenMatches * 10;

    return { file, score, fileTokenCount: fileTokens.length };
  });

  const sorted = scored
    .filter(m => m.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.fileTokenCount - b.fileTokenCount;
    });

  if (sorted.length === 0) return [];

  const bestScore = sorted[0].score;
  const brandFolder = brandKey === 'facesCanada' ? 'faces canada'
    : brandKey === 'pilgrims' ? 'pilgrims'
    : brandKey === 'sugarPop' ? 'sugar pop'
    : brandKey;
  
  return sorted
    .filter(m => m.score >= bestScore - 10)
    .map(m => encodePath(`/${brandFolder}/${m.file}`));
}

// ─── Brand-Specific Product Image Resolvers ──────────────────────────────────

/**
 * Returns an ordered list of candidate image URLs for a given product.
 * The caller should try each in sequence and use the first that loads.
 */
export function getProductImageCandidates(product) {
  const brandName = product?.brands?.name || product?.brand || product?.brand_name || '';
  const name = (product?.name || '').trim();
  const dbUrl = product?.image_url;
  
  let candidates = [];

  // 1. Always prioritize the database image URL if it's set (and not a placeholder)
  if (dbUrl && !dbUrl.includes('unsplash.com')) {
    candidates.push(dbUrl);
  }

  // 1.5 Add any gallery images saved in the database
  if (product?.gallery_images && Array.isArray(product.gallery_images) && product.gallery_images.length > 0) {
    candidates.push(...product.gallery_images);
  }

  // 2. Add brand-specific fuzzy matching / hardcoded paths as fallbacks
  if (isBrand(brandName, 'mars')) {
    const marsImages = getMarsImages(name);
    if (marsImages.length > 0) candidates.push(...marsImages);
  } else if (isBrand(brandName, 'pilgrim')) {
    const matched = findBestImageCandidates('pilgrims', name);
    if (matched.length > 0) candidates.push(...matched);
    const slug = toSlug(name);
    candidates.push(
      encodePath(`/pilgrims/${slug}.png`),
      encodePath(`/pilgrims/${slug}.jpg`)
    );
  } else if (isBrand(brandName, 'insight')) {
    const matched = findBestImageCandidates('insight', name);
    if (matched.length > 0) candidates.push(...matched);
    candidates.push(encodePath(`/insight/${name}.png`));
  } else if (isBrand(brandName, 'faces canada') || isBrand(brandName, 'faces')) {
    const matched = findBestImageCandidates('facesCanada', name);
    if (matched.length > 0) candidates.push(...matched);
    const upper = toUpper(name);
    candidates.push(
      encodePath(`/faces canada/${upper}.jpg`),
      encodePath(`/faces canada/${upper}.png`)
    );
  } else if (isBrand(brandName, 'lotus')) {
    const matched = findBestImageCandidates('lotus', name);
    if (matched.length > 0) candidates.push(...matched);
    const upper = toUpper(name);
    candidates.push(
      encodePath(`/lotus/${upper}.jpg`),
      encodePath(`/lotus/${upper}.png`)
    );
  } else if (isBrand(brandName, 'sugar pop')) {
    const matched = findBestImageCandidates('sugarPop', name);
    if (matched.length > 0) candidates.push(...matched);
    const upper = toUpper(name);
    candidates.push(
      encodePath(`/sugar pop/${upper}.png`),
      encodePath(`/sugar pop/${upper}.jpg`),
      encodePath(`/sugar pop/${upper}.jfif`),
      encodePath(`/sugar pop/${upper}.webp`)
    );
  }

  if (candidates.length > 0) {
    return candidates;
  }

  return [FALLBACK_IMAGE];
}

/**
 * Convenience: returns the single "best" image URL for a product card / thumbnail.
 */
export function getProductImage(product) {
  return getProductImageCandidates(product)[0] || FALLBACK_IMAGE;
}

// ─── Shade / Variant Image Resolvers ─────────────────────────────────────────

/**
 * Returns an ordered list of candidate shade image URLs.
 * Falls back to the variant's stored image_url, then FALLBACK_IMAGE.
 */
export function getShadeCandidates(product, variant) {
  const brandName = product?.brands?.name || product?.brand || product?.brand_name || '';
  const productName = (product?.name || '').trim();
  const shadeName = (variant?.name || variant?.variant_name || product?.variant_name || product?.variant || '').trim();

  const productFolder = toUpper(productName);
  const shadeFile = toUpper(shadeName);
  
  let candidates = [];
  
  // 1. Always prioritize the database image URL if it's set
  if (variant?.image_url && !variant.image_url.includes('unsplash.com')) {
    candidates.push(variant.image_url);
  }

  // ── MARS offer shades ──
  if (isBrand(brandName, 'mars')) {
    const marsFolder = getMarsShadeFolder(productName) || productFolder;
    
    candidates.push(
      encodePath(`/mars/shades/${marsFolder}/${shadeName}.png`),
      encodePath(`/mars/shades/${marsFolder}/${shadeName}.jpg`),
      encodePath(`/mars/shades/${marsFolder}/${shadeName}.webp`),
      encodePath(`/mars/shades/${marsFolder}/${shadeName}.jfif`),
      encodePath(`/mars/shades/${marsFolder}/${shadeFile}.png`),
      encodePath(`/mars/shades/${marsFolder}/${shadeFile}.jpg`),
      encodePath(`/mars/shades/${marsFolder}/${shadeFile}.webp`),
      encodePath(`/mars/shades/${marsFolder}/${shadeFile}.jfif`),
      // Legacy fallback
      encodePath(`/shades/offers/mars/${productFolder}/${shadeFile}.jpg`),
      encodePath(`/shades/offers/mars/${productFolder}/${shadeFile}.png`)
    );
  }

  // ── Insight offer shades ──
  if (isBrand(brandName, 'insight')) {
    candidates.push(
      encodePath(`/shades/offers/insight/${productFolder}/${shadeFile}.jpg`),
      encodePath(`/shades/offers/insight/${productFolder}/${shadeFile}.png`)
    );
  }

  if (candidates.length > 0) {
    return candidates;
  }

  // ── Generic: fall back to variant's stored URL if we haven't already ──
  if (variant?.image_url) return [variant.image_url];

  return [FALLBACK_IMAGE];
}

/**
 * Convenience: returns the single "best" shade image URL.
 */
export function getShadeImage(product, variant) {
  return getShadeCandidates(product, variant)[0] || FALLBACK_IMAGE;
}

// ─── Cart / Order Image Helper ────────────────────────────────────────────────

/**
 * Resolves an list of candidate images for a cart/order item,
 * fallback chain.
 */
export function getCartItemImageCandidates(item) {
  if (!item) return [FALLBACK_IMAGE];
  
  // If it's a shade variant, try shade candidates first
  const shadeCands = getShadeCandidates(item, item?.variant || item);
  if (shadeCands.length > 0 && shadeCands[0] !== FALLBACK_IMAGE) {
    return shadeCands;
  }

  // Try standard product candidates
  const prodCands = getProductImageCandidates(item);

  // If item has a custom DB URL that isn't placeholder
  if (item?.image_url && !item.image_url.includes('unsplash.com')) {
    return [item.image_url, ...prodCands];
  }

  return prodCands;
}

/**
 * Convenience for single cart image
 */
export function getCartItemImage(item) {
  return getCartItemImageCandidates(item)[0] || FALLBACK_IMAGE;
}
