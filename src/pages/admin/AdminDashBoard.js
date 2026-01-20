'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { getAllUsers } from '../../services/users/userService';
import { getAllOrders } from '../../services/orders/orderService';
import { getProducts } from '../../services/products/productService';

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { label: 'Total Orders', value: '0', icon: '📦', bgColor: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'Total Revenue', value: '$0', icon: '💰', bgColor: 'bg-green-50', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { label: 'Total Customers', value: '0', icon: '👥', bgColor: 'bg-purple-50', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { label: 'Products Listed', value: '0', icon: '🛒', bgColor: 'bg-orange-50', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
  ]);

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [usersResult, ordersResult, productsResult] = await Promise.all([
          getAllUsers(),
          getAllOrders(),
          getProducts()
        ]);

        let totalOrders = 0;
        let totalRevenue = 0;
        let totalCustomers = 0;
        let totalProducts = 0;

        if (usersResult.success) {
          totalCustomers = usersResult.users.filter(u => u.role !== 'admin').length;
        }

        if (ordersResult.success) {
          totalOrders = ordersResult.orders.length;
          totalRevenue = ordersResult.orders.reduce((sum, order) => {
            const amount = parseFloat(order.totalAmount) || 0;
            return sum + amount;
          }, 0);

          const recentOrdersList = ordersResult.orders
            .slice(0, 4)
            .map(order => ({
              id: order.id || '#000',
              customer: order.customerName || 'Unknown',
              amount: `$${(parseFloat(order.totalAmount) || 0).toFixed(2)}`,
              status: order.status || 'Pending',
              date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'
            }));
          
          setRecentOrders(recentOrdersList);
        }

        if (productsResult.success) {
          totalProducts = productsResult.products.length;
        }

        setStats([
          { label: 'Total Orders', value: totalOrders.toString(), icon: '📦', bgColor: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: '💰', bgColor: 'bg-green-50', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
          { label: 'Total Customers', value: totalCustomers.toString(), icon: '👥', bgColor: 'bg-purple-50', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
          { label: 'Products Listed', value: totalProducts.toString(), icon: '🛒', bgColor: 'bg-orange-50', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
        ]);

      } catch (error) {
        console.error('[v0] Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`${stat.bgColor} p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 ${loading ? 'animate-pulse' : ''}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 font-medium text-sm">{stat.label}</h3>
                  <div className={`${stat.iconBg} p-3 rounded-lg`}>
                    <span className={`text-2xl`}>{stat.icon}</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stat.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Chart Placeholder */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Sales Overview</h2>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="text-center">
                  <p className="text-gray-400 text-lg">📈 Sales Chart</p>
                  <p className="text-gray-400 text-sm mt-2">Chart visualization would go here</p>
                </div>
              </div>
            </div>

            {/* Category Distribution Placeholder */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Product Categories</h2>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="text-center">
                  <p className="text-gray-400 text-lg">🥧 Distribution Chart</p>
                  <p className="text-gray-400 text-sm mt-2">Category breakdown would go here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                          <span className="ml-2">Loading orders...</span>
                        </div>
                      </td>
                    </tr>
                  ) : recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{order.id.substring(0, 8)}...</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">{order.amount}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-center">
              <button className="text-green-600 hover:text-green-700 font-semibold text-sm transition-colors duration-200">
                View All Orders →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
