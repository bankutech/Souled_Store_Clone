import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API = 'http://localhost:5000/api';

const SORT_OPTIONS = [
  { value: '', label: 'Relevance' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Best Discount' },
];

const BADGE_OPTIONS = ['NEW', 'SALE', 'BESTSELLER', 'LIMITED'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const PAGE_BANNERS = {
  men: { title: "Men's Collection", sub: '500+ styles for the modern man', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80' },
  women: { title: "Women's Collection", sub: 'Fresh styles for every occasion', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=80' },
  kids: { title: "Kids' Collection", sub: 'Cute & comfy styles for the little ones', img: 'https://images.unsplash.com/photo-1519704943960-da918a719a7d?w=1400&q=80' },
  summer: { title: "Summer Collection", sub: 'Light, breezy & sun-ready', img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1400&q=80' },
  winter: { title: "Winter Collection", sub: 'Cozy layers for the cold', img: 'https://images.unsplash.com/photo-1556821840-3a63f8550526?w=1400&q=80' },
  sale: { title: "Big Sale Event", sub: 'Unbeatable deals up to 70% off', img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&q=80' },
  accessories: { title: 'Accessories', sub: 'Caps, bags, socks & more', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80' },
};

function FilterGroup({ title, open, onToggle, children }) {
  return (
    <div className="filter-group">
      <div className="filter-group-header" onClick={onToggle}>
        <span>{title}</span>
        <span className={`chevron ${open ? 'open' : ''}`}>▼</span>
      </div>
      <div className={`filter-body ${open ? '' : 'closed'}`}>{children}</div>
    </div>
  );
}

export default function MenPage({ category, title }) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState('grid4');
  const [openGroups, setOpenGroups] = useState({ price: true, badge: true, size: false });
  const [filters, setFilters] = useState({ badges: [], sizes: [], minPrice: '', maxPrice: '' });
  const [priceInput, setPriceInput] = useState({ min: '', max: '' });
  const LIMIT = 16;

  const banner = PAGE_BANNERS[category] || PAGE_BANNERS['men'];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category && category !== 'men' && category !== 'sale') params.set('category', category);
      if (category === 'sale') params.set('badge', 'SALE');
      if (sort) params.set('sort', sort);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      params.set('page', page);
      params.set('limit', LIMIT);

      const { data } = await axios.get(`${API}/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [category, sort, page, filters]);

  useEffect(() => { setPage(1); }, [category, sort, filters]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  function toggleGroup(key) {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function applyPrice() {
    setFilters(f => ({ ...f, minPrice: priceInput.min, maxPrice: priceInput.max }));
  }

  function clearFilters() {
    setFilters({ badges: [], sizes: [], minPrice: '', maxPrice: '' });
    setPriceInput({ min: '', max: '' });
    setSort('');
    setPage(1);
  }

  const activeFilterCount = filters.badges.length + filters.sizes.length + (filters.minPrice ? 1 : 0);

  const gridClass = view === 'grid3' ? 'products-grid products-grid-3' : 'products-grid';

  return (
    <>
      {/* Page Banner */}
      <div className="page-banner">
        <img src={banner.img} alt={banner.title} />
        <div className="page-banner-content">
          <h1>{banner.title}</h1>
          <p>{banner.sub}</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/">Home</a> › <span style={{ color: '#212529', fontWeight: 600 }}>{title || banner.title}</span>
      </div>

      {/* Layout */}
      <div className="shop-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            {activeFilterCount > 0 && <span className="sidebar-clear" onClick={clearFilters}>Clear All</span>}
          </div>

          <FilterGroup title="Price Range" open={openGroups.price} onToggle={() => toggleGroup('price')}>
            <div className="price-range">
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={priceInput.min}
                  onChange={e => setPriceInput(p => ({ ...p, min: e.target.value }))}
                  id="filter-min-price"
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={priceInput.max}
                  onChange={e => setPriceInput(p => ({ ...p, max: e.target.value }))}
                  id="filter-max-price"
                />
              </div>
              <button className="apply-price-btn" onClick={applyPrice} id="apply-price-btn">Apply</button>
            </div>
          </FilterGroup>

          <FilterGroup title="Product Type" open={openGroups.badge} onToggle={() => toggleGroup('badge')}>
            {BADGE_OPTIONS.map(b => (
              <label key={b} className="filter-item">
                <input
                  type="checkbox"
                  checked={filters.badges.includes(b)}
                  onChange={() => setFilters(f => ({
                    ...f,
                    badges: f.badges.includes(b) ? f.badges.filter(x => x !== b) : [...f.badges, b]
                  }))}
                  id={`filter-badge-${b.toLowerCase()}`}
                />
                <span>{b}</span>
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="Size" open={openGroups.size} onToggle={() => toggleGroup('size')}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '4px 0' }}>
              {SIZE_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setFilters(f => ({
                    ...f,
                    sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s]
                  }))}
                  id={`filter-size-${s.toLowerCase()}`}
                  style={{
                    padding: '5px 10px', fontSize: '11px', fontWeight: 700,
                    border: `1.5px solid ${filters.sizes.includes(s) ? '#1a1a1a' : '#d1d1d1'}`,
                    background: filters.sizes.includes(s) ? '#1a1a1a' : '#fff',
                    color: filters.sizes.includes(s) ? '#fff' : '#212529',
                    borderRadius: '2px', cursor: 'pointer',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Sort By" open={openGroups.sort} onToggle={() => toggleGroup('sort')}>
            {SORT_OPTIONS.map(o => (
              <label key={o.value} className="filter-item">
                <input
                  type="radio"
                  name="sort"
                  checked={sort === o.value}
                  onChange={() => setSort(o.value)}
                  style={{ accentColor: '#e11b23' }}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </FilterGroup>
        </aside>

        {/* Main */}
        <div>
          {/* Toolbar */}
          <div className="shop-toolbar">
            <div className="result-count">
              Showing <strong>{Math.min((page - 1) * LIMIT + 1, total)}–{Math.min(page * LIMIT, total)}</strong> of <strong>{total}</strong> products
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select
                className="sort-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
                id="sort-select"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <div className="view-toggle">
                <button className={`view-btn ${view === 'grid4' ? 'active' : ''}`} onClick={() => setView('grid4')} title="4 columns">▦</button>
                <button className={`view-btn ${view === 'grid3' ? 'active' : ''}`} onClick={() => setView('grid3')} title="3 columns">▤</button>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="active-filters">
              {filters.minPrice && (
                <span className="filter-chip" onClick={() => setFilters(f => ({ ...f, minPrice: '' }))}>
                  Min: ₹{filters.minPrice} ✕
                </span>
              )}
              {filters.maxPrice && (
                <span className="filter-chip" onClick={() => setFilters(f => ({ ...f, maxPrice: '' }))}>
                  Max: ₹{filters.maxPrice} ✕
                </span>
              )}
              {filters.badges.map(b => (
                <span key={b} className="filter-chip" onClick={() => setFilters(f => ({ ...f, badges: f.badges.filter(x => x !== b) }))}>
                  {b} ✕
                </span>
              ))}
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="spinner-wrapper"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or clearing them.</p>
              <button className="empty-cta" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className={gridClass}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                id="prev-page-btn"
              >‹</button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    className={`page-btn ${p === page ? 'active' : ''}`}
                    onClick={() => setPage(p)}
                    id={`page-btn-${p}`}
                  >{p}</button>
                );
              })}
              <button
                className="page-btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                id="next-page-btn"
              >›</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
