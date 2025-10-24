"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function CTFPage() {
  const [flag, setFlag] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ctf/verify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ flag })
      });
      const data = await res.json();
      if (data.correct) setResult('Correct — well done!');
      else setResult('Incorrect flag — try again.');
    } catch (err) {
      setResult('Error submitting flag');
    } finally { setLoading(false); }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-3">CTF — Full flow</h1>
      <p className="mb-4 text-zinc-500">This lab: find admin username via XSS on a product page, brute-force the admin account password, login as admin and open <code>/admin/ctf</code> to get the final key, then submit it here.</p>

      <ol className="list-decimal pl-6 mb-4">
        <li>Open a product from <Link href="/catalog">Catalog</Link> and inspect the Comments section to find the admin username (hidden in DOM).</li>
        <li>Try logging in at <Link href="/auth/signin">Sign in</Link> using the username (the auth accepts username or email) and brute-force the password (the lab uses a weak password for practice).</li>
        <li>After successful login, open <code>/admin/ctf</code> to view the admin-only key.</li>
        <li>Submit that key below.</li>
      </ol>

      <details className="mb-4 p-3 bg-zinc-800 rounded text-white">
        <summary className="cursor-pointer font-semibold">Hints</summary>
        <ul className="mt-2 list-disc pl-5">
          <li>Comments are vulnerable to stored XSS and contain a hidden element with admin username.</li>
          <li>Auth accepts username or email as the first credential; try using the revealed username directly on the signin form.</li>
          <li>Use simple passwords when brute-forcing for this lab (e.g. <code>academy123</code>).</li>
        </ul>
      </details>

      <form onSubmit={submit} className="space-y-2 max-w-xl">
        <input value={flag} onChange={(e) => setFlag(e.target.value)} placeholder="flag{...}" className="w-full p-2 rounded bg-zinc-800 text-white" />
        <div>
          <button className="px-4 py-2 bg-rose-600 text-white rounded" disabled={loading}>{loading ? 'Submitting...' : 'Submit flag'}</button>
        </div>
      </form>

      {result && <div className="mt-3">{result}</div>}
    </main>
  );
}
