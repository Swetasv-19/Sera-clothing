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
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "shipped":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "cancelled":
        return "bg-rose-50 text-rose-600 border-rose-100";
      case "processing":
        return "bg-indigo-50 text-indigo-600 border-indigo-100";
      default:
        return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Total
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
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-400 font-medium"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order: any) => (
                <tr
                  key={order._id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-black uppercase tracking-tight">
                        #{order.orderId.slice(-6)}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 leading-tight">
                        {order.userId?.name || "Guest"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {order.userId?.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-700">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "Item" : "Items"}
                      </span>
                      <span className="text-[10px] text-gray-400 line-clamp-1">
                        {order.items.map((i: any) => i.name).join(", ")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">
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
                      className="text-xs font-bold bg-white border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-black transition-all"
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
    </div>
  );
};

export default OrderTable;
