import React from 'react';

const OrderStatistics = ({
  orders,
  totalRevenue,
  pendingOrders,
  processingOrders,
  shippedOrders,
  deliveredOrders,
  cancelledOrders
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div className="bg-yellow-50 p-4 sm:p-6 rounded-xl shadow-md border border-yellow-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-gray-600 font-medium text-xs sm:text-sm">Pending</h3>
          <span className="text-2xl sm:text-3xl">⏳</span>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">{pendingOrders}</p>
        <p className="text-gray-500 text-xs mt-1 sm:mt-2">waiting orders</p>
      </div>

      <div className="bg-blue-50 p-4 sm:p-6 rounded-xl shadow-md border border-blue-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-gray-600 font-medium text-xs sm:text-sm">Processing</h3>
          <span className="text-2xl sm:text-3xl">🔄</span>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">{processingOrders}</p>
        <p className="text-gray-500 text-xs mt-1 sm:mt-2">being processed</p>
      </div>

      <div className="bg-purple-50 p-4 sm:p-6 rounded-xl shadow-md border border-purple-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-gray-600 font-medium text-xs sm:text-sm">Shipped</h3>
          <span className="text-2xl sm:text-3xl">🚚</span>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">{shippedOrders}</p>
        <p className="text-gray-500 text-xs mt-1 sm:mt-2">in transit</p>
      </div>

      <div className="bg-green-50 p-4 sm:p-6 rounded-xl shadow-md border border-green-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-gray-600 font-medium text-xs sm:text-sm">Delivered</h3>
          <span className="text-2xl sm:text-3xl">✅</span>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">{deliveredOrders}</p>
        <p className="text-gray-500 text-xs mt-1 sm:mt-2">completed</p>
      </div>

      <div className="bg-red-50 p-4 sm:p-6 rounded-xl shadow-md border border-red-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-gray-600 font-medium text-xs sm:text-sm">Cancelled</h3>
          <span className="text-2xl sm:text-3xl">❌</span>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">{cancelledOrders}</p>
        <p className="text-gray-500 text-xs mt-1 sm:mt-2">cancelled</p>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-gray-600 font-medium text-xs sm:text-sm">Total Orders</h3>
          <span className="text-2xl sm:text-3xl">📦</span>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">{orders.length}</p>
        <p className="text-gray-500 text-xs mt-1 sm:mt-2">all time</p>
      </div>

      <div className="bg-green-50 p-4 sm:p-6 rounded-xl shadow-md border border-green-200 sm:col-span-2">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-gray-600 font-medium text-xs sm:text-sm">Total Revenue</h3>
          <span className="text-2xl sm:text-3xl">💰</span>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</p>
        <p className="text-gray-500 text-xs mt-1 sm:mt-2">from delivered orders</p>
      </div>
    </div>
  );
};

export default OrderStatistics;
