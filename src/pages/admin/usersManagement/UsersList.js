import React from 'react';

const UsersList = ({ 
  filteredUsers, 
  handleRoleChange, 
  handleDisableAccount 
}) => {
  if (filteredUsers.length === 0) {
    return (
      <div className="bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">👥</span>
        </div>
        <p className="text-gray-600 text-lg font-medium mb-1">No users found</p>
        <p className="text-gray-400 text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  return (
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
                    {user.name || 'N/A'}
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
                  {user.name || 'N/A'}
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
  );
};

export default UsersList;
