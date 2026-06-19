const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ─── DATA ────────────────────────────────────────────────────────────────────
const categories = [
  { id: 1, name: 'T-Shirts', slug: 'men-tshirts', icon: '👕', count: 240 },
  { id: 2, name: 'Shirts', slug: 'men-shirts', icon: '👔', count: 180 },
  { id: 3, name: 'Hoodies', slug: 'men-hoodies', icon: '🧥', count: 95 },
  { id: 4, name: 'Jeans', slug: 'men-jeans', icon: '👖', count: 120 },
  { id: 5, name: 'Joggers', slug: 'men-joggers', icon: '🩳', count: 80 },
  { id: 6, name: 'Shorts', slug: 'men-shorts', icon: '🩳', count: 60 },
  { id: 7, name: 'Jackets', slug: 'men-jackets', icon: '🧥', count: 45 },
  { id: 8, name: 'Caps', slug: 'caps', icon: '🧢', count: 70 },
  { id: 9, name: 'Women', slug: 'women', icon: '👗', count: 300 },
  { id: 10, name: 'Accessories', slug: 'accessories', icon: '⌚', count: 110 },
  { id: 11, name: 'Kids', slug: 'kids', icon: '🧒', count: 150 },
  { id: 12, name: 'Summer Collection', slug: 'summer', icon: '☀️', count: 200 },
  { id: 13, name: 'Winter Collection', slug: 'winter', icon: '❄️', count: 180 },
];

const brands = ['Souled Store', 'The Souled Store'];

const badges = ['NEW', 'SALE', 'BESTSELLER', 'LIMITED', null, null, null];
const colors = ['Black', 'White', 'Navy', 'Red', 'Grey', 'Olive', 'Yellow', 'Blue'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomPrice() { return (Math.floor(Math.random() * 30) + 5) * 100 + 99; }
function randomMRP(price) { return price + (Math.floor(Math.random() * 4) + 1) * 100; }
function randomRating() { return (3.5 + Math.random() * 1.5).toFixed(1); }
function randomReviews() { return Math.floor(Math.random() * 2000) + 50; }

const productNames = [
  'Stranger Things Fan Art Graphic', 'Batman Classic Logo', 'Friends Central Perk',
  'Rick And Morty Galaxy', 'Spider-Man Into The Verse', 'Harry Potter Hogwarts',
  'Game Of Thrones Winter', 'The Mandalorian Grogu', 'Breaking Bad Heisenberg',
  'Avengers Assemble', 'Naruto Shippuden', 'One Piece Luffy', 'Dragon Ball Super Saiyan',
  'Attack On Titan Survey Corps', 'My Hero Academia Plus Ultra', 'Demon Slayer Corps',
  'Vinland Saga Warriors', 'Jujutsu Kainen Domain Expansion', 'Death Note L',
  'Fullmetal Alchemist Alchemy', 'Cowboy Bebop Spike', 'Neon Genesis Evangelion',
  'Classic Stripe Oversized', 'Solid Comfort Fit', 'Vintage Wash Relaxed',
  'Urban Minimalist Drop', 'Acid Wash Longline', 'Football Club Edition',
  'Retro 90s Aesthetic', 'Summer Breeze Casual',
];

const categoryTypes = ['T-Shirt', 'Graphic Tee', 'Oversized Tee', 'Polo', 'Shirt', 'Hoodie', 'Jacket'];

const imageIds = [
  '1521572163474-6864f9cf17ab', '1618354691438-25bc04584c23', '1581803118522-7b72a50f7e9f',
  '1503341504253-dff4815485f1', '1542291026-7eec264c27ff', '1529374255404-311a2a4f1fd9',
  '1556821840-3a63f8550526', '1571945153237-4929e783af4b', '1490481651871-ab68de25d43d',
  '1620799140408-edc6dcb6d633', '1523381294911-8d3cead13475', '1576566588028-4147f3842f27',
  '1563630423918-b58f07291d37', '1594938298603-c8148c4b4682', '1515886657613-9f3515b0c78f',
  '1508427953056-87b4fbfd996c', '1509631179647-0177331693ae', '1512436991641-6745cae1e5e3',
];

const womenImages = [
  'Gemini_Generated_Image_3mz3m93mz3m93mz3.png',
  'Gemini_Generated_Image_4xep8n4xep8n4xep.png',
  'Gemini_Generated_Image_90if2h90if2h90if.png',
  'Gemini_Generated_Image_g66l5og66l5og66l.png',
  'Gemini_Generated_Image_idi6ycidi6ycidi6.png',
  'Gemini_Generated_Image_iteuigiteuigiteu.png',
  'Gemini_Generated_Image_nm8vlmnm8vlmnm8v.png',
  'Gemini_Generated_Image_qymyexqymyexqymy.png'
];

const accessoriesImages = [
  'Gemini_Generated_Image_1ihu5c1ihu5c1ihu.png',
  'Gemini_Generated_Image_518mhi518mhi518m.png',
  'Gemini_Generated_Image_6f1js76f1js76f1j.png',
  'Gemini_Generated_Image_70kprn70kprn70kp.png',
  'Gemini_Generated_Image_oml2ttoml2ttoml2.png',
  'Gemini_Generated_Image_oufy5aoufy5aoufy.png',
  'Gemini_Generated_Image_sdu6w1sdu6w1sdu6.png',
  'Gemini_Generated_Image_xg1e7zxg1e7zxg1e.png'
];

let products = [];
const categoryCounters = {};

for (let i = 0; i < 160; i++) {
  const price = randomPrice();
  const mrp = randomMRP(price);
  const discount = Math.round(((mrp - price) / mrp) * 100);
  const catIdx = i % categories.length;
  const categorySlug = categories[catIdx].slug;
  const imgId = imageIds[i % imageIds.length];
  const name = productNames[i % productNames.length];
  const catType = categoryTypes[i % categoryTypes.length];

  if (!categoryCounters[categorySlug]) categoryCounters[categorySlug] = 0;
  const count = categoryCounters[categorySlug];

  let image = `https://images.unsplash.com/photo-${imgId}?w=400&q=80`;
  let gallery = [
    `https://images.unsplash.com/photo-${imgId}?w=600&q=80`,
    `https://images.unsplash.com/photo-${imageIds[(i + 1) % imageIds.length]}?w=600&q=80`,
    `https://images.unsplash.com/photo-${imageIds[(i + 2) % imageIds.length]}?w=600&q=80`,
  ];

  if (categorySlug === 'women') {
    image = `/images/women/${womenImages[count % womenImages.length]}`;
    gallery = [image, image, image];
  } else if (categorySlug === 'accessories') {
    image = `/images/accessories/${accessoriesImages[count % accessoriesImages.length]}`;
    gallery = [image, image, image];
  }

  products.push({
    id: i + 1,
    name: `${name} ${catType}`,
    brand: randomItem(brands),
    category: categorySlug,
    categoryName: categories[catIdx].name,
    price,
    mrp,
    discount,
    badge: randomItem(badges),
    rating: parseFloat(randomRating()),
    reviews: randomReviews(),
    colors: [randomItem(colors), randomItem(colors)].filter((v, i, a) => a.indexOf(v) === i),
    sizes: sizes.slice(0, Math.floor(Math.random() * 3) + 3),
    image,
    images: gallery,
    inStock: Math.random() > 0.05,
    description: `Premium quality ${catType.toLowerCase()} crafted with 100% cotton. Features a comfortable relaxed fit perfect for everyday wear. Machine washable and colorfast.`,
    featured: (i < 12) || (categorySlug === 'accessories' && count < 8) || (categorySlug === 'women' && count < 8),
    newArrival: i % 5 === 0,
    bestseller: i % 7 === 0,
  });

  categoryCounters[categorySlug]++;
}

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.get('/api/categories', (req, res) => res.json(categories));

app.get('/api/products', (req, res) => {
  let result = [...products];
  const { category, search, sort, minPrice, maxPrice, badge, page = 1, limit = 20 } = req.query;

  if (category) result = result.filter(p => p.category === category);
  if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (badge) result = result.filter(p => p.badge === badge);
  if (minPrice) result = result.filter(p => p.price >= parseInt(minPrice));
  if (maxPrice) result = result.filter(p => p.price <= parseInt(maxPrice));

  if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
  else if (sort === 'discount') result.sort((a, b) => b.discount - a.discount);
  else if (sort === 'newest') result.sort((a, b) => b.id - a.id);

  const total = result.length;
  const start = (parseInt(page) - 1) * parseInt(limit);
  const paginated = result.slice(start, start + parseInt(limit));

  res.json({ products: paginated, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) });
});

app.get('/api/products/featured', (req, res) => {
  res.json(products.filter(p => p.featured).slice(0, 8));
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 6);
  res.json({ ...product, related });
});

app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const results = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 10);
  res.json(results);
});

app.get('/api/banners', (req, res) => {
  res.json([
    { id: 1, title: 'New Arrivals', subtitle: 'Fresh Drops Every Week', cta: 'Shop Now', link: '/men', bg: '#1a1a1a', image: `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80` },
    { id: 2, title: 'Fan Merchandise', subtitle: 'Official Licensed Apparel', cta: 'Explore', link: '/men-tshirts', bg: '#0d1117', image: `https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&q=80` },
    { id: 3, title: 'Sale Up To 50% Off', subtitle: 'Limited Time Offer', cta: 'Grab Now', link: '/men', bg: '#1c0a00', image: `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1400&q=80` },
  ]);
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
