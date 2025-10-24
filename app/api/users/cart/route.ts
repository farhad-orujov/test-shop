import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const token = await getToken({ req: request, secret });
    if (!token || !token.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await User.findById(token.id).populate({ path: 'cart.product' });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(user.cart || []);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const token = await getToken({ req: request, secret });
    if (!token || !token.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { productId, quantity = 1 } = body;
    if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

    const user = await User.findById(token.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // if product exists in cart, increase quantity
    const existing = (user.cart || []).find((item: any) => item.product.toString() === productId);
    if (existing) {
      existing.quantity = (existing.quantity || 0) + Number(quantity);
    } else {
      user.cart = [...(user.cart || []), { product: productId, quantity: Number(quantity) }];
    }

    await user.save();
    const populated = await User.findById(user._id).populate({ path: 'cart.product' });
    return NextResponse.json(populated?.cart || []);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    const token = await getToken({ req: request, secret });
    if (!token || !token.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { productId, quantity } = body;
    if (!productId || typeof quantity === 'undefined') return NextResponse.json({ error: 'productId and quantity required' }, { status: 400 });

    const user = await User.findById(token.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    user.cart = (user.cart || []).map((item: any) => {
      if (item.product.toString() === productId) {
        return { product: item.product, quantity: Number(quantity) };
      }
      return item;
    });

    await user.save();
    const populated = await User.findById(user._id).populate({ path: 'cart.product' });
    return NextResponse.json(populated?.cart || []);
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const token = await getToken({ req: request, secret });
    if (!token || !token.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(request.url);
    const productId = url.searchParams.get('productId');
    if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

    const user = await User.findById(token.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    user.cart = (user.cart || []).filter((item: any) => item.product.toString() !== productId);
    await user.save();

    const populated = await User.findById(user._id).populate({ path: 'cart.product' });
    return NextResponse.json(populated?.cart || []);
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json({ error: 'Failed to delete cart item' }, { status: 500 });
  }
}
