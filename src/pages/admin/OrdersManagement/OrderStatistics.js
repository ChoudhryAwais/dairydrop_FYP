import React from 'react';
import { MdHourglassEmpty, MdSync, MdLocalShipping, MdCheckCircle, MdCancel, MdInventory, MdAttachMoney } from 'react-icons/md';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-medium text-sm">Pending</h3>
          <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
            <MdHourglassEmpty className="text-xl text-yellow-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{pendingOrders}</p>
        <p className="text-gray-400 text-xs mt-1">waiting orders</p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-medium text-sm">Processing</h3>
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <MdSync className="text-xl text-blue-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{processingOrders}</p>
        <p className="text-gray-400 text-xs mt-1">being processed</p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-medium text-sm">Shipped</h3>
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
            <MdLocalShipping className="text-xl text-purple-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{shippedOrders}</p>
        <p className="text-gray-400 text-xs mt-1">in transit</p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-medium text-sm">Delivered</h3>
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <MdCheckCircle className="text-xl text-green-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{deliveredOrders}</p>
        <p className="text-gray-400 text-xs mt-1">completed</p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-medium text-sm">Cancelled</h3>
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
            <MdCancel className="text-xl text-red-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{cancelledOrders}</p>
        <p className="text-gray-400 text-xs mt-1">cancelled</p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-medium text-sm">Total Orders</h3>
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
            <MdInventory className="text-xl text-gray-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
        <p className="text-gray-400 text-xs mt-1">all time</p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 sm:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-medium text-sm">Total Revenue</h3>
          <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
            <MdAttachMoney className="text-xl text-teal-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</p>
        <p className="text-gray-400 text-xs mt-1">from delivered orders</p>
      </div>
    </div>
  );
};

export default OrderStatistics;
