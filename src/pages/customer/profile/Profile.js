import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/myContext';
import {
  getUserProfile,
  updateUserProfile,
  addAddress,
  removeAddress,
  setAddressAsDefault
} from '../../../services/users/userService';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import AccountInfo from './AccountInfo';
import DeliveryAddresses from './DeliveryAddresses';

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
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <LoadingSpinner size="lg" message="Loading your profile..." />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8"
    >
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

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <AccountInfo
            profileForm={profileForm}
            userProfile={userProfile}
            saving={saving}
            handleProfileChange={handleProfileChange}
            handleSaveProfile={handleSaveProfile}
          />
        )}

        {activeTab === 'addresses' && (
          <DeliveryAddresses
            addresses={addresses}
            addressForm={addressForm}
            showAddressForm={showAddressForm}
            saving={saving}
            handleAddressChange={handleAddressChange}
            handleAddAddress={handleAddAddress}
            handleRemoveAddress={handleRemoveAddress}
            handleSetDefaultAddress={handleSetDefaultAddress}
            setShowAddressForm={setShowAddressForm}
            setAddressForm={setAddressForm}
          />
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
