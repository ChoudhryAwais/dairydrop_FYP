'use client';

import React, { useState, useEffect } from 'react';
import ErrorMessage from '../../../components/ErrorMessage';
import { getAllReviews, deleteReview, approveReview, updateReviewContent } from '../../../services/reviews/reviewService';
import ReviewsStats from './ReviewsStats';
import ReviewsList from './ReviewsList';
import EditReviewModal from './EditReviewModal';

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
  const handleEditContent = async () => {
    if (!selectedReview) return;

    try {
      setActionInProgress(true);
      const result = await updateReviewContent(selectedReview.id, editedContent);
      if (result.success) {
        const updatedReviews = reviews.map(r =>
          r.id === selectedReview.id ? { ...r, comment: editedContent, updatedAt: new Date().toISOString() } : r
        );
        setReviews(updatedReviews);
        setSuccessMessage('Review content updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        handleCloseModal();
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

  const handleEditClick = (review) => {
    setSelectedReview(review);
    setEditedContent(review.comment);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditedContent('');
    setSelectedReview(null);
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
          <ReviewsStats
            totalReviews={totalReviews}
            approvedCount={approvedCount}
            pendingCount={pendingCount}
            averageRating={averageRating}
          />

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

          {/* Reviews List */}
          <ReviewsList
            filteredReviews={filteredReviews}
            loading={loading}
            actionInProgress={actionInProgress}
            handleApproveReview={handleApproveReview}
            handleDeleteReview={handleDeleteReview}
            onEditClick={handleEditClick}
            getStatusBadge={getStatusBadge}
            getStarRating={getStarRating}
          />
        </div>
      </div>

      {/* Edit Modal */}
      <EditReviewModal
        showModal={showEditModal}
        selectedReview={selectedReview}
        editedContent={editedContent}
        setEditedContent={setEditedContent}
        actionInProgress={actionInProgress}
        onSave={handleEditContent}
        onClose={handleCloseModal}
        getStarRating={getStarRating}
      />
    </>
  );
};

export default ReviewsManagement;
