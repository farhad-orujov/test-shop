'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const BurgerIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-7 h-7 text-zinc-300"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-md hover:bg-neutral-800 transition-colors"
      >
        <BurgerIcon />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-md shadow-lg py-1 z-50 border border-neutral-700">
          <Link href="#" className="flex items-center px-4 py-3 text-sm text-zinc-300 hover:bg-neutral-700 transition-colors">
            <Image src="/user.svg" alt="User" width={20} height={20} className="mr-3" style={{ filter: 'invert(80%)' }} />
            <span>Account</span>
          </Link>
          <Link href="#" className="flex items-center px-4 py-3 text-sm text-zinc-300 hover:bg-neutral-700 transition-colors">
            <Image src="/heart.svg" alt="Favorites" width={20} height={20} className="mr-3" style={{ filter: 'invert(80%)' }} />
            <span>Favorites</span>
          </Link>
          <Link href="#" className="flex items-center px-4 py-3 text-sm text-zinc-300 hover:bg-neutral-700 transition-colors">
            <Image src="/basket.svg" alt="Basket" width={24} height={24} className="mr-3" style={{ filter: 'invert(80%)' }} />
            <span>Basket</span>
          </Link>
        </div>
      )}
    </div>
  );
}