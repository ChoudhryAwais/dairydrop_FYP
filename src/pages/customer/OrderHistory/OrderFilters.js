import React from 'react';

const OrderFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  filterStatus, 
  setFilterStatus, 
  setCurrentPage,
  filteredOrdersCount 
}) => {
  return (
    <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="sm:col-span-1 relative">
          <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Search</label>
          <svg className="absolute left-3 bottom-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by order ID or product..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Date Range</label>
          <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white cursor-pointer transition-all">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Last 6 Months</option>
            <option>All Time</option>
          </select>
          <svg className="absolute right-3 bottom-3.5 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white cursor-pointer transition-all"
          >
            <option value="all">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <svg className="absolute right-3 bottom-3.5 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Filter Summary */}
      {(searchQuery || filterStatus !== 'all') && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredOrdersCount}</span> {filteredOrdersCount === 1 ? 'order' : 'orders'}
            {searchQuery && <span> matching "<span className="font-medium">{searchQuery}</span>"</span>}
          </p>
          {(searchQuery || filterStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
                setCurrentPage(1);
              }}
              className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderFilters;
