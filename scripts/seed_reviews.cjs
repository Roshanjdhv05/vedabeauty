const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manual .env parsing
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = fs.readFileSync(envPath, 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) acc[key.trim()] = value.trim();
    return acc;
  }, {});

const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseKey = envConfig.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const NAMES = [
  'Ananya Sharma', 'Priyanka Chopra', 'Sneha Reddy', 'Ishita Iyer', 'Kavita Singh',
  'Megha Kapoor', 'Riya Malhotra', 'Shreya Ghoshal', 'Tanvi Desai', 'Vidya Balan',
  'Aditi Rao', 'Deepa Nair', 'Esha Gupta', 'Fatima Sheikh', 'Gauri Khan',
  'Kiara Advani', 'Mansi Joshi', 'Neha Kakkar', 'Ojaswi Patel', 'Pooja Hegde',
  'Rashmi Sharma', 'Sanya Malhotra', 'Tara Sutaria', 'Urfi Javed', 'Zoya Akhtar'
];

const REVIEWS = [
  { rating: 5, comment: "Amazing product! My skin feels so soft and glowing." },
  { rating: 5, comment: "The color is perfect for my skin tone. Highly recommended to all my friends." },
  { rating: 4, comment: "Fast delivery and great packaging. Veda Beauty never disappoints." },
  { rating: 5, comment: "I've been using this for a week and I can already see the difference in my routine." },
  { rating: 5, comment: "Best purchase ever! Totally worth the price. Will buy again." },
  { rating: 4, comment: "The texture is so smooth and it stays on for a long time without smudge." },
  { rating: 5, comment: "Very gentle on the skin, no irritation at all. Perfect for sensitive skin." },
  { rating: 5, comment: "Love the fragrance and the results. Veda Beauty is my new favorite." },
  { rating: 4, comment: "A must-have for every makeup kit! The quality is top-notch." },
  { rating: 5, comment: "Premium quality at wholesale prices. Very happy with the purchase." },
  { rating: 5, comment: "Absolutely love it! The packaging was so premium." },
  { rating: 4, comment: "Good product, does what it says. Fast shipping too." },
  { rating: 5, comment: "This has become my daily essential. Can't live without it now." },
  { rating: 5, comment: "Value for money indeed. Great quality for this price range." },
  { rating: 4, comment: "The pigment is very rich. Just a small amount is enough." }
];

async function seedReviews() {
  console.log('Fetching products...');
  const { data: products, error: pError } = await supabase
    .from('products')
    .select('id');

  if (pError) {
    console.error('Error fetching products:', pError);
    return;
  }

  console.log(`Found ${products.length} products. Seeding 10 reviews for each...`);

  for (const product of products) {
    const productReviews = [];
    
    // Pick 10 unique combinations for each product
    const shuffledNames = [...NAMES].sort(() => 0.5 - Math.random());
    const shuffledReviews = [...REVIEWS].sort(() => 0.5 - Math.random());

    for (let i = 0; i < 10; i++) {
      const name = shuffledNames[i % NAMES.length];
      const reviewTemplate = shuffledReviews[i % REVIEWS.length];
      
      productReviews.push({
        product_id: product.id,
        user_name: name,
        rating: reviewTemplate.rating,
        comment: reviewTemplate.comment,
        is_verified: true,
        created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
      });
    }

    const { error: rError } = await supabase
      .from('product_reviews')
      .insert(productReviews);

    if (rError) {
      console.error(`Error seeding reviews for product ${product.id}:`, rError.message);
    } else {
      console.log(`Successfully seeded 10 reviews for product ${product.id}`);
    }
  }

  console.log('Seeding complete!');
}

seedReviews();
