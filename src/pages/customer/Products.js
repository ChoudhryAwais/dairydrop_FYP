'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProducts } from '../../services/products/productService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import ProductCard from '../../components/ProductCard';
import { Leaf } from "lucide-react";
import { MdClose, MdInventory } from 'react-icons/md';

const Products = () => {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [maxPrice, setMaxPrice] = useState(100);
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedFatContent, setSelectedFatContent] = useState('All');
  const [addedNotification, setAddedNotification] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const categories = ['All Products', 'Milk', 'Cheese', 'Yogurt', 'Butter', 'Cream', 'Ghee', 'Ice Cream', 'Other'];
  const fatContentOptions = ['All', 'Full Fat', 'Low Fat', 'Fat Free', 'Reduced Fat'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await getProducts();
        if (result.success) {
          setProducts(result.products);
          setFilteredProducts(result.products);

          // Calculate max price
          if (result.products.length > 0) {
            const max = Math.max(...result.products.map(p => p.price));
            setMaxPrice(Math.ceil(max));
            setPriceRange([0, Math.ceil(max)]);
          }
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        console.error('[v0] Error fetching products:', err);
        setError('Error loading products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle category from URL parameter
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'All Products') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Brand filter
    if (selectedBrand !== 'All Brands') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Fat content filter
    if (selectedFatContent !== 'All') {
      filtered = filtered.filter(product => product.fatContent === selectedFatContent);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedCategory, searchTerm, priceRange, selectedBrand, selectedFatContent, products]);

  const handleAddToCart = (product) => {
    const result = addToCart(product, 1);
    if (result.success) {
      setAddedNotification(product.id);
      setNotificationMessage(result.message);
      setNotificationType('success');
    } else {
      setNotificationMessage(result.message);
      setNotificationType('error');
    }
    setTimeout(() => {
      setAddedNotification(null);
      setNotificationMessage('');
    }, 3000);
  };

  // Pagination calculation
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="space-y-0"
    >
      {/* Notification */}
      {notificationMessage && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-fade-in ${notificationType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
          {notificationMessage}
        </div>
      )}

      {/* Banner Header */}
      <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white py-16 px-6 text-center mb-12">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Leaf className="w-20 h-20 absolute top-6 left-16 scale-x-[-1] text-white" />
          <Leaf className="w-32 h-32 absolute bottom-6 right-44 scale-x-[-1] rotate-45 text-white" />
        </div>
        <div className="relative z-10">
          <p className="text-sm font-bold tracking-wider uppercase mb-2">100% Organic & Fresh</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Fresh From The Farm</h1>
          <p className="text-green-50 text-lg max-w-2xl mx-auto">
            Browse our wide selection of 100% organic dairy products. Sourced directly from local farmers to your breakfast table.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 space-y-8">
        {(loading || products.length > 0) && (
          <>
            {/* Top Bar with Results and Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-lg">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredProducts.length}</span> Results
              </div>
              <div className="flex-1 sm:flex-none sm:w-64">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Active Filter Tags */}
            {(selectedCategory !== 'All Products' || searchTerm || selectedBrand !== 'All Brands' || selectedFatContent !== 'All') && (
              <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-lg">
                <span className="text-sm text-gray-600">Active Filters:</span>
                {selectedCategory !== 'All Products' && (
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    <span>Category: {selectedCategory}</span>
                    <button onClick={() => setSelectedCategory('All Products')} className="hover:text-green-900">
                      <MdClose />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory('All Products');
                    setSearchTerm('');
                    setPriceRange([0, maxPrice]);
                    setSelectedBrand('All Brands');
                    setSelectedFatContent('All');
                  }}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Filters and Products Container */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <div className="lg:w-56 flex-shrink-0">
                <div className="space-y-6 bg-white p-6 rounded-lg h-fit">
                  {/* Category Filter */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center justify-between cursor-pointer">
                      Category
                    </h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategory === category}
                            onChange={() => setSelectedCategory(category)}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700 hover:text-gray-900">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="border-t pt-4">
                    <h3 className="font-bold text-gray-900 mb-3">Price Range</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max={maxPrice}
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                        <input
                          type="range"
                          min="0"
                          max={maxPrice}
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fat Content Filter */}
                  <div className="border-t pt-4">
                    <h3 className="font-bold text-gray-900 mb-3">Fat Content</h3>
                    <div className="space-y-2">
                      {fatContentOptions.map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFatContent === option}
                            onChange={() => setSelectedFatContent(option)}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700 hover:text-gray-900">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div className="border-t pt-4">
                    <h3 className="font-bold text-gray-900 mb-3">Brands</h3>
                    <div className="space-y-2">
                      {Array.from(new Set(products.map(p => p.brand).filter(Boolean))).slice(0, 5).map(brand => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedBrand === brand}
                            onChange={() => setSelectedBrand(brand)}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700 hover:text-gray-900">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  <div className="border-t pt-4">
                    <button
                      onClick={() => {
                        setSelectedCategory('All Products');
                        setSearchTerm('');
                        setPriceRange([0, maxPrice]);
                        setSelectedBrand('All Brands');
                        setSelectedFatContent('All');
                      }}
                      className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="flex-1">
                {loading ? (
                  <div className="min-h-[60vh] flex items-center justify-center">
                    <LoadingSpinner size="lg" message="Loading products..." />
                  </div>
                ) : error ? (
                  <ErrorMessage message={error} type="error" />
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      No products available
                    </h3>
                    <p className="text-gray-600">
                      Check back soon for new dairy products!
                    </p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={() => handleAddToCart(product)}
                        showAddToCart={true}
                        showViewDetails={true}
                        isAdmin={false}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {filteredProducts.length > itemsPerPage && (
                  <div className="mt-8 md:mt-10 flex items-center justify-center gap-1.5 md:gap-2">
                    <button 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[32px] h-8 md:min-w-[40px] md:h-10 px-2 md:px-3 rounded-lg font-semibold text-xs md:text-sm transition-all ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-110'
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-500 hover:text-green-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Products;
