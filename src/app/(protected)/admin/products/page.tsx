'use client';

import { useState, useEffect } from 'react';

export default function CreateCategoryAndProduct() {
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState({
    product_category_name: '',
    product_category_description: '',
  });
  const [productData, setProductData] = useState({
    product_name: '',
    product_price: '',
    product_image_url: '',
    product_category_id: '',
  });
  const [categoryMessage, setCategoryMessage] = useState('');
  const [productMessage, setProductMessage] = useState('');

  // Fetch existing categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/product/category');
      const data = await response.json();
      if (response.ok) {
        setCategories(data.data);
      } else {
        console.error(data.message || 'Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Handle category form change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryData({
      ...categoryData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle category submission
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryMessage('');

    try {
      const response = await fetch('/api/product/category/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();

      if (response.ok) {
        setCategoryMessage('Category created successfully!');
        setCategoryData({ product_category_name: '', product_category_description: '' });
        fetchCategories(); // Refresh categories
      } else {
        setCategoryMessage(data.message || 'Failed to create category.');
      }
    } catch (err) {
      setCategoryMessage('Error occurred while creating category.');
    }
  };

  // Handle product form change
  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle product submission
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductMessage('');

    try {
      const response = await fetch('/api/product/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: productData.product_name,
          product_price: parseFloat(productData.product_price),
          product_image_url: productData.product_image_url || null,
          product_category_id: parseInt(productData.product_category_id),
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setProductMessage('Product created successfully!');
        setProductData({
          product_name: '',
          product_price: '',
          product_image_url: '',
          product_category_id: '',
        });
      } else {
        setProductMessage(data.message || 'Failed to create product.');
      }
    } catch (err) {
      setProductMessage('Error occurred while creating product.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Category and Product Management</h1>

      {/* Category Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Create New Category</h2>
        {categoryMessage && (
          <div className={`p-2 rounded mb-4 ${categoryMessage.includes('successfully') ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
            {categoryMessage}
          </div>
        )}
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <div>
            <label htmlFor="product_category_name" className="block text-sm font-medium">
              Category Name
            </label>
            <input
              type="text"
              name="product_category_name"
              id="product_category_name"
              value={categoryData.product_category_name}
              onChange={handleCategoryChange}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="product_category_description" className="block text-sm font-medium">
              Category Description
            </label>
            <input
              type="text"
              name="product_category_description"
              id="product_category_description"
              value={categoryData.product_category_description}
              onChange={handleCategoryChange}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Create Category
          </button>
        </form>
      </div>

      {/* Product Form */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Create New Product</h2>
        {productMessage && (
          <div className={`p-2 rounded mb-4 ${productMessage.includes('successfully') ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
            {productMessage}
          </div>
        )}
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div>
            <label htmlFor="product_name" className="block text-sm font-medium">
              Product Name
            </label>
            <input
              type="text"
              name="product_name"
              id="product_name"
              value={productData.product_name}
              onChange={handleProductChange}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="product_price" className="block text-sm font-medium">
              Product Price
            </label>
            <input
              type="number"
              name="product_price"
              id="product_price"
              step="0.01"
              value={productData.product_price}
              onChange={handleProductChange}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="product_image_url" className="block text-sm font-medium">
              Product Image URL
            </label>
            <input
              type="url"
              name="product_image_url"
              id="product_image_url"
              value={productData.product_image_url}
              onChange={handleProductChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="product_category_id" className="block text-sm font-medium">
              Product Category
            </label>
            <select
              name="product_category_id"
              id="product_category_id"
              value={productData.product_category_id}
              onChange={handleProductChange}
              required
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="">Select a category</option>
              {categories.map((category: any) => (
                <option key={category.product_category_id} value={category.product_category_id}>
                  {category.product_category_name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
}
