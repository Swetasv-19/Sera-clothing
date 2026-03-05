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

const ProductModal = ({
  isOpen,
  onClose,
  onSuccess,
  product,
}: ProductModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "men",
    stock: "",
    images: [] as string[],
    isFeatured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageInput, setImageInput] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "men",
        stock: product.stock || "",
        images: product.images || [],
        isFeatured: product.isFeatured || false,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "men",
        stock: "",
        images: [],
        isFeatured: false,
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (product) {
        await api.put(`/products/${product._id}`, formData);
      } else {
        await api.post("/products", formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving product:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageInput.trim()],
      });
      setImageInput("");
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-all"
          >
            <Icon icon="material-symbols:close" className="text-2xl" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
                Product Name
              </label>
              <input
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
                placeholder="e.g. Classic White Tee"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
                Category
              </label>
              <select
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium appearance-none"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
                <option value="accessories">Accessories</option>
                <option value="sale">Sale</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
              Description
            </label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
              placeholder="Detailed product description..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
                Price (₹)
              </label>
              <input
                required
                type="number"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium font-mono"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
                Stock Quantity
              </label>
              <input
                required
                type="number"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
                placeholder="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
              Product Images
            </label>
            <div className="flex space-x-2">
              <input
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
                placeholder="Enter image URL..."
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
              />
              <button
                type="button"
                onClick={addImage}
                className="px-6 py-3 bg-gray-100 text-gray-900 font-bold rounded-2xl hover:bg-gray-200 transition-all text-sm"
              >
                Add
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4">
              {formData.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group"
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon icon="material-symbols:close" className="text-lg" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl mt-4">
            <input
              type="checkbox"
              id="isFeatured"
              className="w-5 h-5 rounded-lg accent-black cursor-pointer"
              checked={formData.isFeatured}
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: e.target.checked })
              }
            />
            <label
              htmlFor="isFeatured"
              className="text-sm font-bold text-gray-700 cursor-pointer"
            >
              Mark as Featured Product
            </label>
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end space-x-4 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-black transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-10 py-3 bg-black text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:bg-gray-400 flex items-center space-x-2"
          >
            {isSubmitting ? (
              <Icon icon="svg-spinners:180-ring-with-bg" className="text-xl" />
            ) : null}
            <span>{product ? "Save Changes" : "Create Product"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
