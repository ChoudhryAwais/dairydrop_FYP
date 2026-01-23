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
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group h-full flex flex-col border border-gray-100">
      {/* Product Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-6xl">🥛</div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
          {!isOutOfStock && product.isNew && (
            <div className="px-3 py-1 bg-teal-500 text-white text-xs font-bold rounded-lg">
              NEW
            </div>
          )}
          <div className="px-3 py-1 bg-teal-500 text-white text-xs font-bold rounded-lg">
            ORGANIC
          </div>
        </div>

        {/* Add to Cart Button - Floating */}
        {!isAdmin && showAddToCart && (
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isLoading}
            className={`absolute bottom-4 right-4 w-12 h-12 rounded-full font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
            }`}
          >
            {isLoading ? (
              <span className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full"></span>
            ) : isAdded ? (
              '✓'
            ) : (
              '+'
            )}
          </button>
        )}
      </div>

      {/* Product Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category Badge */}
        <span className="inline-block text-teal-700 text-xs font-bold uppercase tracking-wider mb-2 w-fit">
          {product.category}
        </span>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 flex-grow">
          {product.name}
        </h3>

        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 mb-2">
            Brand: <span className="font-medium text-gray-700">{product.brand}</span>
          </p>
        )}

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Size/Quantity */}
        {product.size && (
          <p className="text-xs text-gray-600 mb-2">
            {product.size}
          </p>
        )}

        {/* Price and Stock Info */}
        <div className="flex items-center justify-between mb-4 py-2 border-t border-b border-gray-100">
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
      </div>

      {/* Action Buttons */}
      {isAdmin ? (
        <div className="flex gap-2 p-4 border-t border-gray-100">
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
        </div>
      ) : showViewDetails ? (
        <Link
          to={`/products/${product.id}`}
          className="mx-4 mb-4 py-2 text-center border-2 border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          Details
        </Link>
      ) : null}
    </div>
  );
};

export default ProductCard;
