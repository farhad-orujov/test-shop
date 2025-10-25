"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { beniga, tilda } from "@/app/fonts";
import RatingStars from "./ratingstars";
import { Tags } from "./tags";
import { useRouter } from "next/navigation";
import { X, Loader2, Heart, HeartPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';

interface ColorVariant {
  colorName: string;
  colorCode: string;
  image: string;
}

interface GoodsCardProps {
  _id: string; // MongoDB _id
  classname?: string;
  pathtoimg: string;
  alt: string;
  rating: number;
  price: number;
  originalprice?: number;
  tags?: string[];
  colorVariants?: ColorVariant[];
  category?: string;
  isAdmin?: boolean;
  onDelete?: () => void;
}

export const GoodsCard: React.FC<GoodsCardProps> = ({
  _id,
  classname,
  pathtoimg,
  alt,
  rating,
  price,
  originalprice,
  tags,
  colorVariants,
  category,
  isAdmin = false,
  onDelete,
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session, status } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isProcessingFav, setIsProcessingFav] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchFav = async () => {
      try {
        if (status !== 'authenticated') return;
        const res = await fetch('/api/users/favorites');
        if (res.ok) {
          const favs = await res.json();
          if (mounted) setIsFavorite(favs.some((p: any) => p._id === _id || p.id === _id));
        }
      } catch (err) {
        console.error('Error fetching favorites for card', err);
      }
    };
    fetchFav();
    return () => { mounted = false; };
  }, [status, _id]);

  // DEBUG INFO
  console.log('GoodsCard isAdmin:', isAdmin, 'for product:', alt);

  const handleCardClick = () => {
    // Use MongoDB _id for navigation
    if (!isDeleting) {
      router.push(`/catalog/${_id}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/products/${_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Product deleted successfully');
        if (onDelete) {
          onDelete();
        }
      } else {
        const errorText = await response.text();
        console.error('Error deleting product. Status:', response.status, 'Error text:', errorText);
        alert('Error deleting product: ' + errorText);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product: ' + error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="relative">
        {isAdmin && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={clsx(
              "absolute top-2 right-2 z-20 text-white rounded-full p-1 transition-all duration-200",
              isDeleting 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-red-500 hover:bg-red-600 hover:scale-110"
            )}
            title={isDeleting ? "Deleting..." : "Delete product"}
          >
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <X size={16} />
            )}
          </button>
        )}
        
        <div 
          onClick={handleCardClick} 
          className={clsx(
            "cursor-pointer transition-all duration-300",
            isDeleting && "pointer-events-none"
          )}
        >
          <section
            className={clsx(
              "w-70 h-full rounded-[30px] border-2 border-zinc-200 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-zinc-600/50 m-4 sm:m-8 md:m-4 relative",
              classname,
              isDeleting && "opacity-50 scale-95"
            )}
          >
            {isDeleting && (
              <div className="absolute inset-0 bg-white bg-opacity-80 rounded-[30px] flex items-center justify-center z-10">
                <div className="text-center">
                  <Loader2 size={32} className="animate-spin text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 font-medium">Deleting...</p>
                </div>
              </div>
            )}
            
            <div className="w-full h-10 flex justify-between items-center">
              <div className="pt-2 pl-6">{tags && <Tags tags={tags} />}</div>
              <div className="flex items-center gap-3 pr-3">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (status !== 'authenticated') {
                      router.push('/auth/signin');
                      return;
                    }

                    // Optimistic UI: toggle immediately
                    const prev = isFavorite;
                    setIsFavorite(!prev);
                    setIsProcessingFav(true);

                    try {
                      const res = await fetch('/api/users/favorites', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ productId: _id })
                      });
                      if (!res.ok) {
                        // revert on failure
                        setIsFavorite(prev);
                        console.error('Failed to toggle favorite', await res.text());
                      }
                    } catch (err) {
                      setIsFavorite(prev);
                      console.error('Error toggling favorite', err);
                    } finally {
                      setIsProcessingFav(false);
                    }
                  }}
                  className="p-1"
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isFavorite ? (
                    <Heart size={16} color="#a80000" />
                  ) : (
                    <HeartPlus size={16} color="#f39367ff" />
                  )}
                </button>
              </div>
            </div>
            <div className="h-50 overflow-hidden border-t-2 border-b-2 border-zinc-200">
              {pathtoimg ? (
                pathtoimg.startsWith('data:') ? (
                  // Handle data URIs directly with img tag
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={pathtoimg}
                    alt={alt}
                    width={400}
                    height={100}
                    className={clsx("", classname)}
                  />
                ) : (
                  // Use Next.js Image with our custom loader for everything else
                  <Image
                    src={pathtoimg}
                    alt={alt}
                    width={400}
                    height={100}
                    className={clsx("", classname)}
                    priority
                  />
                )
              ) : (
                // Fallback for empty/undefined src
                <Image
                  src="/placeholder-color.jpg"
                  alt={alt}
                  width={400}
                  height={100}
                  className={clsx("", classname)}
                />
              )}
            </div>
            <div className="pl-6 h-[180px]">
              <h2
                className={clsx(
                  "font-bold text-lg mt-6 uppercase h-[60px]",
                  tilda.className
                )}
              >
                {alt}
              </h2>
              <p className="mb-2 mt-1 capitalize text-sm text-zinc-500">{category || ''}</p>
              <div className="flex">
                <RatingStars value={rating} />
                <p className="ml-2">{rating}</p>
              </div>
              <div className={clsx("mt-2", beniga.className)}>
                {price} AZN{" "}
                {originalprice ? (
                  <span className="text-sm text-zinc-400 line-through">
                    {originalprice} AZN
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="mt-4">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (status !== 'authenticated') {
                      router.push('/auth/signin');
                      return;
                    }

                    // Optimistic UI: show immediate feedback
                    setIsAddingToCart(true);
                    try {
                      const res = await fetch('/api/users/cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ productId: _id, quantity: 1 })
                      });
                      if (!res.ok) {
                        console.error('Failed to add to cart', await res.text());
                      }
                    } catch (err) {
                      console.error('Error adding to cart', err);
                    } finally {
                      // keep brief visual feedback: 700ms
                      setTimeout(() => setIsAddingToCart(false), 700);
                    }
                  }}
                  className="mt-2 inline-block bg-rose-600 text-white px-3 py-2 rounded-md hover:bg-rose-700"
                >
                  {isAddingToCart ? 'Added' : 'Add to cart'}
                </button>
              </div>
              {/* Show color variants indicator */}
              {colorVariants && colorVariants.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {colorVariants.slice(0, 4).map((variant, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: variant.colorCode }}
                    />
                  ))}
                  {colorVariants.length > 4 && (
                    <span className="text-xs text-gray-500 ml-1">
                      +{colorVariants.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};