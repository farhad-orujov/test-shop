export default function cloudinaryLoader({ src, width, quality }) {
  if (!src) return '';
  
  // For local images, return as-is
  if (!src.includes('cloudinary.com')) {
    return src;
  }

  try {
    // Handle both versioned and unversioned URLs
    let path = src;
    if (src.includes('/upload/')) {
      // Extract the path after /upload/
      path = src.split('/upload/')[1];
    }

    // Remove any existing transformations if present
    if (path.includes('/')) {
      path = path.split('/').pop();
    }

    // Build transformation string
    const params = ['f_auto', 'c_limit'];
    if (width) {
      params.push(`w_${width}`);
    }
    if (quality) {
      params.push(`q_${quality}`);
    }

    // Construct final URL
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${params.join(',')}/${path}`;
  } catch (error) {
    console.warn('Error in cloudinary-loader:', error);
    return src;
  }
}