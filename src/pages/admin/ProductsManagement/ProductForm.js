import React from 'react';

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
    <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {editingId ? 'Edit Product' : 'Add New Product'}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Fresh Whole Milk"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price ($) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
          />
        </div>

        {/* Nutritional Facts */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nutritional Facts (per 100g/ml)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <input
                type="text"
                name="nutritionalFacts.calories"
                value={formData.nutritionalFacts.calories}
                onChange={handleInputChange}
                placeholder="Calories (kcal)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              />
            </div>
            <div>
              <input
                type="text"
                name="nutritionalFacts.protein"
                value={formData.nutritionalFacts.protein}
                onChange={handleInputChange}
                placeholder="Protein (g)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              />
            </div>
            <div>
              <input
                type="text"
                name="nutritionalFacts.fat"
                value={formData.nutritionalFacts.fat}
                onChange={handleInputChange}
                placeholder="Fat (g)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              />
            </div>
            <div>
              <input
                type="text"
                name="nutritionalFacts.carbs"
                value={formData.nutritionalFacts.carbs}
                onChange={handleInputChange}
                placeholder="Carbs (g)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              />
            </div>
            <div>
              <input
                type="text"
                name="nutritionalFacts.calcium"
                value={formData.nutritionalFacts.calcium}
                onChange={handleInputChange}
                placeholder="Calcium (mg)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image (Max 1MB)
          </label>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              />
              <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF (max 1MB)</p>
            </div>
            {imagePreview && (
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-300 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain p-1"
                />
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="md:col-span-2 flex gap-4">
          <button
            type="submit"
            className="flex-1 px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 px-6 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
