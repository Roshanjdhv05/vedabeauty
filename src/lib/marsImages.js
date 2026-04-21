/**
 * Mars brand local image resolver
 *
 * Maps exact Supabase product names → local public/mars/ image paths.
 * Files with (1)(2)(3) suffixes are grouped into one product's gallery array.
 *
 * Usage:  getMarsImages("Artistry Liquid Foundation")
 * Returns: ["/mars/ARTISTRY LIQUID FOUNDATION (1).webp", "/mars/ARTISTRY LIQUID FOUNDATION (2).webp"]
 */

// Encode special chars that appear in filenames (spaces, parens, apostrophes, &, etc.)
const m = (f) => `/mars/${encodeURIComponent(f)}`;

// Direct name → [image paths] mapping
// Key = exact product name from Supabase (case-insensitive match applied at lookup time)
const MARS_IMAGE_MAP = {
  // ─── LIPS ────────────────────────────────────────────────────────────────
  "lipstick pencil":                          [m("lipstick_pencil.webp")],
  "lip crayon":                               [m("lip_crayon.webp")],
  "plush velvet lipstick":                    [m("plush_velvet_lipstick.webp")],
  "creamy matte lipstick":                    [m("creamy_matte_lipstick.webp")],
  "3 matte box":                              [m("3_matte_box.webp")],
  "cloud kiss lipstick":                      [m("cloud_kiss_lipstick.webp"), m("cloudkiss11.webp"), m("cloudkiss12.webp"), m("CLOUD KISS1 (2).webp")],
  "edge of desire lip liner":                 [m("edgeofdesire.webp")],
  "edge of desire lip liner-holder (10 pcs)": [m("edgeofdesireliplinerholder.webp")],
  "drip lip mist":                            [m("driplipmist.webp")],
  "infinity lip palette":                     [m("infinitylippalette.webp")],
  "love track":                               [m("lovetrack.webp")],
  "non transfer butter stick":                [m("nontransferbutterstick.webp")],
  "silk matte lipstick":                      [m("silkmattelipstick.webp")],
  "super stay lipstick":                      [m("superstaylipstick.webp")],
  "cinemagic non transfer lip gloss":         [m("cinemagicnontransferlipgloss.webp"), m("CINEMAGICNONTRANSFERLIPGLOSS copy.webp")],
  "colorbum liquid lipstick":                 [m("colorbum_liquid_lipstick.webp")],
  "matte lip color":                          [m("mattelipcolor.webp")],
  "popstar liquid mousse lipstick":           [m("popstarliquidmousselipstick.webp")],
  "matte muse lipstick":                      [m("mattemuselipstick1.webp"), m("mattemuselipstick2.webp")],
  "queen of mattes":                          [m("queenofmattes.webp")],
  "lip lollies lip balm":                     [m("liplollieslipbalm1.webp"), m("liplollieslipbalm2.webp")],
  "hydratint balm":                           [m("hydratintbalm.webp")],
  "full of water lip balm":                   [m("FULLOFWATERLIPBALM (2).webp")],
  "aqua splash lip balm":                     [m("aqua_splash_lip_balm.webp")],
  "click-stick gloss lip balm":               [m("CLICK-STICKGLOSSLIPBALM (1).webp"), m("CLICK-STICKGLOSSLIPBALM (2).webp")],
  "lippy top lip gel":                        [m("LIPPYTOPLIPGEL (2).webp")],
  "clear quartz lip gloss":                   [m("CLEARQUARTZLIPGLOSS.webp")],
  "candylocious lip gloss":                   [m("candylocious_lip_gloss.webp"), m("MARSCANDYLICIOUSLIPGLOSS (2).webp"), m("MARSCANDYLICIOUSLIPGLOSS (3).webp"), m("MARSCANDYLICIOUSLIPGLOSS (4).webp")],
  "color changing lip oil":                   [m("color_changing_lip_oil.webp")],

  // ─── EYES ────────────────────────────────────────────────────────────────
  "micro precision brow pencil":              [m("MICROPRECISIONBROWPENCIL.webp")],
  "oh brow eyebrow pencil":                   [m("OH BROWEYEBROWPENCIL.webp")],
  "eyebrow powder":                           [m("EYEBROWPOWDER.webp")],
  "brow better eyebrow pencil":               [m("BROWBETTEREYEBROWPENCIL.webp")],
  "eyebrow pencil":                           [m("EYEBROWPENCIL.webp")],
  "#eyegotthis liquid eyeliner":              [m("EYEGOTTHISLIQUIDEYELINER.webp")],
  "pen eyeliner":                             [m("pen_eyeliner.webp")],
  "free flow eyeliner":                       [m("FREEFLOWEYELINER.webp")],
  "hyper smooth eyeliner":                    [m("HYPERSMOOTHEYELINER.webp")],
  "ink black eyeliner":                       [m("INKBLACKEYELINER.webp")],
  "so black liquid eyeliner":                 [m("SO BLACKLIQUIDEYELINER (1).webp"), m("SO BLACKLIQUIDEYELINER (2).webp")],
  "sky liner liquid matte eyeliner":          [m("SKYLINERLIQUIDMATTEEYELINER.webp")],
  "city strokes liquid eyeliner":             [m("CITYSTROKESLIQUIDEYELINER (1).webp"), m("CITYSTROKESLIQUIDEYELINER (2).webp")],
  "social black eyeliner with brush tip":     [m("SOCIALBLACKEYELINERWITHBRUSHTIP (1).webp"), m("SOCIALBLACKEYELINERWITHBRUSHTIP (2).webp")],
  "twinkle wink glitter eyeliner":            [m("TWINKLEWINKGLITTEREYELINER.webp")],
  "northern lights pencil eyeliner":          [m("NORTHERNLIGHTSPENCILEYELINER (1).webp"), m("NORTHERNLIGHTSPENCILEYELINER (2).webp")],
  "northern liquid eyeliner":                 [m("northern_liquid_eyeliner.webp"), m("NORTHERNLIGHTSLIQUIDEYELINER (2).webp"), m("NORTHERNLIGHTSLIQUIDEYELINER (3).webp")],
  "eye love multi pods":                      [m("EYELOVEMULTIPODS.webp")],
  "hue gel eyeliner":                         [m("HUEGELEYELINER.webp")],
  "fabulash mascara":                         [m("fabulash_mascara.webp"), m("FABULASH EYELASHES.webp")],
  "forget falsies mascara":                   [m("FORGETFALSIESMASCARA.webp")],
  "silk lengthening mascara":                 [m("SILKLENGTHENINGMASCARA.webp")],
  "double trouble mascara":                   [m("DOUBLETROUBLEMASCARA.webp")],
  "kohl of fame kajal":                       [m("KOHL OFFAMEKAJAL.webp"), m("KOHLOFFAMEKAJAL(2).webp")],
  "wswb kajal":                               [m("wswb_kajal.webp")],
  "ziddi kajal":                              [m("ZIDDIKAJAL.webp")],
  "wswb smooth glide kajal":                  [m("WSWBSMOOTHGLIDEKAJAL.webp")],
  "glitter liquid eyeshadow":                 [m("GLITTERLIQUIDEYESHADOW.webp")],
  "northern lights liquid eyeshadow":         [m("NORTHERNLIGHTSLIQUIDEYESHADOW.webp")],
  "northern lights in a pan":                 [m("NORTHERNLIGHTSINAPAN.webp")],
  "starlit pot":                              [m("STARLITPOT.webp")],
  "back to basics palette":                   [m("BACKTOBASICSPALETTE.webp")],
  "blooming eyeshadow palette":               [m("BLOOMINGEYESHADOWPALETTE.webp")],
  "dance of joy eyeshadow palette":           [m("DANCEOFJOYEYESHADOWPALETTE.webp")],
  "glitter palette":                          [m("glitter_palette.webp")],
  "fantasy 15 eyeshadow palette":             [m("FANTASY15EYESHADOWPALETTE.webp")],
  "36 color eyeshadow palette":               [m("36_color_eyeshadow_palette.webp")],
  "artist's arsenal eyeshadow palette":       [m("ARTIST’SARSENALEYESHADOWPALETTE.webp")],
  "eyes can kill eyeshadow palette":          [m("EYESCANKILLEYESHADOWPALETTE.webp")],
  "sitara metallic eyeshadow palette":        [m("SITARAMETALLICEYESHADOWPALETTE (1).webp"), m("SITARAMETALLICEYESHADOWPALETTE (2).webp")],
  "all i need makeup kit":                    [m("all_i_need_makeup_kit.webp")],
  "eye enchanted dual ended brush set":       [m("EYEENCHANTED DUAL ENDED BRUSH SET.webp")],
  "fabulash eyelashes":                       [m("FABULASH EYELASHES.webp")],
  "highlashes eyelashes":                     [m("HIGHLASHES EYELASHES.webp")],

  // ─── KITS ────────────────────────────────────────────────────────────────
  "city paradise makeup kit - delhi":         [m("city_paradise_delhi.webp"),     m("THECITYPARADISE (9).webp"),  m("THECITYPARADISE (10).webp")],
  "city paradise makeup kit - mumbai":        [m("city_paradise_mumbai.webp"),    m("THECITYPARADISE (11).webp"), m("THECITYPARADISE (12).webp")],
  "city paradise makeup kit - kolkata":       [m("city_paradise_kolkata.webp"),   m("THECITYPARADISE (13).webp")],
  "city paradise makeup kit - chandigarh":    [m("city_paradise_chandigarh.webp"),m("THECITYPARADISE (14).webp")],
  "city paradise makeup kit - bangalore":     [m("city_paradise_bangalore.webp"), m("THECITYPARADISE (15).webp")],
  "city paradise makeup kit - lucknow":       [m("city_paradise_lucknow.webp")],
  "city paradise makeup kit - ahmedabad":     [m("city_paradise_ahmedabad.webp")],
  "city paradise makeup kit - jaipur":        [m("city_paradise_jaipur.webp")],
  "poco makeup":                              [m("POCO MAKEUP.webp")],
  "trio treat":                               [m("TRIOTREAT (2).webp"), m("TRIOTREAT (3).webp"), m("TRIOTREAT (4).webp")],

  // ─── FACE ────────────────────────────────────────────────────────────────
  "pore cure primer":                         [m("PORE CURE PRIMER.webp")],
  "it's glow o'clock primer":                 [m("its_glow_oclock_primer.webp")],
  "hydra glow primer":                        [m("HYDRA GLOW PRIMER.webp")],
  "face primer":                              [m("face_primer.webp"), m("MARS FACE PRIMER (2).webp"), m("MARS FACE PRIMER (3).webp")],
  "take a glow primer":                       [m("TAKE A GLOW PRIMER.webp")],
  "zero pore perfection primer":              [m("ZERO PORE PERFECTION PRIMER.webp")],
  "face primer & makeup fixer":               [m("FACE PRIMER & MAKEUP FIXER.webp")],
  "bloom bb cream":                           [m("BLOOM BB CREAM (1).webp"), m("BLOOM BB CREAM (2).webp")],
  "bb cream":                                 [m("BB CREAM (1).webp"), m("BB CREAM (2).webp")],
  "miracle bb foundation":                    [m("MIRACLE BB FOUNDATION.webp")],
  "matte mousse foundation":                  [m("MATTE MOUSSE FOUNDATION.webp")],
  "2 in 1 super stay foundation":             [m("2_in_1_super_stay_foundation.webp")],
  "the gold waves foundation":                [m("THE GOLD WAVES FOUNDATION.webp")],
  "matte maniac foundation":                  [m("MATTE MANIAC FOUNDATION.webp")],
  "bb cream foundation":                      [m("BB CREAM FOUNDATION.webp")],
  "high coverage foundation":                 [m("HIGH COVERAGEFOUNDATION.webp")],
  "mist foundation":                          [m("mist_foundation.webp")],
  "artistry liquid foundation":               [m("ARTISTRY LIQUID FOUNDATION (1).webp"), m("ARTISTRY LIQUID FOUNDATION (2).webp")],
  "god's glow illuminator":                   [m("gods_glow_illuminator.webp"), m("GOD’S  LOW ILLUMINATOR (2).webp"), m("GOD’S  LOW ILLUMINATOR (3).webp")],
  "zero blend foundation":                    [m("ZERO BLENDFOUNDATION.webp")],
  "cancel liquid concealer":                  [m("CANCEL LIQUID CONCEALER (1).webp"), m("CANCEL LIQUID CONCEALER (2).webp")],
  "color changing foundation":                [m("COLOR CHANGING FOUNDATION.webp")],
  "wonder cover":                             [m("wonder_cover.webp")],
  "cover rangers":                            [m("cover_rangers.webp"), m("MARS COVER RANGERS (2).webp")],
  "fantasy face palette":                     [m("FANTASY FACE PALETTE.webp"), m("MARS FANTASY FACE PALETTE.webp")],
  "contour palette":                          [m("contour_palette.webp")],
  "glowzilla face palette":                   [m("GLOWZILLA FACE PALETTE.webp")],
  "glow fly liquid highlighter":              [m("GLOW FLY LIQUID HIGHLIGHTER.webp")],
  "illuminati base":                          [m("ILLUMINATI BASE.webp")],
  "flush of love blush":                      [m("FLUSH OF LOVE BLUSH.webp")],
  "dark magic blush":                         [m("DARK MAGIC BLUSH.webp")],
  "blush hour liquid blush":                  [m("BLUSH HOUR LIQUID BLUSH.webp")],
  "sugar rush liquid blusher":                [m("SUGAR RUSH LIQUID BLUSHER (1).webp"), m("SUGAR RUSH LIQUID BLUSHER (2).webp")],
  "lip & cheek tint":                         [m("LIP & CHEEK TINT.webp")],
  "rivaaz sindoor":                           [m("RIVAAZ SINDOOR.webp")],
  "mistique bb powder":                       [m("MISTIQUE BB POWDER.webp")],
  "silky skin powder":                        [m("SILKY SKIN POWDER.webp")],
  "born to bake setting powder":              [m("BORN TO BAKE SETTING POWDER.webp")],
  "zero oil compact":                         [m("ZERO OIL COMPACT.webp")],
  "wonder powder":                            [m("wonder_powder.webp")],
  "seal the deal makeup fixer":               [m("SEAL THE DEAL MAKEUP FIXER.webp")],
  "makeup fixer spray":                       [m("MAKEUP FIXER SPRAY.webp")],
  "rose essence makeup fixer":                [m("ROSE ESSENCE MAKEUP FIXER (1).webp"), m("ROSE ESSENCE MAKEUP FIXER (2).webp")],
  "skin perfecting powder":                   [m("SKIN PERFECTING POWDER.webp")],
  "magic compact powder":                     [m("MAGIC COMPACT POWDER.webp")],
  "airbrush powder":                          [m("airbrush_powder.webp")],
  "soft shiny skin powder":                   [m("SOFT SHINY SKIN POWDER.webp")],
  "sweet oil powder":                         [m("SWEET OIL POWDER.webp")],
  "hd compact powder":                        [m("hd_compact_powder.webp")],
  "trend setting powder":                     [m("TREND SETTING POWDER.webp")],
  "oil blotter gel compact":                  [m("OIL BLOTTER GEL COMPACT.webp")],

  // ─── NAILS ───────────────────────────────────────────────────────────────
  "color bomb nail paint":                    [m("COLOR BOMB NAIL PAINT (1).webp"), m("COLOR BOMB NAIL PAINT (2).webp")],
  "euro nails paint":                         [m("EURO NAILS PAINT.webp")],
  "cosmic hues paint":                        [m("COSMIC HUES PAINT.webp")],

  // ─── SKINCARE / REMOVERS ─────────────────────────────────────────────────
  "mr remover":                               [m("MR REMOVER.webp")],
  "wet wipes":                                [m("wet_wipes.webp"), m("MARSWET WIPES (2).webp"), m("MARSWET WIPES (3).webp"), m("MARSWET WIPES (4).webp")],
  "makeup remover wipes":                     [m("makeup_remover_wipes.webp"), m("MAKEUP MELTING MICROFIBER WIPES.webp")],
  "good wipes":                               [m("good_wipes.webp"), m("GOOD WIPES WET WIPES (2).webp"), m("GOOD WIPES WET WIPES (3).webp")],
  "miss wipeout nail polish remover":         [m("MISS WIPEOUT NAIL POLISH REMOVER.webp")],
  "boring cleaner pad":                       [m("BORING CLEANER PAD.webp")],
  "makeup melting microfiber wipes":          [m("MAKEUP MELTING MICROFIBER WIPES.webp")],

  // ─── TOOLS & BRUSHES ─────────────────────────────────────────────────────
  "artist's arsenal makeup brush set":        [m("ARTIST’S ARSENAL MAKEUP BRUSH.webp"), m("ARTIST’S ARSENAL FOUNDATION BRUSH.webp"), m("ARTIST’S ARSENAL POWDER BRUSH.webp")],
  "tools of titan brush set":                 [m("TOOLS OF TITAN BRUSH SET.webp"), m("tools_of_titan_brush_set_holder.webp")],
  "professional brush set":                   [m("professional_brush_set.webp")],
  "4 in 1 travel brush":                      [m("4 IN 1 TRAVEL BRUSH (1).webp"), m("4 IN 1 TRAVEL BRUSH (2).webp")],
  "penta perfect 5-brush set":                [m("PENTA PERFECT 5-BRUSH SET (1).webp"), m("PENTA PERFECT 5-BRUSH SET (2).webp"), m("PENTA PERFECT 5-BRUSH SET (3).webp")],
  "pop retractable brush":                    [m("POP RETRACTABLE BRUSH.webp")],
  "flat eyeshadow brush":                     [m("FLAT EYESHADOW BRUSH.webp")],
  "big eyeshadow blending brush":             [m("BIG EYESHADOW BLENDING BRUSH.webp")],
  "small eyeshadow blending brush":           [m("SMALL EYESHADOW BLENDING BRUSH.webp")],
  "artist's precision eye brush":             [m("ARTIST’S PRECISION EYE BRUSH (1).webp"), m("ARTIST’S PRECISION EYE BRUSH (2).webp")],
  "artist's arsenal angled brush with spoolie": [m("ARTIST’S ARSENAL ANGLED BRUSH WITH SPOOLIE (1).webp"), m("ARTIST’S ARSENAL ANGLED BRUSH WITH SPOOLIE (2).webp")],
  "artist's arsenal flat crease brush":       [m("ARTIST’S ARSENAL FLAT CREASE BRUSH (1).webp"), m("ARTIST’S ARSENAL FLAT CREASE BRUSH (2).webp")],
  "artist's arsenal eyeliner brush":          [m("ARTIST’S ARSENAL EYELINER BRUSH (1).webp"), m("ARTIST’S ARSENAL EYELINER BRUSH (2).webp")],
  "artist's arsenal pencil brush":            [m("ARTIST’S ARSENAL PENCIL BRUSH (1).webp"), m("ARTIST’S ARSENAL PENCIL BRUSH (2).webp")],
  "artist's arsenal blush brush":             [m("ARTIST’S ARSENAL BLUSH BRUSH (1).webp"), m("ARTIST’S ARSENAL BLUSH BRUSH (2).webp")],
  "artist's arsenal bronzer brush":           [m("ARTIST’S ARSENAL BRONZER BRUSH.webp")],
  "artist's arsenal dense highlighter brush": [m("ARTIST’S ARSENAL DENSE HIGHLIGHTER BRUSH (1).webp"), m("ARTIST’S ARSENAL DENSE HIGHLIGHTER BRUSH (2).webp")],
  "artist's arsenal fan brush":               [m("ARTIST’S ARSENAL FAN BRUSH (1).webp"), m("ARTIST’S ARSENAL FAN BRUSH (2).webp")],
  "artist's arsenal small powder brush":      [m("ARTIST’S ARSENAL SMALL POWDER BRUSH (1).webp"), m("ARTIST’S ARSENAL SMALL POWDER BRUSH (2).webp")],
  "artist's arsenal stippling brush":         [m("ARTIST’S ARSENAL STIPPLING BRUSH (1).webp"), m("ARTIST’S ARSENAL STIPPLING BRUSH (2).webp")],
  "artist's flat foundation brush":           [m("ARTIST’S FLAT FOUNDATION BRUSH (1).webp"), m("ARTIST’S FLAT FOUNDATION BRUSH (2).webp")],
  "artist's angular buffing brush":           [m("ARTIST’S ANGULAR BUFFING BRUSH (1).webp"), m("ARTIST’S ANGULAR BUFFING BRUSH (2).webp")],

  // ─── SPONGES ─────────────────────────────────────────────────────────────
  "master blender":                           [m("MASTER BLENDER.webp")],
  "wonder blender":                           [m("WONDER BLENDER.webp")],
  "microfiber blender":                       [m("MICROFIBER BLENDER (1).webp"), m("MICROFIBER BLENDER (2).webp"), m("MICROFIBER BLENDER (3).webp")],
  "beauty blender":                           [m("BEAUTY BLENDER.webp")],
  "pizza puffs (pack of 2)":                  [m("PIZZA PUFFS (PACK OF 2).webp")],
  "puffect puff (pack of 2)":                 [m("PUFFECT  PUFF (PACK OF 2).webp")],

  // ─── ACCESSORIES ─────────────────────────────────────────────────────────
  "makeup mirror":                            [m("MAKEUP MIRROR (1).webp"), m("MAKEUP MIRROR (2).webp")],
  "cosmocandy bag":                           [m("COSMOCANDY BAG.webp")],
  "sharpener":                                [m("sharpener.webp"), m("MARS SHARPNER (2).webp")],
  "makeup pouch":                             [m("makeup_pouch.webp"), m("MARS MAKEUP POUCH (2).webp"), m("MARS MAKEUP POUCH (3).webp")],
  "vanity bag":                               [m("vanity_bag.webp")],
  "ultra thin foundation brush":              [m("ultra_thin_foundation_brush.webp"), m("ARTIST’S ULTRA THIN FOUNDATION BRUSH (2).webp")],
  "wonder fixer":                            [m("wonder_fixer.webp")],
  "artist's arsenal foundation brush":        [m("ARTIST’S ARSENAL FOUNDATION BRUSH.webp")],
  "artist's arsenal powder brush":            [m("ARTIST’S ARSENAL POWDER BRUSH.webp")],
  "mesmereyes eyeshadow palette":             [m("BLOOMINGEYESHADOWPALETTE.webp")], // Fallback to blooming if mesmereyes is missing
  "face primer and makeup fixer":             [m("face_primer_and_makeup_fixer.webp")],
  "lip and cheek tint":                       [m("lip_and_cheek_tint.webp")],
};

/**
 * Lookup local Mars images by product name.
 * Returns array of public paths, or [] if no match.
 */
export function getMarsImages(productName) {
  if (!productName) return [];

  // Normalize name: lowercase, trim, convert curly apostrophes to straight, hyphens to spaces, and & to 'and'
  const normalize = (s) => s.toLowerCase().trim()
    .replace(/’/g, "'")
    .replace(/-/g, ' ')
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' '); // collapse extra spaces
  const key = normalize(productName);

  // 1. Exact match
  if (MARS_IMAGE_MAP[key]) return MARS_IMAGE_MAP[key];

  // 2. Partial match — product name starts with a known key OR key starts with product name
  // Also normalize keys in the map for comparison
  const partialKey = Object.keys(MARS_IMAGE_MAP).find(
    (k) => {
      const normalizedK = normalize(k);
      return key.startsWith(normalizedK) || normalizedK.startsWith(key) || key.includes(normalizedK) || normalizedK.includes(key);
    }
  );
  if (partialKey) return MARS_IMAGE_MAP[partialKey];

  return [];
}

export default MARS_IMAGE_MAP;
