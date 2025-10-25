"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-900 text-zinc-300 rounded-t-3xl mt-12">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Logo.png" alt="Logo" width={140} height={40} />
            </Link>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-white">Help</h4>
              <ul className="mt-2 text-sm space-y-1">
                <li><Link href="/about-us">About Us</Link></li>
                <li><Link href="/catalog">Catalog</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Support</h4>
              <ul className="mt-2 text-sm space-y-1">
                <li>Everyday 10:00-20:00</li>
                <li>TestShop@gmail.com</li>
                <li>+994 77 777 777</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Legal</h4>
              <ul className="mt-2 text-sm space-y-1">
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-zinc-700 pt-4 text-sm text-zinc-400 flex justify-between items-center">
          <div>© {new Date().getFullYear()} TestShop. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/">Home</Link>
            <Link href="/about-us">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
