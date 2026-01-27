import React from 'react';
import { MdPeople, MdAdminPanelSettings, MdShoppingBag, MdCheckCircle, MdBlock } from 'react-icons/md';

const UsersStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-medium text-sm">Total Users</h3>
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
            <MdPeople className="text-xl text-gray-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-medium text-sm">Admin</h3>
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <MdAdminPanelSettings className="text-xl text-blue-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{stats.adminUsers}</p>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-medium text-sm">Customers</h3>
          <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
            <MdShoppingBag className="text-xl text-teal-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{stats.customerUsers}</p>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-medium text-sm">Active</h3>
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <MdCheckCircle className="text-xl text-green-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{stats.activeUsers}</p>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-medium text-sm">Disabled</h3>
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
            <MdBlock className="text-xl text-red-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{stats.disabledUsers}</p>
      </div>
    </div>
  );
};

export default UsersStats;
