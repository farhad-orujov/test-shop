import React from 'react';

export default function AdminCTFPage() {
  const KEY = process.env.CTF_ADMIN_KEY || 'flag{admin-ctf-42}';

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin CTF Panel</h1>
      <p className="mb-4">This page is visible only to admins. The CTF key is shown below.</p>
      <div className="p-4 bg-zinc-900 text-white rounded">
        <div className="font-mono break-words">{KEY}</div>
      </div>
    </main>
  );
}
