import React from 'react';

const DashboardStats = ({ stats, loading }) => {
  return (
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
  );
};

export default DashboardStats;
