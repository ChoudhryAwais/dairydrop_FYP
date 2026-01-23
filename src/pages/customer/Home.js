import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-8 py-16 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to DairyDrop
          </h1>
          <p className="text-xl md:text-2xl text-green-50 mb-8 max-w-2xl mx-auto">
            Your one-stop online store for fresh dairy products delivered to your doorstep.
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Browse by Category Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Link
            to="/products?category=Milk"
            className="group bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">🥛</div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">Milk</h3>
          </Link>

          <Link
            to="/products?category=Cheese"
            className="group bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 rounded-xl p-6 text-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">🧀</div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-yellow-600">Cheese</h3>
          </Link>

          <Link
            to="/products?category=Yogurt"
            className="group bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 rounded-xl p-6 text-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">🥄</div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-pink-600">Yogurt</h3>
          </Link>

          <Link
            to="/products?category=Butter"
            className="group bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 rounded-xl p-6 text-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">🧈</div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-amber-600">Butter</h3>
          </Link>

          <Link
            to="/products?category=Cream"
            className="group bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl p-6 text-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">🍶</div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600">Cream</h3>
          </Link>

          <Link
            to="/products?category=Ghee"
            className="group bg-gradient-to-br from-yellow-50 to-orange-100 hover:from-yellow-100 hover:to-orange-200 rounded-xl p-6 text-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">🫙</div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600">Ghee</h3>
          </Link>

          <Link
            to="/products?category=Ice Cream"
            className="group bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl p-6 text-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">🍨</div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600">Ice Cream</h3>
          </Link>

          <Link
            to="/products?category=Other"
            className="group bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl p-6 text-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">🛒</div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-600">Other</h3>
          </Link>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to get started?</h2>
        <p className="text-gray-600 mb-6">Browse our selection of fresh dairy products and place your order today!</p>
        <Link
          to="/products"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          View All Products
        </Link>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Fresh Products</h3>
          <p className="text-gray-600">All our dairy products are sourced fresh daily from local farms.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Fast Delivery</h3>
          <p className="text-gray-600">Get your dairy products delivered within 24 hours of ordering.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Best Prices</h3>
          <p className="text-gray-600">Competitive prices with regular discounts and offers for our customers.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;