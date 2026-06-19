import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

const API = 'http://localhost:5000/api';

const COLOR_MAP = {
  Black: '#1a1a1a', White: '#f5f5f5', Navy: '#1a237e', Red: '#e11b23',
  Grey: '#9e9e9e', Olive: '#827717', Yellow: '#f9a825', Blue: '#1565c0',
};

function Stars({ rating }) {
  return (
    <span style={{ color: '#f5c518', fontSize: '14px' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < Math.floor(rating) ? '★' : (i < rating ? '⯨' : '☆')}</span>
      ))}
    </span>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setActiveImg(0);
      setSelectedSize('');
      setSelectedColor('');
      setQty(1);
      try {
        const { data } = await axios.get(`${API}/products/${id}`);
        setProduct(data);
        setRelated(data.related || []);
        setSelectedColor(data.colors?.[0] || '');
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, navigate]);

  if (loading) return (
    <div className="spinner-wrapper" style={{ minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  if (!product) return null;

  function handleAddToCart() {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addToCart(product, selectedSize, qty);
  }

  const wishlisted = isWishlisted(product.id);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> ›
        <Link to={`/${product.category}`}>{product.categoryName}</Link> ›
        <span style={{ color: '#212529', fontWeight: 600 }}>{product.name}</span>
      </div>

      <div className="product-detail">
        <div className="detail-grid">
          {/* Images */}
          <div className="detail-images">
            <div className="detail-main-img">
              <img
                src={product.images?.[activeImg] || product.image}
                alt={product.name}
              />
            </div>
            <div className="detail-thumbs">
              {(product.images || [product.image]).map((img, i) => (
                <div
                  key={i}
                  className={`detail-thumb ${i === activeImg ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                  id={`thumb-${i}`}
                >
                  <img src={img} alt={`View ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-brand">{product.brand}</div>
            <h1 className="detail-name">{product.name}</h1>

            {/* Rating */}
            <div className="detail-rating">
              <div className="rating-pill">
                ⭐ {product.rating}
              </div>
              <span style={{ fontSize: '13px', color: '#666' }}>
                {product.reviews.toLocaleString('en-IN')} ratings
              </span>
            </div>

            {/* Price */}
            <div className="detail-price-row">
              <span className="detail-price">₹{product.price.toLocaleString('en-IN')}</span>
              {product.mrp > product.price && (
                <span className="detail-mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
              )}
              {product.discount > 0 && (
                <span className="detail-off-badge">{product.discount}% OFF</span>
              )}
            </div>
            <p style={{ fontSize: '12px', color: '#2e7d32', marginBottom: '18px', fontWeight: 600 }}>
              ✅ Inclusive of all taxes &nbsp;•&nbsp; Free shipping above ₹499
            </p>

            {/* Color */}
            {product.colors?.length > 0 && (
              <div className="detail-colors">
                <div className="detail-section-label">
                  Color: <span style={{ fontWeight: 400, textTransform: 'none' }}>{selectedColor}</span>
                </div>
                <div className="color-dots">
                  {product.colors.map(c => (
                    <div
                      key={c}
                      className={`color-dot ${selectedColor === c ? 'active' : ''}`}
                      style={{ background: COLOR_MAP[c] || '#ccc' }}
                      onClick={() => setSelectedColor(c)}
                      title={c}
                      id={`color-${c.toLowerCase()}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            <div className="detail-sizes">
              <div className="detail-section-label" style={{ color: sizeError ? '#e11b23' : undefined }}>
                Select Size {sizeError && <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '11px' }}>— Please select a size</span>}
              </div>
              <div className="size-grid">
                {product.sizes?.map(s => (
                  <button
                    key={s}
                    className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => { setSelectedSize(s); setSizeError(false); }}
                    id={`size-${s}`}
                  >{s}</button>
                ))}
              </div>
              <a href="#" style={{ fontSize: '11px', color: '#666', marginTop: '8px', display: 'inline-block', textDecoration: 'underline' }}>
                📏 Size Guide
              </a>
            </div>

            {/* Qty + Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} id="qty-decrease">−</button>
                <span className="qty-val" id="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => q + 1)} id="qty-increase">+</button>
              </div>
            </div>

            <div className="detail-actions">
              <button className="add-cart-btn" onClick={handleAddToCart} id="add-to-cart-btn">
                🛒 Add to Cart
              </button>
              <button
                className={`wishlist-big-btn ${wishlisted ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
                title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                id="wishlist-detail-btn"
              >
                {wishlisted ? '❤️' : '🤍'}
              </button>
            </div>

            {/* Meta */}
            <div className="detail-meta">
              <span>🏷 <strong>Category:</strong> {product.categoryName}</span>
              <span>✅ <strong>Availability:</strong> {product.inStock ? 'In Stock' : 'Out of Stock'}</span>
              <span>🔖 <strong>SKU:</strong> TSS-{String(product.id).padStart(5, '0')}</span>
            </div>

            {/* Description */}
            <div style={{ marginTop: '24px', padding: '20px', background: '#f9f9f9', borderRadius: '4px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Product Description</div>
              <p style={{ fontSize: '13px', lineHeight: '1.8', color: '#555' }}>{product.description}</p>
            </div>

            {/* Shipping details */}
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                ['🚚', 'Free delivery on orders above ₹499'],
                ['🔄', 'Easy 15-day returns & exchanges'],
                ['🔒', '100% secure & encrypted checkout'],
                ['📦', 'Ships within 3–5 business days'],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#555' }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: '56px' }}>
            <div className="section-header" style={{ padding: 0, marginBottom: '20px' }}>
              <h2 className="section-title">You May Also <span>Like</span></h2>
            </div>
            <div className="products-grid">
              {related.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
