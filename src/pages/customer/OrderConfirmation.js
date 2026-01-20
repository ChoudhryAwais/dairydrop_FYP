'use client';

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../services/orders/orderService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const result = await getOrderById(orderId);
        if (result.success) {
          setOrder(result.order);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('[v0] Error fetching order:', err);
        setError('Error loading order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner size="md" message="Loading order details..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-12">
        <ErrorMessage 
          message={error || 'Order not found'}
          type="error"
        />
        <div className="text-center mt-6">
          <Link to="/products" className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Success Message */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-4xl font-bold text-green-700 mb-2">Order Confirmed!</h1>
        <p className="text-gray-700 text-lg mb-4">Thank you for your purchase. Your order has been placed successfully.</p>
        <div className="bg-white rounded-lg p-4 inline-block">
          <p className="text-sm text-gray-600">Order ID</p>
          <p className="text-2xl font-bold text-gray-800 font-mono">{order.id}</p>
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Items</h2>
            {order.items && order.items.length > 0 ? (
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">🥛</div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">${item.price} each</p>
                      <p className="font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No items in order</p>
            )}
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-xl shadow-lg p-8 mt-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Delivery Address</h2>
            {order.customerInfo ? (
              <div className="space-y-2">
                <p className="text-gray-700"><strong>Name:</strong> {order.customerInfo.fullName}</p>
                <p className="text-gray-700"><strong>Email:</strong> {order.customerInfo.email}</p>
                <p className="text-gray-700"><strong>Phone:</strong> {order.customerInfo.phone}</p>
                <p className="text-gray-700"><strong>Address:</strong> {order.customerInfo.address}</p>
                <p className="text-gray-700"><strong>City:</strong> {order.customerInfo.city}</p>
                <p className="text-gray-700"><strong>Postal Code:</strong> {order.customerInfo.postalCode}</p>
              </div>
            ) : (
              <p className="text-gray-600">No address information</p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">${order.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-medium">${order.tax?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-gray-900">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-green-600">${order.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                <p className="font-semibold text-gray-800">Cash on Delivery (COD)</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Status</p>
                <p className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                  {order.status || 'Pending'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="font-medium text-gray-800">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
        <h3 className="text-xl font-bold text-blue-900 mb-4">What's Next?</h3>
        <ul className="space-y-3 text-blue-800">
          <li className="flex items-start space-x-3">
            <span className="text-xl font-bold">1</span>
            <span>We'll process your order and prepare it for delivery</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-xl font-bold">2</span>
            <span>You'll receive a confirmation email with tracking details</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-xl font-bold">3</span>
            <span>Your package will be delivered to the address provided. Pay via COD at delivery</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Link
          to="/products"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          to="/"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
