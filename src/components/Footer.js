import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">DairyDrop</h3>
            <p className="text-gray-600 text-sm">
              Your one-stop online store for fresh dairy products delivered to your doorstep.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-green-600 text-sm transition-colors">Home</a></li>
              <li><a href="/products" className="text-gray-600 hover:text-green-600 text-sm transition-colors">Products</a></li>
              <li><a href="/cart" className="text-gray-600 hover:text-green-600 text-sm transition-colors">Cart</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: info@dairydrop.com</li>
              <li>Phone: +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-600 text-sm">&copy; 2026 DairyDrop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;