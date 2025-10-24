"use client";

import { useEffect, useState } from 'react';
import { GoodsCard } from '@/app/components/ui/goodscard';

export default function FavoritesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchFavs = async () => {
      try {
        const res = await fetch('/api/users/favorites');
        if (res.ok) {
          const data = await res.json();
          if (mounted) setItems(data || []);
        } else {
          console.error('Failed to load favorites', await res.text());
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchFavs();
    return () => { mounted = false; };
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Favorites</h1>
      {loading && <div>Loading...</div>}
      {!loading && items.length === 0 && <div className="text-zinc-500">No favorites yet.</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <GoodsCard
            key={p._id || p.id}
            _id={p._id || p.id}
            pathtoimg={p.image}
            alt={p.name}
            rating={p.rating || 0}
            price={p.price || 0}
            originalprice={p.originalPrice}
            tags={p.tags}
            colorVariants={p.colorVariants?.map((v: any) => ({ colorName: v.color || '', colorCode: v.colorCode || '', image: v.image || '' }))}
          />
        ))}
      </div>
    </main>
  );
}
