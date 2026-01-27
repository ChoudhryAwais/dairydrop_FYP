import React from 'react';

const OrderDetailsModal = ({
  show,
  order,
  onClose,
  onStatusUpdate,
  updatingStatus,
  statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
}) => {
  if (!show || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-2xl ml-2 transition-colors duration-200"
          >
            ×
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {/* Order Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm font-medium">Order ID</p>
              <p className="text-gray-800 text-sm sm:text-base font-semibold break-all">{order.id}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs sm:text-sm font-medium">Order Date</p>
              <p className="text-gray-800 text-sm sm:text-base font-semibold">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Name</p>
                <p className="text-gray-800 text-sm sm:text-base">{order.customerInfo?.fullName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Email</p>
                <p className="text-gray-800 text-sm sm:text-base break-all">{order.customerInfo?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Phone</p>
                <p className="text-gray-800 text-sm sm:text-base">{order.customerInfo?.phone || 'N/A'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Delivery Address</p>
                <p className="text-gray-800 text-sm">{order.customerInfo?.address || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">Items</h3>
            <div className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start bg-gray-50 p-2.5 sm:p-3 rounded-lg">
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{item.name}</p>
                    <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600 font-medium text-sm sm:text-base">Total Amount:</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">${(order.total || 0).toFixed(2)}</p>
            </div>

            {/* Status Update */}
            {onStatusUpdate && (
              <div>
                <label className="block text-gray-600 text-xs sm:text-sm font-medium mb-2">Update Status</label>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {statusOptions.map(status => (
                    <button
                      key={status}
                      onClick={() => onStatusUpdate(order.id, status)}
                      disabled={updatingStatus || status === order.status}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${
                        status === order.status
                          ? 'bg-teal-600 text-white cursor-default'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
