'use client';

import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, disableUserAccount } from '../../services/users/userService';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [editingUserId, setEditingUserId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await getAllUsers();
      if (result.success) {
        setUsers(result.users || []);
        setError(null);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setConfirmAction({ type: 'role', userId, value: newRole });
    setShowConfirmModal(true);
  };

  const handleDisableAccount = async (userId, shouldDisable) => {
    setConfirmAction({ type: 'disable', userId, value: shouldDisable });
    setShowConfirmModal(true);
  };

  const confirmActionHandler = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.type === 'role') {
        const result = await updateUserRole(confirmAction.userId, confirmAction.value);
        if (result.success) {
          fetchUsers();
          setError(null);
        } else {
          setError(result.error || 'Failed to update user role');
        }
      } else if (confirmAction.type === 'disable') {
        const result = await disableUserAccount(confirmAction.userId, confirmAction.value);
        if (result.success) {
          fetchUsers();
          setError(null);
        } else {
          setError(result.error || 'Failed to update account status');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = 
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.lastName || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = filterRole === 'All' || user.role === filterRole;
      
      const matchesStatus = filterStatus === 'All' || 
        (filterStatus === 'Active' && !user.disabled) ||
        (filterStatus === 'Disabled' && user.disabled);
      
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'email') {
        return (a.email || '').localeCompare(b.email || '');
      } else if (sortBy === 'name') {
        const nameA = `${a.firstName || ''} ${a.lastName || ''}`;
        const nameB = `${b.firstName || ''} ${b.lastName || ''}`;
        return nameA.localeCompare(nameB);
      } else if (sortBy === 'role') {
        return (a.role || '').localeCompare(b.role || '');
      }
      return 0;
    });

  // Statistics
  const stats = {
    totalUsers: users.length,
    adminUsers: users.filter(u => u.role === 'admin').length,
    customerUsers: users.filter(u => u.role === 'customer').length,
    activeUsers: users.filter(u => !u.disabled).length,
    disabledUsers: users.filter(u => u.disabled).length
  };

  if (loading) {
    return (
      <>
        <div className="flex-1 p-4 sm:p-6 md:p-8 flex items-center justify-center">
          <LoadingSpinner size="lg" message="Loading users..." />
        </div>
      </>
    );
  }

  return (
    <>

      <div className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1">Users Management</h1>
            <p className="text-sm sm:text-base text-gray-500">Manage user roles and account status</p>
          </div>

          {/* Error Alert */}
          {error && (
            <ErrorMessage 
              message={error} 
              type="error" 
              dismissible={true}
              onDismiss={() => setError(null)}
            />
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 font-medium text-sm">Total Users</h3>
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <span className="text-xl">👥</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 font-medium text-sm">Admin</h3>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🛡️</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.adminUsers}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 font-medium text-sm">Customers</h3>
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🛒</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.customerUsers}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 font-medium text-sm">Active</h3>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <span className="text-xl">✅</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.activeUsers}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 font-medium text-sm">Disabled</h3>
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🚫</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.disabledUsers}</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Email or Name
                </label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200"
                />
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Role
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200"
                >
                  <option>All</option>
                  <option>admin</option>
                  <option>customer</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200"
                >
                  <option>All</option>
                  <option>Active</option>
                  <option>Disabled</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200"
                >
                  <option value="createdAt">Join Date</option>
                  <option value="email">Email</option>
                  <option value="name">Name</option>
                  <option value="role">Role</option>
                </select>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500 font-medium">
              {filteredUsers.length} of {users.length} users
            </div>
          </div>

          {/* Users Table / Mobile Cards */}
          {filteredUsers.length === 0 ? (
            <div className="bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👥</span>
              </div>
              <p className="text-gray-600 text-lg font-medium mb-1">No users found</p>
              <p className="text-gray-400 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Role</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Join Date</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-800">
                            {user.email}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-800">
                            {user.firstName && user.lastName 
                              ? `${user.firstName} ${user.lastName}` 
                              : user.firstName || user.lastName || 'N/A'}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                            <select
                              value={user.role || 'customer'}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              className={`w-full px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium border ${
                                user.role === 'admin'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-teal-50 text-teal-700 border-teal-200'
                              } cursor-pointer hover:opacity-80 transition-opacity duration-200`}
                            >
                              <option value="customer">Customer</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                            <span
                              className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                                user.disabled
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {user.disabled ? 'Disabled' : 'Active'}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : 'N/A'}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-center">
                            <button
                              onClick={() => 
                                handleDisableAccount(user.id, !user.disabled)
                              }
                              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                                user.disabled
                                  ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 hover:shadow-sm'
                                  : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 hover:shadow-sm'
                              }`}
                            >
                              {user.disabled ? 'Enable' : 'Disable'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <div className="space-y-3">
                      {/* Email */}
                      <div>
                        <p className="text-xs font-medium text-gray-600">Email</p>
                        <p className="text-sm text-gray-800 break-all">{user.email}</p>
                      </div>

                      {/* Name */}
                      <div>
                        <p className="text-xs font-medium text-gray-600">Name</p>
                        <p className="text-sm text-gray-800">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : user.firstName || user.lastName || 'N/A'}
                        </p>
                      </div>

                      {/* Role and Status Row */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Role */}
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-2">Role</p>
                          <select
                            value={user.role || 'customer'}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className={`w-full px-2 py-1.5 rounded-lg text-xs font-medium border ${
                              user.role === 'admin'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-teal-50 text-teal-700 border-teal-200'
                            } cursor-pointer hover:opacity-80 transition-opacity duration-200`}
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>

                        {/* Status */}
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-2">Status</p>
                          <span
                            className={`block px-2 py-1 rounded-full text-xs font-medium text-center ${
                              user.disabled
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {user.disabled ? 'Disabled' : 'Active'}
                          </span>
                        </div>
                      </div>

                      {/* Join Date */}
                      <div>
                        <p className="text-xs font-medium text-gray-600">Join Date</p>
                        <p className="text-sm text-gray-600">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => 
                          handleDisableAccount(user.id, !user.disabled)
                        }
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          user.disabled
                            ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 hover:shadow-sm'
                            : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 hover:shadow-sm'
                        }`}
                      >
                        {user.disabled ? 'Enable Account' : 'Disable Account'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {confirmAction?.type === 'role' ? 'Change User Role?' : 'Change Account Status?'}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {confirmAction?.type === 'role'
                ? `Are you sure you want to change this user's role to ${confirmAction?.value}?`
                : `Are you sure you want to ${confirmAction?.value ? 'disable' : 'enable'} this account?`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmAction(null);
                }}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmActionHandler}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersManagement;
