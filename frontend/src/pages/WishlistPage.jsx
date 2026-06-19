import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useStore();

  return (
    <div className="wishlist-page">
      <h1 className="page-title">
        My Wishlist {wishlist.length > 0 && <span style={{ fontSize: '20px', fontFamily: 'Montserrat', fontWeight: 400, color: '#9e9e9e' }}>— {wishlist.length} items</span>}
      </h1>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🤍</div>
          <h3>Your wishlist is empty</h3>
          <p>Save items you love by clicking the heart icon on any product.</p>
          <Link to="/men" className="empty-cta">Start Exploring →</Link>
        </div>
      ) : (
        <>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>
            💡 Tip: Click the heart icon to remove items from your wishlist.
          </div>
          <div className="products-grid">
            {wishlist.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
