"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import api from "@/lib/axios";
import ProductModal from "./ProductModal";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(
        `/products?search=${searchTerm}&page=${page}&limit=10`,
      );
      setProducts(data.data);
      setTotalPages(data.pages);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="margin-top padding-around bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] shadow-sm overflow-hidden transition-colors duration-300 block">
      <div className="p-6 border-b border-[var(--card-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="margin-bottom-s relative flex-1 max-w-md group">
          <Icon
            icon="material-symbols:search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--accent-primary)] transition-colors"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-box padding-around-s w-full pl-10 pr-4 py-2 bg-[var(--surface-alt)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all text-[var(--foreground)]"
          />
        </div>

        <button
          onClick={handleAdd}
          className="margin-bottom-s padding-around-s flex items-center gap-2 px-5 py-2 text-sm font-semibold text-gray-300 bg-transparent border border-[var(--card-border)] hover:border-gray-500 hover:text-white rounded-md transition-all duration-200"
        >
          <Icon
            icon="material-symbols:add"
            className="text-[18px] opacity-80"
          />
          <span>Add Product</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[var(--surface)]">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--card-border)]">
                Product
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--card-border)]">
                Category
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--card-border)]">
                Price
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--card-border)]">
                Stock
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--card-border)]">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider text-right border-b border-[var(--card-border)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--card-border)]">
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-6">
                    <div className="h-6 bg-[var(--surface-alt)] rounded w-full" />
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-[var(--muted)] font-medium"
                >
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product: any) => (
                <tr
                  key={product._id}
                  className="group hover:bg-[var(--surface-alt)] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-[var(--surface-alt)] flex-shrink-0 overflow-hidden border border-[var(--card-border)]">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--muted)]">
                            <Icon
                              icon="material-symbols:image-outline"
                              className="text-xl"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[var(--foreground)] leading-tight transition-colors">
                          {product.name}
                        </span>
                        <span className="text-xs text-[var(--muted)] uppercase tracking-tighter">
                          SKU: {product.sku || "N/A"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="padding-around-s px-2.5 py-1 rounded-lg bg-[var(--surface-alt)] text-[var(--foreground)] text-[10px] font-bold uppercase tracking-wider border border-[var(--card-border)]">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[var(--foreground)]">
                    ₹{product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-semibold ${product.stock < 10 ? "text-rose-500" : "text-[var(--muted)]"}`}
                    >
                      {product.stock} pcs
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2 h-2 rounded-full ${product.isActive ? "bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)]" : "bg-[var(--muted-light)]"}`}
                      />
                      <span className="text-xs font-semibold text-[var(--muted)] capitalize">
                        {product.isActive ? "Active" : "Archived"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-gray-300 hover:bg-white/10 hover:text-white rounded-md transition-all duration-200 ease-in-out group"
                        title="Edit"
                      >
                        <Icon
                          icon="material-symbols:edit-outline"
                          className="text-xl shrink-0 w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity duration-200"
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md transition-all duration-200 ease-in-out group"
                        title="Delete"
                      >
                        <Icon
                          icon="material-symbols:delete-outline"
                          className="text-xl shrink-0 w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity duration-200"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="p-6 border-t border-[var(--card-border)] flex items-center justify-between bg-[var(--card-bg)]">
          <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 text-gray-300 hover:bg-white/10 hover:text-white rounded-md transition-all duration-200 ease-in-out disabled:opacity-30 group"
            >
              <Icon
                icon="material-symbols:chevron-left"
                className="text-2xl shrink-0 w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity duration-200"
              />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 text-gray-300 hover:bg-white/10 hover:text-white rounded-md transition-all duration-200 ease-in-out disabled:opacity-30 group"
            >
              <Icon
                icon="material-symbols:chevron-right"
                className="text-2xl shrink-0 w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity duration-200"
              />
            </button>
          </div>
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProducts}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductTable;
