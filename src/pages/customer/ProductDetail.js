'use client';

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/myContext';
import { getProductById, getProducts } from '../../services/products/productService';
import { getProductReviews, addReview } from '../../services/reviews/reviewService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, cartItems } = useCart();
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [addedNotification, setAddedNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        const productResult = await getProductById(id);
        if (productResult.success) {
          setProduct(productResult.product);
          
          // Fetch related products (same category, excluding current product)
          const allProductsResult = await getProducts();
          if (allProductsResult.success) {
            const related = allProductsResult.products
              .filter(p => p.category === productResult.product.category && p.id !== id)
              .slice(0, 4);
            setRelatedProducts(related);
          }
        } else {
          setError('Product not found');
        }

        const reviewsResult = await getProductReviews(id);
        console.log("Reviews result:", reviewsResult);
        if (reviewsResult.success) {
          setReviews(reviewsResult.reviews);
        }
      } catch (err) {
        console.error('[v0] Error fetching product:', err);
        setError('Error loading product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to leave a review');
      return;
    }

    setSubmittingReview(true);
    const reviewData = {
      productId: id,
      userId: currentUser.uid,
      userName: currentUser.email,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      approved: false // Reviews need admin approval
    };

    const result = await addReview(reviewData);
    if (result.success) {
      setReviewForm({ rating: 5, comment: '' });
      
      // Refresh product data to get updated rating
      const productResult = await getProductById(id);
      if (productResult.success) {
        setProduct(productResult.product);
      }
      
      // Refresh reviews
      const reviewsResult = await getProductReviews(id);
      if (reviewsResult.success) {
        setReviews(reviewsResult.reviews);
      }
      
      alert('Review submitted successfully!');
    } else {
      alert('Failed to submit review');
    }
    setSubmittingReview(false);
  };

  if (loading) {
    return <LoadingSpinner size="md" message="Loading product..." />;
  }

  if (error || !product) {
    return <ErrorMessage message={error || 'Product not found'} type="error" />;
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notificationMessage && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-fade-in ${
          notificationType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {notificationMessage}
        </div>
      )}
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-green-600 transition-colors">Products</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Product Image */}
          <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl flex items-center justify-center h-96 overflow-hidden">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <div className="text-9xl">🥛</div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full mb-3">
                {product.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.description}</p>
              
              {/* Rating Display */}
              {product.ratingCount > 0 ? (
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-2xl ${
                          i < Math.round(product.ratingAvg) 
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-bold text-lg">{product.ratingAvg.toFixed(1)}</span>
                    <span className="text-gray-500 ml-1">({product.ratingCount} {product.ratingCount === 1 ? 'review' : 'reviews'})</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 mt-3 text-sm">
                  No reviews yet
                </div>
              )}
            </div>

            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-green-600">${product.price}</span>
                <span className="text-gray-500">per unit</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Availability:</span>
                {product.quantity > 0 ? (
                  <span className="flex items-center text-green-600 font-medium">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    In Stock ({product.quantity} available)
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>
              {product.brand && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Brand:</span>
                  <span className="text-gray-800 font-medium">{product.brand}</span>
                </div>
              )}
              {product.fatContent && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Fat Content:</span>
                  <span className="text-gray-800 font-medium">{product.fatContent}</span>
                </div>
              )}
              {product.shelfLife && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Shelf Life:</span>
                  <span className="text-gray-800 font-medium">{product.shelfLife}</span>
                </div>
              )}
              {(() => {
                const cartItem = cartItems.find(item => item.id === product.id);
                const currentCartQty = cartItem ? cartItem.quantity : 0;
                return currentCartQty > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">In your cart:</span>
                    <span className="text-blue-600 font-medium">{currentCartQty} item(s)</span>
                  </div>
                );
              })()}
              {(() => {
                const cartItem = cartItems.find(item => item.id === product.id);
                const currentCartQty = cartItem ? cartItem.quantity : 0;
                const remaining = product.quantity - currentCartQty;
                return currentCartQty > 0 && remaining > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Can still add:</span>
                    <span className="text-amber-600 font-medium">{remaining} more</span>
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x border-gray-300 font-medium">{quantity}</span>
                <button 
                  onClick={() => {
                    const cartItem = cartItems.find(item => item.id === product.id);
                    const currentCartQty = cartItem ? cartItem.quantity : 0;
                    const maxAllowed = product.quantity - currentCartQty;
                    setQuantity(Math.min(maxAllowed, quantity + 1));
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  disabled={(() => {
                    const cartItem = cartItems.find(item => item.id === product.id);
                    const currentCartQty = cartItem ? cartItem.quantity : 0;
                    return quantity >= (product.quantity - currentCartQty);
                  })()}
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => {
                  const result = addToCart(product, quantity);
                  if (result.success) {
                    setAddedNotification(true);
                    setNotificationMessage(result.message);
                    setNotificationType('success');
                    setTimeout(() => {
                      setAddedNotification(false);
                      navigate('/cart');
                    }, 1500);
                  } else {
                    setNotificationMessage(result.message);
                    setNotificationType('error');
                    setTimeout(() => {
                      setNotificationMessage('');
                    }, 3000);
                  }
                }}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed ${
                  addedNotification
                    ? 'bg-emerald-600 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                disabled={product.quantity <= 0 || (() => {
                  const cartItem = cartItems.find(item => item.id === product.id);
                  const currentCartQty = cartItem ? cartItem.quantity : 0;
                  return currentCartQty >= product.quantity;
                })()}
              >
                {addedNotification ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
            </div>

            <Link 
              to="/products"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Products
            </Link>
          </div>
        </div>
      </div>

      {/* Nutritional Facts */}
      {product.nutritionalFacts && Object.values(product.nutritionalFacts).some(v => v) && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Nutritional Facts</h2>
          <p className="text-sm text-gray-600 mb-4">Per 100g/ml</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {product.nutritionalFacts.calories && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-blue-600">{product.nutritionalFacts.calories}</p>
                <p className="text-sm text-gray-600 mt-1">Calories (kcal)</p>
              </div>
            )}
            {product.nutritionalFacts.protein && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-green-600">{product.nutritionalFacts.protein}g</p>
                <p className="text-sm text-gray-600 mt-1">Protein</p>
              </div>
            )}
            {product.nutritionalFacts.fat && (
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-yellow-600">{product.nutritionalFacts.fat}g</p>
                <p className="text-sm text-gray-600 mt-1">Fat</p>
              </div>
            )}
            {product.nutritionalFacts.carbs && (
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-purple-600">{product.nutritionalFacts.carbs}g</p>
                <p className="text-sm text-gray-600 mt-1">Carbs</p>
              </div>
            )}
            {product.nutritionalFacts.calcium && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-orange-600">{product.nutritionalFacts.calcium}mg</p>
                <p className="text-sm text-gray-600 mt-1">Calcium</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link 
                key={relatedProduct.id} 
                to={`/products/${relatedProduct.id}`}
                className="group"
              >
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-200 h-48 flex items-center justify-center">
                    {relatedProduct.imageUrl ? (
                      <img 
                        src={relatedProduct.imageUrl} 
                        alt={relatedProduct.name} 
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <div className="text-6xl">🥛</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-green-600 font-bold mt-2">${relatedProduct.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Customer Reviews</h2>

        {/* Add Review Form */}
        {isAuthenticated ? (
          <form onSubmit={handleAddReview} className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Leave a Review</h3>
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
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              <Link to="/login" className="font-semibold hover:underline">Log in</Link> to leave a review.
            </p>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{review.userName}</p>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {review.createdAt?.toDate().toLocaleDateString()}
                  </p>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center py-4">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
