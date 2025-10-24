"use client";

import { useState, useRef } from "react";
import { useRouter } from 'next/navigation';

interface ColorVariant {
  color: string;
  colorCode: string;
  image: string;
  imageFile?: File;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    rating: "5",
    tags: "",
    category: "",
    brand: "",
  });

  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
  const [newVariant, setNewVariant] = useState({
    color: "",
    colorCode: "#000000",
    image: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [variantImageFile, setVariantImageFile] = useState<File | null>(null);
  const [variantPreviewUrl, setVariantPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const variantFileInputRef = useRef<HTMLInputElement>(null);

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
      category: "shoes",
      brand: "Adidas"
    },
    {
      name: "Classic Cotton T-Shirt",
      description: "Comfortable 100% cotton t-shirt perfect for everyday wear",
      price: "45",
      originalPrice: "",
      image: "/clothings/tshirts/classic-cotton-tshirt-white.jpg",
      rating: "4",
      tags: "basic, comfortable",
      category: "clothing",
      brand: "Nike"
    }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      
      // Создаем preview локально
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVariantFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVariantImageFile(file);
      
      // Создаем preview локально
      const reader = new FileReader();
      reader.onloadend = () => {
        setVariantPreviewUrl(reader.result as string);
        setNewVariant(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Функция для генерации slug из названия
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mainImageFile) {
      alert('Please select a main product image');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Генерируем slug из названия
      const productId = generateSlug(formData.name);
      
      // Создаем FormData для отправки на сервер
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('originalPrice', formData.originalPrice || '');
      data.append('category', formData.category);
      data.append('brand', formData.brand);
      data.append('rating', formData.rating);
      data.append('tags', JSON.stringify(formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)));
      data.append('image', mainImageFile);

      // Добавляем изображения для вариантов цвета
      colorVariants.forEach((variant, index) => {
        if (variant.imageFile) {
          data.append(`colorImage${index}`, variant.imageFile);
        }
      });

      // Добавляем данные о вариантах цвета
      const colorVariantsData = colorVariants.map((variant, index) => ({
        color: variant.color,
        colorCode: variant.colorCode,
        image: variant.image || '',
        imageFile: variant.imageFile ? `colorImage${index}` : undefined
      }));
      data.append('colorVariants', JSON.stringify(colorVariantsData));

      console.log('Отправка данных на /api/products...');
      
      // Отправляем данные на наш API endpoint
      const response = await fetch('/api/products', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('Товар успешно создан:', result);
        alert('Product created successfully!');
        router.push('/admin/products');
      } else {
        console.error('Ошибка при создании товара:', result);
        alert('Ошибка при создании товара: ' + (result.error || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Ошибка при создании товара:', error);
      alert('Ошибка при создании товара: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addColorVariant = () => {
    if (!newVariant.color || !newVariant.colorCode) {
      alert('Please enter color name and code');
      return;
    }

    const variant: ColorVariant = {
      color: newVariant.color,
      colorCode: newVariant.colorCode,
      image: newVariant.image || "/placeholder-color.jpg",
      imageFile: variantImageFile || undefined
    };

    setColorVariants([...colorVariants, variant]);
    
    // Сбрасываем новый вариант
    setNewVariant({
      color: "",
      colorCode: "#000000",
      image: ""
    });
    setVariantImageFile(null);
    setVariantPreviewUrl("");
    if (variantFileInputRef.current) {
      variantFileInputRef.current.value = "";
    }
  };

  const removeColorVariant = (index: number) => {
    setColorVariants(colorVariants.filter((_, i) => i !== index));
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
      rating: sample.rating,
      tags: sample.tags,
      category: sample.category,
      brand: sample.brand,
    });
    setMainImageFile(null);
    setPreviewUrl("");
    setColorVariants([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
                <div className="text-xs text-gray-500">{sample.category} • {sample.price} AZN • {sample.brand}</div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fillSampleData(sample)}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Fill Form
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="Product name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="Product description"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price (AZN) *</label>
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

        {/* Brand Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">Select a brand (optional)</option>
            <option value="Reebok">Reebok</option>
            <option value="Adidas">Adidas</option>
            <option value="Nike">Nike</option>
            <option value="Puma">Puma</option>
            <option value="Under Armour">Under Armour</option>
          </select>
        </div>

        {/* Category Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">Select a category</option>
            <option value="shoes">Shoes</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="electronics">Electronics</option>
            <option value="sports">Sports</option>
          </select>
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium mb-1">Product Image *</label>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {/* Choose File button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Choose Image File
          </button>

          {/* Preview section */}
          {previewUrl && (
            <div className="border rounded-lg p-3 bg-gray-50 mt-3">
              <div className="mb-3 text-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-32 mx-auto rounded-md"
                />
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setMainImageFile(null);
                    setPreviewUrl("");
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="1">1 ⭐</option>
            <option value="2">2 ⭐</option>
            <option value="3">3 ⭐</option>
            <option value="4">4 ⭐</option>
            <option value="5">5 ⭐</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="new, sale, featured (comma separated)"
          />
        </div>

        {/* Color Variants Section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-3">Color Variants</h3>
          
          {/* Add new variant form */}
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg mb-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Color Name</label>
                <input
                  type="text"
                  value={newVariant.color}
                  onChange={(e) => setNewVariant({...newVariant, color: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color Code</label>
                <input
                  type="color"
                  value={newVariant.colorCode}
                  onChange={(e) => setNewVariant({...newVariant, colorCode: e.target.value})}
                  className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
            
            {/* Variant image upload */}
            <div>
              <label className="block text-sm font-medium mb-1">Variant Image (optional)</label>
              <input
                ref={variantFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleVariantFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => variantFileInputRef.current?.click()}
                className="px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Choose Variant Image
              </button>
              
              {variantPreviewUrl && (
                <div className="mt-2">
                  <img src={variantPreviewUrl} alt="Variant preview" className="max-h-20 rounded-md" />
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={addColorVariant}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Add Color Variant
            </button>
          </div>
          
          {/* Display existing variants */}
          {colorVariants.length > 0 && (
            <div className="space-y-2">
              {colorVariants.map((variant, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-md">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: variant.colorCode }}
                    ></div>
                    <span className="font-medium">{variant.color}</span>
                    {variant.image && variant.image !== "/placeholder-color.jpg" && (
                      <img src={variant.image} alt={variant.color} className="w-8 h-8 rounded-md object-cover" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeColorVariant(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-rose-500 text-white rounded-md hover:bg-rose-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? 'Creating Product...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}