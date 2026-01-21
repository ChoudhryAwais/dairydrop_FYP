'use client';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/myContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/customer/Home';
import Products from './pages/customer/Products';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import Profile from './pages/customer/Profile';
import OrderHistory from './pages/customer/OrderHistory';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import AdminDashboard from './pages/admin/AdminDashBoard';
import ProductsManagement from './pages/admin/ProductsManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import UsersManagement from './pages/admin/UsersManagement';
import ReviewsManagement from './pages/admin/ReviewsManagement';
import './App.css';
import AdminLayout from './layout/AdminLayout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signUp';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!isAuthPage && <Header />}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/order-confirmation/:orderId" element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/order-history" element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<ProductsManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="reviews" element={<ReviewsManagement />} />
          </Route>
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
