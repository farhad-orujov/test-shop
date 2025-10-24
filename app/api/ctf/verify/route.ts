const EASY_FLAG = process.env.CTF_EASY_FLAG || 'flag{easy-xss-tryhackme-123}';
const ADMIN_FLAG = process.env.CTF_ADMIN_KEY || 'flag{admin-ctf-42}';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { flag } = body || {};
    if (!flag) return new Response(JSON.stringify({ ok: false, message: 'Missing flag' }), { status: 400 });

    const f = String(flag).trim();
    const correct = f === EASY_FLAG || f === ADMIN_FLAG;
    if (correct) {
      return new Response(JSON.stringify({ ok: true, correct: true, message: 'Correct flag' }), { status: 200 });
    }
    return new Response(JSON.stringify({ ok: true, correct: false, message: 'Incorrect flag' }), { status: 200 });
  } catch (err) {
    console.error('CTF verify error', err);
    return new Response(JSON.stringify({ ok: false, message: 'Server error' }), { status: 500 });
  }
}
