"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { WishlistItem } from "@/services/wishlist.service";

export default function WishlistSection() {
  const { items, loading, removeFromWishlist, moveWishlistToCart } =
    useWishlist();
  const { addToCart } = useCart();

  const getProductId = (item: WishlistItem): string =>
    typeof item.productId === "object"
      ? ((item.productId as any)?._id ?? "")
      : item.productId;

  const getField = (item: WishlistItem, field: string): any => {
    // Fields may be on the item directly (flat) or on the populated productId object
    const populated =
      typeof item.productId === "object" ? (item.productId as any) : null;
    return (item as any)[field] ?? populated?.[field];
  };

  const handleMoveToCart = async (item: WishlistItem) => {
    const productId = getProductId(item);
    // Optimistically add to cart locally as well (server handles the move)
    addToCart({
      id: productId,
      name: getField(item, "name") ?? "Product",
      price: getField(item, "discountPrice") || getField(item, "price") || 0,
      image:
        (getField(item, "images") as string[] | undefined)?.[0] ??
        getField(item, "image") ??
        "",
      quantity: 1,
    });
    await moveWishlistToCart(productId);
  };

  const handleRemove = async (item: WishlistItem) => {
    await removeFromWishlist(getProductId(item));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Icon
          icon="mdi:loading"
          className="animate-spin text-[var(--accent-primary)]"
          width={32}
        />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-center animate-fadeIn">
        <div className="space-y-4 opacity-70">
          <div className="flex justify-center">
            <Icon icon="mdi:heart-outline" width={40} className="text-muted" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Your wishlist is empty
          </h2>
          <p className="text-sm text-muted mb-6">
            Save your favourite items here while you shop to easily find them
            later.
          </p>
          <Link
            href="/shop"
            className="btn-outline text-sm px-5 py-2 mt-6 inline-block"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="dash-section-head">
        <h1 className="dash-section-title">My Wishlist</h1>
        <p className="dash-section-sub">
          {items.length} saved {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const productId = getProductId(item);
          const name = getField(item, "name") ?? "Product";
          const price = getField(item, "price") ?? 0;
          const discountPrice = getField(item, "discountPrice");
          const images: string[] = getField(item, "images") ?? [];
          const image =
            images[0] ??
            getField(item, "image") ??
            "https://via.placeholder.com/150?text=Product";
          const displayPrice =
            discountPrice && discountPrice < price ? discountPrice : price;

          return (
            <div key={item._id} className="card overflow-hidden group">
              {/* Image */}
              <div className="aspect-[4/5] bg-[var(--surface-alt)] relative overflow-hidden">
                <Link href={`/product/${productId}`}>
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                {/* Remove button */}
                <button
                  onClick={() => handleRemove(item)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 text-[var(--foreground)] flex items-center justify-center backdrop-blur-md hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                  title="Remove from Wishlist"
                >
                  <Icon icon="mdi:heart-off-outline" width={16} />
                </button>
              </div>

              {/* Details */}
              <div className="p-4">
                <Link href={`/product/${productId}`}>
                  <h3 className="font-semibold text-[var(--foreground)] text-sm mb-1 truncate hover:opacity-70 transition-opacity">
                    {name}
                  </h3>
                </Link>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-[var(--foreground)] font-bold">
                    ₹{displayPrice?.toFixed(2)}
                  </span>
                  {discountPrice && discountPrice < price && (
                    <span className="text-[var(--muted)] text-sm line-through">
                      ₹{price?.toFixed(2)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleMoveToCart(item)}
                  className="btn-primary w-full justify-center py-2 text-sm cursor-pointer"
                >
                  <Icon icon="mdi:cart-outline" width={16} className="mr-1" />
                  Move to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
