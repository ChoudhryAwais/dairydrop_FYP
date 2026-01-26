'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/auth/authService';
import ErrorMessage from '../../components/ErrorMessage';
import { InlineSpinner } from '../../components/LoadingSpinner';
import auth_bg from '../../assets/login/auth_bg.avif';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    const result = await resetPassword(email);

    if (result.success) {
      setSuccess(true);
    } else {
      // Handle different Firebase error codes
      let errorMessage = 'Failed to send reset email';
      if (result.error.includes('user-not-found')) {
        errorMessage = 'No account found with this email address';
      } else if (result.error.includes('invalid-email')) {
        errorMessage = 'Invalid email address';
      } else if (result.error.includes('too-many-requests')) {
        errorMessage = 'Too many attempts. Please try again later';
      }
      setError(errorMessage);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand Section */}
      <div
        className="hidden lg:flex lg:w-1/2 h-screen sticky top-0 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(22,163,74,0.7), rgba(34,197,94,0.6)), url(${auth_bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/logo2.png"
              alt="DairyDrop Logo"
              className="h-14 w-auto rounded-[12px] block group-hover:scale-105 transition-transform"
            />
            <h1 className="text-white text-3xl font-bold">Dairy Drop</h1>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h2 className="text-white text-5xl font-bold leading-tight mb-8">
            Don't worry, we've got you covered
          </h2>
          <p className="text-white text-opacity-90 text-lg">
            Enter your email and we'll send you instructions to reset your password
          </p>
        </div>

        {/* Info Card */}
        <div className="relative z-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-30">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="text-white font-semibold text-sm mb-2">Security First</p>
              <p className="text-white text-opacity-80 text-xs leading-relaxed">
                Your security is our priority. The password reset link will expire in 1 hour for your protection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-8 transition"
          >
            <span>←</span>
            <span className="text-sm font-medium">Back to Login</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔑</span>
            </div>
            <h2 className="text-3xl font-bold text-green-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-500 text-sm">
              No worries, we'll send you reset instructions
            </p>
          </div>

          {error && (
            <ErrorMessage
              message={error}
              type="error"
              dismissible={true}
              onDismiss={() => setError('')}
            />
          )}

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✉️</span>
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">Check your email</h3>
              <p className="text-gray-600 text-sm mb-6">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <p className="text-gray-500 text-xs mb-4">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                Try another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">✉️</span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <InlineSpinner size="small" />
                    <span>Sending...</span>
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          {/* Additional Help */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
