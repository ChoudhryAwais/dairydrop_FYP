'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/myContext';
import { getUserOrders } from '../../../services/orders/orderService';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import OrderFilters from './OrderFilters';
import OrdersList from './OrdersList';
import { MdPending, MdSync, MdLocalShipping, MdCheckCircle, MdCancel, MdHelp } from 'react-icons/md';

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
  const [expandedOrderId, setExpandedOrderId] = useState(null);

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
    const IconMap = {
      'Pending': MdPending,
      'Processing': MdSync,
      'Shipped': MdLocalShipping,
      'Out for Delivery': MdLocalShipping,
      'Delivered': MdCheckCircle,
      'Cancelled': MdCancel,
    };
    const IconComponent = IconMap[status] || MdHelp;
    return <IconComponent className="inline" />;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/profile" className="hover:text-green-600 transition-colors">My Account</Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-green-600 font-medium">Order History</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-1">Track and manage your purchases</p>
            </div>
          </div>
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
        <OrderFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          setCurrentPage={setCurrentPage}
          filteredOrdersCount={filteredOrders.length}
        />

        {/* Orders List */}
        <OrdersList
          filteredOrders={filteredOrders}
          paginatedOrders={paginatedOrders}
          expandedOrderId={expandedOrderId}
          setExpandedOrderId={setExpandedOrderId}
          getStatusBadge={getStatusBadge}
          getStatusIcon={getStatusIcon}
          getStatusStep={getStatusStep}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          filterStatus={filterStatus}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setFilterStatus={setFilterStatus}
        />
      </div>
    </div>
  );
};

export default OrderHistory;
