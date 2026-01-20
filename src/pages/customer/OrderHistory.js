'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/myContext';
import { getUserOrders } from '../../services/orders/orderService';

const OrderHistory = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchUserOrders();
  }, [isAuthenticated, navigate, currentUser?.uid]);

  const fetchUserOrders = async () => {
    if (!currentUser?.uid) return;

    setLoading(true);
    setError('');

    try {
      const result = await getUserOrders(currentUser.uid);
      if (result.success) {
        setOrders(result.orders || []);
      } else {
        setError(result.error || 'Failed to load orders');
      }
    } catch (err) {
      console.error('[v0] Error fetching orders:', err);
      setError('An error occurred while fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-50 border-yellow-200 text-yellow-800',
      'Packed': 'bg-blue-50 border-blue-200 text-blue-800',
      'Out for Delivery': 'bg-purple-50 border-purple-200 text-purple-800',
      'Delivered': 'bg-green-50 border-green-200 text-green-800',
    };
    return statusColors[status] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': '📋',
      'Packed': '📦',
      'Out for Delivery': '🚚',
      'Delivered': '✅',
    };
    return icons[status] || '❓';
  };

  const getStatusStep = (status) => {
    const steps = {
      'Pending': 0,
      'Packed': 1,
      'Out for Delivery': 2,
      'Delivered': 3,
    };
    return steps[status] || 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  const statusOptions = ['all', 'Pending', 'Packed', 'Out for Delivery', 'Delivered'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="inline-block">
                <svg className="animate-spin h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">Track your orders and check their delivery status</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="mb-8 flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filterStatus === status
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-green-500 hover:bg-green-50'
              }`}
            >
              {status === 'all' ? 'All Orders' : status}
              {status !== 'all' && (
                <span className="ml-2 text-sm">
                  ({orders.filter(o => o.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 sm:p-12 text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === 'all'
                ? "You haven't placed any orders yet. Start shopping now!"
                : `No orders with status "${filterStatus}"`}
            </p>
            <Link
              to="/products"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                {/* Order Header */}
                <div
                  onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                  className="p-6 sm:p-8 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">Order #{order.id?.substring(0, 8)}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)} {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:gap-6 text-sm text-gray-700">
                        <p><span className="font-semibold">Items:</span> {order.items?.length || 0}</p>
                        <p><span className="font-semibold">Total:</span> ${order.total?.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <div className="flex-shrink-0">
                      <svg
                        className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                          expandedOrderId === order.id ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                {expandedOrderId === order.id && (
                  <div className="border-t border-gray-200 px-6 sm:px-8 py-8">
                    {/* Timeline Steps */}
                    <div className="mb-8">
                      <h4 className="text-sm font-semibold text-gray-900 mb-6">Delivery Progress</h4>
                      <div className="flex justify-between relative">
                        {/* Timeline Line */}
                        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0">
                          <div
                            className="h-full bg-green-600 transition-all duration-500"
                            style={{
                              width: `${(getStatusStep(order.status) / 3) * 100}%`,
                            }}
                          />
                        </div>

                        {/* Timeline Steps */}
                        {['Pending', 'Packed', 'Out for Delivery', 'Delivered'].map((step, index) => (
                          <div key={step} className="flex flex-col items-center z-10">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                                getStatusStep(order.status) >= index
                                  ? 'bg-green-600 text-white shadow-lg'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {getStatusStep(order.status) > index ? '✓' : index + 1}
                            </div>
                            <p className="text-xs font-medium text-gray-700 mt-3 text-center">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="border-t border-gray-200 pt-8">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Order Details</h4>

                      {/* Items */}
                      <div className="mb-6">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Items Ordered</h5>
                        <div className="space-y-2">
                          {order.items?.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing Breakdown */}
                      <div className="mb-6 bg-gray-50 rounded-lg p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-700">Subtotal</span>
                            <span className="font-medium text-gray-900">${order.subtotal?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-700">Tax</span>
                            <span className="font-medium text-gray-900">${order.tax?.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                            <span className="font-semibold text-gray-900">Total</span>
                            <span className="font-bold text-green-600 text-lg">
                              ${order.total?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="text-sm font-medium text-blue-900 mb-2">Delivery Address</h5>
                        <p className="text-sm text-blue-900">
                          <span className="font-medium">{order.customerInfo?.fullName}</span>
                          <br />
                          {order.customerInfo?.address}
                          <br />
                          {order.customerInfo?.city}, {order.customerInfo?.postalCode}
                          <br />
                          {order.customerInfo?.phone}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <Link
                          to={`/order-confirmation/${order.id}`}
                          className="flex-1 inline-block text-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          View Details
                        </Link>
                        {order.status === 'Delivered' && (
                          <button
                            onClick={() => console.log('[v0] Reorder functionality would go here')}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Reorder
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Back to Shopping */}
        <div className="mt-12 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
