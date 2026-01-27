import React from 'react';
import { MdEdit, MdAdd, MdCheck } from 'react-icons/md';

const ProductForm = ({
  showForm,
  editingId,
  formData,
  imagePreview,
  CATEGORIES,
  handleInputChange,
  handleImageChange,
  handleSubmit,
  resetForm
}) => {
  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            {editingId ? (
              <MdEdit className="text-2xl text-teal-600" />
            ) : (
              <MdAdd className="text-2xl text-teal-600" />
            )}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
          </div>
          <button
            onClick={resetForm}
            className="text-gray-500 hover:text-gray-700 font-bold text-2xl ml-2"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Product Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Fresh Whole Milk"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200"
            required
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Product description..."
            rows="4"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200 resize-none"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200"
            required
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity in Stock
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            placeholder="e.g., Nestle, Olper's"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200"
          />
        </div>

        {/* Fat Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fat Content
          </label>
          <select
            name="fatContent"
            value={formData.fatContent}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200"
          >
            <option value="">Select Fat Content</option>
            <option value="Full Fat">Full Fat</option>
            <option value="Low Fat">Low Fat</option>
            <option value="Fat Free">Fat Free</option>
            <option value="Reduced Fat">Reduced Fat</option>
          </select>
        </div>

        {/* Shelf Life */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shelf Life
          </label>
          <input
            type="text"
            name="shelfLife"
            value={formData.shelfLife}
            onChange={handleInputChange}
            placeholder="e.g., 7 days, 3 months"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200"
          />
        </div>

        {/* Nutritional Facts */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nutritional Facts (per 100g/ml)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <input
                type="text"
                name="nutritionalFacts.calories"
                value={formData.nutritionalFacts.calories}
                onChange={handleInputChange}
                placeholder="Calories (kcal)"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200 text-sm"
              />
            </div>
            <div>
              <input
                type="text"
                name="nutritionalFacts.protein"
                value={formData.nutritionalFacts.protein}
                onChange={handleInputChange}
                placeholder="Protein (g)"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200 text-sm"
              />
            </div>
            <div>
              <input
                type="text"
                name="nutritionalFacts.fat"
                value={formData.nutritionalFacts.fat}
                onChange={handleInputChange}
                placeholder="Fat (g)"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200 text-sm"
              />
            </div>
            <div>
              <input
                type="text"
                name="nutritionalFacts.carbs"
                value={formData.nutritionalFacts.carbs}
                onChange={handleInputChange}
                placeholder="Carbs (g)"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200 text-sm"
              />
            </div>
            <div>
              <input
                type="text"
                name="nutritionalFacts.calcium"
                value={formData.nutritionalFacts.calcium}
                onChange={handleInputChange}
                placeholder="Calcium (mg)"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image (Max 1MB)
          </label>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
              <p className="text-xs text-gray-400 mt-2">Supported formats: JPG, PNG, GIF (max 1MB)</p>
            </div>
            {imagePreview && (
              <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center shadow-sm">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="md:col-span-2 flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            {editingId ? (
              <>
                <MdCheck className="text-lg" />
                Update Product
              </>
            ) : (
              <>
                <MdAdd className="text-lg" />
                Add Product
              </>
            )}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
