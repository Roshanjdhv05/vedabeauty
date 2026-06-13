/**
 * marsShadeMap.js
 *
 * Maps normalized (lowercase, trimmed) Mars product names
 * to their actual folder names inside public/mars/shades/.
 *
 * Auto-generated from directory listing of public/mars/shades/.
 * Product keys should match the normalized form used in getShadeCandidates.
 */

/**
 * Normalize a product name for shade-folder lookup.
 * Strips special chars, lowercases, collapses spaces.
 */
export const normalizeShadeLookup = (s) =>
  (s || '')
    .toLowerCase()
    .replace(/['']/g, "'")      // curly → straight apostrophe
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Actual folder names inside public/mars/shades/ keyed by normalized product name */
const MARS_SHADE_FOLDER_MAP = {
  // ─── FOUNDATION / FACE BASE ──────────────────────────────────────────────
  "2 in 1 super stay foundation":              "2 in 1 Super Stay Foundation",
  "artistry liquid foundation":                "Artistry  Liquid Foundation",
  "bb cream":                                  "BB CREAM",
  "bb cream foundation":                       "BB Cream Foundation",
  "bloom bb cream":                            "BLOOM BB CREAM",
  "color changing foundation":                 "MARS COLORBUM LIPSTICK",   // closest available
  "high coverage foundation":                  "HIGH COVERAGE FOUNDATION",
  "high coverage foundation 2":                "High Coverage Foundation 2",
  "matte maniac foundation":                   "Matte Maniac Foundation",
  "matte mousse foundation":                   "MATTE MOUSSE FOUNDATION",
  "miracle bb foundation":                     "MIRACLE BB FOUNDATION",
  "mist foundation":                           "MARS Mist Foundation",
  "mars mist foundation":                      "MARS Mist Foundation",
  "the gold waves foundation":                 "The Gold Waves Foundation",
  "zero blend foundation":                     "Zero Blend Foundation",

  // ─── CONCEALER ───────────────────────────────────────────────────────────
  "cancel liquid concealer":                   "Cancel Liquid Concealer",
  "mars cover rangers":                        "MARS Cover Rangers",
  "cover rangers":                             "MARS Cover Rangers",
  "wonder cover":                              "MARS Wonder Cover",
  "mars wonder cover":                         "MARS Wonder Cover",

  // ─── PRIMER ──────────────────────────────────────────────────────────────
  "take a glow primer":                        "TAKE A GLOW PRIMER",

  // ─── POWDER ──────────────────────────────────────────────────────────────
  "3 in 1 airbrush powder":                    "3 in 1 Airbrush Powder",
  "airbrush powder":                           "3 in 1 Airbrush Powder",
  "born to bake setting powder":               "Born to Bake Setting Powder",
  "hd compact powder":                         "HD Compact Powder",
  "magic compact powder":                      "Magic Compact Powder",
  "mistique bb powder":                        "Mistique BB  Powder",
  "silky skin powder":                         "Silky Skin Powder",
  "skin perfecting powder":                    "Skin Perfecting Powder",
  "soft shiny skin powder":                    "Soft Shiny Skin  Powder",
  "sweet oil powder":                          "Sweet Oil Powder",
  "trend setting powder":                      "Trend Setting  Powder",
  "wonder powder":                             "MARS Wonder Powder",
  "mars wonder powder":                        "MARS Wonder Powder",
  "zero oil compact":                          "Zero Oil Compact",

  // ─── BLUSH / HIGHLIGHTER / ILLUMINATOR ───────────────────────────────────
  "blush hour liquid blush":                   "Blush Hour Liquid Blush",
  "dark magic blush":                          "Dark Magic  Blush",
  "flush of love blush":                       "Flush of Love Blush",
  "glow fly liquid highlighter":               "Glow fly Liquid Highlighter",
  "glowzilla face palette":                    "Glowzilla face palette",
  "god's glow illuminator":                    "God's Glow Illuminator",
  "gods glow illuminator":                     "God's Glow Illuminator",
  "illuminati base":                           "Illuminati Base",
  "sugar rush liquid blusher":                 "SUGAR RUSH LIQUID BLUSHER",

  // ─── CONTOUR / PALETTE ───────────────────────────────────────────────────
  "contour palette":                           "MARS Contour Palette",
  "mars contour palette":                      "MARS Contour Palette",
  "fantasy face palette":                      "Fantasy Face Palette",
  "mars fantasy face palette":                 "MARS Fantasy Face Palette",

  // ─── SINDOOR ─────────────────────────────────────────────────────────────
  "rivaaz sindoor":                            "Rivaaz  Sindoor",

  // ─── LIP PRODUCTS ────────────────────────────────────────────────────────
  "aqua splash lip balm":                      "AQUA SPLASH LIP BALM",
  "candylocious lip gloss":                    "MARS CANDYLICIOUS LIP GLOSS",
  "candylicious lip gloss":                    "MARS CANDYLICIOUS LIP GLOSS",
  "mars candylicious lip gloss":               "MARS CANDYLICIOUS LIP GLOSS",
  "cinemagic non transfer lip gloss":          "CINEMAGIC NON TRANSFER  LIP GLOSS",
  "click-stick gloss lip balm":                "CLICK-STICK GLOSS LIP BALM",
  "click stick gloss lip balm":                "CLICK-STICK GLOSS LIP BALM",
  "cloud kiss lipstick":                       "CLOUD KISS LIPSTICK",
  "color changing lip oil":                    "COLOR CHANGING LIP OIL",
  "colorbum liquid lipstick":                  "MARS COLORBUM LIPSTICK",
  "mars colorbum lipstick":                    "MARS COLORBUM LIPSTICK",
  "creamy matte lipstick":                     "CREAMY MATTE LIPSTICK",
  "drip lip mist":                             "DRIP LIP MIST",
  "edge of desire lip liner":                  "EDGE OF DESIRE LIP LINER",
  "edge of desire lip liner holder":           "EDGE OF DESIRE LIP LINER-HOLDER",
  "edge of desire lip liner-holder":           "EDGE OF DESIRE LIP LINER-HOLDER",
  "full of water lip balm":                    "FULL OF WATER LIP BALM",
  "hydratint balm":                            "HYDRATINT BALM",
  "infinity lip palette":                      "Infinity  Lip Palette",
  "lip and cheek tint":                        "Lip & Cheek Tint",
  "lip and cheek tint":                        "Lip & Cheek Tint",
  "lip crayon":                                "LIP CRAYON",
  "lip lollies lip balm":                      "LIP LOLLIES LIP BALM",
  "lippy top lip gel":                         "LIPPY TOP LIP GEL",
  "love track":                                "LOVE TRACK",
  "matte lip color":                           "MATTE LIP COLOR",
  "matte muse lipstick":                       "MATTE MUSE LIPSTICK",
  "non transfer butter stick":                 "NON TRANSFER BUTTER STICK",
  "plush velvet lipstick":                     "PLUSH VELVET LIPSTICK",
  "poppins lip crayon":                        "POPPINS LIP CRAYON",
  "popstar liquid mousse lipstick":            "POPSTAR LIQUID MOUSSE LIPSTICK",
  "queen of mattes":                           "QUEEN OF MATTES",
  "silk matte lipstick":                       "SILK MATTE LIPSTICK",
  "super stay lipstick":                       "SUPER STAY LIPSTICK",
  "3 matte box":                               "3 Matte Box",

  // ─── EYES ────────────────────────────────────────────────────────────────
  "back to basics palette":                    "BACK TO BASICS PALETTE",
  "blooming eyeshadow palette":                "BLOOMING EYESHADOW PALETTE",
  "brow better eyebrow pencil":                "BROW BETTER  EYEBROW PENCIL",
  "city strokes liquid eyeliner":              "CITY STROKES LIQUID EYELINER",
  "dance of joy eyeshadow palette":            "DANCE OF JOY EYESHADOW PALETTE",
  "double trouble mascara":                    "DOUBLE TROUBLE MASCARA",
  "eye love multi pods":                       "EYE LOVE MULTI PODS",
  "eyebrow pencil":                            "EYEBROW PENCIL",
  "#eyegotthis liquid eyeliner":               "EYEGOTTHIS LIQUID EYELINER",
  "eyegotthis liquid eyeliner":                "EYEGOTTHIS LIQUID EYELINER",
  "fantasy 15 eyeshadow palette":              "Fantasy 15 Eyeshadow palette",
  "fabulash mascara":                          "MARS FABULASH MASCARA",
  "mars fabulash mascara":                     "MARS FABULASH MASCARA",
  "forget falsies mascara":                    "FORGET FALSIES MASCARA",
  "free flow eyeliner":                        "FREE FLOW EYELINER",
  "glitter liquid eyeshadow":                  "GLITTER LIQUID  EYESHADO",
  "glitter palette":                           "MARS Glitter  Palette",
  "mars glitter palette":                      "MARS Glitter  Palette",
  "highlashes eyelashes":                      "HIGHLASHES EYELASHES",
  "hue gel eyeliner":                          "HUE GEL EYELINER",
  "hyper smooth eyeliner":                     "HYPER SMOOTH EYELINER",
  "ink black eyeliner":                        "INK BLACK EYELINER",
  "kohl of fame kajal":                        "KOHL OF FAME KAJAL",
  "mesmereyes eyeshadow palette":              "MESMEREYES EYESHADOW PALETTE",
  "micro precision brow pencil":               "MICRO PRECISION BROW PENCIL",
  "northern lights in a pan":                  "NORTHERN LIGHTS IN A PAN",
  "northern lights liquid eyeliner":           "NORTHERN LIGHTS LIQUID EYELINER",
  "northern liquid eyeliner":                  "NORTHERN LIGHTS LIQUID EYELINER",
  "northern lights liquid eyeshadow":          "NORTHERN LIGHTS LIQUID EYESHADOW",
  "northern lights pencil eyeliner":           "NORTHERN LIGHTS PENCIL EYELINER",
  "oh brow eyebrow pencil":                    "OH BROW EYEBROW PENCIL",
  "artist's arsenal eyeshadow palette":        "ARTIST'S  ARSENAL EYESHADOW PALETTE",
  "silk lengthening mascara":                  "SILK LENGTHENING MASCARA",
  "sitara metallic eyeshadow palette":         "Sitara Metallic Eyeshadow Palette",
  "sky liner liquid matte eyeliner":           "SKY LINER LIQUID MATTE EYELINER",
  "so black liquid eyeliner":                  "SO BLACK LIQUID EYELINER",
  "social black eyeliner with brush tip":      "SOCIAL BLACK EYELINER WITH BRUSH TIP",
  "starlit pot":                               "STARLIT POT",
  "twinkle wink glitter eyeliner":             "TWINKLE WINK GLITTER EYELINER",
  "wswb pen eyeliner":                         "WSWB PEN EYELINER",
  "pen eyeliner":                              "WSWB PEN EYELINER",
  "wswb smooth glide kajal":                   "WSWB SMOOTH GLIDE KAJAL",
  "wswb kajal":                                "MARS WSWB KAJAL",
  "mars wswb kajal":                           "MARS WSWB KAJAL",
  "ziddi kajal":                               "ZIDDI KAJAL",

  // ─── KITS / COMBOS ───────────────────────────────────────────────────────
  "all i need makeup kit":                     "All I Need Makeup Kit",
  "makeup kit":                                "Makeup kit",
  "poco makeup":                               "Poco Makeup",
  "trio treat":                                "TRIO Treat",

  // City Paradise variants
  "city paradise makeup kit - delhi":          "The  City Paradise",
  "city paradise makeup kit - mumbai":         "The City Paradise 2",
  "city paradise makeup kit - kolkata":        "The City Paradise 3",
  "city paradise makeup kit - chandigarh":     "The City Paradise 4",
  "city paradise makeup kit - bangalore":      "The City Paradise 5",
  "city paradise makeup kit - lucknow":        "The City Paradise 6",
  "city paradise makeup kit - ahmedabad":      "The City Paradise 7",
  "city paradise makeup kit - jaipur":         "The City Paradise 8",

  // ─── ACCESSORIES / TOOLS ─────────────────────────────────────────────────
  "good wipes":                                "GOOD WIPES WET WIPES",
  "good wipes wet wipes":                      "GOOD WIPES WET WIPES",
  "makeup melting microfiber wipes":           "MAKEUP MELTING MICROFIBER  WIPES",
  "makeup pouch":                              "MARS MAKEUP POUCH",
  "mars makeup pouch":                         "MARS MAKEUP POUCH",
  "wet wipes":                                 "MARS WET WIPES",
  "mars wet wipes":                            "MARS WET WIPES",
};

/**
 * Look up the actual shade folder name for a given Mars product name.
 * Returns the folder name string, or null if not found.
 */
export function getMarsShadeFolder(productName) {
  if (!productName) return null;
  const key = normalizeShadeLookup(productName);

  // 1. Exact key match
  if (MARS_SHADE_FOLDER_MAP[key]) return MARS_SHADE_FOLDER_MAP[key];

  // 2. Partial key match — iterate map for best overlap
  let bestFolder = null;
  let bestScore = 0;

  for (const [mapKey, folder] of Object.entries(MARS_SHADE_FOLDER_MAP)) {
    if (key === mapKey) return folder; // already handled above, belt-and-suspenders
    if (key.includes(mapKey) || mapKey.includes(key)) {
      const score = Math.min(key.length, mapKey.length);
      if (score > bestScore) {
        bestScore = score;
        bestFolder = folder;
      }
    }
  }

  return bestFolder;
}

export default MARS_SHADE_FOLDER_MAP;
