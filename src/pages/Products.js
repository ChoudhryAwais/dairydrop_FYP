import React from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
  // Sample products - will be replaced with Firebase data
  const sampleProducts = [
    { id: 1, name: 'Fresh Milk', price: 4.99, category: 'Milk' },
    { id: 2, name: 'Cheddar Cheese', price: 8.99, category: 'Cheese' },
    { id: 3, name: 'Greek Yogurt', price: 5.49, category: 'Yogurt' },
    { id: 4, name: 'Organic Butter', price: 6.99, category: 'Butter' },
    { id: 5, name: 'Whole Milk', price: 4.49, category: 'Milk' },
    { id: 6, name: 'Mozzarella Cheese', price: 7.99, category: 'Cheese' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Dairy Products</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Explore our fresh selection of dairy products sourced from local farms.
        </p>
      </div>

      {/* Filter/Category Section */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
          All Products
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
          Milk
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
          Cheese
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
          Yogurt
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
          Butter
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
            <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
              <div className="text-6xl">🥛</div>
            </div>
            <div className="p-5">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-2">
                {product.category}
              </span>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-green-600">${product.price}</span>
                <span className="text-sm text-gray-500">per unit</span>
              </div>
              <div className="flex gap-2">
                <Link 
                  to={`/products/${product.id}`}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-center py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  View Details
                </Link>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors duration-200">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (shown when Firebase returns no products) */}
      {sampleProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No products available</h3>
          <p className="text-gray-600">Check back soon for new dairy products!</p>
        </div>
      )}
    </div>
  );
};

export default Products;