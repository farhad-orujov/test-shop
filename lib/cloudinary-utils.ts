import cloudinary from './cloudinary';

interface UploadResult {
  secure_url: string;
  public_id: string;
}

export const uploadToCloudinary = async (
  file: Buffer | string,
  folder: string = 'products'
): Promise<UploadResult> => {
  try {
    const result = await new Promise<UploadResult>((resolve, reject) => {
      const uploadOptions = {
        folder,
        upload_preset: 'shoes_preset' // Используем ваш пресет
      };
      if (typeof file === 'string') {
        // If it's a base64 string or remote URL
        cloudinary.uploader.upload(file, uploadOptions, (error, res) => {
          if (error) return reject(error as Error);
          return resolve((res as unknown) as UploadResult);
        });
      } else {
        // If it's a Buffer
        cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, res) => {
            if (error) return reject(error as Error);
            return resolve((res as unknown) as UploadResult);
          }
        ).end(file);
      }
    });

    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

export const getCloudinaryUrl = (publicId: string, options: Record<string, unknown> = {}): string => {
  return cloudinary.url(publicId, {
    secure: true,
    ...options
  });
};