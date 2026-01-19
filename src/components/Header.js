import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/myContext';
import { logoutUser } from '../services/auth/authService';

const Header = () => {
  const { isAuthenticated, currentUser, userDetails } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">
              DD
            </div>
            <h1 className="text-2xl font-bold text-gray-800 hover:text-green-600 transition-colors">
              DairyDrop Store
            </h1>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 hover:underline"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 hover:underline"
            >
              Products
            </Link>
            <Link 
              to="/cart" 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md flex items-center space-x-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Cart</span>
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">
                  Welcome, {userDetails?.name || currentUser?.displayName || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 hover:underline"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;