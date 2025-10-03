"use client";

import Image from "next/image";
import SearchBox from "../ui/searchbox/searchbox";
import Link from "next/link";
import BurgerMenu from "./burgermenu";
import { useState, useEffect, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Закрытие меню при клике вне его
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    router.refresh();
  };

  const handleSignIn = () => {
    setIsUserMenuOpen(false);
    router.push('/auth/signin');
  };

  const handleSignUp = () => {
    setIsUserMenuOpen(false);
    router.push('/auth/signup');
  };

  return (
    <>
      <div className="w-full bg-neutral-900 text-zinc-500 rounded-b-3xl py-2 px-4">
        <div className="container mx-auto">
          <div className="hidden sm:flex w-full h-8 justify-between border-b-[1px] border-zinc-700">
            <div>Baku</div>
            <div>Everyday 10:00-20:00</div>
            <div>TestShop@gmail.com</div>
            <div>+994 77 777 777</div>
          </div>
          <div className="relative w-full h-14 flex items-center justify-between border-b-[1px] border-zinc-700">
            <div className="flex-1 basis-1/5">
              <Link href={"/"}>
                <Image src={"/Logo.png"} width={200} height={200} alt={"Logo"} />
              </Link>
            </div>
            <div className="flex-1 basis-3/5">
              <SearchBox />
            </div>
            <div className="flex-1 basis-1/5 flex justify-center">
              {/* Icons for medium and larger screens */}
              <div className="hidden md:flex justify-between items-center min-h-8 w-4/6">
                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-1 rounded-full border-2 border-transparent transition-all duration-200 hover:scale-110 hover:border-rose-800 active:scale-95"
                  >
                    <Image
                      src="/user.svg"
                      alt="User account menu"
                      width={24}
                      height={24}
                      className="text-zinc-500"
                    />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      {status === 'authenticated' && session?.user ? (
                        <>
                          <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                            <div className="font-medium">{session.user.name}</div>
                            <div className="text-gray-500 text-xs">{session.user.email}</div>
                          </div>
                          <button
                            onClick={handleSignOut}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handleSignIn}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Sign In
                          </button>
                          <button
                            onClick={handleSignUp}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Sign Up
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <Link href="" className="p-1 rounded-full border-2 border-transparent transition-all duration-200 hover:scale-110 hover:border-rose-800 active:scale-95">
                  <Image
                    src="/heart.svg"
                    alt="Wishlist"
                    width={24}
                    height={24}
                    className="text-zinc-500"
                  />
                </Link>
                <Link href="" className="p-1 rounded-full border-2 border-transparent transition-all duration-200 hover:scale-110 hover:border-rose-800 active:scale-95">
                  <Image
                    src="/basket.svg"
                    alt="Shopping cart"
                    width={28}
                    height={28}
                    className="text-zinc-500"
                  />
                </Link>
              </div>
              {/* Burger menu for small screens */}
              <div className="md:hidden">
                <BurgerMenu />
              </div>
            </div>
          </div>
          <div className="w-full h-7 mt-2 flex justify-between text-zinc-300">
            <div className="relative">
              <Link href="/catalog" className="py-1 text-zinc-300 transition-colors duration-300 hover:text-white relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100 active:text-gray-400">
                Catalog
              </Link>
            </div>
            <div className="relative">
              <Link href="#" className="py-1 text-zinc-300 transition-colors duration-300 hover:text-white relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100 active:text-gray-400">
                New Items
              </Link>
            </div>
            <div className="relative">
              <Link href="#" className="py-1 text-zinc-300 transition-colors duration-300 hover:text-white relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100 active:text-gray-400">
                Popular
              </Link>
            </div>
            <div className="relative">
              <Link href="#" className="py-1 text-zinc-300 transition-colors duration-300 hover:text-white relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100 active:text-gray-400">
                Contacts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}