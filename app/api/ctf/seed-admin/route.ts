import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST() {
  try {
    await connectToDatabase();
    const name = 'CodeAcademyAdmin92658';
    const email = 'CodeAcademyAdmin92658@example.local';
    const existing = await User.findOne({ $or: [{ email }, { name }] });
    if (existing) {
      return new Response(JSON.stringify({ ok: true, message: 'Admin already exists' }), { status: 200 });
    }

    // Create admin with a weak password for brute-force practice
    const created = await User.create({ name, email, password: 'academy123', isAdmin: true });
    return new Response(JSON.stringify({ ok: true, message: 'Admin created', id: created._id }), { status: 201 });
  } catch (err) {
    console.error('Seed admin error', err);
    return new Response(JSON.stringify({ ok: false, message: 'Error' }), { status: 500 });
  }
}
