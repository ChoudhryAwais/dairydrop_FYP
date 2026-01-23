'use client';

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProducts } from '../../services/products/productService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import ProductCard from '../../components/ProductCard';

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

  const categories = ['All Products', 'Milk', 'Cheese', 'Yogurt', 'Butter', 'Cream', 'Ghee', 'Ice Cream', 'Other'];
  const fatContentOptions = ['All', 'Full Fat', 'Low Fat', 'Fat Free', 'Reduced Fat'];
  const sampleProducts = [
    { id: 1, name: 'Milk', category: 'Milk', price: 2.99 },
    { id: 2, name: 'Cheese', category: 'Cheese', price: 4.99 },
    { id: 3, name: 'Yogurt', category: 'Yogurt', price: 1.99 },
    { id: 4, name: 'Butter', category: 'Butter', price: 3.99 },
  ];

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

  return (
    <div className="space-y-8">
      {/* Notification */}
      {notificationMessage && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-fade-in ${
          notificationType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {notificationMessage}
        </div>
      )}
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Dairy Products</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Explore our fresh selection of dairy products sourced from local farms.
        </p>
      </div>

      {products.length > 0 && (
        <>
          {/* Search Bar */}
          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filter/Category Section */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Advanced Filters */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option>All Brands</option>
                  {Array.from(new Set(products.map(p => p.brand).filter(Boolean))).map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Fat Content Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fat Content
                </label>
                <select
                  value={selectedFatContent}
                  onChange={(e) => setSelectedFatContent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {fatContentOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSelectedCategory('All Products');
                  setSearchTerm('');
                  setPriceRange([0, maxPrice]);
                  setSelectedBrand('All Brands');
                  setSelectedFatContent('All');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </>
      )}

      {/* Products Grid */}
      {loading ? (
        <LoadingSpinner size="md" message="Loading products..." />
      ) : error ? (
        <ErrorMessage message={error} type="error" />
      ) : products.length === 0 ? (
        /* No products at all */
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
        /* Products exist, but filters returned nothing */
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
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
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
    </div>
  );
};

export default Products;
