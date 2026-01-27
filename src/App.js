'use client';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/myContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/customer/Home';
import Products from './pages/customer/Products';
import ProductDetail from './pages/customer/productDetail/ProductDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/checkout/Checkout';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import Profile from './pages/customer/profile/Profile';
import OrderHistory from './pages/customer/OrderHistory/OrderHistory';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminDashboard from './pages/admin/AdminDashBoard/AdminDashBoard';
import ProductsManagement from './pages/admin/ProductsManagement/ProductsManagement';
import OrdersManagement from './pages/admin/OrdersManagement/OrdersManagement';
import UsersManagement from './pages/admin/usersManagement/UsersManagement';
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

// Admin Route Component - Only for admin users
const AdminRoute = ({ children }) => {
  const { isAuthenticated, userDetails } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userDetails?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Customer Route Component - Only for customer users
const CustomerRoute = ({ children }) => {
  const { isAuthenticated, userDetails } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userDetails?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

function AppContent() {
  const location = useLocation();
  const { userDetails } = useAuth();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signUp' || location.pathname === '/forgot-password';

  // Check if admin is on customer pages
  const isAdminOnCustomerPage = userDetails?.role === 'admin' &&
    !location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!isAuthPage && <Header hideAuthStatus={isAdminOnCustomerPage} />}
      <main
        className={
          isAuthPage
            ? 'flex-grow' // 👈 no padding, no container
            : 'flex-grow '
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={
            <CustomerRoute>
              <Checkout />
            </CustomerRoute>
          } />
          <Route path="/order-confirmation/:orderId" element={
            <CustomerRoute>
              <OrderConfirmation />
            </CustomerRoute>
          } />
          <Route path="/profile" element={
            <CustomerRoute>
              <Profile />
            </CustomerRoute>
          } />
          <Route path="/order-history" element={
            <CustomerRoute>
              <OrderHistory />
            </CustomerRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
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
