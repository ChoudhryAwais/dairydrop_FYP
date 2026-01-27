'use client';

import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../../services/users/userService';
import { getAllOrders } from '../../../services/orders/orderService';
import { getProducts } from '../../../services/products/productService';
import { getAllReviews } from '../../../services/reviews/reviewService';
import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';

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
          
          // Calculate in stock and out of stock (using quantity field like ProductsManagement)
          inStockProducts = productsResult.products.filter(p => p.quantity > 0).length;
          outOfStockProducts = productsResult.products.filter(p => !p.quantity || p.quantity === 0).length;
          
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
        let formattedRevenueGrowth;
        if (lastMonthRevenue === 0 && currentMonthRevenue === 0) {
          formattedRevenueGrowth = 'No revenue this month';
        } else if (lastMonthRevenue === 0) {
          formattedRevenueGrowth = `$${currentMonthRevenue.toFixed(2)} this month`;
        } else {
          const revenueGrowthPercentage = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
          formattedRevenueGrowth = revenueGrowthPercentage >= 0 
            ? `+${revenueGrowthPercentage.toFixed(1)}% from last month` 
            : `${revenueGrowthPercentage.toFixed(1)}% from last month`;
        }
        
        let formattedOrdersGrowth;
        if (lastMonthOrders === 0 && currentMonthOrders === 0) {
          formattedOrdersGrowth = 'No orders this month';
        } else if (lastMonthOrders === 0) {
          formattedOrdersGrowth = `${currentMonthOrders} orders this month`;
        } else {
          const ordersGrowthPercentage = ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100;
          formattedOrdersGrowth = ordersGrowthPercentage >= 0 
            ? `+${ordersGrowthPercentage.toFixed(1)}% from last month` 
            : `${ordersGrowthPercentage.toFixed(1)}% from last month`;
        }

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

          {/* Statistics Grid */}
          <DashboardStats stats={stats} loading={loading} />

          {/* Charts and Tables */}
          <DashboardCharts
            loading={loading}
            chartData={chartData}
            viewMode={viewMode}
            setViewMode={setViewMode}
            topProducts={topProducts}
            categoryData={categoryData}
            recentOrders={recentOrders}
            getStatusColor={getStatusColor}
          />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
