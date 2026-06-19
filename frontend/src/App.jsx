import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MenPage from './pages/MenPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import SearchPage from './pages/SearchPage';
import { StoreProvider } from './context/StoreProvider';

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/men" element={<MenPage category="men" title="Men's Collection" />} />
            <Route path="/women" element={<MenPage category="women" title="Women's Collection" />} />
            <Route path="/kids" element={<MenPage category="kids" title="Kids' Collection" />} />
            <Route path="/summer" element={<MenPage category="summer" title="Summer Collection" />} />
            <Route path="/winter" element={<MenPage category="winter" title="Winter Collection" />} />
            <Route path="/sale" element={<MenPage category="sale" title="Sale" />} />
            <Route path="/accessories" element={<MenPage category="accessories" title="Accessories" />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </StoreProvider>
  );
}
