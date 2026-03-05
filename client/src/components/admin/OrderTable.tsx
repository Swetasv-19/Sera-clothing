"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import api from "@/lib/axios";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/admin/orders?page=${page}&limit=10`);
      setOrders(data.data);
      setTotalPages(data.pages);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "shipped":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "cancelled":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "processing":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      default:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  return (
    <div className="margin-top padding-around bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] shadow-sm overflow-hidden transition-colors duration-300 block">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[var(--surface)]">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--card-border)]">
                Order
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--card-border)]">
                Customer
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--card-border)]">
                Items
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--card-border)]">
                Total
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
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="margin-top px-6 py-12 text-center text-[var(--muted)] font-medium"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order: any) => (
                <tr
                  key={order._id}
                  className="group hover:bg-[var(--surface-alt)] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-[var(--foreground)] uppercase tracking-tight">
                        #{order.orderId.slice(-6)}
                      </span>
                      <span className="text-[10px] text-[var(--muted)] font-medium uppercase tracking-widest">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[var(--foreground)] leading-tight">
                        {order.userId?.name || "Guest"}
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        {order.userId?.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[var(--foreground)]">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "Item" : "Items"}
                      </span>
                      <span className="text-[10px] text-[var(--muted)] line-clamp-1">
                        {order.items.map((i: any) => i.name).join(", ")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-[var(--foreground)]">
                      ₹{order.totalPrice.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.orderStatus)}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      className="text-xs font-bold bg-[var(--background)] text-[var(--foreground)] border border-[var(--card-border)] rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all"
                      value={order.orderStatus}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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
              className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-alt)] disabled:opacity-30 transition-all rounded-lg"
            >
              <Icon icon="material-symbols:chevron-left" className="text-2xl" />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-alt)] disabled:opacity-30 transition-all rounded-lg"
            >
              <Icon
                icon="material-symbols:chevron-right"
                className="text-2xl"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
