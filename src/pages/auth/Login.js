'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/auth/authService';
import { useAuth } from '../../context/myContext';
import ErrorMessage from '../../components/ErrorMessage';
import { InlineSpinner } from '../../components/LoadingSpinner';
import auth_bg from '../../assets/login/auth_bg.avif';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { userDetails } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userDetails) {
      if (userDetails.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, userDetails, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await loginUser(email, password);

    if (result.success) {
      // Role-based routing is handled by the useEffect above
    } else {
      setError(result.error || 'Failed to login');
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
            Fresh from the farm to your doorstep
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="relative z-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-30">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-300 text-lg">★</span>
            ))}
          </div>
          <p className="text-white text-sm leading-relaxed mb-4">
            "The quality of the dairy products is unmatched. Best delivery service I've ever used! Highly recommended for fresh milk lovers."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg font-bold text-green-600">
              SJ
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Sarah Jenkins</p>
              <p className="text-white text-opacity-80 text-xs">Happy Customer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-500 text-sm">Please enter your details to sign in</p>
          </div>

          {/* Tab Buttons */}
          <div className="flex gap-4 mb-8 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition ${!isSignUp
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Log In
            </button>
            <Link
              to="/signUp"
              className="flex-1 py-2 px-4 rounded-md font-medium transition text-gray-600 hover:text-gray-800 text-center"
            >
              Sign Up
            </Link>
          </div>

          {error && (
            <ErrorMessage
              message={error}
              type="error"
              dismissible={true}
              onDismiss={() => setError('')}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email or Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">✉️</span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or phone"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
            >
              {loading && <InlineSpinner size="sm" color="white" />}
              {loading ? 'Signing in...' : 'Log In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Don't have an account?{' '}
            <Link to="/signUp" className="text-green-600 font-semibold hover:text-green-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
