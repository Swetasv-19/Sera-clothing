"use client";

import { useEffect, useState, useRef } from "react";
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

  // Ref for the carousel scroll container
  const carouselRef = useRef<HTMLDivElement>(null);

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
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-[var(--accent-primary)]"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 bg-[var(--background)] px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--surface-alt)] flex items-center justify-center text-[var(--muted)]">
          <Icon icon="mdi:hanger" className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-[var(--foreground)] tracking-tight mb-2">
            Product Not Found
          </h2>
          <p className="text-[var(--muted)] text-sm max-w-sm mx-auto">
            The item you are looking for might have been removed or is
            temporarily unavailable.
          </p>
        </div>
        <Link
          href="/shop"
          className="btn-primary px-8 py-3 rounded-xl uppercase tracking-widest text-[11px] font-bold shadow-sm hover:shadow-md transition-all mt-4"
        >
          Return to Boutique
        </Link>
      </div>
    );
  }

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;

  const handleAddToCart = () => {
    const variant = [selectedColor, selectedSize].filter(Boolean).join(" / ");
    addToCart({
      id: product._id + (variant ? `-${variant}` : ""),
      name: product.name,
      price: currentPrice ?? product.price,
      image: product.images[0] || "",
      quantity,
      variant: variant || undefined,
    });

    toast.success("Added to your bag", {
      style: {
        background: "var(--surface)",
        color: "var(--foreground)",
        border: "1px solid var(--card-border)",
        borderRadius: "0.75rem",
        fontSize: "14px",
        fontWeight: "600",
      },
      iconTheme: {
        primary: "var(--accent-primary)",
        secondary: "var(--surface)",
      },
    });
  };

  const handlePrevImage = () => {
    setActiveImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setActiveImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1,
    );
  };

  // Tailwind maps for color swatches
  const getColorClass = (colorName: string) => {
    const map: Record<string, string> = {
      black: "bg-black",
      white: "bg-white border border-gray-300",
      red: "bg-red-600",
      blue: "bg-blue-600",
      green: "bg-green-600",
      navy: "bg-slate-800",
      gray: "bg-gray-400",
      beige: "bg-[#eaddcf]",
      olive: "bg-[#556b2f]",
      brown: "bg-[#8b4513]",
      pink: "bg-pink-300",
      yellow: "bg-yellow-400",
    };
    return (
      map[colorName.toLowerCase()] ||
      "bg-[var(--surface-alt)] border border-[var(--card-border)]"
    );
  };

  return (
    <div className="bg-[var(--background)] min-h-screen pb-24 lg:pb-16 relative">
      <div className="container-padded py-6 lg:py-12">
        {/* Breadcrumb Navigation - Simplified */}
        <nav className="flex items-center gap-2 text-xs text-[var(--muted)] font-medium tracking-wide uppercase mb-10">
          <Link
            href="/"
            className="hover:text-[var(--accent-primary)] transition-colors"
          >
            Home
          </Link>
          <span className="opacity-50">/</span>
          <Link
            href="/shop"
            className="hover:text-[var(--accent-primary)] transition-colors"
          >
            Shop
          </Link>
          <span className="opacity-50">/</span>
          <Link
            href={`/shop?category=${product.category.toLowerCase()}`}
            className="hover:text-[var(--accent-primary)] transition-colors"
          >
            {product.category}
          </Link>
        </nav>

        {/* Main Product Layout */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-10 xl:gap-20">
          {/* Left: Image Carousel (Takes up 45% on desktop) */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-32 flex flex-col gap-4">
            {/* Main Image Viewport */}
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[var(--surface-alt)] shadow-sm group">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.name} - View ${i + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                    i === activeImage ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                />
              ))}

              {hasDiscount && (
                <div className="absolute top-5 left-5 bg-[var(--foreground)] text-[var(--background)] px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold z-20 shadow-md">
                  Sale
                </div>
              )}

              {/* Carousel Arrows (Hover only on Desktop, visible on Mobile) */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm shadow-md flex items-center justify-center text-[var(--foreground)] opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    aria-label="Previous image"
                  >
                    <Icon icon="mdi:chevron-left" className="text-2xl" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm shadow-md flex items-center justify-center text-[var(--foreground)] opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    aria-label="Next image"
                  >
                    <Icon icon="mdi:chevron-right" className="text-2xl" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Scroll */}
            {product.images.length > 1 && (
              <div
                ref={carouselRef}
                className="flex gap-3 overflow-x-auto pb-2 scrollbar-none scroll-smooth items-center justify-start snap-x"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-[4.5rem] aspect-[3/4] rounded-xl overflow-hidden flex-shrink-0 cursor-pointer snap-start transition-all duration-300 ${
                      activeImage === i
                        ? "ring-2 ring-[var(--accent-primary)] ring-offset-2 ring-offset-[var(--background)] opacity-100"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details (Takes up 55% on desktop) */}
          <div className="w-full lg:w-[55%] flex flex-col justify-start">
            {/* Header Section */}
            <div className="mb-14">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--muted)] uppercase block mb-4">
                {product.brand}
              </span>
              <h1 className="text-3xl md:text-[2.5rem] font-serif font-medium text-[var(--foreground)] mb-6 leading-tight tracking-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-0.5 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      icon={i < 4 ? "mdi:star" : "mdi:star-outline"}
                      className="text-[17px]"
                    />
                  ))}
                </div>
                <span className="text-[13px] text-[var(--muted)] font-medium border-b border-[var(--muted)]/40 hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors cursor-pointer pb-0.5">
                  128 Reviews
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">
                  ₹
                  {currentPrice?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-[var(--muted)] line-through decoration-1">
                    ₹
                    {product.price.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--muted)] mt-3 uppercase tracking-wide">
                Inclusive of all taxes
              </p>
            </div>

            {/* Description */}
            <div className="mb-14 pr-0 lg:pr-10">
              <p className="text-[14px] leading-[1.8] text-[var(--foreground)]/80 font-normal">
                {product.description}
              </p>
            </div>

            <hr className="border-[var(--card-border)] mb-14 w-full lg:max-w-xl" />

            {/* Options Section */}
            <div className="space-y-12 mb-16">
              {/* Colors */}
              {product.colors.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--foreground)]">
                      Color:
                    </h3>
                    <span className="text-[13px] text-[var(--muted)] capitalize">
                      {selectedColor}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-8 h-8 rounded-full shadow-sm transition-all focus:outline-none ${getColorClass(color)} ${
                          selectedColor === color
                            ? "ring-[2.5px] ring-[var(--accent-primary)] ring-offset-4 ring-offset-[var(--background)] scale-110"
                            : "hover:scale-110"
                        }`}
                        title={color}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6 w-full lg:max-w-xl">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--foreground)]">
                      Size:
                    </h3>
                    <button className="text-[11px] font-bold text-[var(--foreground)] uppercase tracking-widest border-b border-[var(--foreground)] pb-0.5 transition-opacity hover:opacity-70">
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 w-full lg:max-w-xl">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[4.5rem] h-12 rounded-xl flex items-center justify-center font-semibold text-[13px] tracking-widest transition-all duration-200 select-none ${
                          selectedSize === size
                            ? "border-[2px] border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)] shadow-md shadow-black/10"
                            : "border border-[var(--card-border)] bg-transparent text-[var(--foreground)] hover:border-[var(--foreground)]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Purchase Desktop (Visible only on lg+) */}
            <div className="hidden lg:flex flex-col gap-5 w-full max-w-xl">
              <div className="flex items-stretch gap-4">
                {/* Quantity */}
                <div className="flex items-center w-[120px] rounded-2xl bg-[var(--surface-alt)] p-1 border border-[var(--card-border)]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-colors rounded-xl"
                  >
                    <Icon icon="mdi:minus" />
                  </button>
                  <div className="flex-1 text-center font-bold text-[14px] text-[var(--foreground)]">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-colors rounded-xl"
                  >
                    <Icon icon="mdi:plus" />
                  </button>
                </div>

                {/* Add to Bag CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 h-12 rounded-2xl bg-[var(--foreground)] text-[var(--background)] font-bold tracking-[0.1em] uppercase text-[12px] shadow-lg shadow-black/5 hover:shadow-black/10 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon icon="mdi:shopping-outline" className="text-lg" />
                  {product.stock <= 0 ? "Out of Stock" : "Add to Bag"}
                </button>

                {/* Wishlist */}
                <button className="w-12 h-12 rounded-2xl flex items-center justify-center border border-[var(--card-border)] bg-[var(--surface-alt)] text-[var(--foreground)] hover:bg-[var(--surface)] hover:border-[var(--muted)] transition-all">
                  <Icon icon="mdi:heart-outline" className="text-xl" />
                </button>
              </div>

              {/* Stock info */}
              <div className="flex items-center gap-2 text-[12px] pt-1">
                {product.stock > 0 ? (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[var(--muted)] font-medium">
                      In Stock
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                    <span className="text-[var(--muted)] font-medium">
                      Sold Out
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Elegant Accents / Info (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col gap-4 mt-16 bg-[var(--surface-alt)]/50 p-8 rounded-2xl border border-[var(--card-border)] w-full max-w-xl">
              <div className="flex items-start gap-5 text-[13px] text-[var(--foreground)]/80">
                <Icon
                  icon="mdi:truck-outline"
                  className="w-6 h-6 mt-0.5 opacity-70"
                />
                <div>
                  <strong className="block font-semibold mb-0.5 text-[var(--foreground)]">
                    Complimentary Shipping & Returns
                  </strong>
                  <span className="text-[var(--muted)]">
                    On all orders over ₹1,500. Expected delivery within 3-5
                    business days.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-[var(--background)]/90 backdrop-blur-md border-t border-[var(--card-border)] z-50 transform safe-area-pb">
        <div className="flex items-center gap-3 w-full max-w-md mx-auto">
          {/* Mobile Quantity */}
          <div className="flex h-12 items-center rounded-xl bg-[var(--surface-alt)] border border-[var(--card-border)] px-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-full flex items-center justify-center text-[var(--muted)] focus:outline-none"
            >
              <Icon icon="mdi:minus" className="text-sm" />
            </button>
            <div className="w-6 text-center font-bold text-[13px]">
              {quantity}
            </div>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-full flex items-center justify-center text-[var(--muted)] focus:outline-none"
            >
              <Icon icon="mdi:plus" className="text-sm" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="flex-1 h-12 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-bold tracking-[0.1em] uppercase text-[11px] shadow-lg shadow-black/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {product.stock <= 0 ? "Sold Out" : "Add to Bag"}
          </button>

          <button className="w-12 h-12 rounded-xl flex items-center justify-center border border-[var(--card-border)] bg-[var(--surface-alt)] text-[var(--foreground)] shrink-0">
            <Icon icon="mdi:heart-outline" className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
