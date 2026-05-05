import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function cleanString(str) {
    return str.toUpperCase().replace(/[()]/g, '').replace(/[^A-Z0-9]/g, '').trim();
}

async function fixImages() {
    try {
        console.log('Fetching Insight brand ID...');
        const { data: brandData, error: brandError } = await supabase
            .from('brands')
            .select('id')
            .eq('name', 'Insight')
            .single();

        if (brandError) throw brandError;
        const brandId = brandData.id;

        console.log('Fetching products...');
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, name')
            .eq('brand_id', brandId);

        if (productsError) throw productsError;
        console.log(`Found ${products.length} products.`);

        const sourceDir = path.join(process.cwd(), 'public', 'brands', 'insight');
        const destDir = path.join(process.cwd(), 'public', 'insight');

        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        const files = fs.readdirSync(sourceDir);
        let matchCount = 0;

        for (const product of products) {
            const cleanProductName = cleanString(product.name);
            let bestMatch = null;
            let bestScore = -1;

            for (const file of files) {
                const fileNameWithoutExt = file.replace(/\.[^/.]+$/, "");
                const cleanFileName = cleanString(fileNameWithoutExt);

                if (cleanFileName === cleanProductName) {
                    bestMatch = file;
                    break;
                }
                
                // If one contains the other
                if (cleanProductName.includes(cleanFileName) || cleanFileName.includes(cleanProductName)) {
                    bestMatch = file;
                }
            }

            if (!bestMatch) {
                // Try a fuzzy match based on starting words
                const firstWordProduct = cleanProductName.substring(0, 5);
                for (const file of files) {
                    const cleanFileName = cleanString(file.replace(/\.[^/.]+$/, ""));
                    if (cleanFileName.startsWith(firstWordProduct) || cleanProductName.startsWith(cleanFileName.substring(0, 5))) {
                        // just an approximation
                    }
                }
            }

            if (bestMatch) {
                const ext = path.extname(bestMatch);
                // Sanitize newFileName to remove invalid Windows characters like colons
                const sanitizedProductName = product.name.replace(/[:*?"<>|]/g, '-');
                const newFileName = `${sanitizedProductName}${ext}`;
                const srcPath = path.join(sourceDir, bestMatch);
                const destPath = path.join(destDir, newFileName);
                
                // Copy the file
                fs.copyFileSync(srcPath, destPath);

                // Update DB
                const newImageUrl = `/insight/${newFileName}`;
                await supabase
                    .from('products')
                    .update({ image_url: newImageUrl })
                    .eq('id', product.id);

                console.log(`Matched: ${product.name} -> ${bestMatch}`);
                matchCount++;
            } else {
                console.log(`NO MATCH FOUND FOR: ${product.name}`);
            }
        }
        
        console.log(`\nSuccessfully matched and updated ${matchCount} out of ${products.length} products.`);

    } catch (error) {
        console.error('Error:', error);
    }
}

fixImages();
