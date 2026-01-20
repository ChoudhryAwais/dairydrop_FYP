'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { getAllOrders, updateOrderStatus } from '../../services/orders/orderService';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch all orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const result = await getAllOrders();
        if (result.success) {
          setOrders(result.orders);
          setFilteredOrders(result.orders);
          setError('');
        } else {
          setError('Failed to load orders');
        }
      } catch (err) {
        setError('Error fetching orders');
        console.log('[v0] Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on status and search term
  useEffect(() => {
    let filtered = orders;

    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        order =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.customerEmail && order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm]);

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        // Update local state
        const updatedOrders = orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        setError('');
      } else {
        setError('Failed to update order status');
      }
    } catch (err) {
      setError('Error updating order status');
      console.log('[v0] Error updating status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Orders Management</h1>
            <p className="text-gray-600">Manage all customer orders and track revenue</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 font-medium text-sm">Total Orders</h3>
                <span className="text-3xl">📦</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
              <p className="text-gray-500 text-xs mt-2">{pendingOrders} pending</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 font-medium text-sm">Total Revenue</h3>
                <span className="text-3xl">💰</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</p>
              <p className="text-gray-500 text-xs mt-2">{deliveredOrders} delivered</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 font-medium text-sm">Completion Rate</h3>
                <span className="text-3xl">✓</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {orders.length > 0 ? Math.round((deliveredOrders / orders.length) * 100) : 0}%
              </p>
              <p className="text-gray-500 text-xs mt-2">of orders completed</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
                <input
                  type="text"
                  placeholder="Search by Order ID, Email, or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="bg-white p-12 rounded-xl shadow-md border border-gray-200 text-center">
              <p className="text-gray-600 text-lg">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-md border border-gray-200 text-center">
              <p className="text-gray-600 text-lg">No orders found</p>
            </div>
          ) : (
            /* Orders Table */
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Items</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          <span className="text-green-600">{order.id.substring(0, 8)}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div>
                            <p className="font-medium">{order.customerName || 'Unknown'}</p>
                            <p className="text-gray-500 text-xs">{order.customerEmail || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                          ${(order.totalAmount || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {order.items?.length || 0} item(s)
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowDetails(true);
                            }}
                            className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700 font-bold text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Order ID</p>
                  <p className="text-gray-800 font-semibold">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Order Date</p>
                  <p className="text-gray-800 font-semibold">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Name</p>
                    <p className="text-gray-800">{selectedOrder.customerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Email</p>
                    <p className="text-gray-800">{selectedOrder.customerEmail || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Phone</p>
                    <p className="text-gray-800">{selectedOrder.customerPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Delivery Address</p>
                    <p className="text-gray-800 text-sm">{selectedOrder.shippingAddress || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Items</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Amount */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600 font-medium">Total Amount:</p>
                  <p className="text-2xl font-bold text-gray-800">${(selectedOrder.totalAmount || 0).toFixed(2)}</p>
                </div>

                {/* Status Update */}
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Update Status</label>
                  <div className="flex gap-2 flex-wrap">
                    {statusOptions.map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                        disabled={updatingStatus || status === selectedOrder.status}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          status === selectedOrder.status
                            ? 'bg-green-600 text-white cursor-default'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
