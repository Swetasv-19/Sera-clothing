"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services/product.service";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { Icon } from "@iconify/react";

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}

export default function RelatedProducts({
  category,
  currentProductId,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      try {
        const res = await productService.getProductsByCategory(category);
        if (res.success && res.data) {
          // Exclude the currently viewed product
          const filtered = res.data.filter((p) => p._id !== currentProductId);
          setProducts(filtered.slice(0, 8)); // Show up to 8 products
        }
      } catch (err) {
        console.error("Failed to fetch related products:", err);
      } finally {
        setLoading(false);
      }
    };

    if (category) fetchRelated();
  }, [category, currentProductId]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="w-full bg-(--background) py-16 px-4 sm:px-6 lg:px-8 border-t border-(--divider)">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-(--muted) mb-2">
              More from {category}
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-(--foreground) tracking-tight">
              You Might Also Like
            </h2>
          </div>
          <a
            href={`/shop?category=${category}`}
            className="flex-shrink-0 flex items-center gap-1 text-sm font-bold text-(--muted) hover:text-(--foreground) transition-colors mb-1"
          >
            View All
            <Icon icon="mdi:arrow-right" className="w-4 h-4" />
          </a>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 border-t-2 border-(--accent-primary) rounded-full animate-spin" />
            <p className="font-serif italic text-(--muted)">
              Loading related items…
            </p>
          </div>
        ) : (
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            }}
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
