export const INSIGHT_CATEGORY_MAPPING = {
  'FACE': ['PRIMER', 'BLUSHER', 'CONCEALER', 'FOUNDATION', 'COMPACT', 'POWDER', 'HIGHLIGHTER', 'FIXERS & REMOVERS', 'SINDOOR'],
  'LIPS': ['LIP LINER', 'LIPSTICK', 'LIP COLOR', 'LIP GLOSS', 'LIP BALM'],
  'EYES': ['EYEBROW', 'EYELINER', 'EYESHADOW', 'MASCARA & KAJAL'],
  'ACCESSORIES': ['ACCESSORIES'] 
};

// Helper function to get all actual subcategories for a given category name
export const getMappedCategories = (brandName, categoryName) => {
  const isInsight = brandName?.toLowerCase() === 'insight';
  if (!isInsight) return [categoryName.toLowerCase()];
  
  const upperCat = categoryName.toUpperCase();
  if (INSIGHT_CATEGORY_MAPPING[upperCat]) {
    return INSIGHT_CATEGORY_MAPPING[upperCat].map(c => c.toLowerCase());
  }
  
  return [categoryName.toLowerCase()];
};
