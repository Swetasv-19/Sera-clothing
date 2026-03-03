"use client";

import ProductCard from "./ProductCard";
import { Icon } from "@iconify/react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  discount?: number;
}

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export default function ProductGrid({ products, title, subtitle }: ProductGridProps) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-cyprus mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-cyprus/70 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-sand rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:package-variant" width="32" height="32" className="text-cyprus/40" />
            </div>
            <h3 className="text-xl font-semibold text-cyprus mb-2">No products found</h3>
            <p className="text-cyprus/60">Check back later for new arrivals</p>
          </div>
        )}
      </div>
    </section>
  );
}
