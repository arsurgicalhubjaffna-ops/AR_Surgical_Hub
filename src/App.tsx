import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Quotes from './pages/Quotes';
import Careers from './pages/Careers';
import Categories from './pages/Categories';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import MyWarranty from './pages/MyWarranty';
import WarrantyClaimForm from './pages/WarrantyClaimForm';
import WarrantyDetail from './pages/WarrantyDetail';
import AdminPanel from './pages/Admin/AdminPanel';
import AdminRoute from './pages/Admin/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { useSettings } from './hooks/useSettings';

function App() {
  const { getSetting } = useSettings();

  useEffect(() => {
    const title = getSetting('site_title', 'AR SURGICAL HUB - Precision Surgical Instruments');
    document.title = title;
  }, [getSetting]);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <Routes>
              {/* Admin Panel — no Layout wrapper */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                }
              />
              {/* Public site — with Layout */}
              <Route path="/*" element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/quotes" element={<Quotes />} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/blog/:id" element={<BlogDetail />} />
                    <Route path="/my-orders" element={<MyOrders />} />
                    <Route path="/order/:id" element={<OrderDetail />} />
                    <Route path="/my-warranty" element={<MyWarranty />} />
                    <Route path="/warranty/new" element={<WarrantyClaimForm />} />
                    <Route path="/warranty/:id" element={<WarrantyDetail />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/login" element={<Login />} />
                  </Routes>
                </Layout>
              } />
            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
