import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/Home';
import BrandPage from './pages/BrandPage';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import DealsPage from './pages/DealsPage';
import CategoryPage from './pages/CategoryPage';
import CategoryResults from './pages/CategoryResults';
import SearchResults from './pages/SearchResults';
import BrandCategoryPage from './pages/BrandCategoryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import InvoicePage from './pages/InvoicePage';
import BrandsPage from './pages/BrandsPage';

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminOverview from './pages/admin/AdminOverview';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategoryImages from './pages/admin/AdminCategoryImages';

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) {
    if (location.pathname === '/admin/login') {
      return (
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      );
    }

    return (
      <AdminLayout>
        <Routes>
          <Route path="/admin/overview" element={<AdminOverview />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/category-images" element={<AdminCategoryImages />} />
        </Routes>
      </AdminLayout>
    );
  }

  if (location.pathname.startsWith('/order/') && location.pathname.endsWith('/invoice')) {
    return (
      <Routes>
        <Route path="/order/:orderId/invoice" element={<InvoicePage />} />
      </Routes>
    );
  }

  return (
    <MainLayout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/brand/:id" element={<BrandPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/category/:categoryName" element={<CategoryResults />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/brand/:brandId/category/:categoryName" element={<BrandCategoryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/brands" element={<BrandsPage />} />
      </Routes>
    </MainLayout>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
