"use client";

import { useEffect, useRef, useState } from "react";
import { productService } from "@/services/product.service";
import { Product, ProductFilters } from "@/types/product";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/shop/FilterSidebar";
import { Icon } from "@iconify/react";
import "@/app/styles/layouts/shop.css";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  const handleCloseSidebar = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsSidebarOpen(false);
    }, 280); // matches the 0.3s CSS animation duration
  };

  const handleToggleSidebar = () => {
    if (isSidebarOpen) {
      handleCloseSidebar();
    } else {
      setIsSidebarOpen(true);
    }
  };

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

  // Close sidebar on outside click (only when open and not already closing)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        isSidebarOpen &&
        !isClosing &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        // Also ensure we aren't clicking the toggle button itself
        const target = e.target as HTMLElement;
        if (!target.closest('button[title="Toggle Filters"]')) {
          handleCloseSidebar();
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isSidebarOpen, isClosing]);

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
    <div className="shop-page">
      <div className="shop-container">
        {/* Toggleable Sidebar */}
        {(isSidebarOpen || isClosing) && (
          <aside
            ref={sidebarRef}
            className={`shop-sidebar ${
              isClosing ? "shop-sidebar-closing" : "shop-sidebar-open"
            }`}
          >
            <FilterSidebar
              categories={[
                "men",
                "women",
                "kids",
                "accessories",
                "winter-wear",
                "formal-wear",
              ]}
              currentFilters={filters}
              onFilterChange={handleFilterChange}
              onClose={handleCloseSidebar}
            />
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Control Bar */}
          <div className="flex items-center justify-between mb-8 min-h-[42px] sticky top-[6.5rem] z-[40]">
            <button
              onClick={handleToggleSidebar}
              className="w-[42px] h-[42px] bg-(--surface) border border-(--divider) rounded-[5px] hover:border-(--foreground) shadow-sm transition-all flex items-center justify-center text-(--foreground) cursor-pointer shrink-0"
              title="Toggle Filters"
            >
              <Icon
                icon={isSidebarOpen ? "mdi:close" : "mdi:tune"}
                className={`w-7 h-7 transition-transform duration-300 ${
                  isSidebarOpen ? "rotate-90" : ""
                }`}
              />
            </button>

            <div className="flex items-center" ref={sortRef}>
              <div
                className="relative"
                onMouseEnter={() => setSortOpen(true)}
                onMouseLeave={() => setSortOpen(false)}
              >
                <button className="flex items-center gap-2 px-4 py-2 bg-(--surface) border border-(--divider) rounded-full text-sm font-bold hover:border-(--foreground) transition-all cursor-pointer">
                  Sort by
                  <Icon
                    icon="mdi:chevron-down"
                    className={`transition-transform duration-300 ${
                      sortOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {sortOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-(--background) border border-(--divider) rounded-xl shadow-xl z-50 overflow-hidden animate-fadeIn">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortValue(option);
                          handleFilterChange({ sort: option.value });
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 text-sm transition-colors cursor-pointer ${
                          sortValue.value === option.value
                            ? "bg-(--muted-light) text-(--foreground) font-bold"
                            : "text-(--muted) hover:bg-(--surface) hover:text-(--foreground)"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="flex-1">
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
      </div>

      {/* Full Screen Overlay for Sidebar (Mobile Only) */}
      {(isSidebarOpen || isClosing) && (
        <div
          onClick={handleCloseSidebar}
          className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-45 transition-opacity duration-300 lg:hidden ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
        />
      )}
    </div>
  );
}
