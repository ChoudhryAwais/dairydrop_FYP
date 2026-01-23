import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/myContext';
import { logoutUser } from '../services/auth/authService';
// Optional: You can import an icon for the cart if you like
// import { FaShoppingCart } from 'react-icons/fa';

const Header = ({ hideAuthStatus = false }) => {
  const { isAuthenticated, currentUser, userDetails } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  // If hideAuthStatus is true, pretend user is not authenticated for UI purposes
  const showAsAuthenticated = isAuthenticated && !hideAuthStatus;

  // --- Helper: Dynamic Styles for Active Links ---
  // This creates the "pill" shape highlight effect
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    const baseStyle = "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out";
    
    // Active State: Green background, dark green text
    if (isActive) {
      return `${baseStyle} bg-green-100 text-green-800 shadow-sm`;
    }
    // Inactive State: Gray text, subtle hover effect
    return `${baseStyle} text-gray-600 hover:text-green-700 hover:bg-green-50`;
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        
        {/* Flex container with justify-between to separate Left, Center, Right */}
        <div className="flex items-center justify-between">
          
          {/* --- LEFT: Logo Area --- */}
          <div className="flex-shrink-0">
            <Link to={isAdminPage ? '/admin/dashboard' : '/'} className="flex items-center gap-2 group">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
                DD
              </div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight group-hover:text-green-700 transition-colors hidden sm:block">
                DairyDrop
              </h1>
            </Link>
          </div>

          {/* --- CENTER: Navigation Links (Home, Products, Cart) --- */}
          {/* We hide this on Admin pages or Mobile (hidden md:flex) */}
          {!isAdminPage && (
            <nav className="hidden md:flex items-center justify-center space-x-1 absolute left-1/2 -translate-x-1/2">
              <Link to="/" className={getLinkClass('/')}>
                Home
              </Link>
              
              <Link to="/products" className={getLinkClass('/products')}>
                Products
              </Link>
              
              <Link to="/cart" className={getLinkClass('/cart')}>
                {/* Optional: Add a subtle badge if cart has items */}
                Cart
              </Link>
            </nav>
          )}

          {/* --- RIGHT: User Actions / Auth --- */}
          <div className="flex-shrink-0 flex items-center gap-4">
            
            {showAsAuthenticated ? (
              <>
                {/* User Dropdown / Welcome Area */}
                <div className="flex items-center gap-4">
                  {!isAdminPage && (
                    <div className="hidden lg:flex items-center gap-4 text-sm font-medium text-gray-600">
                      <Link to="/order-history" className="hover:text-green-600 transition-colors">Orders</Link>
                      <Link to="/profile" className="hover:text-green-600 transition-colors">Profile</Link>
                    </div>
                  )}
                  
                  <div className="h-6 w-px bg-gray-200 hidden lg:block"></div>

                  <span className="text-sm font-semibold text-gray-800 hidden sm:block">
                    Hi, {userDetails?.displayName?.split(' ')[0] || 'User'}
                  </span>
                  
                  <button
                    onClick={handleLogout}
                    className="text-sm bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              // Login Button for Guests
              !isAdminPage && (
                <Link 
                  to="/login" 
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium text-sm shadow-md shadow-green-200 transition-all hover:shadow-lg"
                >
                  Login
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;