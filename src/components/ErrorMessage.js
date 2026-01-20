'use client';

import React, { useState } from 'react';

/**
 * ErrorMessage Component
 * Reusable error display with dismissible option
 * 
 * @param {string} message - Error message text (required)
 * @param {string} type - Error type: 'error', 'warning', 'info' (default: 'error')
 * @param {boolean} dismissible - Allow user to close the error (default: true)
 * @param {Function} onDismiss - Callback when error is dismissed
 * @param {string} title - Optional error title/heading
 * @param {Array} details - Optional array of error details to display
 */
const ErrorMessage = ({
  message,
  type = 'error',
  dismissible = true,
  onDismiss,
  title,
  details = [],
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) {
    return null;
  }

  if (!message) {
    return null;
  }

  const styles = {
    error: {
      container: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      title: 'text-red-900',
      message: 'text-red-800',
      button: 'text-red-600 hover:text-red-700 hover:bg-red-100',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      message: 'text-yellow-800',
      button: 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100',
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      message: 'text-blue-800',
      button: 'text-blue-600 hover:text-blue-700 hover:bg-blue-100',
    },
  };

  const style = styles[type] || styles.error;

  const icons = {
    error: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  return (
    <div
      className={`border rounded-lg p-3 sm:p-4 ${style.container} flex flex-col sm:flex-row gap-2 sm:gap-3 w-full overflow-hidden`}
      role="alert"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 flex items-center justify-center h-5 w-5 mt-0.5 ${style.icon}`}>
        {icons[type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className={`font-semibold mb-1 text-sm sm:text-base break-words ${style.title}`}>
            {title}
          </h3>
        )}
        <p className={`text-xs sm:text-sm break-words ${style.message}`}>
          {message}
        </p>

        {/* Error Details (if provided) */}
        {details.length > 0 && (
          <ul className={`mt-2 ml-4 sm:ml-5 text-xs sm:text-sm list-disc ${style.message}`}>
            {details.map((detail, index) => (
              <li key={index} className="mt-1 break-words">
                {detail}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Dismiss Button */}
      {dismissible && (
        <button
          onClick={handleDismiss}
          className={`flex-shrink-0 inline-flex rounded-md p-1 sm:p-1.5 transition-colors self-start sm:self-center ${style.button}`}
          aria-label="Dismiss error"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

/**
 * FieldError Component
 * Inline error display for form fields
 */
export const FieldError = ({ message, visible = true }) => {
  if (!visible || !message) {
    return null;
  }

  return (
    <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1 break-words">
      <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </p>
  );
};

/**
 * ErrorBoundary Component
 * Catches and displays unhandled errors
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[v0] Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="text-center">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-red-600 mx-auto mb-3 sm:mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
                Oops! Something went wrong
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 break-words">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorMessage;
