"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { productService } from "@/services/product.service";
import { Product } from "@/types/product";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const response = await productService.getProductById(id as string);
        if (response.success) {
          setProduct(response.data);
          if (response.data.sizes.length > 0)
            setSelectedSize(response.data.sizes[0]);
          if (response.data.colors.length > 0)
            setSelectedColor(response.data.colors[0]);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Icon
          icon="mdi:alert-circle-outline"
          className="text-[var(--muted)] w-16 h-16"
        />
        <h2 className="text-2xl font-serif font-bold text-[var(--foreground)]">
          Product not found
        </h2>
        <Link href="/shop" className="btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;

  return (
    <div className="container-padded py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-[var(--muted)] mb-8">
        <Link href="/" className="hover:text-[var(--foreground)]">
          Home
        </Link>
        <Icon icon="mdi:chevron-right" />
        <Link href="/shop" className="hover:text-[var(--foreground)]">
          Shop
        </Link>
        <Icon icon="mdi:chevron-right" />
        <span className="text-[var(--foreground)] font-medium truncate">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--surface-alt)] relative group">
            <img
              src={product.images[activeImage] || "/placeholder-product.jpg"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                SALE
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-24 aspect-[4/5] rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === i
                      ? "border-[var(--accent-primary)] scale-95"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${i}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="text-sm font-bold tracking-widest text-[var(--accent-secondary)] uppercase block mb-2">
              {product.brand} | {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--foreground)] mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    icon={i < 4 ? "mdi:star" : "mdi:star-outline"}
                    width={20}
                  />
                ))}
              </div>
              <span className="text-sm text-[var(--muted)] font-medium">
                (120 Reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-bold text-[var(--foreground)]">
                ${currentPrice?.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-[var(--muted)] line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-[var(--muted)] leading-relaxed mb-8">
              {product.description}
            </p>
          </div>

          <div className="space-y-8 mb-10">
            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] mb-4">
                  Select Color:{" "}
                  <span className="text-[var(--muted)] normal-case font-medium">
                    {selectedColor}
                  </span>
                </h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        selectedColor === color
                          ? "border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--background)] shadow-md"
                          : "border-[var(--divider)] text-[var(--foreground)] hover:border-[var(--foreground)]"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
                    Select Size
                  </h3>
                  <button className="text-xs font-bold text-[var(--accent-primary)] hover:underline underline-offset-4">
                    SIZE GUIDE
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center font-bold transition-all ${
                        selectedSize === size
                          ? "border-[var(--accent-primary)] text-[var(--accent-primary)] scale-110 shadow-sm"
                          : "border-[var(--divider)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] mb-4">
                Quantity
              </h3>
              <div className="flex items-center w-32 border border-[var(--divider)] rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[var(--muted-light)] transition-colors"
                >
                  <Icon icon="mdi:minus" />
                </button>
                <div className="flex-1 text-center font-bold text-[var(--foreground)]">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[var(--muted-light)] transition-colors"
                >
                  <Icon icon="mdi:plus" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button
              className="btn-primary flex-1 py-4 flex items-center justify-center gap-3"
              onClick={() => {
                const variant = [selectedColor, selectedSize]
                  .filter(Boolean)
                  .join(" / ");
                addToCart({
                  id: product._id + (variant ? `-${variant}` : ""),
                  name: product.name,
                  price: currentPrice ?? product.price,
                  image: product.images[0] || "",
                  quantity,
                  variant: variant || undefined,
                });
                toast.success(`${product.name} added to bag`);
              }}
            >
              <Icon icon="mdi:shopping-cart" width={22} />
              Add to Bag
            </button>
            <button className="flex-1 btn-outline py-4 flex items-center justify-center gap-3">
              <Icon icon="mdi:heart-outline" width={22} />
              Wishlist
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-10 pt-10 border-t border-[var(--divider)] space-y-4">
            <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
              <Icon
                icon="mdi:truck-fast-outline"
                className="w-5 h-5 text-[var(--accent-primary)]"
              />
              <span>Complimentary shipping on orders over $150</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
              <Icon
                icon="mdi:refresh"
                className="w-5 h-5 text-[var(--accent-primary)]"
              />
              <span>30-day elegant return policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
