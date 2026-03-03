"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services/product.service";
import { Product, ProductFilters } from "@/types/product";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/shop/FilterSidebar";
import { Icon } from "@iconify/react";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default hidden so user can toggle
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
  });
  const [totalPages, setTotalPages] = useState(1);

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
    <div className="bg-[var(--background)] min-h-screen flex relative overflow-x-hidden">
      {/* 
        Full Height Toggleable Sidebar 
        We use fixed positioning for the "drawer" feel on mobile, 
        and relative/static on desktop if we want it to push content.
      */}
      <aside 
        className={`fixed z-50 w-80 bg-[var(--surface)] border-[var(--divider)] transform transition-all duration-300 ease-in-out shadow-2xl 
          top-1/2 -translate-y-1/2 left-0 border-r lg:left-6 h-auto max-h-[85vh] rounded-[7px] lg:border overflow-hidden lg:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]
          ${isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full lg:translate-x-[-120%] opacity-0 pointer-events-none"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-[var(--divider)] flex justify-center items-center relative mb-4">
            <h2 className="text-3xl font-serif font-bold text-[var(--foreground)] tracking-tight">Filters</h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden absolute top-1/2 -translate-y-1/2 right-4 p-2 hover:bg-[var(--muted-light)] rounded-full transition-colors"
            >
              <Icon icon="mdi:close" className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <FilterSidebar 
              categories={["men", "women", "unisex", "accessories"]} 
              brands={["Sera"]} 
              onFilterChange={handleFilterChange} 
            />
          </div>


        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Top Control Bar */}
        <div className="sticky top-20 z-40 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--divider)]">
          <div className="container-padded py-2 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--divider)] rounded-full font-bold text-sm text-[var(--foreground)] hover:bg-[var(--muted-light)] transition-all active:scale-95"
              >
                <Icon icon={isSidebarOpen ? "mdi:menu-open" : "mdi:filter-variant"} className="w-5 h-5 text-[var(--accent-primary)]" />
                <span>{isSidebarOpen ? "Hide Filters" : "Show Filters"}</span>
              </button>
              
              <div className="hidden sm:block h-6 w-px bg-[var(--divider)]" />
              
              <p className="text-sm font-medium text-[var(--muted)]">
                Showing <span className="text-[var(--foreground)]">{products.length}</span> luxury pieces
              </p>
            </div>

            <div className="flex items-center gap-3">
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <input
                  type="text"
                  name="search"
                  placeholder="Seach collection..."
                  className="pl-10 pr-4 py-2 bg-[var(--surface-alt)] border border-[var(--divider)] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] w-48 lg:w-64 transition-all"
                />
                <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              </form>

              <select 
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
                className="bg-[var(--surface)] border border-[var(--divider)] rounded-full px-4 py-2 text-sm font-bold text-[var(--foreground)] focus:outline-none cursor-pointer hover:border-[var(--muted)] transition-colors"
              >
                <option value="-createdAt">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="container-padded py-10 flex-1">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
              <div className="w-12 h-12 border-t-2 border-[var(--accent-primary)] rounded-full animate-spin" />
              <p className="font-serif italic text-[var(--muted)]">Curating the finest selection...</p>
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
                          ? "bg-[var(--foreground)] text-[var(--background)] scale-110 shadow-lg"
                          : "bg-[var(--surface)] text-[var(--foreground)] border border-[var(--divider)] hover:border-[var(--foreground)]"
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
              <Icon icon="mdi:emoticon-neutral-outline" className="w-16 h-16 text-[var(--muted)] mb-4" />
              <h3 className="text-3xl font-serif font-bold text-[var(--foreground)]">No results found</h3>
              <p className="text-[var(--muted)] max-w-sm mt-2">Try adjusting your filters or search terms to find what you're looking for.</p>
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
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[45] transition-opacity"
        />
      )}
    </div>
  );
}
