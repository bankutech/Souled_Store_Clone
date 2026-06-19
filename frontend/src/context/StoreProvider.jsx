import { useState } from 'react';
import { StoreContext } from './StoreContext';
import Toast from '../components/Toast';

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);

  function showToast(msg, type = 'success') {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  }

  function addToCart(product, size, qty = 1) {
    setCart(prev => {
      const key = `${product.id}-${size}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { ...product, size, qty, key }];
    });
    showToast(`Added to cart!`);
  }

  function removeFromCart(key) {
    setCart(prev => prev.filter(i => i.key !== key));
    showToast('Removed from cart', 'error');
  }

  function updateQty(key, delta) {
    setCart(prev =>
      prev.map(i => i.key === key ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );
  }

  function toggleWishlist(product) {
    setWishlist(prev => {
      const has = prev.some(p => p.id === product.id);
      if (has) {
        showToast('Removed from wishlist', 'error');
        return prev.filter(p => p.id !== product.id);
      }
      showToast('Added to wishlist! ❤️');
      return [...prev, product];
    });
  }

  function isWishlisted(id) {
    return wishlist.some(p => p.id === id);
  }

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartMRP = cart.reduce((s, i) => s + i.mrp * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const value = {
    cart,
    wishlist,
    addToCart,
    removeFromCart,
    updateQty,
    toggleWishlist,
    isWishlisted,
    cartTotal,
    cartMRP,
    cartCount,
    showToast
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
      {toast && <Toast key={toast.id} message={toast.msg} type={toast.type} />}
    </StoreContext.Provider>
  );
}
