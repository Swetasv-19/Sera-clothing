"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { productService } from "@/services/product.service";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { Icon } from "@iconify/react";
import RelatedProducts from "@/components/product/RelatedProducts";
import WishlistButton from "@/components/WishlistButton";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);
  const [customisationSelected, setCustomisationSelected] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await productService.getProductById(id);
        if (res.success && res.data) {
          setProduct(res.data);
          if (res.data.sizes && res.data.sizes.length > 0) {
            setSelectedSize(res.data.sizes[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-(--background)">
        <div className="w-12 h-12 border-t-2 border-(--accent-primary) rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 bg-(--background)">
        <h2 className="text-2xl font-serif text-(--foreground)">
          Product not found
        </h2>
        <button
          onClick={() => router.push("/shop")}
          className="px-6 py-2 bg-(--foreground) text-(--background) rounded-full font-bold transition-all hover:opacity-90"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const images =
    product.images?.length > 0 ? product.images : ["/placeholder.jpg"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const activePrice =
    customisationSelected && product.customisationPrice
      ? product.customisationPrice
      : product.discountPrice || product.price;

  const handleAddToCart = () => {
    addToCart({
      id: `${product._id}-${selectedSize || "nosize"}${customisationSelected ? "-custom" : ""}`,
      name: customisationSelected
        ? `${product.name} (Customised)`
        : product.name,
      price: activePrice,
      image: images[0],
      quantity: 1,
      variant: selectedSize || undefined,
      ...(customisationSelected && customImage ? { customImage } : {}),
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  return (
    <div className="w-full bg-(--background) animate-fadeIn">
      <div className="h-screen w-full p-4 sm:p-6 lg:p-8 flex items-center justify-center overflow-hidden">
        {/* Invisible centered card */}
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12 bg-transparent">
          {/* Left side: Image carousel */}
          <div className="w-full md:w-[300px] flex-shrink-0 flex flex-col justify-center gap-6 h-[50vh] md:h-full">
            <div className="relative w-full h-[300px] min-h-[300px] overflow-hidden rounded-2xl bg-(--surface)">
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="object-cover w-full h-full transition-opacity duration-300"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-sm"
                  >
                    <Icon icon="mdi:chevron-left" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-sm"
                  >
                    <Icon icon="mdi:chevron-right" className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Sale Badge */}
              {product.discountPrice &&
                product.discountPrice < product.price && (
                  <div className="absolute top-4 right-4 bg-(--foreground) text-(--background) px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                    Sale
                  </div>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none flex-shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-16 aspect-square flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      currentImageIndex === idx
                        ? "border-(--foreground)"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right side: Product details */}
          <div className="w-full md:w-1/2 flex flex-col justify-center py-2 max-h-[85vh] overflow-y-auto scrollbar-none">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-(--foreground) font-bold mb-3 tracking-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon
                    key={star}
                    icon="mdi:star"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                ))}
              </div>
              <span className="text-(--muted) text-sm sm:text-base font-medium mt-0.5">
                (4.5/5)
              </span>
            </div>

            {/* Description */}
            <p className="text-(--foreground) text-base sm:text-lg mb-8 leading-relaxed max-w-prose opacity-80">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-end gap-4 mb-8">
              <span className="text-3xl sm:text-4xl font-bold text-(--foreground)">
                ₹{activePrice}
              </span>
              {!customisationSelected &&
                product.discountPrice &&
                product.discountPrice < product.price && (
                  <span className="text-xl sm:text-2xl text-(--muted) line-through mb-1">
                    ₹{product.price}
                  </span>
                )}
              {customisationSelected && (
                <span className="text-sm font-semibold text-(--muted) mb-1">
                  Customised
                </span>
              )}
            </div>

            {/* Standard / Customised Selector */}
            {product.isCustomisable && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-(--foreground) uppercase tracking-widest mb-4 opacity-80">
                  Choose Option
                </h3>
                <div className="flex rounded-xl overflow-hidden border-2 border-(--divider)">
                  <button
                    onClick={() => {
                      setCustomisationSelected(false);
                      if (customImage) URL.revokeObjectURL(customImage);
                      setCustomImage(null);
                      setCustomImageFile(null);
                    }}
                    className={`flex-1 py-3 px-4 text-sm font-bold transition-all cursor-pointer ${
                      !customisationSelected
                        ? "bg-(--foreground) text-(--background)"
                        : "bg-transparent text-(--foreground) hover:bg-(--surface)"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span>Standard</span>
                      <span className="text-xs font-semibold opacity-70">
                        ₹{product.discountPrice || product.price}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => setCustomisationSelected(true)}
                    className={`flex-1 py-3 px-4 text-sm font-bold transition-all cursor-pointer border-l-2 border-(--divider) ${
                      customisationSelected
                        ? "bg-(--foreground) text-(--background)"
                        : "bg-transparent text-(--foreground) hover:bg-(--surface)"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span>Customised</span>
                      <span className="text-xs font-semibold opacity-70">
                        ₹
                        {product.customisationPrice ||
                          product.discountPrice ||
                          product.price}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            <div className="w-full h-px bg-(--divider) mb-8" />

            {/* Colors available (Text only) */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-(--foreground) uppercase tracking-widest mb-2 opacity-80">
                  Available Colors
                </h3>
                <p className="text-(--foreground) text-lg capitalize font-medium">
                  {product.colors.join(", ")}
                </p>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-12">
                <h3 className="text-sm font-bold text-(--foreground) uppercase tracking-widest mb-4 opacity-80">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-16 sm:min-w-20 h-12 px-5 rounded-xl font-bold transition-all border-2 cursor-pointer ${
                        selectedSize === size
                          ? "bg-(--foreground) border-(--foreground) text-(--background) shadow-lg scale-105"
                          : "bg-transparent border-(--divider) text-(--foreground) hover:border-(--foreground)"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customisation Upload */}
            {product.isCustomisable && customisationSelected && (
              <div className="mb-12">
                <h3 className="text-sm font-bold text-(--foreground) uppercase tracking-widest mb-4 opacity-80 flex items-center gap-2">
                  <Icon icon="mdi:palette-outline" className="w-5 h-5" />
                  Customise Your Design
                </h3>
                {!customImage ? (
                  <label
                    htmlFor="custom-image-upload"
                    className="flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed border-(--divider) hover:border-(--foreground) bg-(--surface)/50 cursor-pointer transition-all duration-300 group"
                  >
                    <Icon
                      icon="mdi:cloud-upload-outline"
                      className="w-10 h-10 text-(--muted) group-hover:text-(--foreground) transition-colors mb-2"
                    />
                    <span className="text-sm font-semibold text-(--muted) group-hover:text-(--foreground) transition-colors">
                      Click to upload your image
                    </span>
                    <span className="text-xs text-(--muted) mt-1 opacity-60">
                      PNG, JPG up to 5MB
                    </span>
                    <input
                      id="custom-image-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert("File size must be under 5MB");
                            return;
                          }
                          setCustomImageFile(file);
                          setCustomImage(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                ) : (
                  <div className="relative w-full flex items-center gap-4 p-4 rounded-2xl bg-(--surface)/50 border border-(--divider)">
                    <div className="w-28 h-28 rounded-xl overflow-hidden border border-(--divider) flex-shrink-0">
                      <img
                        src={customImage}
                        alt="Your custom design"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-(--foreground)">
                        {customImageFile?.name}
                      </p>
                      <p className="text-xs text-(--muted) mt-0.5">
                        {customImageFile &&
                          (customImageFile.size / 1024).toFixed(1)}{" "}
                        KB
                      </p>
                      <button
                        onClick={() => {
                          if (customImage) URL.revokeObjectURL(customImage);
                          setCustomImage(null);
                          setCustomImageFile(null);
                        }}
                        className="mt-3 flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Icon
                          icon="mdi:trash-can-outline"
                          className="w-4 h-4"
                        />
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button
                onClick={handleAddToCart}
                className="flex-1 h-16 rounded-full bg-(--surface) border-2 border-(--foreground) text-(--foreground) font-bold text-lg hover:bg-(--foreground) hover:text-(--background) transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md cursor-pointer"
              >
                <Icon icon="mdi:cart-outline" className="w-6 h-6" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 h-16 rounded-full bg-(--foreground) border-2 border-(--foreground) text-(--background) font-bold text-lg hover:bg-transparent hover:text-(--foreground) transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                Buy Now
              </button>
              <WishlistButton
                productId={product._id}
                size="lg"
                className="flex-shrink-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <RelatedProducts
        category={product.category}
        currentProductId={product._id}
      />
    </div>
  );
}
