import React from 'react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import OrderDetailsModal from './OrderDetailsModal';

const OrdersList = ({
  loading,
  filteredOrders,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  getStatusColor,
  setSelectedOrder,
  setShowDetails,
  selectedOrder,
  showDetails,
  handleStatusUpdate,
  updatingStatus,
  statusOptions
}) => {
  return (
    <>
      {/* Filters and Search */}
      <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
            <input
              type="text"
              placeholder="Search by Order ID, Email, or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200"
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
        <div className="bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-gray-100">
          <LoadingSpinner size="md" message="Loading orders..." />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📦</span>
          </div>
          <p className="text-gray-600 text-lg font-medium mb-1">No orders found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        /* Orders Table/Cards */
        <div>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
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
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        <span className="text-teal-600">{order.id.substring(0, 8)}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div>
                          <p className="font-medium">{order.customerInfo.fullName || 'Unknown'}</p>
                          <p className="text-gray-500 text-xs">{order.customerInfo.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        ${(order.total || 0).toFixed(2)}
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
                          className="text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200"
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

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Order ID</p>
                    <p className="text-sm font-semibold text-teal-600">{order.id.substring(0, 8)}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Customer</p>
                    <p className="text-sm font-medium text-gray-800">{order.customerInfo.fullName || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{order.customerInfo.email || 'N/A'}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="text-sm font-semibold text-gray-800">${(order.total || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Items</p>
                      <p className="text-sm text-gray-700">{order.items?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowDetails(true);
                  }}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        show={showDetails}
        order={selectedOrder}
        onClose={() => setShowDetails(false)}
        onStatusUpdate={handleStatusUpdate}
        updatingStatus={updatingStatus}
        statusOptions={statusOptions}
      />
    </>
  );
};

export default OrdersList;
