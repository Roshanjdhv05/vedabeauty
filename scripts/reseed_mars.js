import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env file
const envPath = path.resolve(process.cwd(), '.env');
const env = fs.readFileSync(envPath, 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=');
  if (key && value) acc[key.trim()] = value.trim();
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const m = (f) => `/mars/${encodeURIComponent(f)}`;

const MARS_IMAGE_MAP = {
  "lipstick pencil":                          [m("lipstick_pencil.png")],
  "lip crayon":                               [m("lip_crayon.png")],
  "plush velvet lipstick":                    [m("plush_velvet_lipstick.png")],
  "creamy matte lipstick":                    [m("creamy_matte_lipstick.png")],
  "3 matte box":                              [m("3_matte_box.png")],
  "cloud kiss lipstick":                      [m("cloud_kiss_lipstick.png")],
  "edge of desire lip liner":                 [m("edgeofdesire.png")],
  "edge of desire lip liner-holder":          [m("edgeofdesireliplinerholder.png")], // simplified name
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
  "city paradise makeup kit - delhi":         [m("city_paradise_delhi.png")],
  "city paradise makeup kit - mumbai":        [m("city_paradise_mumbai.png")],
  "city paradise makeup kit - kolkata":       [m("city_paradise_kolkata.png")],
  "city paradise makeup kit - chandigarh":    [m("city_paradise_chandigarh.png")],
  "city paradise makeup kit - bangalore":     [m("city_paradise_bangalore.png")],
  "city paradise makeup kit - lucknow":       [m("city_paradise_lucknow.png")],
  "city paradise makeup kit - ahmedabad":     [m("city_paradise_ahmedabad.png")],
  "city paradise makeup kit - jaipur":        [m("city_paradise_jaipur.png")],
  "poco makeup":                              [m("POCO MAKEUP.png")],
  "trio treat":                               [m("TRIOTREAT (2).png")],
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
  "artist's arsenal makeup brush":            [m("ARTIST'S ARSENAL MAKEUP BRUSH.png")],
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
};

const productText = `LIPS
Lipstick Pencil: Rs. 599/- set
Lip Crayon: Rs. 279/-
Plush Velvet Lipstick: Rs. 199/-
Creamy Matte Lipstick: Rs. 199/-
3 Matte Box: Rs. 447/-
Cloud Kiss Lipstick: Rs. 499/-
Edge of Desire Lip Liner: Rs. 69/-
Edge of Desire Lip Liner-Holder: Rs. 790/- (10 pcs)
Drip Lip Mist: Rs. 299/-
Infinity Lip Palette: Rs. 379/-
Love Track: Rs. 299/-
Non Transfer Butter Stick: Rs. 549/-
Silk Matte Lipstick: Rs. 279/-
Poppins Lip Crayon: Rs. 329/-
Super Stay Lipstick: Rs. 279/-
Cinemagic Non Transfer Lip Gloss: Rs. 399/-
Colorbum Liquid Lipstick: Rs. 229/-
Matte Lip Color: Rs. 249/-
Popstar Liquid Mousse Lipstick: Rs. 249/-
Matte Muse Lipstick: Rs. 299/-
Queen of Mattes: Rs. 499/-
Lip Lollies Lip Balm: Rs. 229/-
Hydratint Balm: Rs. 229/-
Full of Water Lip Balm: Rs. 89/-
Aqua Splash Lip Balm: Rs. 149/-
Click-Stick Gloss Lip Balm: Rs. 349/-
Lippy Top Lip Gel: Rs. 199/-
Clear Quartz Lip Gloss: Rs. 199/-
Candylocious Lip Gloss: Rs. 249/-
Color Changing Lip Oil: Rs. 249/-

EYES
Micro Precision Brow Pencil: Rs. 149/-
Oh Brow Eyebrow Pencil: Rs. 229/-
Eyebrow Powder: Rs. 249/-
Brow Better Eyebrow Pencil: Rs. 69/-
Eyebrow Pencil: Rs. 59/-
#Eyegotthis Liquid Eyeliner: Rs. 199/-
Pen Eyeliner: Rs. 249/-
Free Flow Eyeliner: Rs. 229/-
Hyper Smooth Eyeliner: Rs. 199/-
Ink Black Eyeliner: Rs. 279/-
So Black Liquid Eyeliner: Rs. 149/-
Sky Liner Liquid Matte Eyeliner: Rs. 199/-
City Strokes Liquid Eyeliner: Rs. 179/-
Social Black Eyeliner with Brush Tip: Rs. 199/-
Twinkle Wink Glitter Eyeliner: Rs. 249/-
Northern Lights Pencil Eyeliner: Rs. 399/-
Northern Liquid Eyeliner: Rs. 499/-
Eye Love Multi Pods: Rs. 329/-
Hue Gel Eyeliner: Rs. 329/-
Fabulash Mascara: Rs. 249/-
Forget Falsies Mascara: Rs. 279/-
Silk Lengthening Mascara: Rs. 249/-
Double Trouble Mascara: Rs. 299/-
Kohl of Fame Kajal: Rs. 149/-
Wswb Kajal: Rs. 229/-
Ziddi Kajal: Rs. 279/-
Wswb Smooth Glide Kajal: Rs. 299/-
Glitter Liquid Eyeshadow: Rs. 279/-
Northern Lights Liquid Eyeshadow: Rs. 599/-
Northern Lights in a Pan: Rs. 499/-
Starlit Pot: Rs. 399/-
Back to Basics Palette: Rs. 299/-
Blooming Eyeshadow Palette: Rs. 399/-
Mesmereyes Eyeshadow Palette: Rs. 399/-
Dance of Joy Eyeshadow Palette: Rs. 299/-
Glitter Palette: Rs. 349/-
Fantasy 15 Eyeshadow Palette: Rs. 449/-
36 Color Eyeshadow Palette: Rs. 949/-
Artist’s Arsenal Eyeshadow Palette: Rs. 949/-
Eyes Can Kill Eyeshadow Palette: Rs. 1499/-
Sitara Metallic Eyeshadow Palette: Rs. 949/-
All I Need Makeup Kit: Rs. 399/-

FACE KITS
City Paradise Makeup Kit - Delhi: Rs. 499/-
City Paradise Makeup Kit - Mumbai: Rs. 499/-
City Paradise Makeup Kit - Kolkata: Rs. 499/-
City Paradise Makeup Kit - Chandigarh: Rs. 499/-
City Paradise Makeup Kit - Bangalore: Rs. 499/-
City Paradise Makeup Kit - Lucknow: Rs. 499/-
City Paradise Makeup Kit - Ahmedabad: Rs. 499/-
City Paradise Makeup Kit - Jaipur: Rs. 499/-
Poco Makeup: Rs. 349/-
Makeup Kit: Rs. 799/-
Trio Treat: Rs. 649/-

FACE
Pore Cure Primer: Rs. 329/-
It’s Glow O’Clock Primer: Rs. 399/-
Hydra Glow Primer: Rs. 349/-
Face Primer: Rs. 399/-
Take a Glow Primer: Rs. 449/-
Zero Pore Perfection Primer: Rs. 249/-
Face Primer & Makeup Fixer: Rs. 449/-
Bloom BB Cream: Rs. 249/-
BB Cream: Rs. 339/-
Miracle BB Foundation: Rs. 429/-
Matte Mousse Foundation: Rs. 429/-
2 in 1 Super Stay Foundation: Rs. 429/-
The Gold Waves Foundation: Rs. 319/-
Matte Maniac Foundation: Rs. 299/-
BB Cream Foundation: Rs. 429/-
High Coverage Foundation: Rs. 249/-
Mist Foundation: Rs. 429/-
Artistry Liquid Foundation: Rs. 899/-
God’s Glow Illuminator: Rs. 899/-
Zero Blend Foundation: Rs. 449/-
Cancel Liquid Concealer: Rs. 249/-
Color Changing Foundation: Rs. 499/-
Wonder Cover: Rs. 199/-
Cover Rangers: Rs. 599/-
Fantasy Face Palette: Rs. 349/-
Contour Palette: Rs. 429/-
Glowzilla Face Palette: Rs. 329/-
Glow Fly Liquid Highlighter: Rs. 399/-
Illuminati Base: Rs. 329/-
Flush of Love Blush: Rs. 299/-
Dark Magic Blush: Rs. 299/-
Blush Hour Liquid Blush: Rs. 299/-
Sugar Rush Liquid Blusher: Rs. 279/-
Lip & Cheek Tint: Rs. 299/-
Rivaaz Sindoor: Rs. 129/-
Mistique BB Powder: Rs. 310/-
Silky Skin Powder: Rs. 310/-
Skin Perfecting Powder: Rs. 310/-
Soft Shiny Skin Powder: Rs. 266/-
Airbrush Powder: Rs. 355/-
Sweet Oil Powder: Rs. 310/-
Magic Compact Powder: Rs. 248/-
Trend Setting Powder: Rs. 266/-
Born to Bake Setting Powder: Rs. 399/-
Zero Oil Compact: Rs. 310/-
Wonder Powder: Rs. 355/-
HD Compact Powder: Rs. 221/-
Oil Blotter Gel Compact: Rs. 355/-
Seal the Deal Makeup Fixer: Rs. 299/-
Makeup Fixer Spray: Rs. 349/-
Rose Essence Makeup Fixer: Rs. 349/-
Wonder Fixer: Rs. 449/-

NAILS
Color Bomb Nail Paint: Rs. 59/-
Euro Nails Paint: Rs. 69/-
Cosmic Hues Paint: Rs. 99/-

REMOVERS & WIPES
Mr Remover: Rs. 299/-
Wet Wipes: Rs. 79/-
Makeup Remover Wipes: Rs. 109/-
Good Wipes: Rs. 39/-
Miss Wipeout Nail Polish Remover: Rs. 75/-

TOOLS & BRUSHES
Artist’s Arsenal Makeup Brush: Rs. 1499/-
Tools of Titan Brush Set: Rs. 999/-
Tools of Titan Brush Set Holder: Rs. 1149/-
4 in 1 Travel Brush: Rs. 659/-
Professional Brush Set: Rs. 2699/-
Penta Perfect 5-Brush Set: Rs. 999/-
Eye Enchanted Dual-Ended Brush Set: Rs. 549/-
Pop Retractable Brush: Rs. 499/-
Artist’s Arsenal Bronzer Brush: Rs. 399/-
Artist’s Arsenal Powder Brush: Rs. 299/-
Artist’s Arsenal Foundation Brush: Rs. 349/-
Artist’s Arsenal Dense Highlighter Brush: Rs. 299/-
Artist’s Arsenal Blush Brush: Rs. 399/-
Artist’s Arsenal Fan Brush: Rs. 199/-
Artist’s Arsenal Stippling Brush: Rs. 399/-
Artist’s Arsenal Small Powder Brush: Rs. 249/-
Artist’s Flat Foundation Brush: Rs. 429/-
Artist’s Angular Buffing Brush: Rs. 299/-
Ultra Thin Foundation Brush: Rs. 249/-
Small Eyeshadow Blending Brush: Rs. 199/-
Big Eyeshadow Blending Brush: Rs. 199/-
Flat Eyeshadow Brush: Rs. 199/-
Artist’s Arsenal Pencil Brush: Rs. 199/-
Artist’s Arsenal Eyeliner Brush: Rs. 199/-
Artist’s Arsenal Flat Crease Brush: Rs. 199/-
Artist’s Arsenal Angled Brush with Spoolie: Rs. 199/-
Artist’s Precision Eye Brush: Rs. 199/-
Fabulash Eyelashes: Rs. 99/-
Highlashes Eyelashes: Rs. 349/-

SPONGES & BLENDERS
Master Blender: Rs. 129/-
Wonder Blender: Rs. 129/-
Microfiber Blender: Rs. 149/-
Beauty Blender: Rs. 299/-
Puffect Puff (Pack of 2): Rs. 129/-
Makeup Melting Microfiber Wipes: Rs. 129/-
Pizza Puffs (Pack of 2): Rs. 129/-

ACCESSORIES
Makeup Mirror: Rs. 299/-
Boring Cleaner Pad: Rs. 199/-
Cosmocandy Bag: Rs. 399/-
Sharpener: Rs. 69/-
Makeup Pouch: Rs. 549/-
Vanity Bag: Rs. 2799/-`;

async function seedMars() {
  try {
    console.log("--- STARTING MARS SEED ---");

    // 1. Get MARS brand ID if it exists
    const { data: brands } = await supabase.from('brands').select('id, name').ilike('name', '%MARS%').limit(1);
    const marsBrandId = brands && brands.length > 0 ? brands[0].id : null;
    const marsBrandName = brands && brands.length > 0 ? brands[0].name : "MARS";
    
    if (marsBrandId) {
      console.log("Linked to existing MARS brand:", marsBrandId, "with name:", marsBrandName);
    } else {
      console.log("Warning: MARS brand not found in brands table. Will be unlinked.");
    }

    const lines = productText.split('\n');
    let currentCategory = "General";
    const productsToInsert = [];

    for (const line of lines) {
      const cleanLine = line.trim();
      if (!cleanLine) continue;

      // Check if it's a category header
      if (!cleanLine.includes(':')) {
        currentCategory = cleanLine;
        continue;
      }

      // Parse product line
      // Format: "Product Name: Rs. XXX/- [optional text]"
      const [namePart, pricePart] = cleanLine.split(':');
      const name = namePart.trim();
      
      // Extract number from price part
      const priceMatch = pricePart.match(/Rs\.\s*(\d+)/i);
      if (!priceMatch) continue;
      
      const originalPrice = parseInt(priceMatch[1], 10);
      const discountedPrice = Math.round(originalPrice * 0.8); // 20% off

      const nameKey = name.toLowerCase();
      
      // Resolve Image URL
      let imageUrl = 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=800'; // Generic fallback instead of broken placeholder
      
      let imagePaths = MARS_IMAGE_MAP[nameKey];
      if (!imagePaths) {
        // Try partial match
        const partialKey = Object.keys(MARS_IMAGE_MAP).find(
          (k) => nameKey.startsWith(k) || k.startsWith(nameKey) || nameKey.includes(k) || k.includes(nameKey)
        );
        if (partialKey) {
          imagePaths = MARS_IMAGE_MAP[partialKey];
        }
      }

      if (imagePaths && imagePaths.length > 0) {
        imageUrl = imagePaths[0];
      }

      productsToInsert.push({
        name: name,
        description: `Official ${marsBrandName} ${currentCategory} product. Premium quality cosmetics.`,
        price: discountedPrice,
        category: currentCategory,
        image_url: imageUrl,
        brand_name: marsBrandName,
        brand_id: marsBrandId // Link to official brand immediately
      });
    }

    console.log("Parsed " + productsToInsert.length + " products. Inserting into database...");

    // Insert in batches of 50 to avoid RLS/payload limits
    const batchSize = 50;
    let successCount = 0;
    
    for (let i = 0; i < productsToInsert.length; i += batchSize) {
      const batch = productsToInsert.slice(i, i + batchSize);
      const { data, error } = await supabase.from('products').insert(batch).select('id');
      
      if (error) {
        console.error("Batch insert failed:", error);
      } else {
        successCount += data.length;
        console.log("Successfully inserted batch of " + data.length);
      }
    }

    console.log("\\nDONE! Inserted " + successCount + " products with 20% discount and brand link.");
    process.exit(0);
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}

seedMars();
