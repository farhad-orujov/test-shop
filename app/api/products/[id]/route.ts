import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { deleteFromCloudinary } from '@/lib/cloudinary-utils';

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const resolvedParams = await params;
  try {
    await connectToDatabase();
    
    // Ищем товар по _id (MongoDB ObjectId)
    const product = await Product.findById(resolvedParams.id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// Обновить товар
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Ищем и обновляем товар по полю id (slug)
    const product = await Product.findOneAndUpdate(
      { id: resolvedParams.id },
      body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// Удалить товар
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    await connectToDatabase();
    
    console.log('Attempting to delete product with _id:', resolvedParams.id);
    
    // Сначала находим продукт для получения информации об изображениях
    const product = await Product.findById(resolvedParams.id);
    
    if (!product) {
      console.log('Product not found with _id:', resolvedParams.id);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Удаляем основное изображение из Cloudinary
    if (product.imagePublicId) {
      try {
        await deleteFromCloudinary(product.imagePublicId);
        console.log('Main image deleted from Cloudinary:', product.imagePublicId);
      } catch (error) {
        console.error('Error deleting main image from Cloudinary:', error);
      }
    }
    
    // Удаляем изображения вариантов цвета из Cloudinary
    if (product.colorVariants && product.colorVariants.length > 0) {
      for (const variant of product.colorVariants) {
        if (variant.publicId) {
          try {
            await deleteFromCloudinary(variant.publicId);
            console.log('Color variant image deleted from Cloudinary:', variant.publicId);
          } catch (error) {
            console.error('Error deleting color variant image from Cloudinary:', error);
          }
        }
      }
    }
    
    // Удаляем товар из MongoDB
    await Product.findByIdAndDelete(resolvedParams.id);
    
    console.log('Product deleted successfully:', product._id);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}