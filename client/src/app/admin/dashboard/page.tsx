"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import api from "@/lib/axios";

const DashboardStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/stats");
        setStats(data.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      name: "Total Users",
      value: stats?.totalUsers ?? "—",
      icon: "material-symbols:group-outline",
      description: "Registered accounts",
    },
    {
      name: "Total Products",
      value: stats?.totalProducts ?? "—",
      icon: "material-symbols:shopping-bag-outline",
      description: "Active in catalog",
    },
    {
      name: "Total Orders",
      value: stats?.totalOrders ?? "—",
      icon: "material-symbols:list-alt-outline",
      description: "All time orders",
    },
    {
      name: "Total Sales",
      value: stats ? `₹${stats.totalSales?.toLocaleString() || 0}` : "—",
      icon: "material-symbols:account-balance-wallet-outline",
      description: "Delivered revenue",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header Card */}
      <div className="margin-top padding-around bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl px-8 py-7 shadow-sm text-center">
        <h3 className="text-xl font-semibold text-[var(--foreground)] tracking-tight">
          Dashboard Overview
        </h3>
        <p className="text-[var(--muted)] text-sm mt-1">
          A snapshot of your store's performance today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-36 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl animate-pulse"
              />
            ))
          : statCards.map((stat) => (
              <div
                key={stat.name}
                className="margin-top-lg padding-around bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-[var(--surface-alt)] text-[var(--accent-primary)] border border-[var(--card-border)]">
                  <Icon icon={stat.icon} className="text-[22px]" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[var(--foreground)] tracking-tight leading-none">
                    {stat.value}
                  </p>
                  <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mt-2">
                    {stat.name}
                  </p>
                  <p className="text-[10px] text-[var(--muted)] mt-0.5 opacity-60">
                    {stat.description}
                  </p>
                </div>
              </div>
            ))}
      </div>

      {/* Recent Transactions Card */}
      <div className="margin-top-lg padding-around bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--card-border)] flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)]">
              Recent Transactions
            </h4>
            <p className="text-[10px] text-[var(--muted)] mt-0.5">
              Last 5 orders placed
            </p>
          </div>
          <button className="text-xs font-semibold text-[var(--accent-primary)] hover:opacity-70 transition-opacity px-3 py-1.5 rounded-lg cursor-pointer">
            View all →
          </button>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-[var(--surface-alt)] rounded-lg animate-pulse w-full"
                />
              ))}
            </div>
          ) : !stats?.recentOrders?.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-[var(--muted)]">
              <Icon
                icon="material-symbols:receipt-long-outline"
                className="text-4xl mb-3 opacity-40"
              />
              <p className="text-sm font-medium">No transactions yet</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--surface)]">
                  {["Order ID", "Customer", "Amount", "Status", "Date"].map(
                    (col, i) => (
                      <th
                        key={col}
                        className={`px-6 py-3.5 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest border-b border-[var(--card-border)] ${i === 4 ? "text-right" : ""}`}
                      >
                        {col}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--card-border)]">
                {stats.recentOrders.map((order: any) => (
                  <tr
                    key={order._id}
                    className="hover:bg-[var(--surface-alt)] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-mono font-medium text-[var(--muted)]">
                      #{order.orderId?.slice(-6) ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[var(--foreground)] leading-tight">
                        {order.userId?.name || "Guest"}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        {order.userId?.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                      ₹{order.totalPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          order.orderStatus === "delivered"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : order.orderStatus === "cancelled"
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                              : order.orderStatus === "shipped"
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--muted)] text-right">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
