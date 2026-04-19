/**
 * Mars brand local image resolver
 *
 * Maps exact Supabase product names → local public/mars/ image paths.
 * Files with (1)(2)(3) suffixes are grouped into one product's gallery array.
 *
 * Usage:  getMarsImages("Artistry Liquid Foundation")
 * Returns: ["/mars/ARTISTRY LIQUID FOUNDATION (1).png", "/mars/ARTISTRY LIQUID FOUNDATION (2).png"]
 */

// Encode special chars that appear in filenames (spaces, parens, apostrophes, &, etc.)
const m = (f) => `/mars/${encodeURIComponent(f)}`;

// Direct name → [image paths] mapping
// Key = exact product name from Supabase (case-insensitive match applied at lookup time)
const MARS_IMAGE_MAP = {
  // ─── LIPS ────────────────────────────────────────────────────────────────
  "lipstick pencil":                          [m("lipstick_pencil.png")],
  "lip crayon":                               [m("lip_crayon.png")],
  "plush velvet lipstick":                    [m("plush_velvet_lipstick.png")],
  "creamy matte lipstick":                    [m("creamy_matte_lipstick.png")],
  "3 matte box":                              [m("3_matte_box.png")],
  "cloud kiss lipstick":                      [m("cloud_kiss_lipstick.png"), m("cloudkiss11.png"), m("cloudkiss12.png"), m("CLOUD KISS1 (2).png")],
  "edge of desire lip liner":                 [m("edgeofdesire.png")],
  "edge of desire lip liner-holder (10 pcs)": [m("edgeofdesireliplinerholder.png")],
  "drip lip mist":                            [m("driplipmist.png")],
  "infinity lip palette":                     [m("infinitylippalette.png")],
  "love track":                               [m("lovetrack.png")],
  "non transfer butter stick":                [m("nontransferbutterstick.png")],
  "silk matte lipstick":                      [m("silkmattelipstick.png")],
  "super stay lipstick":                      [m("superstaylipstick.png")],
  "cinemagic non transfer lip gloss":         [m("cinemagicnontransferlipgloss.png"), m("CINEMAGICNONTRANSFERLIPGLOSS copy.png")],
  "colorbum liquid lipstick":                 [m("colorbum_liquid_lipstick.png")],
  "matte lip color":                          [m("mattelipcolor.png")],
  "popstar liquid mousse lipstick":           [m("popstarliquidmousselipstick.png")],
  "matte muse lipstick":                      [m("mattemuselipstick1.png"), m("mattemuselipstick2.png")],
  "queen of mattes":                          [m("queenofmattes.png")],
  "lip lollies lip balm":                     [m("liplollieslipbalm1.png"), m("liplollieslipbalm2.png")],
  "hydratint balm":                           [m("hydratintbalm.png")],
  "full of water lip balm":                   [m("FULLOFWATERLIPBALM (2).png")],
  "aqua splash lip balm":                     [m("aqua_splash_lip_balm.png")],
  "click-stick gloss lip balm":               [m("CLICK-STICKGLOSSLIPBALM (1).png"), m("CLICK-STICKGLOSSLIPBALM (2).png")],
  "lippy top lip gel":                        [m("LIPPYTOPLIPGEL (2).png")],
  "clear quartz lip gloss":                   [m("CLEARQUARTZLIPGLOSS.png")],
  "candylocious lip gloss":                   [m("candylocious_lip_gloss.png"), m("MARSCANDYLICIOUSLIPGLOSS (2).png"), m("MARSCANDYLICIOUSLIPGLOSS (3).png"), m("MARSCANDYLICIOUSLIPGLOSS (4).png")],
  "color changing lip oil":                   [m("color_changing_lip_oil.png")],

  // ─── EYES ────────────────────────────────────────────────────────────────
  "micro precision brow pencil":              [m("MICROPRECISIONBROWPENCIL.png")],
  "oh brow eyebrow pencil":                   [m("OH BROWEYEBROWPENCIL.png")],
  "eyebrow powder":                           [m("EYEBROWPOWDER.png")],
  "brow better eyebrow pencil":               [m("BROWBETTEREYEBROWPENCIL.png")],
  "eyebrow pencil":                           [m("EYEBROWPENCIL.png")],
  "#eyegotthis liquid eyeliner":              [m("EYEGOTTHISLIQUIDEYELINER.png")],
  "pen eyeliner":                             [m("pen_eyeliner.png")],
  "free flow eyeliner":                       [m("FREEFLOWEYELINER.png")],
  "hyper smooth eyeliner":                    [m("HYPERSMOOTHEYELINER.png")],
  "ink black eyeliner":                       [m("INKBLACKEYELINER.png")],
  "so black liquid eyeliner":                 [m("SO BLACKLIQUIDEYELINER (1).png"), m("SO BLACKLIQUIDEYELINER (2).png")],
  "sky liner liquid matte eyeliner":          [m("SKYLINERLIQUIDMATTEEYELINER.png")],
  "city strokes liquid eyeliner":             [m("CITYSTROKESLIQUIDEYELINER (1).png"), m("CITYSTROKESLIQUIDEYELINER (2).png")],
  "social black eyeliner with brush tip":     [m("SOCIALBLACKEYELINERWITHBRUSHTIP (1).png"), m("SOCIALBLACKEYELINERWITHBRUSHTIP (2).png")],
  "twinkle wink glitter eyeliner":            [m("TWINKLEWINKGLITTEREYELINER.png")],
  "northern lights pencil eyeliner":          [m("NORTHERNLIGHTSPENCILEYELINER (1).png"), m("NORTHERNLIGHTSPENCILEYELINER (2).png")],
  "northern liquid eyeliner":                 [m("northern_liquid_eyeliner.png"), m("NORTHERNLIGHTSLIQUIDEYELINER (2).png"), m("NORTHERNLIGHTSLIQUIDEYELINER (3).png")],
  "eye love multi pods":                      [m("EYELOVEMULTIPODS.png")],
  "hue gel eyeliner":                         [m("HUEGELEYELINER.png")],
  "fabulash mascara":                         [m("fabulash_mascara.png"), m("FABULASH EYELASHES.png")],
  "forget falsies mascara":                   [m("FORGETFALSIESMASCARA.png")],
  "silk lengthening mascara":                 [m("SILKLENGTHENINGMASCARA.png")],
  "double trouble mascara":                   [m("DOUBLETROUBLEMASCARA.png")],
  "kohl of fame kajal":                       [m("KOHL OFFAMEKAJAL.png"), m("KOHLOFFAMEKAJAL(2).png")],
  "wswb kajal":                               [m("wswb_kajal.png")],
  "ziddi kajal":                              [m("ZIDDIKAJAL.png")],
  "wswb smooth glide kajal":                  [m("WSWBSMOOTHGLIDEKAJAL.png")],
  "glitter liquid eyeshadow":                 [m("GLITTERLIQUIDEYESHADOW.png")],
  "northern lights liquid eyeshadow":         [m("NORTHERNLIGHTSLIQUIDEYESHADOW.png")],
  "northern lights in a pan":                 [m("NORTHERNLIGHTSINAPAN.png")],
  "starlit pot":                              [m("STARLITPOT.png")],
  "back to basics palette":                   [m("BACKTOBASICSPALETTE.png")],
  "blooming eyeshadow palette":               [m("BLOOMINGEYESHADOWPALETTE.png")],
  "dance of joy eyeshadow palette":           [m("DANCEOFJOYEYESHADOWPALETTE.png")],
  "glitter palette":                          [m("glitter_palette.png")],
  "fantasy 15 eyeshadow palette":             [m("FANTASY15EYESHADOWPALETTE.png")],
  "36 color eyeshadow palette":               [m("36_color_eyeshadow_palette.png")],
  "artist's arsenal eyeshadow palette":       [m("ARTIST’SARSENALEYESHADOWPALETTE.png")],
  "eyes can kill eyeshadow palette":          [m("EYESCANKILLEYESHADOWPALETTE.png")],
  "sitara metallic eyeshadow palette":        [m("SITARAMETALLICEYESHADOWPALETTE (1).png"), m("SITARAMETALLICEYESHADOWPALETTE (2).png")],
  "all i need makeup kit":                    [m("all_i_need_makeup_kit.png")],
  "eye enchanted dual ended brush set":       [m("EYEENCHANTED DUAL ENDED BRUSH SET.png")],
  "fabulash eyelashes":                       [m("FABULASH EYELASHES.png")],
  "highlashes eyelashes":                     [m("HIGHLASHES EYELASHES.png")],

  // ─── KITS ────────────────────────────────────────────────────────────────
  "city paradise makeup kit - delhi":         [m("city_paradise_delhi.png"),     m("THECITYPARADISE (9).png"),  m("THECITYPARADISE (10).png")],
  "city paradise makeup kit - mumbai":        [m("city_paradise_mumbai.png"),    m("THECITYPARADISE (11).png"), m("THECITYPARADISE (12).png")],
  "city paradise makeup kit - kolkata":       [m("city_paradise_kolkata.png"),   m("THECITYPARADISE (13).png")],
  "city paradise makeup kit - chandigarh":    [m("city_paradise_chandigarh.png"),m("THECITYPARADISE (14).png")],
  "city paradise makeup kit - bangalore":     [m("city_paradise_bangalore.png"), m("THECITYPARADISE (15).png")],
  "city paradise makeup kit - lucknow":       [m("city_paradise_lucknow.png")],
  "city paradise makeup kit - ahmedabad":     [m("city_paradise_ahmedabad.png")],
  "city paradise makeup kit - jaipur":        [m("city_paradise_jaipur.png")],
  "poco makeup":                              [m("POCO MAKEUP.png")],
  "trio treat":                               [m("TRIOTREAT (2).png"), m("TRIOTREAT (3).png"), m("TRIOTREAT (4).png")],

  // ─── FACE ────────────────────────────────────────────────────────────────
  "pore cure primer":                         [m("PORE CURE PRIMER.png")],
  "it's glow o'clock primer":                 [m("its_glow_oclock_primer.png")],
  "hydra glow primer":                        [m("HYDRA GLOW PRIMER.png")],
  "face primer":                              [m("face_primer.png"), m("MARS FACE PRIMER (2).png"), m("MARS FACE PRIMER (3).png")],
  "take a glow primer":                       [m("TAKE A GLOW PRIMER.png")],
  "zero pore perfection primer":              [m("ZERO PORE PERFECTION PRIMER.png")],
  "face primer & makeup fixer":               [m("FACE PRIMER & MAKEUP FIXER.png")],
  "bloom bb cream":                           [m("BLOOM BB CREAM (1).png"), m("BLOOM BB CREAM (2).png")],
  "bb cream":                                 [m("BB CREAM (1).png"), m("BB CREAM (2).png")],
  "miracle bb foundation":                    [m("MIRACLE BB FOUNDATION.png")],
  "matte mousse foundation":                  [m("MATTE MOUSSE FOUNDATION.png")],
  "2 in 1 super stay foundation":             [m("2_in_1_super_stay_foundation.png")],
  "the gold waves foundation":                [m("THE GOLD WAVES FOUNDATION.png")],
  "matte maniac foundation":                  [m("MATTE MANIAC FOUNDATION.png")],
  "bb cream foundation":                      [m("BB CREAM FOUNDATION.png")],
  "high coverage foundation":                 [m("HIGH COVERAGEFOUNDATION.png")],
  "mist foundation":                          [m("mist_foundation.png")],
  "artistry liquid foundation":               [m("ARTISTRY LIQUID FOUNDATION (1).png"), m("ARTISTRY LIQUID FOUNDATION (2).png")],
  "god's glow illuminator":                   [m("gods_glow_illuminator.png"), m("GOD’S  LOW ILLUMINATOR (2).png"), m("GOD’S  LOW ILLUMINATOR (3).png")],
  "zero blend foundation":                    [m("ZERO BLENDFOUNDATION.png")],
  "cancel liquid concealer":                  [m("CANCEL LIQUID CONCEALER (1).png"), m("CANCEL LIQUID CONCEALER (2).png")],
  "color changing foundation":                [m("COLOR CHANGING FOUNDATION.png")],
  "wonder cover":                             [m("wonder_cover.png")],
  "cover rangers":                            [m("cover_rangers.png"), m("MARS COVER RANGERS (2).png")],
  "fantasy face palette":                     [m("FANTASY FACE PALETTE.png"), m("MARS FANTASY FACE PALETTE.png")],
  "contour palette":                          [m("contour_palette.png")],
  "glowzilla face palette":                   [m("GLOWZILLA FACE PALETTE.png")],
  "glow fly liquid highlighter":              [m("GLOW FLY LIQUID HIGHLIGHTER.png")],
  "illuminati base":                          [m("ILLUMINATI BASE.png")],
  "flush of love blush":                      [m("FLUSH OF LOVE BLUSH.png")],
  "dark magic blush":                         [m("DARK MAGIC BLUSH.png")],
  "blush hour liquid blush":                  [m("BLUSH HOUR LIQUID BLUSH.png")],
  "sugar rush liquid blusher":                [m("SUGAR RUSH LIQUID BLUSHER (1).png"), m("SUGAR RUSH LIQUID BLUSHER (2).png")],
  "lip & cheek tint":                         [m("LIP & CHEEK TINT.png")],
  "rivaaz sindoor":                           [m("RIVAAZ SINDOOR.png")],
  "mistique bb powder":                       [m("MISTIQUE BB POWDER.png")],
  "silky skin powder":                        [m("SILKY SKIN POWDER.png")],
  "born to bake setting powder":              [m("BORN TO BAKE SETTING POWDER.png")],
  "zero oil compact":                         [m("ZERO OIL COMPACT.png")],
  "wonder powder":                            [m("wonder_powder.png")],
  "seal the deal makeup fixer":               [m("SEAL THE DEAL MAKEUP FIXER.png")],
  "makeup fixer spray":                       [m("MAKEUP FIXER SPRAY.png")],
  "rose essence makeup fixer":                [m("ROSE ESSENCE MAKEUP FIXER (1).png"), m("ROSE ESSENCE MAKEUP FIXER (2).png")],
  "skin perfecting powder":                   [m("SKIN PERFECTING POWDER.png")],
  "magic compact powder":                     [m("MAGIC COMPACT POWDER.png")],
  "airbrush powder":                          [m("airbrush_powder.png")],
  "soft shiny skin powder":                   [m("SOFT SHINY SKIN POWDER.png")],
  "sweet oil powder":                         [m("SWEET OIL POWDER.png")],
  "hd compact powder":                        [m("hd_compact_powder.png")],
  "trend setting powder":                     [m("TREND SETTING POWDER.png")],
  "oil blotter gel compact":                  [m("OIL BLOTTER GEL COMPACT.png")],

  // ─── NAILS ───────────────────────────────────────────────────────────────
  "color bomb nail paint":                    [m("COLOR BOMB NAIL PAINT (1).png"), m("COLOR BOMB NAIL PAINT (2).png")],
  "euro nails paint":                         [m("EURO NAILS PAINT.png")],
  "cosmic hues paint":                        [m("COSMIC HUES PAINT.png")],

  // ─── SKINCARE / REMOVERS ─────────────────────────────────────────────────
  "mr remover":                               [m("MR REMOVER.png")],
  "wet wipes":                                [m("wet_wipes.png"), m("MARSWET WIPES (2).png"), m("MARSWET WIPES (3).png"), m("MARSWET WIPES (4).png")],
  "makeup remover wipes":                     [m("makeup_remover_wipes.png"), m("MAKEUP MELTING MICROFIBER WIPES.png")],
  "good wipes":                               [m("good_wipes.png"), m("GOOD WIPES WET WIPES (2).png"), m("GOOD WIPES WET WIPES (3).png")],
  "miss wipeout nail polish remover":         [m("MISS WIPEOUT NAIL POLISH REMOVER.png")],
  "boring cleaner pad":                       [m("BORING CLEANER PAD.png")],
  "makeup melting microfiber wipes":          [m("MAKEUP MELTING MICROFIBER WIPES.png")],

  // ─── TOOLS & BRUSHES ─────────────────────────────────────────────────────
  "artist's arsenal makeup brush set":        [m("ARTIST’S ARSENAL MAKEUP BRUSH.png"), m("ARTIST’S ARSENAL FOUNDATION BRUSH.png"), m("ARTIST’S ARSENAL POWDER BRUSH.png")],
  "tools of titan brush set":                 [m("TOOLS OF TITAN BRUSH SET.png"), m("tools_of_titan_brush_set_holder.png")],
  "professional brush set":                   [m("professional_brush_set.png")],
  "4 in 1 travel brush":                      [m("4 IN 1 TRAVEL BRUSH (1).png"), m("4 IN 1 TRAVEL BRUSH (2).png")],
  "penta perfect 5-brush set":                [m("PENTA PERFECT 5-BRUSH SET (1).png"), m("PENTA PERFECT 5-BRUSH SET (2).png"), m("PENTA PERFECT 5-BRUSH SET (3).png")],
  "pop retractable brush":                    [m("POP RETRACTABLE BRUSH.png")],
  "flat eyeshadow brush":                     [m("FLAT EYESHADOW BRUSH.png")],
  "big eyeshadow blending brush":             [m("BIG EYESHADOW BLENDING BRUSH.png")],
  "small eyeshadow blending brush":           [m("SMALL EYESHADOW BLENDING BRUSH.png")],
  "artist's precision eye brush":             [m("ARTIST’S PRECISION EYE BRUSH (1).png"), m("ARTIST’S PRECISION EYE BRUSH (2).png")],
  "artist's arsenal angled brush with spoolie": [m("ARTIST’S ARSENAL ANGLED BRUSH WITH SPOOLIE (1).png"), m("ARTIST’S ARSENAL ANGLED BRUSH WITH SPOOLIE (2).png")],
  "artist's arsenal flat crease brush":       [m("ARTIST’S ARSENAL FLAT CREASE BRUSH (1).png"), m("ARTIST’S ARSENAL FLAT CREASE BRUSH (2).png")],
  "artist's arsenal eyeliner brush":          [m("ARTIST’S ARSENAL EYELINER BRUSH (1).png"), m("ARTIST’S ARSENAL EYELINER BRUSH (2).png")],
  "artist's arsenal pencil brush":            [m("ARTIST’S ARSENAL PENCIL BRUSH (1).png"), m("ARTIST’S ARSENAL PENCIL BRUSH (2).png")],
  "artist's arsenal blush brush":             [m("ARTIST’S ARSENAL BLUSH BRUSH (1).png"), m("ARTIST’S ARSENAL BLUSH BRUSH (2).png")],
  "artist's arsenal bronzer brush":           [m("ARTIST’S ARSENAL BRONZER BRUSH.png")],
  "artist's arsenal dense highlighter brush": [m("ARTIST’S ARSENAL DENSE HIGHLIGHTER BRUSH (1).png"), m("ARTIST’S ARSENAL DENSE HIGHLIGHTER BRUSH (2).png")],
  "artist's arsenal fan brush":               [m("ARTIST’S ARSENAL FAN BRUSH (1).png"), m("ARTIST’S ARSENAL FAN BRUSH (2).png")],
  "artist's arsenal small powder brush":      [m("ARTIST’S ARSENAL SMALL POWDER BRUSH (1).png"), m("ARTIST’S ARSENAL SMALL POWDER BRUSH (2).png")],
  "artist's arsenal stippling brush":         [m("ARTIST’S ARSENAL STIPPLING BRUSH (1).png"), m("ARTIST’S ARSENAL STIPPLING BRUSH (2).png")],
  "artist's flat foundation brush":           [m("ARTIST’S FLAT FOUNDATION BRUSH (1).png"), m("ARTIST’S FLAT FOUNDATION BRUSH (2).png")],
  "artist's angular buffing brush":           [m("ARTIST’S ANGULAR BUFFING BRUSH (1).png"), m("ARTIST’S ANGULAR BUFFING BRUSH (2).png")],

  // ─── SPONGES ─────────────────────────────────────────────────────────────
  "master blender":                           [m("MASTER BLENDER.png")],
  "wonder blender":                           [m("WONDER BLENDER.png")],
  "microfiber blender":                       [m("MICROFIBER BLENDER (1).png"), m("MICROFIBER BLENDER (2).png"), m("MICROFIBER BLENDER (3).png")],
  "beauty blender":                           [m("BEAUTY BLENDER.png")],
  "pizza puffs (pack of 2)":                  [m("PIZZA PUFFS (PACK OF 2).png")],
  "puffect puff (pack of 2)":                 [m("PUFFECT  PUFF (PACK OF 2).png")],

  // ─── ACCESSORIES ─────────────────────────────────────────────────────────
  "makeup mirror":                            [m("MAKEUP MIRROR (1).png"), m("MAKEUP MIRROR (2).png")],
  "cosmocandy bag":                           [m("COSMOCANDY BAG.png")],
  "sharpener":                                [m("sharpener.png"), m("MARS SHARPNER (2).png")],
  "makeup pouch":                             [m("makeup_pouch.png"), m("MARS MAKEUP POUCH (2).png"), m("MARS MAKEUP POUCH (3).png")],
  "vanity bag":                               [m("vanity_bag.png")],
  "ultra thin foundation brush":              [m("ultra_thin_foundation_brush.png"), m("ARTIST’S ULTRA THIN FOUNDATION BRUSH (2).png")],
};

/**
 * Lookup local Mars images by product name.
 * Returns array of public paths, or [] if no match.
 */
export function getMarsImages(productName) {
  if (!productName) return [];

  const key = productName.toLowerCase().trim();

  // 1. Exact match
  if (MARS_IMAGE_MAP[key]) return MARS_IMAGE_MAP[key];

  // 2. Partial match — product name starts with a known key OR key starts with product name
  const partialKey = Object.keys(MARS_IMAGE_MAP).find(
    (k) => key.startsWith(k) || k.startsWith(key) || key.includes(k) || k.includes(key)
  );
  if (partialKey) return MARS_IMAGE_MAP[partialKey];

  return [];
}

export default MARS_IMAGE_MAP;
