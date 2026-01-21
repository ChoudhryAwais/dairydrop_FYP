'use client';

import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../services/products/productService';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProductCard from '../../components/ProductCard';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Milk',
    quantity: '',
    imageUrl: '',
    brand: '',
    fatContent: '',
    shelfLife: '',
    nutritionalFacts: {
      calories: '',
      protein: '',
      fat: '',
      carbs: '',
      calcium: ''
    }
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');

  const CATEGORIES = ['Milk', 'Yogurt', 'Cheese', 'Butter', 'Cream', 'Ghee', 'Ice Cream', 'Other'];

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await getProducts();
      if (result.success) {
        setProducts(result.products || []);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Check file size (limit to 1MB for Base64 storage)
      if (file.size > 1024 * 1024) {
        setError('Image size should be less than 1MB');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        // Store Base64 in formData
        setFormData(prev => ({
          ...prev,
          imageUrl: base64String
        }));
      };
      reader.onerror = () => {
        setError('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('nutritionalFacts.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        nutritionalFacts: {
          ...prev.nutritionalFacts,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Milk',
      quantity: '',
      imageUrl: '',
      brand: '',
      fatContent: '',
      shelfLife: '',
      nutritionalFacts: {
        calories: '',
        protein: '',
        fat: '',
        carbs: '',
        calcium: ''
      }
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const productPayload = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity) || 0
      };

      if (editingId) {
        // Update existing product
        // Only pass imageFile if a new image was selected
        const result = await updateProduct(editingId, productPayload, imageFile);
        if (result.success) {
          setError(null);
          fetchProducts();
          resetForm();
        } else {
          setError(result.error || 'Failed to update product');
        }
      } else {
        // Add new product
        const result = await addProduct(productPayload, imageFile);
        if (result.success) {
          setError(null);
          fetchProducts();
          resetForm();
        } else {
          setError(result.error || 'Failed to add product');
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      quantity: product.quantity,
      imageUrl: product.imageUrl,
      brand: product.brand || '',
      fatContent: product.fatContent || '',
      shelfLife: product.shelfLife || '',
      nutritionalFacts: product.nutritionalFacts || {
        calories: '',
        protein: '',
        fat: '',
        carbs: '',
        calcium: ''
      }
    });
    setImagePreview(product.imageUrl);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id, imageUrl) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const result = await deleteProduct(id, imageUrl);
        if (result.success) {
          setError(null);
          fetchProducts();
        } else {
          setError(result.error || 'Failed to delete product');
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const filteredProducts = filterCategory === 'All'
    ? products
    : products.filter(p => p.category === filterCategory);

  // Calculate statistics
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.quantity > 0).length;
  const outOfStockProducts = products.filter(p => !p.quantity || p.quantity === 0).length;
  const lowStockProducts = products.filter(p => p.quantity > 0 && p.quantity < 10).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * (p.quantity || 0)), 0);
  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = products.filter(p => p.category === cat).length;
    return acc;
  }, {});

  if (loading) {
    return (
      <>
        <div className="flex-1 p-8 flex items-center justify-center">
          <LoadingSpinner size="lg" message="Loading products..." />
        </div>
      </>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Product Management</h1>
          <p className="text-gray-600">Add, edit, and manage your dairy products</p>
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

        {/* Add/Edit Form */}
        {showForm && (
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
        )}

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
      </div>
    </div>
  );
};

export default ProductsManagement;
