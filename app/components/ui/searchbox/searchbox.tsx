"use client";

import { useState } from "react";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);

  // Заглушка товаров (можно заменить fetch на API)
  const products = [
    "Ноутбук",
    "Смартфон",
    "Наушники",
    "Клавиатура",
    "Мышь",
    "Монитор",
  ];

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);

    // фильтруем товары по запросу
    const filtered = products.filter((p) =>
      p.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered);
  }

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Искать товары..."
        className="w-full p-1 pl-5 pr-10 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
      />
      {/* Значок лупы справа */}
      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-600 pointer-events-none">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>

      {query && results.length > 0 && (
        <ul className="absolute left-0 right-0 top-full mt-1 border border-gray-300 rounded shadow bg-white z-10">
          {results.map((item, idx) => (
            <li
              key={idx}
              className="p-2 hover:bg-blue-100 cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
