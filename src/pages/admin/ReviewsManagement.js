'use client';

import React, { useState, useEffect } from 'react';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAllReviews, deleteReview, approveReview, updateReviewContent } from '../../services/reviews/reviewService';

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [actionInProgress, setActionInProgress] = useState(false);

  // Fetch all reviews on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const result = await getAllReviews();
        if (result.success) {
          setReviews(result.reviews);
          setFilteredReviews(result.reviews);
          setError('');
        } else {
          setError('Failed to load reviews');
        }
      } catch (err) {
        setError('Error fetching reviews');
        console.log('[v0] Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Filter reviews based on status and search term
  useEffect(() => {
    let filtered = reviews;

    if (statusFilter !== 'All') {
      if (statusFilter === 'Approved') {
        filtered = filtered.filter(review => review.approved === true);
      } else if (statusFilter === 'Pending') {
        filtered = filtered.filter(review => review.approved !== true);
      }
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        review =>
          (review.authorName && review.authorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (review.comment && review.comment.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (review.productId && review.productId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredReviews(filtered);
  }, [reviews, statusFilter, searchTerm]);

  // Handle delete review
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        setActionInProgress(true);
        const result = await deleteReview(reviewId);
        if (result.success) {
          setReviews(reviews.filter(r => r.id !== reviewId));
          setSuccessMessage('Review deleted successfully');
          setTimeout(() => setSuccessMessage(''), 3000);
          setError('');
        } else {
          setError('Failed to delete review');
        }
      } catch (err) {
        setError('Error deleting review');
        console.log('[v0] Error deleting review:', err);
      } finally {
        setActionInProgress(false);
      }
    }
  };

  // Handle approve review
  const handleApproveReview = async (reviewId) => {
    try {
      setActionInProgress(true);
      const result = await approveReview(reviewId);
      if (result.success) {
        const updatedReviews = reviews.map(r =>
          r.id === reviewId ? { ...r, approved: true, approvedAt: new Date().toISOString() } : r
        );
        setReviews(updatedReviews);
        setSuccessMessage('Review approved successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        setError('');
      } else {
        setError('Failed to approve review');
      }
    } catch (err) {
      setError('Error approving review');
      console.log('[v0] Error approving review:', err);
    } finally {
      setActionInProgress(false);
    }
  };

  // Handle edit review content
  const handleEditContent = async (reviewId) => {
    try {
      setActionInProgress(true);
      const result = await updateReviewContent(reviewId, editedContent);
      if (result.success) {
        const updatedReviews = reviews.map(r =>
          r.id === reviewId ? { ...r, comment: editedContent, updatedAt: new Date().toISOString() } : r
        );
        setReviews(updatedReviews);
        setSuccessMessage('Review content updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        setShowEditModal(false);
        setEditedContent('');
        setSelectedReview(null);
        setError('');
      } else {
        setError('Failed to update review');
      }
    } catch (err) {
      setError('Error updating review');
      console.log('[v0] Error updating review:', err);
    } finally {
      setActionInProgress(false);
    }
  };

  // Get status badge
  const getStatusBadge = (isApproved) => {
    if (isApproved) {
      return <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Approved</span>;
    }
    return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">Pending</span>;
  };

  // Get star rating display
  const getStarRating = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        ))}
        <span className="text-gray-600 text-sm ml-2">({rating}/5)</span>
      </div>
    );
  };

  // Calculate statistics
  const totalReviews = reviews.length;
  const approvedCount = reviews.filter(r => r.approved === true).length;
  const pendingCount = totalReviews - approvedCount;
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1">Reviews Moderation</h1>
            <p className="text-sm sm:text-base text-gray-500">Manage and moderate customer reviews</p>
          </div>

          {/* Statistics Cards */}
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

          {/* Success Message */}
          {successMessage && (
            <ErrorMessage 
              message={successMessage} 
              type="info" 
              dismissible={true}
              onDismiss={() => setSuccessMessage('')}
            />
          )}

          {/* Error Message */}
          {error && (
            <ErrorMessage 
              message={error} 
              type="error" 
              dismissible={true}
              onDismiss={() => setError('')}
            />
          )}

          {/* Filters and Search */}
          <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Reviews</label>
                <input
                  type="text"
                  placeholder="Search by author, content, or product ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200"
                >
                  <option value="All">All Reviews</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-gray-100">
              <LoadingSpinner size="md" message="Loading reviews..." />
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⭐</span>
              </div>
              <p className="text-gray-600 text-lg font-medium mb-1">No reviews found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            /* Reviews List */
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
                      onClick={() => {
                        setSelectedReview(review);
                        setEditedContent(review.comment);
                        setShowEditModal(true);
                      }}
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
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Review Content</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditedContent('');
                  setSelectedReview(null);
                }}
                className="text-gray-500 hover:text-gray-700 font-bold text-2xl transition-colors duration-200"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Review Info */}
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Author</p>
                <p className="text-gray-800 font-medium">{selectedReview.authorName || 'Anonymous'}</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Rating</p>
                {getStarRating(selectedReview.rating || 0)}
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Review Content</label>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="Edit the review content..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200 resize-none"
                  rows="6"
                />
                <p className="text-gray-400 text-xs mt-2">
                  {editedContent.length} / 1000 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditedContent('');
                    setSelectedReview(null);
                  }}
                  disabled={actionInProgress}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEditContent(selectedReview.id)}
                  disabled={actionInProgress || editedContent.trim() === ''}
                  className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-200 font-medium disabled:opacity-50 shadow-sm hover:shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewsManagement;
