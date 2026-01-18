import React from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  // Sample cart items - will be replaced with Firebase state
  const cartItems = [
    { id: 1, name: 'Fresh Milk', price: 4.99, quantity: 2 },
    { id: 2, name: 'Cheddar Cheese', price: 8.99, quantity: 1 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">Shopping Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl">🥛</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-green-600 font-semibold">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors">
                        -
                      </button>
                      <span className="px-4 py-1 border-x border-gray-300 font-medium">{item.quantity}</span>
                      <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors">
                        +
                      </button>
                    </div>
                    <button className="text-red-500 hover:text-red-700 transition-colors p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-gray-900">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link 
                to="/checkout"
                className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg mb-3"
              >
                Proceed to Checkout
              </Link>
              <Link 
                to="/products"
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-center py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Start adding some delicious dairy products to your cart!</p>
          <Link 
            to="/products"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;