import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Get all products with filtering
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.getAll('category');
    const search = searchParams.get('search');
  const brand = searchParams.getAll('brand');
  const tag = searchParams.getAll('tag');
    
  const query: Record<string, unknown> = {};
    
    if (category.length > 0) {
      query.category = { $in: category };
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (brand.length > 0) {
      // Match brands case-insensitively
      query.brand = { $in: brand.map(b => new RegExp(`^${b}$`, 'i')) };
    }

    if (tag.length > 0) {
      // Match tags case-insensitively
      query.tags = { $in: tag.map(t => new RegExp(`^${t}$`, 'i')) };
    }

    // Price filtering (minPrice / maxPrice) - parse as numbers and add $gte/$lte
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    if (minPriceParam || maxPriceParam) {
      const priceQuery: Record<string, number> = {};
      const min = minPriceParam ? parseFloat(minPriceParam) : NaN;
      const max = maxPriceParam ? parseFloat(maxPriceParam) : NaN;
      if (!Number.isNaN(min)) priceQuery.$gte = min;
      if (!Number.isNaN(max)) priceQuery.$lte = max;
      // Only apply if at least one bound is valid
      if (Object.keys(priceQuery).length > 0) {
        query.price = priceQuery;
      }
    }

    // Color filtering: match colorVariants.color case-insensitively
    const colorParam = searchParams.get('color');
    if (colorParam) {
      const colorRegex = new RegExp(`^${colorParam.replace(/^#/, '')}$`, 'i');
      // Match either the color name or the colorCode (hex) of the variant
      query.$or = [
        { 'colorVariants.color': { $in: [colorRegex] } },
        { 'colorVariants.colorCode': { $in: [colorRegex] } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// Create new product
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const formData = await request.formData();
    
    const name = (formData.get('name') as string || '').trim();
    const description = (formData.get('description') as string || '').trim();
    const price = parseFloat(formData.get('price') as string || '0');
    const originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : undefined;
    const rating = parseFloat(formData.get('rating') as string || '0');
    const category = (formData.get('category') as string || '').trim();
    const brandValue = (formData.get('brand') as string || '').trim();
    const tags = JSON.parse((formData.get('tags') as string) || '[]') as string[];
    const colorVariants = JSON.parse((formData.get('colorVariants') as string) || '[]') as Array<{
      color?: string;
      colorCode?: string;
      image?: string;
      imageFile?: string;
    }>;

    // Basic validation
    if (!name || !description || !category || !price || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Generate slug from name
    const generateSlug = (name: string): string => {
      return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    };
    
    const id = generateSlug(name);
    
    // Upload main image
  const mainImageFile = formData.get('image') as File;
    let imageUrl = '';
    let imagePublicId = '';
    
    if (mainImageFile) {
      const bytes = await mainImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer, 'products');
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }
    
    // Upload color variant images
    const processedColorVariants = await Promise.all(
      colorVariants.map(async (variant) => {
        if (variant.imageFile) {
          const colorImageFile = formData.get(variant.imageFile) as File | null;
          if (colorImageFile) {
            const bytes = await colorImageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadResult = await uploadToCloudinary(buffer, 'products/color-variants');
            return {
              color: variant.color,
              colorCode: variant.colorCode,
              image: uploadResult.secure_url,
              publicId: uploadResult.public_id
            };
          }
        }
        return {
          color: variant.color,
          colorCode: variant.colorCode,
          image: variant.image || '/placeholder-color.jpg'
        };
      })
    );
    
    const product = new Product({
      id,
      name,
      description,
      price,
      originalPrice,
      image: imageUrl,
      imagePublicId,
      rating,
      tags,
      category,
      brand: brandValue || undefined,
      colorVariants: processedColorVariants
    });
    
    const savedProduct = await product.save();
    
    return NextResponse.json(savedProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}