import connectToDatabase from '@/lib/mongodb';
import Comment from '@/lib/models/Comment';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get('productId');
    const clientId = url.searchParams.get('clientId');
    await connectToDatabase();
    const q: any = {};
    if (productId) q.productId = productId;
    if (clientId) q.clientId = clientId;
    const comments = await Comment.find(q).sort({ createdAt: -1 }).lean();
    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (err) {
    console.error('Error fetching comments', err);
    return new Response('Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, author, content, clientId } = body;
    if (!productId || !content) return new Response('Missing fields', { status: 400 });

    await connectToDatabase();
    const created = await Comment.create({ productId, author: author || 'anonymous', content, clientId: clientId || null });
    return new Response(JSON.stringify(created), { status: 201 });
  } catch (err) {
    console.error('Error creating comment', err);
    return new Response('Error', { status: 500 });
  }
}
