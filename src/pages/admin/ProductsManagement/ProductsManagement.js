'use client';

import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../../services/products/productService';
import ErrorMessage from '../../../components/ErrorMessage';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ProductForm from './ProductForm';
import ProductsList from './ProductsList';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Calculate filtered products
  const filteredProducts = filterCategory === 'All'
    ? products
    : products.filter(product => product.category === filterCategory);

  // Calculate paginated products
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

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
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1">Product Management</h1>
          <p className="text-sm sm:text-base text-gray-500">Add, edit, and manage your dairy products</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <ErrorMessage
              message={error}
              type="error"
              dismissible={true}
              onDismiss={() => setError(null)}
            />
          </div>
        )}

        <ProductsList
          products={products}
          filteredProducts={paginatedProducts}
          filterCategory={filterCategory}
          setFilterCategory={(category) => {
            setFilterCategory(category);
            setCurrentPage(1); // Reset to first page when filtering
          }}
          showForm={showForm}
          setShowForm={setShowForm}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          CATEGORIES={CATEGORIES}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalFilteredProducts={filteredProducts.length}
          itemsPerPage={itemsPerPage}
        />

        <ProductForm
          showForm={showForm}
          editingId={editingId}
          formData={formData}
          imagePreview={imagePreview}
          CATEGORIES={CATEGORIES}
          handleInputChange={handleInputChange}
          handleImageChange={handleImageChange}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
        />
      </div>
    </div>
  );
};

export default ProductsManagement;
