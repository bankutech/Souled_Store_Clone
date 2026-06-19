import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API = 'http://localhost:5000/api';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputVal, setInputVal] = useState(q);

  useEffect(() => {
    const fetchData = async () => {
      setInputVal(q);
      if (!q.trim()) {
        setProducts([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/products?search=${encodeURIComponent(q)}&limit=40`);
        setProducts(data.products);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [q]);

  function handleSearch(e) {
    e.preventDefault();
    if (inputVal.trim()) setSearchParams({ q: inputVal.trim() });
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 className="page-title">Search Results</h1>

      {/* Search form */}
      <form onSubmit={handleSearch} style={{ marginBottom: '32px', display: 'flex', gap: '10px', maxWidth: '500px' }}>
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="Search products, characters..."
          id="search-page-input"
          style={{
            flex: 1, height: '46px', border: '2px solid #1a1a1a',
            borderRadius: '2px', padding: '0 14px', fontSize: '14px',
            fontFamily: 'Montserrat, sans-serif'
          }}
        />
        <button
          type="submit"
          id="search-page-btn"
          style={{
            height: '46px', padding: '0 24px', background: '#1a1a1a',
            color: '#fff', fontSize: '13px', fontWeight: 700,
            letterSpacing: '1px', textTransform: 'uppercase',
            borderRadius: '2px', cursor: 'pointer'
          }}
        >Search</button>
      </form>

      {loading ? (
        <div className="spinner-wrapper"><div className="spinner" /></div>
      ) : q && products.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>No results for "{q}"</h3>
          <p>Try different keywords or browse our collections.</p>
          <Link to="/men" className="empty-cta">Browse All Products →</Link>
        </div>
      ) : q ? (
        <>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '24px' }}>
            Found <strong>{products.length}</strong> results for "<strong>{q}</strong>"
          </p>
          <div className="products-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>What are you looking for?</h3>
          <p>Search for T-shirts, hoodies, fan merchandise and more.</p>
        </div>
      )}
    </div>
  );
}
