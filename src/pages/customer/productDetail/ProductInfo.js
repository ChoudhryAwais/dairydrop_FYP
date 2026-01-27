import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const ProductInfo = ({
  product,
  quantity,
  setQuantity,
  selectedImage,
  setSelectedImage,
  cartItems,
  addToCart,
  setAddedNotification,
  setNotificationMessage,
  setNotificationType,
  renderStars
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg flex items-center justify-center h-96 overflow-hidden border border-gray-200">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-9xl">🥛</div>
              )}
            </div>
            {/* Image Thumbnails */}
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center overflow-hidden transition-all ${selectedImage === index
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 bg-gray-100'
                    }`}
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-2xl">🥛</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">

            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* Rating */}
              {product.ratingCount > 0 ? (
                <div className="flex items-center gap-3">
                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {renderStars(product.ratingAvg)}
                  </div>

                  {/* Average rating and count */}
                  <span className="text-sm text-gray-600">
                    {product.ratingAvg?.toFixed(1)} | {product.ratingCount} {product.ratingCount === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No reviews yet</div>
              )}

            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 border-b border-gray-200 pb-4">
              <span className="text-4xl font-bold text-green-600">${product.price}</span>
              <span className="text-lg text-gray-500 line-through">${(product.price * 1.1).toFixed(2)}</span>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Product Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-green-600 text-lg font-semibold">📦</div>
                <p className="text-xs text-gray-600 mt-1">Shelf Life</p>
                <p className="text-sm font-semibold text-gray-900">{product.shelfLife || 'N/A'}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-green-600 text-lg font-semibold">✓</div>
                <p className="text-xs text-gray-600 mt-1">Pasteurized</p>
                <p className="text-sm font-semibold text-gray-900">Yes</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-green-600 text-lg font-semibold">⭐</div>
                <p className="text-xs text-gray-600 mt-1">Grade A</p>
                <p className="text-sm font-semibold text-gray-900">Premium</p>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <span className="w-3 h-3 bg-green-600 rounded-full"></span>
              {product.quantity > 0 ? (
                <span>In Stock - Ready to Ship</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors font-bold text-lg w-10 h-10 flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-semibold text-base py-2">{quantity}</span>
                  <button
                    onClick={() => {
                      const cartItem = cartItems.find(item => item.id === product.id);
                      const currentCartQty = cartItem ? cartItem.quantity : 0;
                      const maxAllowed = product.quantity - currentCartQty;
                      setQuantity(Math.min(maxAllowed, quantity + 1));
                    }}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors font-bold text-lg w-10 h-10 flex items-center justify-center"
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
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed ${false
                    ? 'bg-emerald-600 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  disabled={product.quantity <= 0 || (() => {
                    const cartItem = cartItems.find(item => item.id === product.id);
                    const currentCartQty = cartItem ? cartItem.quantity : 0;
                    return currentCartQty >= product.quantity;
                  })()}
                >
                  🛒 Add to Cart
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                  ♡
                </button>
              </div>

              {/* Items in Cart Info */}
              {(() => {
                const cartItem = cartItems.find(item => item.id === product.id);
                const currentCartQty = cartItem ? cartItem.quantity : 0;
                const remaining = product.quantity - currentCartQty;

                return currentCartQty > 0 ? (
                  <div className="text-sm text-gray-600 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">In your cart:</span>
                      <span className="font-semibold text-blue-600">{currentCartQty} item{currentCartQty > 1 ? 's' : ''}</span>
                    </div>
                    {remaining > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Can still add:</span>
                        <span className="font-semibold text-amber-600">{remaining} more</span>
                      </div>
                    )}
                  </div>
                ) : null;
              })()}
            </div>

            {/* Features */}
            <div className="flex gap-4 text-sm text-gray-600 border-t pt-4">
              <div className="flex items-center gap-1">
                <span className="text-lg">🌿</span> 100% Organic
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg">✓</span> Non-GMO
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg">🚚</span> Free Shipping over $25
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
