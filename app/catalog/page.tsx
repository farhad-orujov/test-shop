"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Filter, FilterValues } from "@/app/components/filter/filter";
import clsx from "clsx";
import { beniga } from "@/app/fonts";
import { GoodsCard } from "@/app/components/ui/goodscard";

interface ColorVariant {
  colorName: string;
  colorCode: string;
  image: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  tags: string[];
  colorVariants?: ColorVariant[];
  brand?: string;
  category?: string;
}

export default function CatalogPage() {
  const { data: session } = useSession();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Partial<FilterValues>>({
    brands: [],
    categories: [],
    gender: "",
    color: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  const fetchProducts = async (currentFilters: Partial<FilterValues>) => {
    setLoading(true);
    try {
      let url = "/api/products";
      const params = new URLSearchParams();

      if (currentFilters.brands && currentFilters.brands.length > 0) {
        currentFilters.brands.forEach((brand) => params.append("brand", brand));
      }
      if (currentFilters.categories && currentFilters.categories.length > 0) {
        currentFilters.categories.forEach((category) =>
          params.append("category", category),
        );
      }
      if (currentFilters.gender) {
        params.append("gender", currentFilters.gender);
      }
      if (currentFilters.color) {
        params.append("color", currentFilters.color);
      }
      if (currentFilters.minPrice) {
        params.append("minPrice", currentFilters.minPrice);
      }
      if (currentFilters.maxPrice) {
        params.append("maxPrice", currentFilters.maxPrice);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      brands: [],
      categories: [],
      gender: "",
      color: "",
      minPrice: "",
      maxPrice: "",
    };
    setFilters(clearedFilters);
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
          "text-xl font-bold text-neutral-900 mt-6 border-b-[2px] border-zinc-200 ",
        )}
      >
        CATALOG
      </h1>
      <div className="lg:hidden">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="my-4 flex items-center gap-2 rounded-[14px] border p-2 ml-21"
        >
          <span>Filters</span>
        </button>
      </div>
      <div className="flex flex-row">
        <div
          className={clsx(
            "fixed inset-0 z-40 transition-opacity duration-300 ease-in-out lg:hidden",
            isFilterOpen
              ? "bg-black/50 opacity-100"
              : "opacity-0 pointer-events-none",
          )}
          onClick={() => setIsFilterOpen(false)}
        >
          <div
            className={clsx(
              "absolute left-0 top-0 h-full w-4/5 max-w-sm transform overflow-y-auto bg-white p-4 transition-transform duration-300 ease-in-out",
              isFilterOpen ? "translate-x-0" : "-translate-x-full",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Filter
              classname="w-full"
              isModal={true}
              onClose={() => setIsFilterOpen(false)}
              initialFilters={filters}
              onApply={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>

        <div className="hidden w-[200px] pr-2 lg:block lg:border-r-[2px] lg:border-zinc-200">
          <Filter
            classname="w-full"
            initialFilters={filters}
            onApply={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />
        </div>
        <div className="w-full">
          <div className="mx-auto gap-y-8 sm:gap-y-12 md:gap-y-12 flex max-w-max flex-nowrap lg:justify-start justify-center px-10 flex-wrap justify-center px-0">
            {products.map((product) => (
              <GoodsCard
                key={product._id}
                _id={product._id}
                pathtoimg={product.image}
                alt={product.name}
                category={product.category || ''}
                rating={product.rating}
                price={product.price}
                originalprice={product.originalPrice}
                tags={product.tags}
                colorVariants={product.colorVariants}
                classname=""
                isAdmin={session?.user?.isAdmin || false}
                onDelete={() => fetchProducts(filters)}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}