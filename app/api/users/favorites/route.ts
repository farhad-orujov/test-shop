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

    const user = await User.findById(token.id).populate('favorites');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(user.favorites || []);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const token = await getToken({ req: request, secret });
    if (!token || !token.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { productId } = body;
    if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

    const user = await User.findById(token.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const existingIndex = (user.favorites || []).findIndex((id: any) => id.toString() === productId);
    if (existingIndex === -1) {
      // add
      user.favorites = [...(user.favorites || []), productId];
    } else {
      // remove
      user.favorites = (user.favorites || []).filter((id: any) => id.toString() !== productId);
    }

    await user.save();

    const populated = await User.findById(user._id).populate('favorites');
    return NextResponse.json(populated?.favorites || []);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
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

    user.favorites = (user.favorites || []).filter((id: any) => id.toString() !== productId);
    await user.save();

    const populated = await User.findById(user._id).populate('favorites');
    return NextResponse.json(populated?.favorites || []);
  } catch (error) {
    console.error('Error deleting favorite:', error);
    return NextResponse.json({ error: 'Failed to delete favorite' }, { status: 500 });
  }
}
