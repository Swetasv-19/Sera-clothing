"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import { Icon } from "@iconify/react";
import { productService } from "@/services/product.service";
import { Product } from "@/types/product";

// Fallback products in case API is not running or empty
const fallbackProducts: Product[] = [
  {
    _id: "1",
    name: "Elegant Silk Blouse",
    description: "Premium silk blouse for special occasions",
    price: 89.99,
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop",
    ],
    category: "women",
    isFeatured: true,
    isActive: true,
    brand: "Sera",
    sizes: ["S", "M", "L"],
    colors: ["Cream"],
    stock: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Classic Wool Coat",
    description: "Handcrafted wool coat for winter",
    price: 249.99,
    discountPrice: 199.99,
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
    ],
    category: "women",
    isFeatured: true,
    isActive: true,
    brand: "Sera",
    sizes: ["M", "L", "XL"],
    colors: ["Beige"],
    stock: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await productService.getFeaturedProducts();
        if (response.success && response.data.length > 0) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <>
      <Hero />

      {/* Perks strip */}
      <section
        className="section-padding"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="container-padded">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              {
                icon: "mdi:truck-delivery",
                title: "Free Shipping",
                sub: "On orders over $100",
              },
              {
                icon: "mdi:shield-check",
                title: "Quality Guarantee",
                sub: "Premium materials only",
              },
              {
                icon: "mdi:refresh",
                title: "Easy Returns",
                sub: "30-day return policy",
              },
            ].map(({ icon, title, sub }) => (
              <div
                key={title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1.5rem",
                  borderRadius: "0.75rem",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--divider)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-3px)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 24px -4px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "50%",
                    backgroundColor: "var(--muted-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="text-[var(--foreground)]">
                    <Icon icon={icon} width={22} height={22} />
                  </span>
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: 600,
                      color: "var(--foreground)",
                      fontSize: "0.95rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {title}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--muted)",
                      marginTop: "0.2rem",
                    }}
                  >
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section
        className="section-padding"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="container-padded">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              className="font-serif text-3xl md:text-4xl font-bold"
              style={{ color: "var(--foreground)", marginBottom: "1rem" }}
            >
              Featured Collection
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "var(--muted)",
                maxWidth: "38rem",
                margin: "0 auto",
              }}
            >
              Handpicked premium pieces that define modern elegance
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-900"></div>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </section>
    </>
  );
}
