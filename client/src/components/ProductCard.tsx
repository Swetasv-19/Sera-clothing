"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { Product } from "../types/product";
import { useCart } from "@/context/CartContext";
import WishlistButton from "@/components/WishlistButton";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const currentPrice = hasDiscount
    ? (product.discountPrice ?? product.price)
    : product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) / product.price) * 100,
      )
    : 0;

  // Calculate if product is new (created within last 30 days)
  const isNew = (() => {
    if (!product.createdAt) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(product.createdAt) > thirtyDaysAgo;
  })();

  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;

    addToCart({
      id: product._id, // By default we use the base product ID, if variants are implemented later we might append them
      name: product.name,
      price: currentPrice,
      image: product.images[0] || "/placeholder-product.jpg",
      quantity: 1,
    });

    // Show a success toast notification
    toast.success(`${product.name} added to cart`, {
      style: {
        background: "var(--surface)",
        color: "var(--foreground)",
        border: "1px solid var(--divider)",
      },
      iconTheme: {
        primary: "var(--accent-primary)",
        secondary: "var(--surface)",
      },
    });
  };

  return (
    <div className="card" style={{ overflow: "hidden" }}>
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
                ((e.currentTarget as HTMLImageElement).style.transform =
                  "scale(1.08)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLImageElement).style.transform =
                  "scale(1)")
              }
            />
          </div>

          {/* Badges Container */}
          <div
            style={{
              position: "absolute",
              top: "0.75rem",
              left: "0.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              alignItems: "flex-start",
            }}
          >
            {product.isFeatured && (
              <span
                style={{
                  backgroundColor: "var(--accent-secondary)",
                  color: "#FFF3E6",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  padding: "0.25rem 0.6rem",
                  borderRadius: "9999px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                FEATURED
              </span>
            )}

            {isNew && (
              <span
                style={{
                  backgroundColor: "var(--foreground)",
                  color: "var(--background)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  padding: "0.25rem 0.6rem",
                  borderRadius: "9999px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                NEW
              </span>
            )}
          </div>

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

        {/* Wishlist button — outside Link so it doesn't navigate */}
        <div
          style={{
            position: "absolute",
            bottom: "0.75rem",
            right: "0.75rem",
            zIndex: 3,
          }}
        >
          <WishlistButton productId={product._id} size="sm" variant="default" />
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

        <Link
          href={`/product/${product._id}`}
          style={{ textDecoration: "none" }}
        >
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
          <div
            style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}
          >
            <span
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--foreground)",
              }}
            >
              ₹{currentPrice?.toFixed(2)}
            </span>
            {hasDiscount && (
              <span
                style={{
                  fontSize: "0.85rem",
                  textDecoration: "line-through",
                  color: "var(--muted)",
                }}
              >
                ₹{product.price.toFixed(2)}
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
              ((e.currentTarget as HTMLElement).style.color =
                "var(--accent-secondary)")
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
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--muted)",
              marginLeft: "0.25rem",
            }}
          >
            (4.0)
          </span>
        </div>

        {/* Add to Cart Button (Always Visible) */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          style={{
            width: "100%",
            marginTop: "1.2rem",
            padding: "0.65rem 0.5rem",
            borderRadius: "0.5rem",
            fontSize: "0.85rem",
            fontWeight: 600,
            backgroundColor: isOutOfStock ? "var(--surface)" : "transparent",
            color: isOutOfStock ? "var(--muted)" : "var(--foreground)",
            border: "1px solid transparent",
            cursor: isOutOfStock ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
            transition: "border-color 0.2s ease, transform 0.1s ease",
            opacity: isOutOfStock ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (isOutOfStock) return;
            (e.currentTarget as HTMLElement).style.borderColor =
              "var(--divider)";
            (e.currentTarget as HTMLElement).style.transform =
              "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            if (isOutOfStock) return;
            (e.currentTarget as HTMLElement).style.borderColor = "transparent";
            (e.currentTarget as HTMLElement).style.transform = "none";
          }}
        >
          <Icon icon="mdi:shopping-cart-outline" width={18} height={18} />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
