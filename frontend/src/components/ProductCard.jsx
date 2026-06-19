import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const COLOR_MAP = {
  Black: '#1a1a1a', White: '#f5f5f5', Navy: '#1a237e', Red: '#e11b23',
  Grey: '#9e9e9e', Olive: '#827717', Yellow: '#f9a825', Blue: '#1565c0',
};

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>
          {i < full ? '★' : (i === full && half ? '⯨' : '☆')}
        </span>
      ))}
    </span>
  );
}

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted, addToCart } = useStore();
  const wishlisted = isWishlisted(product.id);

  function getBadgeClass(badge) {
    if (!badge) return '';
    if (badge === 'NEW') return 'badge-new';
    if (badge === 'SALE') return 'badge-sale';
    if (badge === 'BESTSELLER') return 'badge-bestseller';
    if (badge === 'LIMITED') return 'badge-limited';
    return 'badge-new';
  }

  return (
    <div className="product-card" id={`product-card-${product.id}`}>
      {/* Image */}
      <div className="product-card-img" onClick={() => navigate(`/product/${product.id}`)}>
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge && (
          <span className={`product-badge ${getBadgeClass(product.badge)}`}>{product.badge}</span>
        )}
        {product.discount > 0 && (
          <span className="product-discount-badge">-{product.discount}%</span>
        )}
        <button
          className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={e => { e.stopPropagation(); toggleWishlist(product); }}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          id={`wishlist-btn-${product.id}`}
        >
          {wishlisted ? '❤️' : '🤍'}
        </button>
        <div
          className="quick-add"
          onClick={e => { e.stopPropagation(); addToCart(product, product.sizes?.[2] || 'M'); }}
        >
          + Quick Add
        </div>
      </div>

      {/* Info */}
      <div className="product-info" onClick={() => navigate(`/product/${product.id}`)}>
        <div className="product-name">{product.name}</div>
        <div className="product-rating">
          <Stars rating={product.rating} />
          <span className="rating-val">{product.rating}</span>
          <span className="rating-cnt">({product.reviews.toLocaleString('en-IN')})</span>
        </div>
        <div className="product-price">
          <span className="price-current">₹{product.price.toLocaleString('en-IN')}</span>
          {product.mrp > product.price && (
            <span className="price-mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
          )}
          {product.discount > 0 && (
            <span className="price-off">{product.discount}% OFF</span>
          )}
        </div>
        {/* Color dots */}
        {product.colors?.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
            {product.colors.map(c => (
              <span key={c} title={c} style={{
                width: '12px', height: '12px', borderRadius: '50%',
                background: COLOR_MAP[c] || '#ccc',
                border: '1px solid #ddd', display: 'inline-block'
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
