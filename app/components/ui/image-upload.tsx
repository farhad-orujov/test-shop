"use client";

import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (url: string, publicId: string) => void;
  currentImage?: string;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  currentImage,
  label = "Upload Image"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset'); // You'll need to create this in Cloudinary

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      onImageUpload(data.secure_url, data.public_id);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUpload('', '');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div className="relative">
        {preview ? (
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors">
            <ImageIcon size={32} className="text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click to upload image</p>
          </div>
        )}
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
      </div>

      {isUploading && (
        <div className="flex items-center text-sm text-blue-600">
          <Upload size={16} className="mr-2 animate-spin" />
          Uploading...
        </div>
      )}
    </div>
  );
};