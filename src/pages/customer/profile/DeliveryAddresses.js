import React from 'react';

const DeliveryAddresses = ({
  addresses,
  addressForm,
  showAddressForm,
  saving,
  handleAddressChange,
  handleAddAddress,
  handleRemoveAddress,
  handleSetDefaultAddress,
  setShowAddressForm,
  setAddressForm
}) => {
  return (
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

      {/* Address List */}
      {addresses.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Your Delivery Addresses</h3>
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                {/* Address Details */}
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

                {/* Address Actions */}
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
  );
};

export default DeliveryAddresses;
