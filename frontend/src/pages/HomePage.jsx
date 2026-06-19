import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API = 'http://localhost:5000/api';

const BANNERS = [
  {
    id: 1,
    title: 'New Season Drops',
    subtitle: 'FRESH ARRIVALS 2025',
    cta: 'Shop Now',
    link: '/men',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
  },
  {
    id: 2,
    title: 'Fan Merchandise',
    subtitle: 'OFFICIAL LICENSED APPAREL',
    cta: 'Explore Collection',
    link: '/men-tshirts',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&q=80',
  },
  {
    id: 3,
    title: 'Sale — Up To 50% Off',
    subtitle: 'LIMITED TIME ONLY',
    cta: 'Grab The Deal',
    link: '/men',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1400&q=80',
  },
];

const CATEGORIES = [
  { name: 'T-Shirts', slug: 'men-tshirts', icon: '👕', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
  { name: 'Shirts', slug: 'men-shirts', icon: '👔', img: 'https://images.unsplash.com/photo-1508427953056-87b4fbfd996c?w=400&q=80' },
  { name: 'Hoodies', slug: 'men-hoodies', icon: '🧥', img: 'https://images.unsplash.com/photo-1556821840-3a63f8550526?w=400&q=80' },
  { name: 'Jeans', slug: 'men-jeans', icon: '👖', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
];

const OFFERS = [
  { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹499' },
  { icon: '↩️', title: 'Easy Returns', desc: '15-day hassle-free returns' },
  { icon: '🔒', title: '100% Secure', desc: 'Encrypted payments' },
  { icon: '🌟', title: 'Authentic Products', desc: 'Official licensed merch' },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % BANNERS.length), 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/products/featured`),
      axios.get(`${API}/products?sort=newest&limit=8`),
    ]).then(([f, n]) => {
      setFeatured(f.data);
      setNewArrivals(n.data.products);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero Carousel */}
      <section className="hero" id="hero-section">
        {BANNERS.map((b, i) => (
          <div
            key={b.id}
            className={`hero-slide ${i === slide ? 'active' : ''}`}
            style={{ display: i === slide ? 'flex' : 'none' }}
          >
            <img src={b.image} alt={b.title} />
            <div className="hero-content">
              <div className="hero-subtitle">{b.subtitle}</div>
              <h1 className="hero-title">{b.title}</h1>
              <Link to={b.link} className="hero-cta">{b.cta} →</Link>
            </div>
          </div>
        ))}
        <button className="hero-arrow prev" onClick={() => setSlide(s => (s - 1 + BANNERS.length) % BANNERS.length)}>‹</button>
        <button className="hero-arrow next" onClick={() => setSlide(s => (s + 1) % BANNERS.length)}>›</button>
        <div className="hero-dots">
          {BANNERS.map((_, i) => (
            <div key={i} className={`hero-dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} />
          ))}
        </div>
      </section>

      {/* Offers Strip */}
      <section style={{ padding: '28px 20px', background: '#fafafa' }}>
        <div className="offers-row">
          {OFFERS.map(o => (
            <div key={o.title} className="offer-item">
              <span className="offer-icon">{o.icon}</span>
              <div>
                <div className="offer-title">{o.title}</div>
                <div className="offer-desc">{o.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="section" id="categories-section">
        <div className="section-header">
          <h2 className="section-title">Shop by <span>Category</span></h2>
          <Link to="/men" className="view-all">View All →</Link>
        </div>
        <div className="cat-cards-grid">
          {CATEGORIES.map(cat => (
            <div
              key={cat.slug}
              className="cat-card"
              onClick={() => navigate(`/${cat.slug}`)}
              id={`cat-card-${cat.slug}`}
            >
              <img src={cat.img} alt={cat.name} loading="lazy" />
              <div className="cat-card-overlay" />
              <div className="cat-card-info">
                <div className="cat-card-name">{cat.name}</div>
                <div className="cat-card-count">Explore Collection</div>
                <span className="cat-card-btn">Shop Now →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" id="featured-section" style={{ background: '#fafafa' }}>
        <div className="section-header">
          <h2 className="section-title">Best <span>Sellers</span></h2>
          <Link to="/men" className="view-all">View All →</Link>
        </div>
        {loading ? (
          <div className="spinner-wrapper"><div className="spinner" /></div>
        ) : (
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Red Banner */}
      <div className="banner-strip">
        <h2>UP TO 50% OFF — SALE ON NOW</h2>
        <p>Limited time deals across all categories. Don't miss out!</p>
        <Link to="/men" className="banner-strip-btn">Shop The Sale →</Link>
      </div>

      {/* New Arrivals */}
      <section className="section" id="new-arrivals-section">
        <div className="section-header">
          <h2 className="section-title">New <span>Arrivals</span></h2>
          <Link to="/men" className="view-all">View All →</Link>
        </div>
        {loading ? (
          <div className="spinner-wrapper"><div className="spinner" /></div>
        ) : (
          <div className="products-scroll-wrapper">
            <div className="products-scroll-row">
              {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </section>

      {/* Promo Banners */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="promo-grid">
          <div className="promo-card" onClick={() => navigate('/men-tshirts')}>
            <img src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80" alt="Men's T-Shirts" />
            <div className="promo-overlay" />
            <div className="promo-content">
              <h3>Graphic Tees</h3>
              <p>Featuring your favorite shows & movies</p>
              <span className="promo-btn">Shop Now →</span>
            </div>
          </div>
          <div className="promo-card" onClick={() => navigate('/women')}>
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" alt="Women's Collection" />
            <div className="promo-overlay" />
            <div className="promo-content">
              <h3>Women's Edit</h3>
              <p>New season styles just dropped</p>
              <span className="promo-btn">Explore →</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fan Universe CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1f3d 100%)',
        padding: '64px 20px',
        textAlign: 'center',
        color: '#fff'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', letterSpacing: '4px', fontWeight: 700, color: '#f5c518', marginBottom: '12px', textTransform: 'uppercase' }}>
            Fan Universe
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '52px', letterSpacing: '2px', lineHeight: 1, marginBottom: '16px' }}>
            Wear What You Love
          </h2>
          <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px' }}>
            From Anime to Superheroes, Pop Culture to Sports — we've got officially licensed merchandise for everything you love.
          </p>
          <Link to="/men-tshirts" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#e11b23', color: '#fff', padding: '14px 32px',
            fontSize: '12px', fontWeight: 800, letterSpacing: '2px',
            textTransform: 'uppercase', borderRadius: '2px', textDecoration: 'none'
          }}>
            Explore Fan Merch →
          </Link>
        </div>
      </section>
    </>
  );
}
