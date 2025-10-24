import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/lib/models/Product';

// Временный endpoint для обновления существующих продуктов
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Получаем все продукты без поля id
    const products = await Product.find({ id: { $exists: false } });
    
    let updatedCount = 0;
    
    for (const product of products) {
      // Генерируем slug из названия
      const slug = product.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      
      // Обновляем продукт с новым id
      await Product.updateOne(
        { _id: product._id },
        { $set: { id: slug } }
      );
      
      updatedCount++;
    }
    
    return NextResponse.json({ 
      message: `Updated ${updatedCount} products with slug IDs`,
      updatedCount 
    });
    
  } catch (error) {
    console.error('Error updating products:', error);
    return NextResponse.json(
      { error: 'Failed to update products' },
      { status: 500 }
    );
  }
}