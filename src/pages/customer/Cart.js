'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateCartItem, calculateTotals } = useCart();
  const { subtotal, tax, total } = calculateTotals();
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuantityUpdate = (itemId, newQuantity) => {
    const result = updateCartItem(itemId, newQuantity);
    if (!result.success) {
      setErrorMessage(result.message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Notification */}
      {errorMessage && (
        <div className="fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg bg-red-600 text-white animate-fade-in">
          {errorMessage}
        </div>
      )}
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" className="hover:text-gray-900">Dairy</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>

      {cartItems.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Your Cart 
              <span className="text-gray-500 font-normal text-lg ml-2">({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg overflow-hidden">
                {/* Table Header - Hidden on mobile */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="col-span-5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</div>
                  <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">Price</div>
                  <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">Quantity</div>
                  <div className="col-span-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">Total</div>
                </div>

                {/* Cart Items */}
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="px-4 sm:px-6 py-6 hover:bg-gray-50 transition-colors">
                      {/* Mobile Layout */}
                      <div className="md:hidden space-y-3">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                            {item.imageUrl ? (
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-2xl">🥛</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{item.sku || 'SKU: N/A'}</p>
                            <p className="text-sm text-green-600 font-semibold mt-1">✓ In Stock</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <div>
                            <p className="text-sm text-gray-600">Price</p>
                            <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                              <button 
                                onClick={() => handleQuantityUpdate(item.id, Math.max(1, item.quantity - 1))}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors font-semibold"
                              >
                                −
                              </button>
                              <span className="px-3 py-1 font-medium text-center w-8">{item.quantity}</span>
                              <button 
                                onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors font-semibold"
                              >
                                +
                              </button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors p-1"
                              title="Remove item"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <span className="text-gray-600 font-medium">Total</span>
                          <span className="text-lg font-bold text-green-600">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                        {/* Product */}
                        <div className="col-span-5 flex gap-4">
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                            {item.imageUrl ? (
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-2xl">🥛</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">SKU: {item.sku || 'N/A'}</p>
                            <p className="text-xs text-green-600 font-semibold mt-1">✓ In Stock</p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 text-center">
                          <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2 flex justify-center">
                          <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                            <button 
                              onClick={() => handleQuantityUpdate(item.id, Math.max(1, item.quantity - 1))}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors font-semibold"
                            >
                              −
                            </button>
                            <span className="px-3 py-1 font-medium text-center w-8">{item.quantity}</span>
                            <button 
                              onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors font-semibold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="col-span-3 flex justify-between items-center">
                          <span className="font-bold text-green-600">${(item.price * item.quantity).toFixed(2)}</span>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1 ml-2"
                            title="Remove item"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping Link */}
              <div className="mt-6">
                <Link 
                  to="/products"
                  className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm sticky top-24">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                </div>

                <div className="p-6 space-y-4 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping estimate</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax estimate <span className="text-xs text-gray-500">8%</span></span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold">Order Total</span>
                    <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <Link 
                    to="/checkout"
                    className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm-2 15l-5-5 1.41-1.41L10 12.17l7.59-7.59L19 6l-9 9z"/>
                    </svg>
                  </Link>
                  
                </div>

                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-center text-xs text-gray-500 gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5s-5 2.24-5 5v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6-2c1.66 0 3 1.34 3 3v2H9V6c0-1.66 1.34-3 3-3z"/>
                    </svg>
                    Secure Checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Start adding some delicious dairy products to your cart!</p>
            <Link 
              to="/products"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Browse Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
