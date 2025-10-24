"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Suggestion {
  _id: string;
  name: string;
  image?: string;
}

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const timerRef = useRef<number | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setShow(false);
      return;
    }

    setLoading(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setResults(Array.isArray(data) ? data : []);
          setShow(true);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error('Search error', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  function onSelect(s: Suggestion) {
    setQuery("");
    setShow(false);
    router.push(`/catalog/${s._id}`);
  }

  function onEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (results.length > 0) {
        onSelect(results[0]);
      } else {
        router.push(`/catalog?search=${encodeURIComponent(query)}`);
      }
    }
  }

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onEnter}
  placeholder="Search products..."
        className="w-full p-2 pl-4 pr-10 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 text-white"
        onFocus={() => { if (results.length > 0) setShow(true); }}
      />

      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 pointer-events-none">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>

      {show && query && (
        <ul className="absolute left-0 right-0 top-full mt-1 border border-zinc-700 rounded shadow bg-neutral-900 z-50 text-white max-h-64 overflow-auto">
          {loading && (
            <li className="p-3 text-zinc-400">Searching...</li>
          )}
          {!loading && results.length === 0 && (
            <li className="p-3 text-zinc-400">No results</li>
          )}
          {!loading && results.map((item) => (
            <li
              key={item._id}
              onClick={() => onSelect(item)}
              className="flex items-center gap-3 p-2 hover:bg-zinc-800 cursor-pointer"
            >
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
              ) : (
                <div className="w-10 h-10 bg-zinc-700 rounded" />
              )}
              <div className="truncate">{item.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
