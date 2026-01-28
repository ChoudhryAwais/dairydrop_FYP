'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/myContext';
import { getUserOrders } from '../../../services/orders/orderService';
import { getProductById } from '../../../services/products/productService';
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
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [showNotification, setShowNotification] = useState(false);
  const [processingBuyAgain, setProcessingBuyAgain] = useState(false);

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

  const { clearCart, addToCart } = useCart();

  const handleBuyAgain = async (order) => {
    if (!order || !order.items) return;

    setProcessingBuyAgain(true);
    const messages = [];
    let allOutOfStock = true;
    let hasErrors = false;

    // Check stock for each item
    for (const item of order.items) {
      try {
        // Fetch current product data to get latest stock
        const result = await getProductById(item.id);
        
        if (!result.success || !result.product) {
          messages.push(`${item.name} is no longer available`);
          hasErrors = true;
          continue;
        }

        const currentProduct = result.product;
        const availableStock = currentProduct.quantity || 0;
        const requestedQuantity = item.quantity || 1;

        if (availableStock === 0) {
          messages.push(`${item.name} is out of stock`);
          hasErrors = true;
        } else if (availableStock < requestedQuantity) {
          // Add partial quantity
          const productToAdd = {
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            imageUrl: currentProduct.imageUrl || currentProduct.image || '',
            quantity: availableStock,
          };
          
          const addResult = addToCart(productToAdd, availableStock);
          if (addResult.success) {
            messages.push(`${item.name}: Only ${availableStock} of ${requestedQuantity} available. Added ${availableStock} to cart.`);
            allOutOfStock = false;
          }
        } else {
          // Add full quantity
          const productToAdd = {
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            imageUrl: currentProduct.imageUrl || currentProduct.image || '',
            quantity: availableStock,
          };
          
          const addResult = addToCart(productToAdd, requestedQuantity);
          if (addResult.success) {
            allOutOfStock = false;
          }
        }
      } catch (err) {
        console.error('Error checking product stock:', err);
        messages.push(`Error checking ${item.name}`);
        hasErrors = true;
      }
    }

    setProcessingBuyAgain(false);

    // Show notifications
    if (allOutOfStock) {
      setNotificationType('error');
      setNotificationMessage(messages.join(' • '));
      setShowNotification(true);
    } else if (hasErrors || messages.length > 0) {
      setNotificationType('warning');
      setNotificationMessage(messages.join(' • '));
      setShowNotification(true);
    } else {
      setNotificationType('success');
      setNotificationMessage('Items added to cart successfully!');
      setShowNotification(true);
    }

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage('');
    }, 5000);

    // Navigate to cart only if at least one item was added
    if (!allOutOfStock) {
      setTimeout(() => {
        navigate('/cart');
      }, 2000);
    }
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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      {/* Notification Toast */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div className={`p-4 rounded-xl shadow-2xl border-2 ${
            notificationType === 'success' 
              ? 'bg-green-50 border-green-200' 
              : notificationType === 'warning'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                notificationType === 'success'
                  ? 'bg-green-100'
                  : notificationType === 'warning'
                  ? 'bg-yellow-100'
                  : 'bg-red-100'
              }`}>
                {notificationType === 'success' ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : notificationType === 'warning' ? (
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${
                  notificationType === 'success'
                    ? 'text-green-900'
                    : notificationType === 'warning'
                    ? 'text-yellow-900'
                    : 'text-red-900'
                }`}>
                  {notificationType === 'success' ? 'Success' : notificationType === 'warning' ? 'Partial Success' : 'Error'}
                </p>
                <p className={`text-sm mt-1 ${
                  notificationType === 'success'
                    ? 'text-green-700'
                    : notificationType === 'warning'
                    ? 'text-yellow-700'
                    : 'text-red-700'
                }`}>
                  {notificationMessage}
                </p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className={`flex-shrink-0 ${
                  notificationType === 'success'
                    ? 'text-green-400 hover:text-green-600'
                    : notificationType === 'warning'
                    ? 'text-yellow-400 hover:text-yellow-600'
                    : 'text-red-400 hover:text-red-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}

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
          onBuyAgain={handleBuyAgain}
          processingBuyAgain={processingBuyAgain}
        />
      </div>
      </motion.div>
  );
};

export default OrderHistory;
