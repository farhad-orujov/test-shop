"use client";

import { useEffect, useRef, useState } from 'react';
import { GoodsCard } from '@/app/components/ui/goodscard';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  image: string;
  rating: number;
  price: number;
  originalPrice?: number;
  tags?: string[];
  colorVariants?: Array<{ color?: string; colorCode?: string; image?: string }>;
}

export default function NewItemsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchNewItems = async () => {
      try {
        const res = await fetch('/api/products?tag=new');
        if (res.ok) {
          const data = await res.json();
          setProducts(data || []);
        } else {
          console.error('Failed to fetch new items', await res.text());
        }
      } catch (err) {
        console.error('Error fetching new items', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewItems();
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.9;
    el.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  // Autoplay and indicators
  const [current, setCurrent] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const onScroll = () => {
      const child = el.querySelector('.snap-start');
      const firstChild = el.firstElementChild as HTMLElement | null;
      const itemWidth = firstChild ? firstChild.clientWidth + 16 : el.clientWidth * 0.9;
      const idx = Math.round(el.scrollLeft / itemWidth);
      setCurrent(idx);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    const interval = setInterval(() => {
      if (paused.current) return;
      // auto-scroll by one item
      const el = carouselRef.current;
      if (!el) return;
      const firstChild = el.firstElementChild as HTMLElement | null;
      const itemWidth = firstChild ? firstChild.clientWidth + 16 : el.clientWidth * 0.9;
      el.scrollBy({ left: itemWidth, behavior: 'smooth' });
    }, 4000);

    return () => {
      el.removeEventListener('scroll', onScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">New Items</h1>

      <section className="relative">
        <button
          aria-label="Scroll left"
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 rounded-full p-2 shadow hover:scale-105"
        >
          ‹
        </button>

        <div
          ref={carouselRef}
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={() => { paused.current = false; }}
          className={clsx(
            'flex gap-4 overflow-x-auto scroll-smooth py-4 px-8',
            'snap-x snap-mandatory'
          )}
          style={{ scrollPadding: '1rem' }}
        >
          {loading && (
            <div className="w-full flex items-center justify-center py-12">Loading...</div>
          )}

          {!loading && products.length === 0 && (
            <div className="w-full text-center text-zinc-500 py-12">No new items found.</div>
          )}

          {products.map((p) => (
            <div key={p._id} className="snap-start flex-shrink-0 w-[320px] sm:w-[360px] md:w-[320px]">
              <GoodsCard
                _id={p._id}
                pathtoimg={p.image}
                alt={p.name}
                category={(p as any).category || ''}
                rating={p.rating}
                price={p.price}
                originalprice={p.originalPrice}
                tags={p.tags}
                colorVariants={
                  p.colorVariants?.map((v) => ({ colorName: v.color || '', colorCode: v.colorCode || '', image: v.image || '' }))
                }
              />
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-4 gap-2">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                const el = carouselRef.current;
                if (!el) return;
                const firstChild = el.firstElementChild as HTMLElement | null;
                const itemWidth = firstChild ? firstChild.clientWidth + 16 : el.clientWidth * 0.9;
                el.scrollTo({ left: idx * itemWidth, behavior: 'smooth' });
              }}
              className={clsx('w-3 h-3 rounded-full', current === idx ? 'bg-rose-600' : 'bg-zinc-400')}
            />
          ))}
        </div>

        <button
          aria-label="Scroll right"
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 rounded-full p-2 shadow hover:scale-105"
        >
          <ChevronRight size={18} />
        </button>
      </section>
    </main>
  );
}
