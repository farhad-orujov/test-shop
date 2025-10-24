"use client";

import { useEffect, useState } from 'react';

interface Review {
  _id: string;
  productId: string;
  author?: string;
  content: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews/admin');
        if (res.ok) {
          const data = await res.json();
          setReviews(data || []);
        } else {
          console.error('Unauthorized or error fetching admin reviews', await res.text());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin - Reviews (Vulnerable)</h1>

      {/* Hidden admin flag: visible to admin in DOM for CTF (should be protected in real apps) */}
      <div id="admin-flag" style={{ display: 'none' }}>
        flag{`{stored-xss-9a8b7c}`}
      </div>

      {loading && <div>Loading...</div>}

      <div className="space-y-4 mt-4">
        {reviews.map((r) => (
          <div key={r._id} className="p-4 border rounded bg-white text-black">
            <div className="text-sm text-zinc-500 mb-2">Product: {r.productId} — Author: {r.author}</div>
            {/* Intentionally vulnerable rendering: content is inserted as HTML without sanitization */}
            <div dangerouslySetInnerHTML={{ __html: r.content }} />
          </div>
        ))}
      </div>
    </main>
  );
}
