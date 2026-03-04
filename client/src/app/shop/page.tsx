"use client";

import { useEffect, useRef, useState } from "react";
import { productService } from "@/services/product.service";
import { Product, ProductFilters } from "@/types/product";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/shop/FilterSidebar";
import { Icon } from "@iconify/react";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
  });
  const [totalPages, setTotalPages] = useState(1);

  const sortOptions = [
    { value: "-createdAt", label: "Newest" },
    { value: "price", label: "Price: Low to High" },
    { value: "-price", label: "Price: High to Low" },
  ];
  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState(sortOptions[0]);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts(filters);
      if (response.success) {
        setProducts(response.data);
        setTotalPages(response.pages);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    handleFilterChange({ search });
  };

  return (
    <div className="bg-(--background) min-h-screen flex relative overflow-x-hidden">
      {/* 
        Full Height Toggleable Sidebar 
        We use fixed positioning for the "drawer" feel on mobile, 
        and relative/static on desktop if we want it to push content.
      */}
      <aside
        className={`fixed z-50 w-80 bg-(--surface) border-(--divider) transform transition-all duration-300 ease-in-out shadow-2xl 
          top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 border-r h-auto max-h-[85vh] rounded-[7px] overflow-hidden lg:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]
          ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-(--divider) flex justify-center items-center relative mb-4">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden absolute top-1/2 -translate-y-1/2 right-4 p-2 hover:bg-(--muted-light) rounded-full transition-colors"
            >
              <Icon icon="mdi:close" className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {/* TODO: <FilterSidebar
              categories={["men", "women", "unisex", "accessories"]}
              brands={["Sera"]}
              onFilterChange={handleFilterChange}
            /> */}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* TODO: Top Control Bar attached with the header*/}

        {/* Product Grid Area */}
        <div className="pl-10 lg:pl-16 pr-6 lg:pr-10 py-10 flex-1">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
              <div className="w-12 h-12 border-t-2 border-(--accent-primary) rounded-full animate-spin" />
              <p className="font-serif italic text-(--muted)">
                Curating the finest selection...
              </p>
            </div>
          ) : products.length > 0 ? (
            <>
              <ProductGrid products={products} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-20 gap-3 pb-10">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handleFilterChange({ page: i + 1 })}
                      className={`w-12 h-12 rounded-full font-serif font-bold transition-all ${
                        filters.page === i + 1
                          ? "bg-(--foreground) text-(--background) scale-110 shadow-lg"
                          : "bg-(--surface) text-(--foreground) border border-(--divider) hover:border-(--foreground)"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-32 text-center">
              <Icon
                icon="mdi:emoticon-neutral-outline"
                className="w-16 h-16 text-(--muted) mb-4"
              />
              <h3 className="text-3xl font-serif font-bold text-(--foreground)">
                No results found
              </h3>
              <p className="text-(--muted) max-w-sm mt-2">
                Try adjusting your filters or search terms to find what you're
                looking for.
              </p>
              <button
                onClick={() => setFilters({ page: 1, limit: 12 })}
                className="mt-8 btn-primary"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Full Screen Overlay for Sidebar (Mobile & Desktop) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-45 transition-opacity"
        />
      )}
    </div>
  );
}
