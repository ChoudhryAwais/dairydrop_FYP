import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/myContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import './App.css';

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
          <Route path="/products" element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } />
          <Route path="/products/:id" element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
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
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;