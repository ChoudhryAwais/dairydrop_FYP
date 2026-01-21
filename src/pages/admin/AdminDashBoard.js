'use client';

import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAllUsers } from '../../services/users/userService';
import { getAllOrders } from '../../services/orders/orderService';
import { getProducts } from '../../services/products/productService';
import { getAllReviews } from '../../services/reviews/reviewService';

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { label: 'Total Orders', value: '0', icon: '📦', bgColor: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'Total Revenue', value: '$0', icon: '💰', bgColor: 'bg-green-50', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { label: 'Delivered Orders', value: '0', icon: '✅', bgColor: 'bg-teal-50', iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
    { label: 'Total Customers', value: '0', icon: '👥', bgColor: 'bg-purple-50', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { label: 'Products Listed', value: '0', icon: '🛒', bgColor: 'bg-orange-50', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
    { label: 'Average Rating', value: '0', icon: '⭐', bgColor: 'bg-yellow-50', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  ]);

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [usersResult, ordersResult, productsResult, reviewsResult] = await Promise.all([
          getAllUsers(),
          getAllOrders(),
          getProducts(),
          getAllReviews()
        ]);

        let totalOrders = 0;
        let totalRevenue = 0;
        let deliveredOrders = 0;
        let totalCustomers = 0;
        let totalProducts = 0;
        let averageRating = 0;

        if (usersResult.success) {
          totalCustomers = usersResult.users.filter(u => u.role !== 'admin').length;
        }

        if (ordersResult.success) {
          totalOrders = ordersResult.orders.length;
          deliveredOrders = ordersResult.orders.filter(o => o.status === 'Delivered').length;
          // Calculate revenue only from delivered orders
          totalRevenue = ordersResult.orders
            .filter(order => order.status === 'Delivered')
            .reduce((sum, order) => {
              const amount = parseFloat(order.total) || 0;
              return sum + amount;
            }, 0);

          const recentOrdersList = ordersResult.orders
            .slice(0, 4)
            .map(order => ({
              id: order.id || '#000',
              customer: order.customerInfo.fullName || 'Unknown',
              amount: `$${(parseFloat(order.total) || 0).toFixed(2)}`,
              status: order.status || 'Pending',
              date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'
            }));
          
          setRecentOrders(recentOrdersList);
        }

        if (productsResult.success) {
          totalProducts = productsResult.products.length;
          
          // Calculate category distribution
          const categories = ['Milk', 'Yogurt', 'Cheese', 'Butter', 'Cream', 'Other'];
          const categoryColors = ['bg-blue-500', 'bg-purple-500', 'bg-yellow-500', 'bg-green-500', 'bg-pink-500', 'bg-gray-500'];
          const categoryCounts = categories.map((cat, idx) => {
            const count = productsResult.products.filter(p => p.category === cat).length;
            return {
              name: cat,
              count,
              percentage: totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0,
              color: categoryColors[idx]
            };
          }).filter(c => c.count > 0);
          
          setCategoryData(categoryCounts);
        }

        if (reviewsResult.success && reviewsResult.reviews.length > 0) {
          const approvedReviews = reviewsResult.reviews.filter(r => r.approved === true);
          if (approvedReviews.length > 0) {
            averageRating = (approvedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / approvedReviews.length).toFixed(1);
          }
        }

        // Calculate monthly sales data (full year)
        if (ordersResult.success) {
          // Get all unique years from orders
          const years = [...new Set(ordersResult.orders.map(order => {
            return new Date(order.createdAt).getFullYear();
          }))].sort((a, b) => b - a);
          setAvailableYears(years.length > 0 ? years : [new Date().getFullYear()]);

          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const monthlyRevenue = [];
          
          for (let i = 0; i < 12; i++) {
            const monthName = months[i];
            const monthOrders = ordersResult.orders.filter(order => {
              const orderDate = new Date(order.createdAt);
              return orderDate.getMonth() === i && 
                     orderDate.getFullYear() === selectedYear &&
                     order.status === 'Delivered';
            });
            
            const revenue = monthOrders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
            monthlyRevenue.push({
              month: monthName,
              revenue,
              orders: monthOrders.length
            });
          }
          
          const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 1);
          setMonthlyData(monthlyRevenue.map(m => ({
            ...m,
            percentage: Math.round((m.revenue / maxRevenue) * 100)
          })));
        }

        setStats([
          { label: 'Total Orders', value: totalOrders.toString(), icon: '📦', bgColor: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: '💰', bgColor: 'bg-green-50', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
          { label: 'Delivered Orders', value: deliveredOrders.toString(), icon: '✅', bgColor: 'bg-teal-50', iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
          { label: 'Total Customers', value: totalCustomers.toString(), icon: '👥', bgColor: 'bg-purple-50', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
          { label: 'Products Listed', value: totalProducts.toString(), icon: '🛒', bgColor: 'bg-orange-50', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
          { label: 'Average Rating', value: averageRating || '0', icon: '⭐', bgColor: 'bg-yellow-50', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
        ]);

      } catch (error) {
        console.error('[v0] Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedYear]);

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
    <>
      {/* Main Content */}
      <div className="flex-1 p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
            {/* Sales Overview Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Sales Overview</h2>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                </div>
              ) : monthlyData.length === 0 ? (
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-400">No sales data available</p>
                </div>
              ) : (
                <div className="h-64 flex items-end justify-between gap-2 px-2">
                  {monthlyData.map((data, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center group">
                      <div className="relative w-full mb-2">
                        <div 
                          className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-500 hover:from-green-600 hover:to-green-500 cursor-pointer shadow-sm"
                          style={{ height: `${Math.max(data.percentage * 2, 20)}px` }}
                          title={`$${data.revenue.toFixed(2)}`}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                            ${data.revenue.toFixed(0)}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-medium text-gray-600 mt-1">{data.month}</div>
                      <div className="text-xs text-gray-400">{data.orders}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total revenue for {selectedYear} (delivered orders)</span>
                  <span className="text-green-600 font-semibold">
                    ${monthlyData.reduce((sum, m) => sum + m.revenue, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Category Distribution Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Product Categories</h2>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                </div>
              ) : categoryData.length === 0 ? (
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-400">No products available</p>
                </div>
              ) : (
                <div className="h-64 flex flex-col justify-center">
                  {/* Progress Bars */}
                  <div className="space-y-4">
                    {categoryData.map((cat, idx) => (
                      <div key={idx} className="group">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                          <span className="text-sm text-gray-500">{cat.count} ({cat.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`${cat.color} h-3 rounded-full transition-all duration-500 ease-out`}
                            style={{ width: `${cat.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-3">
                      {categoryData.map((cat, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className={`w-3 h-3 ${cat.color} rounded-sm`}></div>
                          <span className="text-xs text-gray-600">{cat.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
                        <LoadingSpinner size="sm" message="Loading orders..." />
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
    </>
  );
};

export default AdminDashboard;
