'use client';

import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, disableUserAccount } from '../../../services/users/userService';
import ErrorMessage from '../../../components/ErrorMessage';
import LoadingSpinner from '../../../components/LoadingSpinner';
import UsersStats from './UsersStats';
import UsersList from './UsersList';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
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
          <UsersStats stats={stats} />

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
          <UsersList
            filteredUsers={filteredUsers}
            handleRoleChange={handleRoleChange}
            handleDisableAccount={handleDisableAccount}
          />
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
