import React from 'react';
import ProductCard from '../../../components/ProductCard';
import { MdInventory, MdCheckCircle, MdWarning, MdCancel, MdClose, MdAdd } from 'react-icons/md';

const ProductsList = ({
  products,
  filteredProducts,
  filterCategory,
  setFilterCategory,
  showForm,
  setShowForm,
  handleEdit,
  handleDelete,
  CATEGORIES,
  currentPage,
  setCurrentPage,
  totalPages,
  totalFilteredProducts,
  itemsPerPage
}) => {
  // Calculate statistics
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.quantity > 0).length;
  const outOfStockProducts = products.filter(p => !p.quantity || p.quantity === 0).length;
  const lowStockProducts = products.filter(p => p.quantity > 0 && p.quantity < 10).length;

  return (
    <>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-600 font-medium text-sm">Total Products</h3>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <MdInventory className="text-xl text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{totalProducts}</p>
          <p className="text-gray-400 text-xs mt-1">all categories</p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-600 font-medium text-sm">In Stock</h3>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <MdCheckCircle className="text-xl text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{inStockProducts}</p>
          <p className="text-gray-400 text-xs mt-1">available</p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-600 font-medium text-sm">Low Stock</h3>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <MdWarning className="text-xl text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{lowStockProducts}</p>
          <p className="text-gray-400 text-xs mt-1">&lt;10 units</p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-600 font-medium text-sm">Out of Stock</h3>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <MdCancel className="text-xl text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{outOfStockProducts}</p>
          <p className="text-gray-400 text-xs mt-1">need restock</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex gap-3 flex-wrap items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-5 py-2.5 font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
            showForm 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'
          }`}
        >
          {showForm ? (
            <>
              <MdClose className="text-lg" />
              Cancel
            </>
          ) : (
            <>
              <MdAdd className="text-lg" />
              Add Product
            </>
          )}
        </button>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-white text-gray-700 text-sm transition-all duration-200"
        >
          <option>All</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <div className="ml-auto text-gray-500 text-sm font-medium">
          {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdInventory className="text-3xl text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg font-medium mb-1">No products found</p>
          <p className="text-gray-400 text-sm">Add your first product to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

      {/* Pagination */}
      {totalFilteredProducts > itemsPerPage && (
        <div className="mt-8 md:mt-10 flex items-center justify-center gap-1.5 md:gap-2">
          <button 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-gray-600 hover:text-teal-600 hover:bg-teal-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`min-w-[32px] h-8 md:min-w-[40px] md:h-10 px-2 md:px-3 rounded-lg font-semibold text-xs md:text-sm transition-all ${
                currentPage === page
                  ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg scale-110'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-teal-500 hover:text-teal-600'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-gray-600 hover:text-teal-600 hover:bg-teal-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default ProductsList;
