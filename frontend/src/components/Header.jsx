import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const navLinks = [
  { label: 'MEN', path: '/men' },
  { label: 'WOMEN', path: '/women' },
  { label: 'KIDS', path: '/kids' },
  { label: 'ACCESSORIES', path: '/accessories' },
  { label: 'SUMMER', path: '/summer' },
  { label: 'WINTER', path: '/winter' },
  { label: 'SALE', path: '/sale', className: 'sale-link' },
];

export default function Header() {
  const { cartCount, wishlist } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setShowDrop(false);
        return;
      }
      try {
        const { data } = await axios.get(`${API}/search?q=${encodeURIComponent(query)}`);
        setResults(data);
        setShowDrop(true);
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function onClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDrop(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setShowDrop(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery('');
  }

  function goToProduct(id) {
    setShowDrop(false);
    setQuery('');
    navigate(`/product/${id}`);
  }

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i}>
              🚚 FREE SHIPPING on orders above <em>₹499</em> &nbsp;•&nbsp;
              🎉 Use code <em>TSS10</em> for 10% OFF &nbsp;•&nbsp;
              ⚡ New drops every Monday &nbsp;•&nbsp;
              🌟 100% Original Merchandise &nbsp;•&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <header className="header">
        <div className="header-inner">
          {/* Logo */}
          <Link to="/" className="header-logo">
            <div className="logo-main">THE SOULED STORE</div>
            <div className="logo-sub">Official Fan Merchandise</div>
          </Link>

          {/* Nav */}
          <nav className="header-nav">
            {navLinks.map(link => (
              <Link
                key={link.path + link.label}
                to={link.path}
                className={`nav-link ${link.className || ''} ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <div className="header-search" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search products, characters..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setShowDrop(true)}
                id="header-search-input"
              />
              <button type="submit" className="search-btn" aria-label="Search">🔍</button>
            </form>
            {showDrop && results.length > 0 && (
              <div className="search-dropdown">
                {results.map(p => (
                  <div key={p.id} className="search-item" onClick={() => goToProduct(p.id)}>
                    <img src={p.image} alt={p.name} />
                    <div>
                      <div className="search-item-name">{p.name}</div>
                      <div className="search-item-price">₹{p.price.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Icons */}
          <div className="header-icons">
            <Link to="/search" className="icon-btn" title="Search" id="search-icon-btn">🔍</Link>
            <Link to="/wishlist" className="icon-btn" title="Wishlist" id="wishlist-icon-btn">
              🤍
              {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
            </Link>
            <Link to="/cart" className="icon-btn" title="Cart" id="cart-icon-btn">
              🛒
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Link>
            <button className="icon-btn" title="Account" id="account-icon-btn">👤</button>
          </div>
        </div>
      </header>
    </>
  );
}
