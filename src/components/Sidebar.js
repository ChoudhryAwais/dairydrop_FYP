'use client';

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;

      setIsMobile((prev) => {
        // Only react when breakpoint changes
        if (prev !== mobile) {
          setIsOpen(!mobile); // desktop = open, mobile = closed
        }
        return mobile;
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '🛒' },
    { path: '/admin/orders', label: 'Orders', icon: '📦' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/reviews', label: 'Reviews', icon: '⭐' },
  ];

  return (
    <>
      {/* Mobile Menu Button - Only show when sidebar is closed */}
      {isMobile && !isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 z-50 p-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors duration-200 lg:hidden"
          aria-label="Open menu"
          style={{ top: '88px' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
          style={{ top: '70px', left: 0, right: 0, bottom: 0 }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 bg-gradient-to-b from-green-600 to-emerald-600 text-white transition-all duration-300 shadow-2xl
          ${isMobile
            ? `z-40 w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `z-30 ${isOpen ? 'w-64' : 'w-20'}`
          }`}
        style={isMobile ? { top: '70px', height: 'calc(100vh - 70px)' } : { top: '64px', height: 'calc(100vh - 64px)' }}
      >
        {/* Header */}
        <div className="p-4 border-b border-green-500 flex items-center justify-between">
          {isOpen && <h2 className="text-xl font-bold truncate">DairyDrop Admin</h2>}
          {/* Toggle button - different for mobile vs desktop */}
          {isMobile ? (
            isOpen && (
              <button
                onClick={closeSidebar}
                className="p-2 hover:bg-green-500 rounded-lg transition-colors duration-200 ml-auto"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )
          ) : (
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-green-500 rounded-lg transition-colors duration-200"
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                )}
              </svg>
            </button>
          )}
        </div>

        {/* Menu Items */}
        <nav className="mt-8 space-y-2 px-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={isMobile ? closeSidebar : undefined}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.path)
                  ? 'bg-white text-green-600 shadow-lg'
                  : 'text-white hover:bg-green-500'
                }`}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {isOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content Spacer - Only on desktop */}
      {!isMobile && <div className={`${isOpen ? 'ml-64' : 'ml-20'}`} />}
    </>
  );
};

export default Sidebar;
