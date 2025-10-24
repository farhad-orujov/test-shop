/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com', // Cloudinary
      'images.unsplash.com', // Для примера, если нужны другие источники
    ],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig