'use client';

import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, disableUserAccount } from '../../services/users/userService';
import Sidebar from '../../components/Sidebar';

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
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Users Management</h1>
            <p className="text-gray-600">Manage user roles and account status</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <p className="text-gray-600 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <p className="text-gray-600 text-sm font-medium">Admin</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.adminUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <p className="text-gray-600 text-sm font-medium">Customers</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.customerUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <p className="text-gray-600 text-sm font-medium">Active</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.activeUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <p className="text-gray-600 text-sm font-medium">Disabled</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.disabledUsers}</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="createdAt">Join Date</option>
                  <option value="email">Email</option>
                  <option value="name">Name</option>
                  <option value="role">Role</option>
                </select>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>

          {/* Users Table */}
          {filteredUsers.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-md border border-gray-200 text-center">
              <p className="text-gray-500 text-lg">No users found</p>
              <p className="text-gray-400 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Join Date</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : user.firstName || user.lastName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <select
                            value={user.role || 'customer'}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className={`px-3 py-1 rounded text-sm font-medium border ${
                              user.role === 'admin'
                                ? 'bg-blue-100 text-blue-700 border-blue-300'
                                : 'bg-green-100 text-green-700 border-green-300'
                            } cursor-pointer hover:opacity-80`}
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              user.disabled
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {user.disabled ? 'Disabled' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                          <button
                            onClick={() => 
                              handleDisableAccount(user.id, !user.disabled)
                            }
                            className={`px-4 py-1 rounded text-sm font-medium transition-colors ${
                              user.disabled
                                ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-300'
                                : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-300'
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
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {confirmAction?.type === 'role' ? 'Change User Role?' : 'Change Account Status?'}
            </h3>
            <p className="text-gray-600 mb-6">
              {confirmAction?.type === 'role'
                ? `Are you sure you want to change this user's role to ${confirmAction?.value}?`
                : `Are you sure you want to ${confirmAction?.value ? 'disable' : 'enable'} this account?`}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmAction(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmActionHandler}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
