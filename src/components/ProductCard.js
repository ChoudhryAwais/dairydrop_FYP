'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * ProductCard Component
 * Reusable product display card used across Products, Cart, Admin, and Orders pages
 * 
 * @param {Object} product - Product data object
 * @param {string} product.id - Product ID
 * @param {string} product.name - Product name
 * @param {number} product.price - Product price
 * @param {string} product.category - Product category
 * @param {string} product.imageUrl - Product image URL
 * @param {number} product.quantity - Available stock quantity
 * @param {string} product.description - Product description
 * @param {Function} onAddToCart - Callback function for add to cart button
 * @param {boolean} showAddToCart - Show/hide add to cart button (default: true)
 * @param {boolean} showViewDetails - Show/hide view details button (default: true)
 * @param {Function} onEdit - Callback for edit button (admin only)
 * @param {Function} onDelete - Callback for delete button (admin only)
 * @param {boolean} isAdmin - Show admin controls (default: false)
 */
const ProductCard = ({
  product,
  onAddToCart,
  onEdit,
  onDelete,
  showAddToCart = true,
  showViewDetails = true,
  isAdmin = false,
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (onAddToCart) {
      setIsLoading(true);
      try {
        const result = await onAddToCart(product);
        if (result && result.success) {
          setIsAdded(true);
          setTimeout(() => setIsAdded(false), 2000);
        }
      } catch (error) {
        console.error('[v0] Error adding to cart:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isOutOfStock = product.quantity <= 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group h-full flex flex-col">
      {/* Product Image Container */}
      <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-6xl">🥛</div>
        )}
        
        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <div className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
              Out of Stock
            </div>
          ) : product.quantity < 5 ? (
            <div className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
              Low Stock
            </div>
          ) : null}
        </div>
      </div>

      {/* Product Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category Badge */}
        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-2 w-fit">
          {product.category}
        </span>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 flex-grow">
          {product.name}
        </h3>

        {/* Brand (optional) */}
        {product.brand && (
          <p className="text-xs text-gray-500 mb-2">
            Brand: <span className="font-medium text-gray-700">{product.brand}</span>
          </p>
        )}

        {/* Description (optional) */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price and Stock Info */}
        <div className="flex items-center justify-between mb-4 py-2 border-t border-b border-gray-200">
          <div>
            <span className="text-2xl font-bold text-green-600">
              ${product.price?.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500 ml-1">per unit</span>
          </div>
          {!isAdmin && (
            <span className={`text-xs font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {isOutOfStock ? 'Out of Stock' : `${product.quantity} available`}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          {isAdmin ? (
            <>
              <button
                onClick={() => onEdit?.(product)}
                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(product)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              {showViewDetails && (
                <Link
                  to={`/products/${product.id}`}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-center py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
                >
                  Details
                </Link>
              )}
              {showAddToCart && (
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isLoading}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors duration-200 text-sm ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : isOutOfStock
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-1">
                      <span className="animate-spin inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full"></span>
                      Adding...
                    </span>
                  ) : isAdded ? (
                    '✓ Added'
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
