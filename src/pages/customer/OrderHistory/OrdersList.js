import React from 'react';
import { Link } from 'react-router-dom';

const OrdersList = ({ 
  filteredOrders,
  paginatedOrders,
  expandedOrderId,
  setExpandedOrderId,
  getStatusBadge,
  getStatusIcon,
  getStatusStep,
  currentPage,
  setCurrentPage,
  totalPages,
  filterStatus,
  searchQuery,
  setSearchQuery,
  setFilterStatus
}) => {
  // Empty State
  if (filteredOrders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-16 text-center">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
          <svg className="w-10 h-10 md:w-12 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">No orders found</h3>
        <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 max-w-md mx-auto">
          {filterStatus === 'all' && !searchQuery
            ? "You haven't placed any orders yet. Start shopping for fresh dairy products now!"
            : "No orders match your current filters. Try adjusting your search criteria."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {(filterStatus !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
              }}
              className="inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all shadow-sm text-sm md:text-base"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear Filters
            </button>
          )}
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl text-sm md:text-base"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Orders List */}
      <div className="space-y-4 md:space-y-5">
        {paginatedOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl md:rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-green-200 transition-all duration-300">
            {/* Collapsible Header */}
            <button
              onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
              className="w-full p-4 md:p-8 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-transparent transition-all duration-300"
            >
              <div className="w-full">
                {/* Header Row - Responsive Grid */}
                <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-6 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-200">
                  {/* Order Placed */}
                  <div className="col-span-1 md:col-span-3 text-left">
                    <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 md:mb-1.5">Order Placed</p>
                    <p className="text-xs md:text-sm text-gray-900 font-semibold">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-[10px] md:hidden text-gray-500 mt-0.5">ORD-{order.id?.substring(0, 4).toUpperCase()}</p>
                  </div>
                  
                  {/* Status - Mobile: Top Right, Desktop: Far Right */}
                  <div className="col-span-1 md:col-span-5 flex items-start md:items-end justify-end md:order-last">
                    <span className={`px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold shadow-sm ${getStatusBadge(order.status)}`}>
                      <span className="hidden md:inline">{getStatusIcon(order.status)} </span>{order.status}
                    </span>
                  </div>

                  {/* Order ID - Desktop Only */}
                  <div className="hidden md:block md:col-span-2 text-left">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1.5">Order ID</p>
                    <p className="text-sm text-green-700 font-bold">#{order.id?.substring(0, 8).toUpperCase()}</p>
                  </div>
                  
                  {/* Total Amount - Desktop Only in Header */}
                  <div className="hidden md:block md:col-span-2 text-left">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1.5">Total Amount</p>
                    <p className="text-lg text-gray-900 font-bold">${order.total?.toFixed(2)}</p>
                  </div>
                </div>

                {/* Products and Actions Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">
                  {/* Product Thumbnails */}
                  <div className="md:col-span-3 flex gap-2 md:gap-2.5">
                    {order.items?.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg md:rounded-xl flex items-center justify-center overflow-hidden border border-gray-200 md:border-2 shadow-sm hover:shadow-md transition-shadow">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-0.5 md:p-1" />
                        ) : (
                          <span className="text-lg md:text-2xl">🥛</span>
                        )}
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-lg md:rounded-xl flex items-center justify-center border border-green-200 md:border-2 shadow-sm">
                        <span className="text-sm md:text-base font-black text-green-700">+{order.items.length - 3}</span>
                      </div>
                    )}
                  </div>

                  {/* Product Names */}
                  <div className="md:col-span-2">
                    <p className="text-xs md:text-sm text-gray-700 font-medium line-clamp-2">
                      {order.items?.map(item => item.name).join(', ')}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-500 mt-1">{order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}</p>
                  </div>

                  {/* Mobile: Total Amount */}
                  <div className="md:hidden border-t border-gray-200 pt-3 flex justify-between items-center">
                    <p className="text-xs text-gray-500">Total:</p>
                    <p className="text-sm font-bold text-gray-900">${order.total?.toFixed(2)}</p>
                  </div>

                  {/* Desktop: View Invoice */}
                  <div className="hidden md:block md:col-span-2 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="text-green-600 hover:text-green-700 text-sm font-semibold flex items-center gap-2 justify-end transition-colors group"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Invoice
                    </button>
                  </div>

                  {/* Expand Icon */}
                  <div className="hidden md:flex md:col-span-5 justify-end">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg
                        className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                          expandedOrderId === order.id ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* Expanded Details */}
            {expandedOrderId === order.id && (
              <div className="border-t border-gray-200 p-4 md:p-8 bg-gradient-to-br from-gray-50 to-white space-y-4 md:space-y-8">
                {/* Timeline Steps - Only show if not cancelled */}
                {order.status !== 'Cancelled' && (
                  <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200">
                    <h3 className="text-sm md:text-base font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      Delivery Progress
                    </h3>
                    <div className="flex justify-between relative px-2 md:px-4">
                      {/* Timeline Line */}
                      <div className="absolute top-4 md:top-5 left-2 md:left-4 right-2 md:right-4 h-0.5 md:h-1.5 bg-gray-200 rounded-full z-0">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500 shadow-sm"
                          style={{
                            width: `${(getStatusStep(order.status) / 3) * 100}%`,
                          }}
                        />
                      </div>

                      {/* Timeline Steps */}
                      {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, index) => (
                        <div key={step} className="flex flex-col items-center z-10">
                          <div
                            className={`w-8 h-8 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-lg font-bold transition-all duration-300 border-2 md:border-4 ${ 
                              getStatusStep(order.status) >= index
                                ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg border-white'
                                : 'bg-white text-gray-400 border-gray-200'
                            }`}
                          >
                            {getStatusStep(order.status) > index ? '✓' : index + 1}
                          </div>
                          <p className={`text-[10px] md:text-xs font-semibold mt-2 md:mt-3 text-center max-w-[60px] ${getStatusStep(order.status) >= index ? 'text-gray-900' : 'text-gray-500'}`}>{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cancelled Notice */}
                {order.status === 'Cancelled' && (
                  <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 md:border-2 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm">
                    <div className="flex items-start md:items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-12 md:h-12 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg md:text-2xl">❌</span>
                      </div>
                      <div>
                        <h4 className="text-xs md:text-base font-bold text-red-900 mb-0.5 md:mb-1">Order Cancelled</h4>
                        <p className="text-[10px] md:text-sm text-red-800">This order has been cancelled and will not be delivered.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200">
                  <h3 className="text-sm md:text-base font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    Order Items
                  </h3>
                  <div className="space-y-2 md:space-y-3">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 md:p-4 rounded-lg md:rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all">
                        <div className="flex items-center gap-2 md:gap-4">
                          <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 md:border-2 shadow-sm">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-0.5 md:p-1" />
                            ) : (
                              <span className="text-base md:text-xl">🥛</span>
                            )}
                          </div>
                          <div>
                            <p className="text-xs md:text-base font-semibold text-gray-900">{item.name}</p>
                            <p className="text-[10px] md:text-sm text-gray-600">Quantity: <span className="font-medium text-gray-900">{item.quantity}</span></p>
                          </div>
                        </div>
                        <p className="text-sm md:text-lg font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Order Summary */}
                  <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
                    <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      Order Summary
                    </h4>
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex justify-between text-xs md:text-sm p-2 md:p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Subtotal</span>
                        <span className="font-semibold text-gray-900">${order.subtotal?.toFixed(2) || order.total?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm p-2 md:p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Tax</span>
                        <span className="font-semibold text-gray-900">${order.tax?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="border-t-2 border-gray-200 pt-2 md:pt-3 mt-2 md:mt-3 flex justify-between items-center p-2 md:p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                        <span className="text-sm md:text-base font-bold text-gray-900">Total</span>
                        <span className="font-black text-green-600 text-lg md:text-2xl">${order.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {order.customerInfo && (
                    <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
                      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 md:w-5 md:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        Delivery Address
                      </h4>
                      <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                          <span className="font-semibold text-gray-900 block mb-1 md:mb-2">{order.customerInfo.fullName}</span>
                          {order.customerInfo.address}<br />
                          {order.customerInfo.city}, {order.customerInfo.postalCode}<br />
                          <span className="font-medium text-gray-900 mt-1 md:mt-2 inline-block">📞 {order.customerInfo.phone}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-2 md:gap-3 pt-2 md:pt-4">
                  <button className="flex-1 text-green-600 hover:text-white hover:bg-green-600 font-semibold py-2 md:py-3 border-2 border-green-600 rounded-lg md:rounded-xl transition-all shadow-sm hover:shadow-md text-sm md:text-base">
                    View Invoice
                  </button>
                  {order.status === 'Delivered' && (
                    <button className="flex-1 px-4 py-2 md:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg md:rounded-xl transition-all shadow-md hover:shadow-lg text-sm md:text-base">
                      Buy Again
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 md:mt-10 flex items-center justify-center gap-1.5 md:gap-2">
          <button 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`min-w-[32px] h-8 md:min-w-[40px] md:h-10 px-2 md:px-3 rounded-lg font-semibold text-xs md:text-sm transition-all ${
                currentPage === page
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-110'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-500 hover:text-green-600'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersList;

