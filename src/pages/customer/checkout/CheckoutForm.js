import React from 'react';
import { Link } from 'react-router-dom';
import { InlineSpinner } from '../../../components/LoadingSpinner';

const CheckoutForm = ({
  formData,
  errors,
  loading,
  cartItems,
  handleChange,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
            <span className="text-green-600 font-bold">1</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Contact Information</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              placeholder="John Doe"
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              placeholder="john@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
            <span className="text-green-600 font-bold">2</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Shipping Address</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              placeholder="123 Main Street"
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                placeholder="New York"
              />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${errors.postalCode ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                placeholder="10001"
              />
              {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
            <span className="text-green-600 font-bold">3</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Method</h2>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 sm:p-6 flex items-start gap-4">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
          <div>
            <p className="font-semibold text-blue-900 mb-1">Cash on Delivery (COD)</p>
            <p className="text-sm text-blue-800">Pay securely when your order arrives at your doorstep. No prepayment required.</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          disabled={loading || cartItems.length === 0}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <InlineSpinner size="sm" color="white" />
              Processing Order...
            </div>
          ) : (
            'Place Order'
          )}
        </button>

        <Link
          to="/cart"
          className="flex-1 sm:flex-none px-6 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-900 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Cart
        </Link>
      </div>
    </form>
  );
};

export default CheckoutForm;
