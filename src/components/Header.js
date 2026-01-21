import React from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { useAuth } from '../context/myContext';
import { logoutUser } from '../services/auth/authService';

const Header = () => {
  const { isAuthenticated, currentUser, userDetails } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link to={isAdminPage ? '/admin/dashboard' : '/'}
            className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">
              DD
            </div>
            <h1 className="text-2xl font-bold text-gray-800 hover:text-green-600 transition-colors">
              DairyDrop Store
            </h1>
          </Link>
          <nav className="flex items-center space-x-6">
            {!isAdminPage && (
              <>
                <Link to="/" className="text-gray-700 hover:text-green-600 font-medium hover:underline">
                  Home
                </Link>

                <Link to="/products" className="text-gray-700 hover:text-green-600 font-medium hover:underline">
                  Products
                </Link>

                {isAuthenticated && (
                  <>
                    <Link to="/order-history" className="text-gray-700 hover:text-green-600 font-medium hover:underline">
                      Orders
                    </Link>

                    <Link to="/profile" className="text-gray-700 hover:text-green-600 font-medium hover:underline">
                      Profile
                    </Link>
                  </>
                )}

                <Link
                  to="/cart"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm flex items-center space-x-1"
                >
                  <span>Cart</span>
                </Link>
              </>
            )}

            {/* Auth section (shown on both admin & user pages) */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">
                  Welcome, {userDetails?.displayName || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              !isAdminPage && (
                <Link to="/login" className="text-gray-700 hover:text-green-600 font-medium hover:underline">
                  Login
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;