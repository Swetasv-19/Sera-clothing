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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md group">
          <Icon
            icon="material-symbols:search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
          />
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-100"
        >
          <Icon icon="material-symbols:add" className="text-xl" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-8">
                    <div className="h-6 bg-gray-100 rounded-lg w-full" />
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-400 font-medium"
                >
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product: any) => (
                <tr
                  key={product._id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Icon
                              icon="material-symbols:image-outline"
                              className="text-xl"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 leading-tight group-hover:text-black transition-colors">
                          {product.name}
                        </span>
                        <span className="text-xs text-gray-400 uppercase tracking-tighter">
                          SKU: {product.sku || "N/A"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider border border-gray-200/50">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-semibold ${product.stock < 10 ? "text-rose-500" : "text-gray-600"}`}
                    >
                      {product.stock} pcs
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2 h-2 rounded-full ${product.isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-gray-300"}`}
                      />
                      <span className="text-xs font-semibold text-gray-600 capitalize">
                        {product.isActive ? "Active" : "Archived"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Icon
                          icon="material-symbols:edit-outline"
                          className="text-xl"
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Icon
                          icon="material-symbols:delete-outline"
                          className="text-xl"
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
        <div className="p-6 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 disabled:opacity-30 transition-all rounded-lg"
            >
              <Icon icon="material-symbols:chevron-left" className="text-2xl" />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 disabled:opacity-30 transition-all rounded-lg"
            >
              <Icon
                icon="material-symbols:chevron-right"
                className="text-2xl"
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
