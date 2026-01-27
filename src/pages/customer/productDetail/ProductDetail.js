'use client';

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/myContext';
import { getProductById, getProducts } from '../../../services/products/productService';
import { getProductReviews, addReview } from '../../../services/reviews/reviewService';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTabs';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, cartItems } = useCart();
  const { isAuthenticated, currentUser } = useAuth();
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
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

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

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notificationMessage && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-fade-in ${notificationType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
          {notificationMessage}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
          <span className="text-gray-400">/</span>
          <Link to="/products" className="hover:text-green-600 transition-colors">Products</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>
      </div>

      {/* Product Information Component */}
      <ProductInfo
        product={product}
        quantity={quantity}
        setQuantity={setQuantity}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        cartItems={cartItems}
        addToCart={addToCart}
        setAddedNotification={setAddedNotification}
        setNotificationMessage={setNotificationMessage}
        setNotificationType={setNotificationType}
        renderStars={renderStars}
      />

      {/* Product Tabs Component */}
      <ProductTabs
        product={product}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reviews={reviews}
        reviewForm={reviewForm}
        setReviewForm={setReviewForm}
        submittingReview={submittingReview}
        handleAddReview={handleAddReview}
        isAuthenticated={isAuthenticated}
        renderStars={renderStars}
        relatedProducts={relatedProducts}
      />
    </div>
  );
};

export default ProductDetail;
