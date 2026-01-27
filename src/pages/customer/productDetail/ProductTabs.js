import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProductTabs = ({
  product,
  activeTab,
  setActiveTab,
  reviews,
  reviewForm,
  setReviewForm,
  submittingReview,
  handleAddReview,
  isAuthenticated,
  renderStars,
  relatedProducts
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Tabs Section */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'description'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'nutrition'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              Nutritional Facts
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'reviews'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              Reviews
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
              {product.brand && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Brand</h3>
                  <p className="text-gray-700">{product.brand}</p>
                </div>
              )}
              {product.fatContent && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fat Content</h3>
                  <p className="text-gray-700">{product.fatContent}</p>
                </div>
              )}
            </div>
          )}

          {/* Nutrition Tab */}
          {activeTab === 'nutrition' && product.nutritionalFacts && Object.values(product.nutritionalFacts).some(v => v) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nutritional Facts</h2>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 text-gray-600">Amount Per Serving</td>
                      <td className="py-3 text-right font-semibold">1 Cup (240ml)</td>
                    </tr>
                    {product.nutritionalFacts.calories && (
                      <tr className="border-b border-gray-200">
                        <td className="py-3 text-gray-600">Calories</td>
                        <td className="py-3 text-right font-semibold">{product.nutritionalFacts.calories}</td>
                      </tr>
                    )}
                    {product.nutritionalFacts.fat && (
                      <tr className="border-b border-gray-200">
                        <td className="py-3 text-gray-600">Total Fat</td>
                        <td className="py-3 text-right font-semibold">{product.nutritionalFacts.fat}g</td>
                      </tr>
                    )}
                    {product.nutritionalFacts.protein && (
                      <tr className="border-b border-gray-200">
                        <td className="py-3 text-gray-600">Protein</td>
                        <td className="py-3 text-right font-semibold">{product.nutritionalFacts.protein}g</td>
                      </tr>
                    )}
                    {product.nutritionalFacts.carbs && (
                      <tr className="border-b border-gray-200">
                        <td className="py-3 text-gray-600">Total Carbohydrate</td>
                        <td className="py-3 text-right font-semibold">{product.nutritionalFacts.carbs}g</td>
                      </tr>
                    )}
                    {product.nutritionalFacts.calcium && (
                      <tr className="border-b border-gray-200">
                        <td className="py-3 text-gray-600">Calcium</td>
                        <td className="py-3 text-right font-semibold">{product.nutritionalFacts.calcium}mg</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="bg-green-50 rounded-lg p-6 h-fit">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Why Organic?</h3>
                <ul className="space-y-3">
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">No synthetic hormones or antibiotics</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Cows raised on organic pasture</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Higher levels of Omega-3 fatty acids</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Support for sustainable farming practices</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Never tested on animals</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

              {/* Review Stats */}
              {reviews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 pb-8 border-b border-gray-200">
                  <div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-gray-900">{product.ratingAvg?.toFixed(1) || '0'}</span>
                      <span className="text-gray-500">out of 5</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center gap-1">
                        {renderStars(product.ratingAvg)}
                      </div>

                    </div>
                    <p className="text-sm text-gray-600">Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviews.filter(r => r.rating === rating).length;
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-8">{rating}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Write Review Button */}
              {!isAuthenticated && (
                <div className="mb-8">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Write a Review
                  </button>
                </div>
              )}

              {/* Add Review Form - Authenticated */}
              {isAuthenticated && (
                <form onSubmit={handleAddReview} className="bg-gray-50 rounded-lg p-6 mb-8 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Leave a Review</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value={5}>5 Stars - Excellent</option>
                      <option value={4}>4 Stars - Good</option>
                      <option value={3}>3 Stars - Average</option>
                      <option value={2}>2 Stars - Poor</option>
                      <option value={1}>1 Star - Very Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Share your thoughts about this product..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none h-24"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium disabled:bg-gray-400 transition-colors"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="flex gap-4 pb-6 border-b border-gray-200 last:border-b-0">
                      {/* User Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                          {review.userName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{review.userName}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <div className="flex items-center gap-1">
                                  {renderStars(review.rating)}
                                </div>

                              </div>
                              <p className="text-xs text-gray-500">
                                {review.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review this product!</p>
                )}
              </div>

              {/* View All Reviews Link */}
              {reviews.length > 3 && (
                <div className="mt-8 text-center">
                  <button className="text-green-600 font-medium hover:text-green-700 transition-colors">
                    View All Reviews
                    <span className="ml-1">→</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* You Might Also Like Section */}
      {relatedProducts.length > 0 && (
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-gray-100 h-48 flex items-center justify-center overflow-hidden">
                      {relatedProduct.imageUrl ? (
                        <img
                          src={relatedProduct.imageUrl}
                          alt={relatedProduct.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-6xl">🥛</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-green-600 font-bold">${relatedProduct.price}</p>
                        <button className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductTabs;
