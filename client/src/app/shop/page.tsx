"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { productService } from "@/services/product.service";
import { Product, ProductFilters } from "@/types/product";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/shop/FilterSidebar";
import { Icon } from "@iconify/react";
import "@/app/styles/layouts/shop.css";

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
  });
  const [totalPages, setTotalPages] = useState(1);

  // URL Parameters for filtering
  const saleParam = searchParams?.get("sale") === "true";
  const newParam = searchParams?.get("new") === "true";

  const sortOptions = [
    { value: "-createdAt", label: "Newest" },
    { value: "price", label: "Price: Low to High" },
    { value: "-price", label: "Price: High to Low" },
  ];
  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState(sortOptions[0]);
  const sortRef = useRef<HTMLDivElement>(null);

  // Dynamic Title
  useEffect(() => {
    if (saleParam && newParam) document.title = "Sera | New Sale Items";
    else if (saleParam) document.title = "Sera | Sale";
    else if (newParam) document.title = "Sera | New Arrivals";
    else document.title = "Sera | Shop";
  }, [saleParam, newParam]);

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

  // Client-side filtering for Sale/New flags
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      let keep = true;

      // Sale condition: if there's a discount price and it's less than regular price
      if (saleParam) {
        keep = keep && !!p.discountPrice && p.discountPrice < p.price;
      }

      // New condition: created within last 30 days
      if (newParam) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        keep = keep && new Date(p.createdAt) > thirtyDaysAgo;
      }

      return keep;
    });
  }, [products, saleParam, newParam]);

  // Handle URL toggle clicks
  const toggleUrlFilter = (type: "all" | "sale" | "new") => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.delete("page"); // reset page to 1

    if (type === "all") {
      params.delete("sale");
      params.delete("new");
    } else if (type === "sale") {
      params.set("sale", "true");
      params.delete("new"); // Optional: if you want them to be mutually exclusive by default toggle. Or keep both by un-deleting.
    } else if (type === "new") {
      params.set("new", "true");
      params.delete("sale");
    }

    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="shop-page">
      <div className="shop-container">
        {/* Permanent Sidebar */}
        <aside className="shop-sidebar">
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
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Dynamic Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-serif text-(--foreground)">
              {saleParam && newParam
                ? "New Sale Items"
                : saleParam
                  ? "Sale"
                  : newParam
                    ? "New Arrivals"
                    : "Shop All"}
            </h1>
          </div>

          {/* Control Bar */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between py-4 mb-6 min-h-10.5 z-40">
            {/* Quick URL Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toggleUrlFilter("all")}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${!saleParam && !newParam ? "bg-(--foreground) text-(--background)" : "bg-(--surface) text-(--foreground) border border-(--divider) hover:border-(--foreground)"}`}
              >
                All
              </button>
              <button
                onClick={() => toggleUrlFilter("sale")}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${saleParam ? "bg-(--foreground) text-(--background)" : "bg-(--surface) text-(--foreground) border border-(--divider) hover:border-(--foreground)"}`}
              >
                Sale
              </button>
              <button
                onClick={() => toggleUrlFilter("new")}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${newParam ? "bg-(--foreground) text-(--background)" : "bg-(--surface) text-(--foreground) border border-(--divider) hover:border-(--foreground)"}`}
              >
                New
              </button>
            </div>

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
            ) : filteredProducts.length > 0 ? (
              <>
                <ProductGrid products={filteredProducts} />

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
    </div>
  );
}
