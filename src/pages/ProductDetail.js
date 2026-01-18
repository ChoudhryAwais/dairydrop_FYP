import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  
  // Sample product data - will be replaced with Firebase data
  const product = {
    id: id,
    name: 'Fresh Milk',
    price: 4.99,
    category: 'Milk',
    description: 'Premium quality fresh milk sourced from local dairy farms. Rich in calcium and essential nutrients.',
    inStock: true,
    quantity: 50,
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-green-600 transition-colors">Products</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Product Image */}
          <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl flex items-center justify-center h-96">
            <div className="text-9xl">🥛</div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full mb-3">
                {product.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-green-600">${product.price}</span>
                <span className="text-gray-500">per unit</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Availability:</span>
                {product.inStock ? (
                  <span className="flex items-center text-green-600 font-medium">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    In Stock ({product.quantity} available)
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors">
                  -
                </button>
                <span className="px-6 py-2 border-x border-gray-300 font-medium">1</span>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors">
                  +
                </button>
              </div>
              <button 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={!product.inStock}
              >
                Add to Cart
              </button>
            </div>

            <Link 
              to="/products"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;