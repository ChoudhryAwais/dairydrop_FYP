import React from 'react';
import ProductCard from '../../../components/ProductCard';

const ProductsList = ({
  products,
  filteredProducts,
  filterCategory,
  setFilterCategory,
  showForm,
  setShowForm,
  handleEdit,
  handleDelete,
  CATEGORIES
}) => {
  // Calculate statistics
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.quantity > 0).length;
  const outOfStockProducts = products.filter(p => !p.quantity || p.quantity === 0).length;
  const lowStockProducts = products.filter(p => p.quantity > 0 && p.quantity < 10).length;

  return (
    <>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-blue-50 p-4 sm:p-6 rounded-xl shadow-md border border-blue-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-gray-600 font-medium text-xs sm:text-sm">Total Products</h3>
            <span className="text-2xl sm:text-3xl">📦</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800">{totalProducts}</p>
          <p className="text-gray-500 text-xs mt-1 sm:mt-2">all categories</p>
        </div>

        <div className="bg-green-50 p-4 sm:p-6 rounded-xl shadow-md border border-green-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-gray-600 font-medium text-xs sm:text-sm">In Stock</h3>
            <span className="text-2xl sm:text-3xl">✅</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800">{inStockProducts}</p>
          <p className="text-gray-500 text-xs mt-1 sm:mt-2">available</p>
        </div>

        <div className="bg-yellow-50 p-4 sm:p-6 rounded-xl shadow-md border border-yellow-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-gray-600 font-medium text-xs sm:text-sm">Low Stock</h3>
            <span className="text-2xl sm:text-3xl">⚠️</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800">{lowStockProducts}</p>
          <p className="text-gray-500 text-xs mt-1 sm:mt-2">&lt;10 units</p>
        </div>

        <div className="bg-red-50 p-4 sm:p-6 rounded-xl shadow-md border border-red-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-gray-600 font-medium text-xs sm:text-sm">Out of Stock</h3>
            <span className="text-2xl sm:text-3xl">❌</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800">{outOfStockProducts}</p>
          <p className="text-gray-500 text-xs mt-1 sm:mt-2">need restock</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex gap-4 flex-wrap items-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
        >
          <option>All</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <div className="ml-auto text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-md border border-gray-200 text-center">
          <p className="text-gray-500 text-lg">No products found</p>
          <p className="text-gray-400 mt-2">Add your first product to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              showAddToCart={false}
              showViewDetails={false}
              isAdmin={true}
              onEdit={() => handleEdit(product)}
              onDelete={() => handleDelete(product.id, product.imageUrl)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ProductsList;
