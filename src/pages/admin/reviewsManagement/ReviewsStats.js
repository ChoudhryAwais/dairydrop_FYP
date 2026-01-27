import React from 'react';

const ReviewsStats = ({ totalReviews, approvedCount, pendingCount, averageRating }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-medium text-sm">Total Reviews</h3>
          <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
            <span className="text-xl">⭐</span>
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{totalReviews}</p>
        <p className="text-gray-400 text-xs mt-1">All reviews</p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-medium text-sm">Approved</h3>
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <span className="text-xl">✓</span>
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{approvedCount}</p>
        <p className="text-gray-400 text-xs mt-1">Published reviews</p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-medium text-sm">Pending</h3>
          <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
            <span className="text-xl">⏳</span>
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{pendingCount}</p>
        <p className="text-gray-400 text-xs mt-1">Awaiting approval</p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-medium text-sm">Avg Rating</h3>
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <span className="text-xl">📊</span>
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{averageRating}</p>
        <p className="text-gray-400 text-xs mt-1">out of 5 stars</p>
      </div>
    </div>
  );
};

export default ReviewsStats;
