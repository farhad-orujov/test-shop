"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<string[]>([]);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/users/cart');
      if (res.ok) {
        const data = await res.json();
        setItems(data || []);
      } else {
        console.error('Failed to fetch cart', await res.text());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (productId: string, qty: number) => {
    // Optimistic UI: update local state immediately, then sync with server.
    const prev = items;
    const alreadyUpdating = updatingIds.includes(productId);
    if (alreadyUpdating) return; // prevent concurrent ops for same item

    setUpdatingIds((s) => [...s, productId]);
    const optimisticallyUpdated = items.map((it) =>
      it.product._id === productId ? { ...it, quantity: qty } : it
    );
    setItems(optimisticallyUpdated);

    try {
      const res = await fetch('/api/users/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: qty })
      });
      if (res.ok) {
        const data = await res.json();
        // reconcile with server response if provided
        if (Array.isArray(data)) setItems(data || []);
      } else {
        console.error('Failed to update qty', await res.text());
        setItems(prev); // rollback
      }
    } catch (err) {
      console.error(err);
      setItems(prev); // rollback on network error
    } finally {
      setUpdatingIds((s) => s.filter((id) => id !== productId));
    }
  };

  const removeItem = async (productId: string) => {
    // Optimistic remove
    const prev = items;
    const optimisticallyRemoved = items.filter((it) => it.product._id !== productId);
    setItems(optimisticallyRemoved);
    setUpdatingIds((s) => [...s, productId]);
    try {
      const res = await fetch(`/api/users/cart?productId=${productId}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setItems(data || []);
      } else {
        console.error('Failed to remove', await res.text());
        setItems(prev); // rollback
      }
    } catch (err) {
      console.error(err);
      setItems(prev);
    } finally {
      setUpdatingIds((s) => s.filter((id) => id !== productId));
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {loading && <div>Loading...</div>}
      {!loading && items.length === 0 && <div className="text-zinc-500">Cart is empty.</div>}

      <div className="space-y-4">
        {items.map((item: any) => (
          <div key={item.product._id} className="flex items-center gap-4 p-4 border rounded">
            <div className="w-24 h-24 relative">
              <Image src={item.product.image} alt={item.product.name} width={96} height={96} className="object-cover rounded" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">{item.product.name}</div>
              <div className="text-zinc-500">{item.product.price} AZN</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item.product._id, Math.max(1, item.quantity - 1))}
                className="px-3 py-1 bg-gray-200 rounded"
                disabled={updatingIds.includes(item.product._id)}
              >
                -
              </button>
              <div>{item.quantity}</div>
              <button
                onClick={() => updateQty(item.product._id, item.quantity + 1)}
                className="px-3 py-1 bg-gray-200 rounded"
                disabled={updatingIds.includes(item.product._id)}
              >
                +
              </button>
            </div>
            <div>
              <button onClick={() => removeItem(item.product._id)} className="text-red-600">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
