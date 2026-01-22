'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/myContext';
import {
  getUserProfile,
  updateUserProfile,
  addAddress,
  removeAddress,
  setAddressAsDefault
} from '../../services/users/userService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  // State management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [editingAddressId, setEditingAddressId] = useState(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    name: '',
    phone: '',
    email: ''
  });

  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    isDefault: false
  });

  const [showAddressForm, setShowAddressForm] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Fetch user profile on mount
  useEffect(() => {
    if (currentUser?.uid) {
      fetchUserProfile();
    }
  }, [currentUser?.uid]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const result = await getUserProfile(currentUser.uid);

      if (result.success) {
        const userData = result.user;
        setUserProfile(userData);

        // Populate profile form
        setProfileForm({
          displayName: userData.displayName || '',
          name: userData.name || '',
          phone: userData.phone || '',
          email: userData.email || currentUser.email || ''
        });

        // Set addresses
        setAddresses(userData.addresses || []);
      } else {
        setErrorMessage(result.error || 'Failed to load profile');
      }
    } catch (error) {
      console.error('[v0] Error fetching profile:', error);
      setErrorMessage('An error occurred while loading your profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
    setErrorMessage('');
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrorMessage('');
  };

  const validateProfileForm = () => {
    if (!profileForm.displayName.trim()) {
      setErrorMessage('Display name is required');
      return false;
    }
    if (!profileForm.phone.trim()) {
      setErrorMessage('Phone number is required');
      return false;
    }
    if (!/^\d{10,}$/.test(profileForm.phone.replace(/\D/g, ''))) {
      setErrorMessage('Please enter a valid phone number (10+ digits)');
      return false;
    }
    return true;
  };

  const validateAddressForm = () => {
    if (!addressForm.fullName.trim()) {
      setErrorMessage('Full name is required');
      return false;
    }
    if (!addressForm.phone.trim()) {
      setErrorMessage('Phone number is required');
      return false;
    }
    if (!/^\d{10,}$/.test(addressForm.phone.replace(/\D/g, ''))) {
      setErrorMessage('Please enter a valid phone number');
      return false;
    }
    if (!addressForm.street.trim()) {
      setErrorMessage('Street address is required');
      return false;
    }
    if (!addressForm.city.trim()) {
      setErrorMessage('City is required');
      return false;
    }
    if (!addressForm.postalCode.trim()) {
      setErrorMessage('Postal code is required');
      return false;
    }
    return true;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await updateUserProfile(currentUser.uid, {
        displayName: profileForm.displayName,
        name: profileForm.name,
        phone: profileForm.phone
      });

      if (result.success) {
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('[v0] Error updating profile:', error);
      setErrorMessage('An error occurred while updating your profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    if (!validateAddressForm()) return;

    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      let newAddress = {
        id: Date.now().toString(),
        ...addressForm
      };

      // If the new address is marked as default, unset default on all existing addresses
      if (newAddress.isDefault) {
        setAddresses(prev =>
          prev.map(addr => ({ ...addr, isDefault: false }))
        );
      }

      const result = await addAddress(currentUser.uid, newAddress);

      if (result.success) {
        // If new address is default, ensure it's reflected in state
        setAddresses(prev => {
          if (newAddress.isDefault) {
            return [...prev, { ...newAddress, isDefault: true }];
          }
          return [...prev, newAddress];
        });

        setAddressForm({
          fullName: '',
          phone: '',
          street: '',
          city: '',
          postalCode: '',
          isDefault: false
        });
        setShowAddressForm(false);
        setSuccessMessage('Address added successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(result.error || 'Failed to add address');
      }
    } catch (error) {
      console.error('[v0] Error adding address:', error);
      setErrorMessage('An error occurred while adding the address');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAddress = async (addressToRemove) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    setSaving(true);
    setErrorMessage('');

    try {
      const result = await removeAddress(currentUser.uid, addressToRemove);

      if (result.success) {
        setAddresses(prev => prev.filter(addr => addr.id !== addressToRemove.id));
        setSuccessMessage('Address removed successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(result.error || 'Failed to remove address');
      }
    } catch (error) {
      console.error('[v0] Error removing address:', error);
      setErrorMessage('An error occurred while removing the address');
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    setSaving(true);
    setErrorMessage('');

    try {
      const result = await setAddressAsDefault(currentUser.uid, addressId);

      if (result.success) {
        // Update local state with the returned updated list from the service
        setAddresses(result.addresses);
        setSuccessMessage('Default address updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(result.error || 'Failed to update default address');
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      setErrorMessage('An error occurred while updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner size="lg" message="Loading your profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and delivery addresses</p>
        </div>

        {/* Messages */}
        {errorMessage && (
          <ErrorMessage
            message={errorMessage}
            type="error"
            dismissible={true}
            onDismiss={() => setErrorMessage('')}
          />
        )}

        {successMessage && (
          <ErrorMessage
            message={successMessage}
            type="info"
            dismissible={true}
            onDismiss={() => setSuccessMessage('')}
          />
        )}

        {/* Tabs */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-1 flex gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${activeTab === 'profile'
              ? 'bg-green-600 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            Account Info
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${activeTab === 'addresses'
              ? 'bg-green-600 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            Delivery Addresses
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={profileForm.email}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              {/* Real Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={profileForm.displayName}
                  onChange={handleProfileChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Account Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 font-medium">Member Since</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {userProfile?.createdAt
                      ? new Date(userProfile.createdAt).toLocaleDateString()
                      : 'N/A'
                    }
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 font-medium">Account Status</p>
                  <p
                    className={`mt-1 text-lg font-bold ${userProfile?.disabled
                      ? 'text-red-600'
                      : 'text-green-600'
                      }`}
                  >
                    {userProfile?.disabled ? 'Disabled' : 'Active'}
                  </p>
                </div>

              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            {/* Add New Address Button */}
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Address
              </button>
            )}

            {/* Add Address Form */}
            {showAddressForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Delivery Address</h3>

                <form onSubmit={handleAddAddress} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={addressForm.fullName}
                        onChange={handleAddressChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={addressForm.phone}
                        onChange={handleAddressChange}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={addressForm.street}
                      onChange={handleAddressChange}
                      placeholder="123 Main Street"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        placeholder="New York"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={addressForm.postalCode}
                        onChange={handleAddressChange}
                        placeholder="10001"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={addressForm.isDefault}
                      onChange={handleAddressChange}
                      className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                      Set as default delivery address
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Adding...' : 'Add Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        setAddressForm({
                          fullName: '',
                          phone: '',
                          street: '',
                          city: '',
                          postalCode: '',
                          isDefault: false
                        });
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-lg font-semibold transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Addresses List */}
            {addresses.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Your Delivery Addresses</h3>
                {addresses.map((address) => (
                  <div key={address.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
    
    {/* Address Text Info */}
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-lg font-bold text-gray-900">{address.fullName}</h4>
        {address.isDefault && (
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
            Default
          </span>
        )}
      </div>
      <p className="text-gray-600 mb-1">{address.street}</p>
      <p className="text-gray-600 mb-1">{address.city}, {address.postalCode}</p>
      <p className="text-gray-600 text-sm">Phone: {address.phone}</p>
    </div>

    {/* ACTION BUTTONS SECTION */}
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center mt-4 sm:mt-0">
      {!address.isDefault && (
        <button
          onClick={() => handleSetDefaultAddress(address.id)}
          disabled={saving}
          className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Make Default
        </button>
      )}

      <button
        onClick={() => handleRemoveAddress(address)}
        disabled={saving}
        className="w-full sm:w-auto bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </button>
    </div>
    
  </div>
</div>
                ))}
              </div>
            ) : (
              !showAddressForm && (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No Addresses Yet</h3>
                  <p className="text-gray-600 mb-4">Add your first delivery address to get started</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
