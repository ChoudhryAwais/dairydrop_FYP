'use client';

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '🛒' },
    { path: '/admin/orders', label: 'Orders', icon: '📦' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/reviews', label: 'Reviews', icon: '⭐' },
    { path: '/', label: 'Back to Store', icon: '🏠' },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-green-600 to-emerald-600 text-white transition-all duration-300 z-40 ${
          isOpen ? 'w-64' : 'w-20'
        } shadow-2xl`}
      >
        {/* Header */}
        <div className="p-4 border-b border-green-500 flex items-center justify-between">
          {isOpen && <h2 className="text-xl font-bold">DairyDrop Admin</h2>}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-green-500 rounded-lg transition-colors duration-200"
          >
            {isOpen ? '✕' : '≡'}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="mt-8 space-y-2 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-white text-green-600 shadow-lg'
                  : 'text-white hover:bg-green-500'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content Spacer */}
      <div className={isOpen ? 'ml-64' : 'ml-20'} />
    </>
  );
};

export default Sidebar;
