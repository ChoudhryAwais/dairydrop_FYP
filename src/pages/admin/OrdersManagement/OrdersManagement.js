'use client';

import React, { useState, useEffect } from 'react';
import ErrorMessage from '../../../components/ErrorMessage';
import { getAllOrders, updateOrderStatus } from '../../../services/orders/orderService';
import OrderStatistics from './OrderStatistics';
import OrdersList from './OrdersList';

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
          (order.customerInfo.email && order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.customerInfo.fullName && order.customerInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
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

  // Calculate statistics
  const totalRevenue = orders
    .filter(order => order.status === 'Delivered')
    .reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const processingOrders = orders.filter(o => o.status === 'Processing').length;
  const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Orders Management</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage all customer orders and track revenue</p>
          </div>

          {/* Statistics Cards */}
          <OrderStatistics
            orders={orders}
            totalRevenue={totalRevenue}
            pendingOrders={pendingOrders}
            processingOrders={processingOrders}
            shippedOrders={shippedOrders}
            deliveredOrders={deliveredOrders}
            cancelledOrders={cancelledOrders}
          />

          {/* Error Message */}
          {error && (
            <ErrorMessage 
              message={error} 
              type="error" 
              dismissible={true}
              onDismiss={() => setError('')}
            />
          )}

          {/* Orders List */}
          <OrdersList
            loading={loading}
            filteredOrders={filteredOrders}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            getStatusColor={getStatusColor}
            setSelectedOrder={setSelectedOrder}
            setShowDetails={setShowDetails}
            selectedOrder={selectedOrder}
            showDetails={showDetails}
            handleStatusUpdate={handleStatusUpdate}
            updatingStatus={updatingStatus}
            statusOptions={statusOptions}
          />
        </div>
      </div>
    </>
  );
};

export default OrdersManagement;
