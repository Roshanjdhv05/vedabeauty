
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parser for scripts
const envPath = path.resolve(process.cwd(), '.env');
const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
const env = envLines.reduce((acc, line) => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=');
  if (key && value) acc[key.trim()] = value.trim();
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const m = (f) => `/mars/${f}`;

const MARS_IMAGE_MAP = {
  "lipstick pencil":                          [m("lipstick_pencil.png")],
  "lip crayon":                               [m("lip_crayon.png")],
  "plush velvet lipstick":                    [m("plush_velvet_lipstick.png")],
  "creamy matte lipstick":                    [m("creamy_matte_lipstick.png")],
  "3 matte box":                              [m("3_matte_box.png")],
  "cloud kiss lipstick":                      [m("cloud_kiss_lipstick.png")],
  "edge of desire lip liner":                 [m("edgeofdesire.png")],
  "edge of desire lip liner-holder":          [m("edgeofdesireliplinerholder.png")],
  "drip lip mist":                            [m("driplipmist.png")],
  "infinity lip palette":                     [m("infinitylippalette.png")],
  "love track":                               [m("lovetrack.png")],
  "non transfer butter stick":                [m("nontransferbutterstick.png")],
  "silk matte lipstick":                      [m("silkmattelipstick.png")],
  "super stay lipstick":                      [m("superstaylipstick.png")],
  "cinemagic non transfer lip gloss":         [m("cinemagicnontransferlipgloss.png")],
  "colorbum liquid lipstick":                 [m("colorbum_liquid_lipstick.png")],
  "matte lip color":                          [m("mattelipcolor.png")],
  "popstar liquid mousse lipstick":           [m("popstarliquidmousselipstick.png")],
  "matte muse lipstick":                      [m("mattemuselipstick1.png")],
  "queen of mattes":                          [m("queenofmattes.png")],
  "lip lollies lip balm":                     [m("liplollieslipbalm1.png")],
  "hydratint balm":                           [m("hydratintbalm.png")],
  "full of water lip balm":                   [m("FULLOFWATERLIPBALM (2).png")],
  "aqua splash lip balm":                     [m("aqua_splash_lip_balm.png")],
  "click-stick gloss lip balm":               [m("CLICK-STICKGLOSSLIPBALM (1).png")],
  "lippy top lip gel":                        [m("LIPPYTOPLIPGEL (2).png")],
  "clear quartz lip gloss":                   [m("CLEARQUARTZLIPGLOSS.png")],
  "candylocious lip gloss":                   [m("candylocious_lip_gloss.png")],
  "color changing lip oil":                   [m("color_changing_lip_oil.png")],
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
  "so black liquid eyeliner":                 [m("SO BLACKLIQUIDEYELINER (1).png")],
  "sky liner liquid matte eyeliner":          [m("SKYLINERLIQUIDMATTEEYELINER.png")],
  "city strokes liquid eyeliner":             [m("CITYSTROKESLIQUIDEYELINER (1).png")],
  "social black eyeliner with brush tip":     [m("SOCIALBLACKEYELINERWITHBRUSHTIP (1).png")],
  "twinkle wink glitter eyeliner":            [m("TWINKLEWINKGLITTEREYELINER.png")],
  "northern lights pencil eyeliner":          [m("NORTHERNLIGHTSPENCILEYELINER (1).png")],
  "northern liquid eyeliner":                 [m("northern_liquid_eyeliner.png")],
  "eye love multi pods":                      [m("EYELOVEMULTIPODS.png")],
  "hue gel eyeliner":                         [m("HUEGELEYELINER.png")],
  "fabulash mascara":                         [m("fabulash_mascara.png")],
  "forget falsies mascara":                   [m("FORGETFALSIESMASCARA.png")],
  "silk lengthening mascara":                 [m("SILKLENGTHENINGMASCARA.png")],
  "double trouble mascara":                   [m("DOUBLETROUBLEMASCARA.png")],
  "kohl of fame kajal":                       [m("KOHL OFFAMEKAJAL.png")],
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
  "artist's arsenal eyeshadow palette":       [m("ARTIST'SARSENALEYESHADOWPALETTE.png")],
  "eyes can kill eyeshadow palette":          [m("EYESCANKILLEYESHADOWPALETTE.png")],
  "all i need makeup kit":                    [m("all_i_need_makeup_kit.png")],
  "fabulash eyelashes":                       [m("FABULASH EYELASHES.png")],
  "highlashes eyelashes":                     [m("HIGHLASHES EYELASHES.png")],
  "pore cure primer":                         [m("PORE CURE PRIMER.png")],
  "it's glow o'clock primer":                 [m("its_glow_oclock_primer.png")],
  "hydra glow primer":                        [m("HYDRA GLOW PRIMER.png")],
  "face primer":                              [m("face_primer.png")],
  "take a glow primer":                       [m("TAKE A GLOW PRIMER.png")],
  "zero pore perfection primer":              [m("ZERO PORE PERFECTION PRIMER.png")],
  "face primer & makeup fixer":               [m("FACE PRIMER & MAKEUP FIXER.png")],
  "bloom bb cream":                           [m("BLOOM BB CREAM (1).png")],
  "bb cream":                                 [m("BB CREAM (1).png")],
  "miracle bb foundation":                    [m("MIRACLE BB FOUNDATION.png")],
  "matte mousse foundation":                  [m("MATTE MOUSSE FOUNDATION.png")],
  "2 in 1 super stay foundation":             [m("2_in_1_super_stay_foundation.png")],
  "the gold waves foundation":                [m("THE GOLD WAVES FOUNDATION.png")],
  "matte maniac foundation":                  [m("MATTE MANIAC FOUNDATION.png")],
  "bb cream foundation":                      [m("BB CREAM FOUNDATION.png")],
  "high coverage foundation":                 [m("HIGH COVERAGEFOUNDATION.png")],
  "mist foundation":                          [m("mist_foundation.png")],
  "artistry liquid foundation":               [m("ARTISTRY LIQUID FOUNDATION (1).png")],
  "god's glow illuminator":                   [m("gods_glow_illuminator.png")],
  "zero blend foundation":                    [m("ZERO BLENDFOUNDATION.png")],
  "cancel liquid concealer":                  [m("CANCEL LIQUID CONCEALER (1).png")],
  "color changing foundation":                [m("COLOR CHANGING FOUNDATION.png")],
  "wonder cover":                             [m("wonder_cover.png")],
  "cover rangers":                            [m("cover_rangers.png")],
  "fantasy face palette":                     [m("FANTASY FACE PALETTE.png")],
  "contour palette":                          [m("contour_palette.png")],
  "glowzilla face palette":                   [m("GLOWZILLA FACE PALETTE.png")],
  "glow fly liquid highlighter":              [m("GLOW FLY LIQUID HIGHLIGHTER.png")],
  "illuminati base":                          [m("ILLUMINATI BASE.png")],
  "flush of love blush":                      [m("FLUSH OF LOVE BLUSH.png")],
  "dark magic blush":                         [m("DARK MAGIC BLUSH.png")],
  "blush hour liquid blush":                  [m("BLUSH HOUR LIQUID BLUSH.png")],
  "sugar rush liquid blusher":                [m("SUGAR RUSH LIQUID BLUSHER (1).png")],
  "lip & cheek tint":                         [m("LIP & CHEEK TINT.png")],
  "rivaaz sindoor":                           [m("RIVAAZ SINDOOR.png")],
  "mistique bb powder":                       [m("MISTIQUE BB POWDER.png")],
  "silky skin powder":                        [m("SILKY SKIN POWDER.png")],
  "born to bake setting powder":              [m("BORN TO BAKE SETTING POWDER.png")],
  "zero oil compact":                         [m("ZERO OIL COMPACT.png")],
  "wonder powder":                            [m("wonder_powder.png")],
  "seal the deal makeup fixer":               [m("SEAL THE DEAL MAKEUP FIXER.png")],
  "makeup fixer spray":                       [m("MAKEUP FIXER SPRAY.png")],
  "color bomb nail paint":                    [m("COLOR BOMB NAIL PAINT (1).png")],
  "euro nails paint":                         [m("EURO NAILS PAINT.png")],
  "cosmic hues paint":                        [m("COSMIC HUES PAINT.png")],
  "mr remover":                               [m("MR REMOVER.png")],
  "wet wipes":                                [m("wet_wipes.png")],
  "makeup remover wipes":                     [m("makeup_remover_wipes.png")],
  "good wipes":                               [m("good_wipes.png")],
  "miss wipeout nail polish remover":         [m("MISS WIPEOUT NAIL POLISH REMOVER.png")],
  "boring cleaner pad":                       [m("BORING CLEANER PAD.png")],
  "artist's arsenal makeup brush set":        [m("ARTIST'S ARSENAL MAKEUP BRUSH.png")],
  "tools of titan brush set":                 [m("TOOLS OF TITAN BRUSH SET.png")],
  "professional brush set":                   [m("professional_brush_set.png")],
  "4 in 1 travel brush":                      [m("4 IN 1 TRAVEL BRUSH (1).png")],
  "master blender":                           [m("MASTER BLENDER.png")],
  "wonder blender":                           [m("WONDER BLENDER.png")],
  "microfiber blender":                       [m("MICROFIBER BLENDER (1).png")],
  "beauty blender":                           [m("BEAUTY BLENDER.png")],
  "makeup mirror":                            [m("MAKEUP MIRROR (1).png")],
  "cosmocandy bag":                           [m("COSMOCANDY BAG.png")],
  "sharpener":                                [m("sharpener.png")],
  "makeup pouch":                             [m("makeup_pouch.png")],
  "vanity bag":                               [m("vanity_bag.png")],
  "flat eyeshadow brush":                     [m("FLAT EYESHADOW BRUSH.png")],
  "big eyeshadow blending brush":             [m("BIG EYESHADOW BLENDING BRUSH.png")],
  "small eyeshadow blending brush":           [m("SMALL EYESHADOW BLENDING BRUSH.png")],
  "artist's precision eye brush":             [m("ARTIST’S PRECISION EYE BRUSH (1).png")],
  "artist's arsenal angled brush with spoolie": [m("ARTIST’S ARSENAL ANGLED BRUSH WITH SPOOLIE (1).png")],
  "artist's arsenal flat crease brush":       [m("ARTIST’S ARSENAL FLAT CREASE BRUSH (1).png")],
  "artist's arsenal eyeliner brush":          [m("ARTIST’S ARSENAL EYELINER BRUSH (1).png")],
  "artist's arsenal pencil brush":            [m("ARTIST’S ARSENAL PENCIL BRUSH (1).png")],
  "artist's arsenal blush brush":             [m("ARTIST’S ARSENAL BLUSH BRUSH (1).png")],
  "artist's arsenal bronzer brush":           [m("ARTIST’S ARSENAL BRONZER BRUSH.png")],
  "artist's arsenal dense highlighter brush": [m("ARTIST’S ARSENAL DENSE HIGHLIGHTER BRUSH (1).png")],
  "artist's arsenal fan brush":               [m("ARTIST’S ARSENAL FAN BRUSH (1).png")],
  "artist's arsenal small powder brush":      [m("ARTIST’S ARSENAL SMALL POWDER BRUSH (1).png")],
  "artist's arsenal stippling brush":         [m("ARTIST’S ARSENAL STIPPLING BRUSH (1).png")],
  "artist's flat foundation brush":           [m("ARTIST’S FLAT FOUNDATION BRUSH (1).png")],
  "artist's angular buffing brush":           [m("ARTIST’S ANGULAR BUFFING BRUSH (1).png")],
};

async function updateImages() {
  try {
    console.log("--- STARTING COMPREHENSIVE MARS IMAGE UPDATE ---");

    // Fetch all products where brand_name starts with 'Mars'
    const { data: products, error: pError } = await supabase
      .from('products')
      .select('id, name, brand_name')
      .ilike('brand_name', 'Mars%');

    if (pError) throw pError;
    console.log(`Found ${products.length} Mars products to check.`);

    let updatedCount = 0;
    for (const product of products) {
      const nameKey = product.name.toLowerCase().trim();
      
      // Try exact match first
      let imagePaths = MARS_IMAGE_MAP[nameKey];
      
      // If no exact match, try partial match
      if (!imagePaths) {
        const partialKey = Object.keys(MARS_IMAGE_MAP).find(
          (k) => nameKey.startsWith(k) || k.startsWith(nameKey) || nameKey.includes(k) || k.includes(nameKey)
        );
        if (partialKey) {
          imagePaths = MARS_IMAGE_MAP[partialKey];
        }
      }

      if (imagePaths && imagePaths.length > 0) {
        const imageUrl = imagePaths[0];
        const { error: uError } = await supabase
          .from('products')
          .update({ image_url: imageUrl })
          .eq('id', product.id);

        if (uError) {
          console.error(`Failed to update ${product.name}:`, uError.message);
        } else {
          updatedCount++;
        }
      }
    }

    console.log(`Successfully updated ${updatedCount} products with correct local paths.`);
    console.log("--- UPDATE COMPLETE ---");
    process.exit(0);
  } catch (err) {
    console.error("Update failed:", err);
    process.exit(1);
  }
}

updateImages();
