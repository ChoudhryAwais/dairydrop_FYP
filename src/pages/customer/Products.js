'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProducts } from '../../services/products/productService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import ProductCard from '../../components/ProductCard';

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchTerm, setSearchTerm] = useState('');
  const [addedNotification, setAddedNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['All Products', 'Milk', 'Cheese', 'Yogurt', 'Butter'];
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

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedNotification(product.id);
    setTimeout(() => setAddedNotification(null), 2000);
  };

  return (
    <div className="space-y-8">
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
