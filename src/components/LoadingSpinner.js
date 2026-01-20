'use client';

import React from 'react';

/**
 * LoadingSpinner Component
 * Reusable loading indicator with multiple variants
 * 
 * @param {string} size - Spinner size: 'sm', 'md', 'lg' (default: 'md')
 * @param {string} color - Spinner color: 'green', 'blue', 'gray' (default: 'green')
 * @param {string} message - Optional loading message text
 * @param {boolean} fullScreen - Fill entire screen (default: false)
 * @param {boolean} overlay - Show semi-transparent overlay (default: false)
 */
const LoadingSpinner = ({
  size = 'md',
  color = 'green',
  message = '',
  fullScreen = false,
  overlay = false,
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-3',
    lg: 'h-16 w-16 border-4',
  };

  const colorClasses = {
    green: 'border-green-600 border-t-transparent',
    blue: 'border-blue-600 border-t-transparent',
    gray: 'border-gray-600 border-t-transparent',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center'
    : 'flex items-center justify-center py-12';

  const overlayClasses = overlay
    ? 'bg-black/50'
    : 'bg-transparent';

  return (
    <div
      className={`${containerClasses} ${fullScreen ? overlayClasses : ''}`}
    >
      <div className="text-center">
        {/* Spinner */}
        <div
          className={`rounded-full animate-spin mx-auto ${sizeClasses[size]} ${colorClasses[color]}`}
        />

        {/* Message */}
        {message && (
          <p className="mt-4 text-gray-600 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Inline Loading Indicator
 * Compact spinner for use within buttons, cards, etc.
 */
export const InlineSpinner = ({ size = 'sm', color = 'green' }) => {
  const sizeClasses = {
    sm: 'h-3 w-3 border border-current',
    md: 'h-4 w-4 border-2 border-current',
  };

  const colorClasses = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    white: 'text-white',
  };

  return (
    <div
      className={`rounded-full animate-spin inline-block ${sizeClasses[size]} ${colorClasses[color]}`}
      style={{ borderTopColor: 'transparent' }}
    />
  );
};

/**
 * Skeleton Loading State
 * Placeholder while content loads
 */
export const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="flex gap-2 mt-4">
                <div className="h-10 bg-gray-200 rounded flex-1" />
                <div className="h-10 bg-gray-200 rounded flex-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm p-4 space-y-3 animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="h-6 bg-gray-200 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default LoadingSpinner;
