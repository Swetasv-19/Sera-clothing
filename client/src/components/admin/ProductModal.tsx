"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import api from "@/lib/axios";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSuccess,
  product,
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "men",
    stock: "",
    sku: "",
    brand: "Sera",
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        discountPrice: product.discountPrice || "",
        category: product.category || "men",
        stock: product.stock || "",
        sku: product.sku || "",
        brand: product.brand || "Sera",
        isActive: product.isActive !== undefined ? product.isActive : true,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        category: "men",
        stock: "",
        sku: "",
        brand: "Sera",
        isActive: true,
      });
    }
    setError("");
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (product?._id) {
        await api.put(`/products/${product._id}`, formData);
      } else {
        await api.post("/products", formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to save product.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-all duration-300 ease-out">
      <div
        className="w-full max-w-2xl bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between padding-around border-b border-[var(--card-border)] bg-[var(--surface-alt)]">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-xs text-[var(--muted)] mt-1 font-medium">
              {product
                ? "Make changes to your product here."
                : "Fill in the details for your new product."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          >
            <Icon icon="material-symbols:close" className="text-2xl" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto padding-around scrollbar-hide bg-[var(--surface)]">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="padding-around rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center gap-2">
                <Icon
                  icon="material-symbols:error-outline"
                  className="text-lg"
                />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full padding-around bg-[var(--surface-alt)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all placeholder:text-[var(--muted)]/50 font-medium"
                  placeholder="e.g. Premium Cotton T-Shirt"
                />
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full padding-around bg-[var(--surface-alt)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all placeholder:text-[var(--muted)]/50 font-medium resize-none leading-relaxed"
                  placeholder="Describe your product here..."
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Price (₹)
                </label>
                <div className="relative">
                  <Icon
                    icon="material-symbols:payments-outline"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full padding-around pl-12 bg-[var(--surface-alt)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all placeholder:text-[var(--muted)]/50 font-medium"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Discount Price */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Discount Price (₹)
                </label>
                <div className="relative">
                  <Icon
                    icon="material-symbols:local-offer-outline"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />
                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    min="0"
                    className="w-full padding-around pl-12 bg-[var(--surface-alt)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all placeholder:text-[var(--muted)]/50 font-medium"
                    placeholder="0.00 (Optional)"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full padding-around pr-12 bg-[var(--surface-alt)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all appearance-none cursor-pointer font-medium"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="accessories">Accessories</option>
                    <option value="sale">Sale</option>
                  </select>
                  <Icon
                    icon="material-symbols:keyboard-arrow-down"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none text-xl"
                  />
                </div>
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Stock
                </label>
                <div className="relative">
                  <Icon
                    icon="material-symbols:inventory-2-outline"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full padding-around pl-12 bg-[var(--surface-alt)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all placeholder:text-[var(--muted)]/50 font-medium"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* SKU */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
                  SKU
                </label>
                <div className="relative">
                  <Icon
                    icon="material-symbols:barcode"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full padding-around pl-12 bg-[var(--surface-alt)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all placeholder:text-[var(--muted)]/50 font-medium uppercase"
                    placeholder="Enter SKU"
                  />
                </div>
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Brand
                </label>
                <div className="relative">
                  <Icon
                    icon="material-symbols:branding-watermark-outline"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full padding-around pl-12 bg-[var(--surface-alt)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all placeholder:text-[var(--muted)]/50 font-medium"
                    placeholder="e.g. Sera"
                  />
                </div>
              </div>

              {/* Is Active Toggle */}
              <div className="md:col-span-2 flex items-center gap-3 p-4 bg-[var(--surface-alt)] rounded-xl border border-[var(--card-border)] shrink-0">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[var(--foreground)]">
                    Product Status
                  </h4>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    Toggle whether this product is visible to customers
                  </p>
                </div>
                <label className="inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 shrink-0 bg-[var(--muted)]/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--accent-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--card-border)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                  <span className="ml-3 text-sm font-bold w-12 text-left text-[var(--foreground)] whitespace-nowrap">
                    {formData.isActive ? "Active" : "Hidden"}
                  </span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="padding-around border-t border-[var(--card-border)] bg-[var(--surface-alt)] flex justify-end items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-[var(--foreground)] bg-transparent hover:bg-[var(--surface)] border border-[var(--card-border)] rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 rounded-xl shadow-lg shadow-[var(--accent-primary)]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Icon icon="line-md:loading-twotone-loop" className="text-xl" />
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Icon
                  icon="material-symbols:save-outline"
                  className="text-lg"
                />
                <span>Save Product</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
