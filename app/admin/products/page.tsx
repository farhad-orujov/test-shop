"use client";

import { useState } from "react";

export default function AdminProductsPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    image: "",
    rating: "5",
    tags: "",
    category: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Предзаполненные примеры для копирования
  const sampleData = [
    {
      name: "Dropset Control Training Shoes",
      description: "Premium training shoes with advanced cushioning and support for intense workouts",
      price: "300",
      originalPrice: "400",
      image: "/clothings/shoes/Dropset_Control_Training_Shoes_Black_JQ1767_HM1.jpg",
      rating: "4",
      tags: "new, sale, featured",
      category: "shoes"
    },
    {
      name: "Classic Cotton T-Shirt",
      description: "Comfortable 100% cotton t-shirt perfect for everyday wear",
      price: "45",
      originalPrice: "",
      image: "/clothings/tshirts/classic-cotton-tshirt-white.jpg",
      rating: "4",
      tags: "basic, comfortable",
      category: "clothing"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
          image: formData.image,
          rating: parseInt(formData.rating),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          category: formData.category
        }),
      });

      if (response.ok) {
        alert('Product created successfully!');
        setFormData({
          name: "",
          description: "",
          price: "",
          originalPrice: "",
          image: "",
          rating: "5",
          tags: "",
          category: ""
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create product'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fillSampleData = (sample: typeof sampleData[0]) => {
    setFormData({
      name: sample.name,
      description: sample.description,
      price: sample.price,
      originalPrice: sample.originalPrice,
      image: sample.image,
      rating: sample.rating,
      tags: sample.tags,
      category: sample.category
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Визуальная обратная связь
      const button = event?.target as HTMLButtonElement;
      const originalText = button.textContent;
      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = originalText;
      }, 1000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      
      {/* Блок с примерами для копирования */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium mb-3 text-gray-700">Quick Fill Examples:</h3>
        <div className="space-y-3">
          {sampleData.map((sample, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md border">
              <div className="flex-1">
                <div className="font-medium text-sm">{sample.name}</div>
                <div className="text-xs text-gray-500">{sample.category} • {sample.price} AZN</div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fillSampleData(sample)}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Fill Form
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(JSON.stringify(sample, null, 2))}
                  className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Copy JSON
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="Product name"
            />
            <button
              type="button"
              onClick={() => copyToClipboard(formData.name)}
              className="px-3 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              title="Copy to clipboard"
            >
              Copy
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <div className="flex gap-2">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="Product description"
            />
            <button
              type="button"
              onClick={() => copyToClipboard(formData.description)}
              className="px-3 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300 transition-colors self-start"
              title="Copy to clipboard"
            >
              Copy
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price (AZN)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Original Price (USD)</label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="400 (optional)"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="/path/to/image.jpg"
            />
            <button
              type="button"
              onClick={() => copyToClipboard(formData.image)}
              className="px-3 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              title="Copy to clipboard"
            >
              Copy
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="shoes, clothing, accessories"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="new, sale, featured"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              type="button"
              onClick={() => copyToClipboard(formData.tags)}
              className="px-3 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              title="Copy to clipboard"
            >
              Copy
            </button>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 disabled:bg-rose-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </button>
          
          <button
            type="button"
            onClick={() => {
              const allData = JSON.stringify(formData, null, 2);
              copyToClipboard(allData);
            }}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Copy All Data
          </button>
        </div>
      </form>
    </div>
  );
}