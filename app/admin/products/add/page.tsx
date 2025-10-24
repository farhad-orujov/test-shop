"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface ColorVariant {
  color: string;
  colorCode: string;
  image: string;
  imageFile?: File | undefined;
}

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    rating: '5',
    tags: '',
    mainImage: null as File | null,
    colorVariants: [] as ColorVariant[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for server submission
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('originalPrice', formData.originalPrice || '');
      data.append('category', formData.category);
      data.append('brand', formData.brand);
      data.append('rating', formData.rating);
      data.append('tags', JSON.stringify(formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)));
      
      // Add main image
      if (formData.mainImage) {
        data.append('image', formData.mainImage);
      }

      // Add color variant images
      formData.colorVariants.forEach((variant, index) => {
        if (variant.imageFile) {
          data.append(`colorImage${index}`, variant.imageFile);
        }
      });

      // Add color variant data
      const colorVariantsData = formData.colorVariants.map((variant, index) => ({
        color: variant.color,
        colorCode: variant.colorCode,
        image: variant.image || '',
        imageFile: variant.imageFile ? `colorImage${index}` : undefined
      }));
      data.append('colorVariants', JSON.stringify(colorVariantsData));

      // Submit data to API endpoint
      const response = await fetch('/api/products', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      
      if (response.ok) {
        router.push('/catalog');
      } else {
        alert('Error creating product: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, mainImage: file }));
    }
  };

  const addColorVariant = () => {
    setFormData(prev => ({
      ...prev,
      colorVariants: [...prev.colorVariants, { color: '', colorCode: '', image: '' }]
    }));
  };

  const updateColorVariant = (index: number, field: keyof ColorVariant, value: string | File | undefined) => {
    setFormData(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const handleColorImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateColorVariant(index, 'imageFile', file);
    }
  };

  const removeColorVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      
      <form ref={formRef} onSubmit={handleSubmit} className="max-w-2xl space-y-6" autoComplete="off" encType="multipart/form-data">
        <div>
          <label className="block text-sm font-medium mb-2">Product Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description *</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Price (AZN) *</label>
            <input
              type="number"
              required
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Original Price (USD)</label>
            <input
              type="number"
              step="0.01"
              value={formData.originalPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            <option value="Running">Running</option>
            <option value="Football">Football</option>
            <option value="Basketball">Basketball</option>
            <option value="Walking">Walking</option>
            <option value="Golf">Golf</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Brand *</label>
          <input
            type="text"
            required
            value={formData.brand}
            onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Main Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {formData.mainImage && (
            <p className="text-sm text-green-600 mt-1">✓ Image selected: {formData.mainImage.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g.: new, hit, sale"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Rating</label>
          <select
            value={formData.rating}
            onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">1 ⭐</option>
            <option value="2">2 ⭐</option>
            <option value="3">3 ⭐</option>
            <option value="4">4 ⭐</option>
            <option value="5">5 ⭐</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium">Color Variants</label>
            <button
              type="button"
              onClick={addColorVariant}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
            >
              + Add Color
            </button>
          </div>

          {formData.colorVariants.map((variant, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <input
                    type="text"
                    value={variant.color}
                    onChange={(e) => updateColorVariant(index, 'color', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Color name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Color Code</label>
                  <input
                    type="color"
                    value={variant.colorCode}
                    onChange={(e) => updateColorVariant(index, 'colorCode', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Variant Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleColorImageChange(index, e)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={() => removeColorVariant(index)}
                className="text-red-600 text-sm hover:text-red-800"
              >
                Delete Variant
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {loading ? 'Creating Product...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}