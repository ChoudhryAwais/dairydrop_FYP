import React from 'react';
import LoadingSpinner from '../../../components/LoadingSpinner';

const ReviewsList = ({
  filteredReviews,
  loading,
  actionInProgress,
  handleApproveReview,
  handleDeleteReview,
  onEditClick,
  getStatusBadge,
  getStarRating
}) => {
  if (loading) {
    return (
      <div className="bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-gray-100">
        <LoadingSpinner size="md" message="Loading reviews..." />
      </div>
    );
  }

  if (filteredReviews.length === 0) {
    return (
      <div className="bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⭐</span>
        </div>
        <p className="text-gray-600 text-lg font-medium mb-1">No reviews found</p>
        <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredReviews.map((review) => (
        <div
          key={review.id}
          className="bg-white p-5 sm:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          {/* Review Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-gray-800">{review.authorName || 'Anonymous'}</h3>
                {getStatusBadge(review.approved)}
              </div>
              <p className="text-gray-600 text-sm mb-2">Product ID: {review.productId}</p>
              {getStarRating(review.rating || 0)}
            </div>
            <p className="text-gray-500 text-xs mt-3 md:mt-0">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Review Content */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            {!review.approved && (
              <button
                onClick={() => handleApproveReview(review.id)}
                disabled={actionInProgress}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-200 font-medium text-sm disabled:opacity-50 shadow-sm hover:shadow-md"
              >
                Approve
              </button>
            )}
            <button
              onClick={() => onEditClick(review)}
              disabled={actionInProgress}
              className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all duration-200 font-medium text-sm disabled:opacity-50"
            >
              Edit Content
            </button>
            <button
              onClick={() => handleDeleteReview(review.id)}
              disabled={actionInProgress}
              className="flex-1 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium text-sm disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
