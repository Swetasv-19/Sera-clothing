"use client";

import ProductCard from "./ProductCard";
import { Icon } from "@iconify/react";
import { Product } from "../types/product";

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export default function ProductGrid({ products, title, subtitle }: ProductGridProps) {
  return (
    <div>
      {/* Optional section header */}
      {(title || subtitle) && (
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          {title && (
            <h2
              className="font-serif"
              style={{ color: "var(--foreground)", marginBottom: "0.75rem" }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p style={{ fontSize: "1.1rem", color: "var(--muted)" }}>{subtitle}</p>
          )}
        </div>
      )}

      {/* Products grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
          gap: "1.5rem",
        }}
      >
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Empty state */}
      {products.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
          <div
            style={{
              width: "5rem",
              height: "5rem",
              borderRadius: "50%",
              backgroundColor: "var(--surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
            }}
          >
            <Icon
              icon="mdi:package-variant"
              width={32}
              height={32}
              style={{ color: "var(--muted)" }}
            />
          </div>
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: 600,
              color: "var(--foreground)",
              marginBottom: "0.5rem",
            }}
          >
            No products found
          </h3>
          <p style={{ color: "var(--muted)" }}>Check back later for new arrivals</p>
        </div>
      )}
    </div>
  );
}
