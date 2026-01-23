'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/myContext';
import { getUserOrders } from '../../services/orders/orderService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const OrderHistory = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Declare expandedOrderId and setExpandedOrderId

  const getStatusColor = (status) => {
    const statusStyles = {
      'Pending': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      'Processing': 'bg-blue-50 text-blue-700 border border-blue-200',
      'Shipped': 'bg-purple-50 text-purple-700 border border-purple-200',
      'Out for Delivery': 'bg-blue-50 text-blue-700 border border-blue-200',
      'Delivered': 'bg-green-50 text-green-700 border border-green-200',
      'Cancelled': 'bg-red-50 text-red-700 border border-red-200',
    };
    return statusStyles[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
  };

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

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Pending': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      'Processing': 'bg-blue-50 text-blue-700 border border-blue-200',
      'Shipped': 'bg-purple-50 text-purple-700 border border-purple-200',
      'Out for Delivery': 'bg-blue-50 text-blue-700 border border-blue-200',
      'Delivered': 'bg-green-50 text-green-700 border border-green-200',
      'Cancelled': 'bg-red-50 text-red-700 border border-red-200',
    };
    return statusStyles[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': '📋',
      'Processing': '⚙️',
      'Shipped': '🚚',
      'Out for Delivery': '🚚',
      'Delivered': '✓',
      'Cancelled': '✕',
    };
    return icons[status] || '❓';
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

  const getStatusStep = (status) => {
    const steps = {
      'Pending': 0,
      'Processing': 1,
      'Shipped': 2,
      'Delivered': 3,
      'Cancelled': -1, // Cancelled is not shown in timeline
    };
    return steps[status] ?? 0;
  };

  const filteredOrders = filterStatus === 'all'
    ? orders.filter(order => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const orderIdMatch = order.id?.toLowerCase().includes(query);
        const productNameMatch = order.items?.some(item => item.name?.toLowerCase().includes(query));
        return orderIdMatch || productNameMatch;
      })
    : orders.filter(order => {
        if (order.status !== filterStatus) return false;
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const orderIdMatch = order.id?.toLowerCase().includes(query);
        const productNameMatch = order.items?.some(item => item.name?.toLowerCase().includes(query));
        return orderIdMatch || productNameMatch;
      });

  // Pagination
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner size="lg" message="Loading your orders..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/profile" className="hover:text-gray-900">My Account</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Order History</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
        </div>

        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error}
            type="error"
            dismissible={true}
            onDismiss={() => setError('')}
          />
        )}

        {/* Filters Section */}
        <div className="mb-8 bg-white rounded-lg p-4 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search orders by ID or product"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Date Filter */}
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Last 6 Months</option>
            <option>All Time</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="all">Status: All</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
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
          <div>
            {/* Orders List */}
            <div className="space-y-6">
              {paginatedOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Desktop View */}
                  <div className="hidden md:block">
                    {/* Collapsible Header */}
                    <button
                      onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                      className="w-full p-6 flex items-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        {/* Header Row */}
                        <div className="grid grid-cols-12 gap-6 mb-4 pb-4 border-b border-gray-200">
                          <div className="col-span-3 text-left">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Order Placed</p>
                            <p className="text-sm text-gray-900 font-medium">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          </div>
                          <div className="col-span-2 text-left">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Order ID</p>
                            <p className="text-sm text-gray-900 font-medium">ORD-{order.id?.substring(0, 4).toUpperCase()}</p>
                          </div>
                          <div className="col-span-2 text-left">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Total Amount</p>
                            <p className="text-sm text-gray-900 font-bold">${order.total?.toFixed(2)}</p>
                          </div>
                          <div className="col-span-5 flex items-end justify-end">
                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusBadge(order.status)}`}>
                              {getStatusIcon(order.status)} {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Products Row */}
                        <div className="grid grid-cols-12 gap-6 items-center">
                          {/* Product Thumbnails */}
                          <div className="col-span-3 flex gap-2">
                            {order.items?.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                                {item.imageUrl ? (
                                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                                ) : (
                                  <span className="text-lg">🥛</span>
                                )}
                              </div>
                            ))}
                            {order.items?.length > 3 && (
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                <span className="text-lg font-bold text-gray-600">+{order.items.length - 3}</span>
                              </div>
                            )}
                          </div>

                          {/* Product Names */}
                          <div className="col-span-2">
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {order.items?.map(item => item.name).join(', ')}
                            </p>
                          </div>

                          {/* View Invoice */}
                          <div className="col-span-2 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1 justify-end"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              View Invoice
                            </button>
                          </div>

                          {/* Expand Icon */}
                          <div className="col-span-5 flex justify-end">
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
                    </button>

                    {/* Expanded Details */}
                    {expandedOrderId === order.id && (
                      <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-6">
                        {/* Items List */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                          <div className="space-y-3">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                                    {item.imageUrl ? (
                                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                                    ) : (
                                      <span className="text-lg">🥛</span>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Subtotal</span>
                              <span className="font-medium text-gray-900">${order.subtotal?.toFixed(2) || order.total?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Tax</span>
                              <span className="font-medium text-gray-900">${order.tax?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                              <span className="font-semibold text-gray-900">Total</span>
                              <span className="font-bold text-green-600 text-lg">${order.total?.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Delivery Address */}
                        {order.customerInfo && (
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">{order.customerInfo.fullName}</span>
                              <br />
                              {order.customerInfo.address}
                              <br />
                              {order.customerInfo.city}, {order.customerInfo.postalCode}
                              <br />
                              {order.customerInfo.phone}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button className="flex-1 text-teal-600 hover:text-teal-700 text-sm font-medium py-2 border border-teal-600 rounded-lg transition-colors">
                            View Invoice
                          </button>
                          {order.status === 'Delivered' && (
                            <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                              Buy Again
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden">
                    {/* Collapsible Header */}
                    <button
                      onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                      className="w-full p-4 space-y-4 hover:bg-gray-50 transition-colors"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div className="text-left">
                          <p className="text-xs text-gray-500 font-semibold uppercase">Order Placed</p>
                          <p className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          <p className="text-xs text-gray-500 mt-1">ORD-{order.id?.substring(0, 4).toUpperCase()}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Products */}
                      <div className="flex gap-2">
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden border border-gray-200">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-sm">🥛</span>
                            )}
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                            <span className="text-xs font-bold">+{order.items.length - 3}</span>
                          </div>
                        )}
                      </div>

                      {/* Amount */}
                      <div className="border-t border-gray-200 pt-3 flex justify-between">
                        <p className="text-xs text-gray-500">Total:</p>
                        <p className="text-sm font-bold text-gray-900">${order.total?.toFixed(2)}</p>
                      </div>
                    </button>

                    {/* Expanded Details */}
                    {expandedOrderId === order.id && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
                        {/* Items List */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                          <div className="space-y-2">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="bg-white p-2 rounded border border-gray-200 text-xs">
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <div className="flex justify-between mt-1">
                                  <span className="text-gray-600">Qty: {item.quantity}</span>
                                  <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded border border-gray-200 p-3 text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">${order.subtotal?.toFixed(2) || order.total?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium">${order.tax?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="border-t border-gray-200 pt-1 flex justify-between font-semibold">
                            <span>Total</span>
                            <span className="text-green-600">${order.total?.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Delivery Address */}
                        {order.customerInfo && (
                          <div className="bg-white rounded border border-gray-200 p-3 text-xs">
                            <h4 className="font-semibold text-gray-900 mb-1">Delivery Address</h4>
                            <p className="text-gray-700">
                              <span className="font-medium">{order.customerInfo.fullName}</span>
                              <br />
                              {order.customerInfo.address}
                              <br />
                              {order.customerInfo.city}, {order.customerInfo.postalCode}
                              <br />
                              {order.customerInfo.phone}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <button className="w-full text-teal-600 font-medium py-2 border border-teal-600 rounded text-sm transition-colors">
                            View Invoice
                          </button>
                          {order.status === 'Delivered' && (
                            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded text-sm transition-colors">
                              Buy Again
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button className="px-2 py-1 text-gray-600 hover:text-gray-900 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded font-medium text-sm transition-colors ${
                      currentPage === page
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-2 py-1 text-gray-600 hover:text-gray-900 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
