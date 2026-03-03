"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <div
      className="card"
      style={{ overflow: "hidden" }}
    >
      {/* Image area */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <Link href={`/product/${product._id}`} style={{ display: "block" }}>
          <div
            style={{
              aspectRatio: "1 / 1",
              overflow: "hidden",
              backgroundColor: "var(--surface-alt)",
            }}
          >
            <img
              src={product.images[0] || "/placeholder-product.jpg"}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease",
                display: "block",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")
              }
            />
          </div>

          {/* Badges */}
          {product.isFeatured && (
            <span
              style={{
                position: "absolute",
                top: "0.75rem",
                left: "0.75rem",
                backgroundColor: "var(--accent-secondary)",
                color: "#FFF3E6",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "0.25rem 0.6rem",
                borderRadius: "9999px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              FEATURED
            </span>
          )}
          {hasDiscount && (
            <span
              style={{
                position: "absolute",
                top: "0.75rem",
                right: "0.75rem",
                backgroundColor: "#dc2626",
                color: "#fff",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "0.25rem 0.6rem",
                borderRadius: "9999px",
              }}
            >
              -{discountPercentage}%
            </span>
          )}
        </Link>

        {/* Quick actions overlay */}
        <div
          className="quick-actions"
          style={{
            position: "absolute",
            bottom: "0.75rem",
            left: "0.75rem",
            right: "0.75rem",
            display: "flex",
            gap: "0.5rem",
            opacity: 0,
            transition: "opacity 0.25s ease",
          }}
        >
          <Link
            href={`/product/${product._id}`}
            style={{
              flex: 1,
              padding: "0.5rem 0.5rem",
              borderRadius: "0.5rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              backgroundColor: "var(--accent-primary)",
              color: "var(--background)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              transition: "opacity 0.2s",
              textDecoration: "none"
            }}
          >
            <Icon icon="mdi:eye" width={15} height={15} />
            View
          </Link>
          <button
            style={{
              flex: 1,
              padding: "0.5rem 0.5rem",
              borderRadius: "0.5rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              backgroundColor: "var(--accent-secondary)",
              color: "#FFF3E6",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
            }}
          >
            <Icon icon="mdi:shopping-cart" width={15} height={15} />
            Add
          </button>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "1rem" }}>
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--muted)",
            display: "block",
            marginBottom: "0.35rem",
          }}
        >
          {product.brand} | {product.category}
        </span>

        <Link href={`/product/${product._id}`} style={{ textDecoration: "none" }}>
          <h3
            className="font-serif"
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--foreground)",
              marginBottom: "0.65rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "0.7")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "1")
            }
          >
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
            <span
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--foreground)",
              }}
            >
              ${currentPrice?.toFixed(2)}
            </span>
            {hasDiscount && (
              <span
                style={{
                  fontSize: "0.85rem",
                  textDecoration: "line-through",
                  color: "var(--muted)",
                }}
              >
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            aria-label="Wishlist"
            style={{
              padding: "0.4rem",
              borderRadius: "0.4rem",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--muted)",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--accent-secondary)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--muted)")
            }
          >
            <Icon icon="mdi:heart-outline" width={20} height={20} />
          </button>
        </div>

        {/* Stars */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            marginTop: "0.6rem",
          }}
        >
          {[...Array(5)].map((_, i) => (
            <Icon
              key={i}
              icon={i < 4 ? "mdi:star" : "mdi:star-outline"}
              width={13}
              height={13}
              style={{ color: i < 4 ? "#eab308" : "var(--muted-light)" }}
            />
          ))}
          <span style={{ fontSize: "0.75rem", color: "var(--muted)", marginLeft: "0.25rem" }}>
            (4.0)
          </span>
        </div>
      </div>

      {/* Hover style for quick actions — injected via global styles */}
      <style>{`
        .card:hover .quick-actions { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
