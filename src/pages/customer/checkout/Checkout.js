'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/myContext';
import { createOrder } from '../../../services/orders/orderService';
import { updateProductQuantity } from '../../../services/products/productService';
import ErrorMessage from '../../../components/ErrorMessage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import CheckoutForm from './CheckoutForm';

const Checkout = () => {
  const { cartItems, clearCart, calculateTotals } = useCart();
  const { subtotal, tax, total } = calculateTotals();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const fetchUserContact = async (uid) => {
    if (!uid) return null;

    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (err) {
      console.error('[v0] Error fetching user contact info:', err);
    }

    return null;
  };

  const fetchDefaultAddress = async (uid) => {
    if (!uid) return null;

    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const addresses = data.addresses || [];

        return addresses.find(addr => addr.isDefault) || null;
      }
    } catch (err) {
      console.error('Error fetching default address:', err);
    }

    return null;
  };

  useEffect(() => {
    if (!currentUser?.uid) return;

    const loadCheckoutData = async () => {
      const userInfo = await fetchUserContact(currentUser.uid);
      const defaultAddress = await fetchDefaultAddress(currentUser.uid);

      setFormData({
        fullName:
          defaultAddress?.fullName ||
          userInfo?.name ||
          '',
        email: currentUser.email || '',
        phone:
          defaultAddress?.phone ||
          userInfo?.phone ||
          '',
        address: defaultAddress?.street || '',
        city: defaultAddress?.city || '',
        postalCode: defaultAddress?.postalCode || '',
      });
    };

    loadCheckoutData();
  }, [currentUser]);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (10+ digits)';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Street address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setErrors({ cart: 'Your cart is empty' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const orderData = {
        userId: currentUser.uid,
        items: cartItems,
        customerInfo: formData,
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        paymentMethod: 'COD',
        status: 'Pending',
      };

      const result = await createOrder(orderData);

      if (result.success) {
        // Decrease product quantities
        try {
          await Promise.all(
            cartItems.map(item =>
              updateProductQuantity(item.id, -item.quantity)
            )
          );
        } catch (quantityError) {
          console.error('[v0] Error updating product quantities:', quantityError);
        }

        setSuccessMessage('Order placed successfully! Redirecting...');
        clearCart();
        setTimeout(() => {
          navigate(`/order-confirmation/${result.orderId}`);
        }, 1500);
      } else {
        setErrors({ submit: result.error || 'Failed to place order. Please try again.' });
      }
    } catch (error) {
      console.error('[v0] Order creation error:', error);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items before proceeding to checkout.</p>
          <Link
            to="/products"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order by filling out the information below.</p>
        </div>

        {/* Error Messages */}
        {Object.keys(errors).length > 0 && (
          <ErrorMessage
            message="Please fix the following errors:"
            details={Object.values(errors)}
            type="error"
            dismissible={true}
            onDismiss={() => setErrors({})}
          />
        )}

        {/* Success Message */}
        {successMessage && (
          <ErrorMessage
            message={successMessage}
            type="info"
            dismissible={false}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm
              formData={formData}
              errors={errors}
              loading={loading}
              cartItems={cartItems}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 sticky top-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Items List */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900 whitespace-nowrap ml-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-4 mb-6 border-t-2 border-gray-200 pt-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t-2 border-gray-200 pt-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
                </div>
              </div>
              {/* Item Count */}
              <div className="text-center py-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">{cartItems.length}</span> item{cartItems.length !== 1 ? 's' : ''} in cart
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
