import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Функция для загрузки буфера в Cloudinary
export async function uploadToCloudinary(buffer: Buffer, folder: string): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        // Явно указываем тип результата
        resolve({
          secure_url: result?.secure_url || '',
          public_id: result?.public_id || '',
        });
      }
    ).end(buffer);
  });
}

export default cloudinary;