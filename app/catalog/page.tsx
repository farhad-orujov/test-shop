"use client";

import { useState, useEffect } from "react";
import { Filter } from "@/app/components//filter/filter";
import clsx from "clsx";
import { beniga } from "@/app/fonts";
import { GoodsCard } from "@/app/components/ui/goodscard";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  tags: string[];
}

export default function CatalogPage() {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const options = [
    { id: "1", label: "Option 1", value: "option1" },
    { id: "2", label: "Option 2", value: "option2" },
    { id: "3", label: "Option 3", value: "option3" },
  ];

  const customColors = [
    { id: "custom-1", value: "black", color: "#000000" },
    { id: "custom-2", value: "white", color: "#FFFFFF" },
    { id: "custom-3", value: "gray", color: "#6B7280" },
    { id: "custom-4", value: "navy", color: "#1E3A8A" },
    { id: "custom-5", value: "brown", color: "#92400E" },
    { id: "custom-6", value: "orange", color: "#EA580C" },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto pl-3">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto pl-3">
      <h1
        className={clsx(
          beniga.className,
          "text-xl font-bold text-neutral-900 mt-6 border-b-[2px] border-zinc-200 "
        )}
      >
        CATALOG
      </h1>
      <div className="lg:hidden">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="my-4 flex items-center gap-2 rounded-[14px] border p-2 ml-21"
        >
          <span>Фильтры</span>
        </button>
      </div>
      <div className="flex flex-row">
        <div
          className={clsx(
            "fixed inset-0 z-40 transition-opacity duration-300 ease-in-out lg:hidden",
            isFilterOpen
              ? "bg-black/50 opacity-100"
              : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsFilterOpen(false)}
        >
          <div
            className={clsx(
              "absolute left-0 top-0 h-full w-4/5 max-w-sm transform overflow-y-auto bg-white p-4 transition-transform duration-300 ease-in-out",
              isFilterOpen ? "translate-x-0" : "-translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Filter
              classname="w-full"
              isModal={true}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>
        </div>

        <div className="hidden w-[200px] pr-2 lg:block lg:border-r-[2px] lg:border-zinc-200">
          <Filter classname="w-full" />
        </div>
        <div className="w-full">
          <div className="mx-auto gap-y-8 sm:gap-y-12 md:gap-y-4 flex max-w-max flex-nowrap lg:justify-start justify-center px-10 flex-wrap justify-center px-0">
            {products.map((product) => (
              <GoodsCard
                key={product._id}
                pathtoimg={product.image}
                alt={product.name}
                rating={product.rating}
                price={product.price}
                originalprice={product.originalPrice}
                tags={product.tags}
                classname=""
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}