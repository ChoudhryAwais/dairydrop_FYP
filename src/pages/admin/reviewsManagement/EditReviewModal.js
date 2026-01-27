import React from 'react';

const EditReviewModal = ({
  showModal,
  selectedReview,
  editedContent,
  setEditedContent,
  actionInProgress,
  onSave,
  onClose,
  getStarRating
}) => {
  if (!showModal || !selectedReview) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Review Content</h2>
          <button
            onClick={onClose}
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
              onClick={onClose}
              disabled={actionInProgress}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={actionInProgress || editedContent.trim() === ''}
              className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-200 font-medium disabled:opacity-50 shadow-sm hover:shadow-md"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditReviewModal;
