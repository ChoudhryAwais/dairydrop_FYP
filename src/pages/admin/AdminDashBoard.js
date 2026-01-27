'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAllUsers } from '../../services/users/userService';
import { getAllOrders } from '../../services/orders/orderService';
import { getProducts } from '../../services/products/productService';
import { getAllReviews } from '../../services/reviews/reviewService';

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { label: 'Total Orders', value: '0', icon: '🛒', bgColor: 'bg-blue-50', iconBg: 'bg-blue-100', subtext: '0% more than last month' },
    { label: 'Total Revenue', value: '$0', icon: '💰', bgColor: 'bg-green-50', iconBg: 'bg-green-100', subtext: '0% from last month' },
    { label: 'Delivered Orders', value: '0', icon: '✅', bgColor: 'bg-teal-50', iconBg: 'bg-teal-100', subtext: 'Completed' },
    { label: 'Total Customers', value: '0', icon: '👥', bgColor: 'bg-purple-50', iconBg: 'bg-purple-100', subtext: 'Active users' },
    { label: 'Products Listed', value: '0', icon: '🏪', bgColor: 'bg-orange-50', iconBg: 'bg-orange-100', subtext: '0 in stock, 0 out of stock' },
    { label: 'Average Rating', value: '0', icon: '⭐', bgColor: 'bg-yellow-50', iconBg: 'bg-yellow-100', subtext: 'from 0 reviews, 0 pending' },
  ]);

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [viewMode, setViewMode] = useState('weekly'); // 'weekly', 'monthly', or 'yearly'

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
        let pendingOrders = 0;
        let deliveredOrders = 0;
        let totalCustomers = 0;
        let totalProducts = 0;
        let averageRating = 0;
        let totalReviews = 0;
        let pendingReviews = 0;
        let lastMonthRevenue = 0;
        let currentMonthRevenue = 0;
        let lastMonthOrders = 0;
        let currentMonthOrders = 0;
        let inStockProducts = 0;
        let outOfStockProducts = 0;

        if (usersResult.success) {
          totalCustomers = usersResult.users.filter(u => u.role !== 'admin').length;
        }

        if (ordersResult.success) {
          totalOrders = ordersResult.orders.length;
          pendingOrders = ordersResult.orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
          deliveredOrders = ordersResult.orders.filter(o => o.status === 'Delivered').length;
          
          // Calculate revenue only from delivered orders
          totalRevenue = ordersResult.orders
            .filter(order => order.status === 'Delivered')
            .reduce((sum, order) => {
              const amount = parseFloat(order.total) || 0;
              return sum + amount;
            }, 0);

          // Calculate month-over-month growth
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          
          // Last month
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

          currentMonthRevenue = ordersResult.orders
            .filter(order => {
              const orderDate = new Date(order.createdAt);
              return orderDate.getMonth() === currentMonth && 
                     orderDate.getFullYear() === currentYear &&
                     order.status === 'Delivered';
            })
            .reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);

          lastMonthRevenue = ordersResult.orders
            .filter(order => {
              const orderDate = new Date(order.createdAt);
              return orderDate.getMonth() === lastMonth && 
                     orderDate.getFullYear() === lastMonthYear &&
                     order.status === 'Delivered';
            })
            .reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);

          // Calculate order counts for month-over-month
          currentMonthOrders = ordersResult.orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() === currentMonth && 
                   orderDate.getFullYear() === currentYear;
          }).length;

          lastMonthOrders = ordersResult.orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() === lastMonth && 
                   orderDate.getFullYear() === lastMonthYear;
          }).length;

          const recentOrdersList = ordersResult.orders
            .slice(0, 4)
            .map(order => ({
              id: order.id || '#000',
              customer: order.customerInfo?.fullName || 'Unknown',
              product: order.items?.[0]?.name || 'Multiple Items',
              amount: `$${parseFloat(order.total).toFixed(2)}`,
              status: order.status || 'Pending',
              date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'
            }));
          
          setRecentOrders(recentOrdersList);
        }

        if (productsResult.success) {
          totalProducts = productsResult.products.length;
          
          // Calculate in stock and out of stock
          inStockProducts = productsResult.products.filter(p => p.stock > 0 || p.inStock === true).length;
          outOfStockProducts = productsResult.products.filter(p => p.stock === 0 || p.inStock === false).length;
          
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

          // Get top products (sorted by some criteria, using first 4 for now)
          const topProds = productsResult.products.slice(0, 4).map(prod => ({
            name: prod.name || 'Unknown Product',
            price: `$${(parseFloat(prod.price) || 0).toFixed(2)}`,
            category: prod.category || 'Other',
            image: prod.imageUrl || ''
          }));
          setTopProducts(topProds);
        }

        if (reviewsResult.success && reviewsResult.reviews.length > 0) {
          totalReviews = reviewsResult.reviews.length;
          pendingReviews = reviewsResult.reviews.filter(r => r.approved === false || r.approved === undefined).length;
          const approvedReviews = reviewsResult.reviews.filter(r => r.approved === true);
          if (approvedReviews.length > 0) {
            averageRating = (approvedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / approvedReviews.length).toFixed(1);
          }
        }

        // Calculate month-over-month percentages
        const revenueGrowthPercentage = lastMonthRevenue > 0 
          ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          : 0;
        
        const ordersGrowthPercentage = lastMonthOrders > 0 
          ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
          : 0;

        // Format the percentages
        const formattedRevenueGrowth = revenueGrowthPercentage >= 0 
          ? `+${revenueGrowthPercentage.toFixed(1)}% from last month` 
          : `${revenueGrowthPercentage.toFixed(1)}% from last month`;
        
        const formattedOrdersGrowth = ordersGrowthPercentage >= 0 
          ? `${ordersGrowthPercentage.toFixed(1)}% more than last month` 
          : `${ordersGrowthPercentage.toFixed(1)}% less than last month`;

        // Update stats with calculated values
        setStats([
          { 
            label: 'Total Orders', 
            value: totalOrders.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), 
            icon: '🛒', 
            bgColor: 'bg-blue-50', 
            iconBg: 'bg-blue-100', 
            subtext: formattedOrdersGrowth
          },
          { 
            label: 'Total Revenue', 
            value: `$${totalRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 
            icon: '💰', 
            bgColor: 'bg-green-50', 
            iconBg: 'bg-green-100', 
            subtext: formattedRevenueGrowth
          },
          { 
            label: 'Delivered Orders', 
            value: deliveredOrders.toString(), 
            icon: '✅', 
            bgColor: 'bg-teal-50', 
            iconBg: 'bg-teal-100', 
            subtext: 'Completed'
          },
          { 
            label: 'Total Customers', 
            value: totalCustomers.toString(), 
            icon: '👥', 
            bgColor: 'bg-purple-50', 
            iconBg: 'bg-purple-100', 
            subtext: 'Active users'
          },
          { 
            label: 'Products Listed', 
            value: totalProducts.toString(), 
            icon: '🏪', 
            bgColor: 'bg-orange-50', 
            iconBg: 'bg-orange-100', 
            subtext: `${inStockProducts} in stock, ${outOfStockProducts} out of stock`
          },
          { 
            label: 'Average Rating', 
            value: averageRating || '0', 
            icon: '⭐', 
            bgColor: 'bg-yellow-50', 
            iconBg: 'bg-yellow-100', 
            subtext: `from ${totalReviews} reviews, ${pendingReviews} pending`
          },
        ]);

        // Generate chart data based on view mode
        if (ordersResult.success) {
          // Get all unique years from orders
          const years = [...new Set(ordersResult.orders.map(order => {
            return new Date(order.createdAt).getFullYear();
          }))].sort((a, b) => b - a);
          setAvailableYears(years.length > 0 ? years : [new Date().getFullYear()]);

          let chartDataArray = [];

          if (viewMode === 'weekly') {
            // Generate data for 7 days of the week
            const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const now = new Date();
            const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
            
            // Generate data for each day
            chartDataArray = daysOfWeek.map((day, idx) => {
              // Calculate which date this day represents (going back from today)
              const daysBack = (currentDay === 0 ? 7 : currentDay) - (idx + 1);
              const targetDate = new Date(now);
              targetDate.setDate(now.getDate() - daysBack);
              targetDate.setHours(0, 0, 0, 0);
              
              const nextDay = new Date(targetDate);
              nextDay.setDate(targetDate.getDate() + 1);

              const dayOrders = ordersResult.orders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= targetDate && orderDate < nextDay && order.status === 'Delivered';
              });
              
              const revenue = dayOrders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
              
              return {
                name: day,
                revenue: revenue,
                orders: dayOrders.length
              };
            });
          } else if (viewMode === 'monthly') {
            // Monthly view - show all 12 months for current year
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const currentYear = new Date().getFullYear();
            
            chartDataArray = months.map((month, idx) => {
              const monthOrders = ordersResult.orders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate.getMonth() === idx && 
                       orderDate.getFullYear() === currentYear &&
                       order.status === 'Delivered';
              });
              
              const revenue = monthOrders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
              
              return {
                name: month,
                revenue: revenue,
                orders: monthOrders.length
              };
            });
          } else {
            // Yearly view - show available years
            chartDataArray = years.map(year => {
              const yearOrders = ordersResult.orders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate.getFullYear() === year && order.status === 'Delivered';
              });
              
              const revenue = yearOrders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
              
              return {
                name: year.toString(),
                revenue: revenue,
                orders: yearOrders.length
              };
            });
          }

          setChartData(chartDataArray);
        }

      } catch (error) {
        console.error('[Dashboard] Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [viewMode]);

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
      <div className="flex-1 p-8 transition-all duration-300 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Monitor your store's performance and manage operations</p>
          </div>

          {/* Statistics Grid - All 9 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 ${loading ? 'animate-pulse' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs font-medium mb-2">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800 mb-1">{loading ? '...' : stat.value}</p>
                    <p className={`text-xs font-medium ${stat.subtext.includes('+') ? 'text-green-600' : stat.subtext.includes('attention') ? 'text-red-600' : 'text-gray-500'}`}>
                      {stat.subtext}
                    </p>
                  </div>
                  <div className={`${stat.iconBg} p-3 rounded-full`}>
                    <span className="text-xl">{stat.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            {/* Revenue Analytics Chart - Takes 2 columns */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-1">Revenue Analytics</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setViewMode('weekly')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      viewMode === 'weekly' 
                        ? 'text-teal-600 bg-teal-50' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Weekly
                  </button>
                  <button 
                    onClick={() => setViewMode('monthly')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      viewMode === 'monthly' 
                        ? 'text-teal-600 bg-teal-50' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setViewMode('yearly')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      viewMode === 'yearly' 
                        ? 'text-teal-600 bg-teal-50' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                </div>
              ) : chartData.length === 0 ? (
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-400">No data available</p>
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        tickFormatter={(value) => `$${value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        formatter={(value) => [`$${value}`, 'Revenue']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#14b8a6" 
                        strokeWidth={2.5}
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Top Products - Takes 1 column */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800">Top Products</h2>
              </div>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                </div>
              ) : topProducts.length === 0 ? (
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-400 text-sm">No products available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topProducts.map((product, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">🥛</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-teal-600">{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Categories Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-1">Product Categories</h2>
              <p className="text-sm text-gray-500">Distribution across categories</p>
            </div>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <LoadingSpinner size="sm" />
              </div>
            ) : categoryData.length === 0 ? (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-400">No products available</p>
              </div>
            ) : (
              <div>
                {/* Progress Bars */}
                <div className="space-y-4 mb-6">
                  {categoryData.map((cat, idx) => (
                    <div key={idx} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 ${cat.color} rounded-full shadow-sm`}></div>
                          <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{cat.count} items</span>
                          <span className="text-sm font-semibold text-gray-700">{cat.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`${cat.color} h-3 rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${cat.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-3">
                    {categoryData.map((cat, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className={`w-2.5 h-2.5 ${cat.color} rounded-full`}></div>
                        <span className="text-xs font-medium text-gray-700">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
                <button className="text-sm text-teal-600 font-medium hover:text-teal-700">View All</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        <LoadingSpinner size="sm" message="Loading orders..." />
                      </td>
                    </tr>
                  ) : recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                          #{order.id.substring(0, 4)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.product}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">{order.amount}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
