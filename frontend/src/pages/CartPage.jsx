import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, cartTotal, cartMRP } = useStore();
  const savings = cartMRP - cartTotal;
  const shipping = cartTotal >= 499 ? 0 : 49;
  const finalTotal = cartTotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1 className="page-title">Your Cart</h1>
        <div className="empty-state">
          <div className="icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet. Let's fix that!</p>
          <Link to="/men" className="empty-cta">Continue Shopping →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="page-title">Your Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})</h1>

      <div className="cart-layout">
        {/* Items */}
        <div>
          {cart.map(item => (
            <div key={item.key} className="cart-item" id={`cart-item-${item.key}`}>
              <div className="cart-item-img">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-meta">
                  Size: {item.size} &nbsp;•&nbsp; Color: {item.colors?.[0] || 'Default'}
                </div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => updateQty(item.key, -1)} id={`qty-dec-${item.key}`}>−</button>
                  <span className="qty-val">{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.key, 1)} id={`qty-inc-${item.key}`}>+</button>
                </div>
                <span
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.key)}
                  id={`remove-${item.key}`}
                >
                  Remove
                </span>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div className="cart-item-price">₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                {item.mrp > item.price && (
                  <div style={{ fontSize: '11px', color: '#9e9e9e', textDecoration: 'line-through', marginTop: '4px' }}>
                    ₹{(item.mrp * item.qty).toLocaleString('en-IN')}
                  </div>
                )}
                {item.discount > 0 && (
                  <div style={{ fontSize: '11px', color: '#e11b23', fontWeight: 700, marginTop: '2px' }}>
                    {item.discount}% OFF
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Coupon */}
          <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '4px', marginTop: '16px', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Enter coupon code (try: TSS10)"
              id="coupon-input"
              style={{
                flex: 1, padding: '10px 12px', border: '1.5px solid #d1d1d1',
                borderRadius: '2px', fontSize: '12px', fontFamily: 'inherit'
              }}
            />
            <button
              id="apply-coupon-btn"
              style={{
                padding: '10px 20px', background: '#1a1a1a', color: '#fff',
                fontSize: '12px', fontWeight: 700, letterSpacing: '1px',
                textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer'
              }}
            >Apply</button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
            <span>₹{cartMRP.toLocaleString('en-IN')}</span>
          </div>
          {savings > 0 && (
            <div className="summary-row saving">
              <span>Discount</span>
              <span>−₹{savings.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: shipping === 0 ? '#2e7d32' : undefined }}>
              {shipping === 0 ? 'FREE' : `₹${shipping}`}
            </span>
          </div>
          {shipping > 0 && (
            <p style={{ fontSize: '11px', color: '#e11b23', marginBottom: '8px' }}>
              Add ₹{(499 - cartTotal).toLocaleString('en-IN')} more for free shipping!
            </p>
          )}

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{finalTotal.toLocaleString('en-IN')}</span>
          </div>

          {savings > 0 && (
            <div style={{ background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '4px', padding: '10px 12px', marginTop: '12px', fontSize: '12px', color: '#2e7d32', fontWeight: 700, textAlign: 'center' }}>
              🎉 You're saving ₹{savings.toLocaleString('en-IN')} on this order!
            </div>
          )}

          <button className="checkout-btn" id="checkout-btn">
            Proceed to Checkout →
          </button>
          <Link to="/men" className="continue-btn" style={{ display: 'block', textAlign: 'center' }}>
            Continue Shopping
          </Link>

          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {['🔒 Secure Checkout', '🚚 Free Shipping above ₹499', '↩️ Easy 15-day returns'].map(t => (
              <div key={t} style={{ fontSize: '11px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>{t}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
