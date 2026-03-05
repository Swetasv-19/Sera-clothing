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

  if (isLoading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-white rounded-2xl border border-gray-100 shadow-sm"
          />
        ))}
      </div>
    );

  const statCards = [
    {
      name: "Total Users",
      value: stats?.totalUsers || 0,
      icon: "material-symbols:group-outline",
      color: "blue",
    },
    {
      name: "Total Products",
      value: stats?.totalProducts || 0,
      icon: "material-symbols:shopping-bag-outline",
      color: "emerald",
    },
    {
      name: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: "material-symbols:list-alt-outline",
      color: "amber",
    },
    {
      name: "Total Sales",
      value: `₹${stats?.totalSales?.toLocaleString() || 0}`,
      icon: "material-symbols:account-balance-wallet-outline",
      color: "rose",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold tracking-tight text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-500`}
              >
                <Icon icon={stat.icon} className="text-2xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
          <button className="text-sm font-semibold text-gray-500 hover:text-black transition-colors">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 pt-0 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                  Order ID
                </th>
                <th className="pb-4 pt-0 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                  Customer
                </th>
                <th className="pb-4 pt-0 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                  Amount
                </th>
                <th className="pb-4 pt-0 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="pb-4 pt-0 font-semibold text-gray-500 text-xs uppercase tracking-wider text-right">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentOrders?.map((order: any) => (
                <tr
                  key={order.orderId}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-5 font-mono text-xs text-gray-400">
                    #{order.orderId.slice(-6)}
                  </td>
                  <td className="py-5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 leading-tight">
                        {order.userId?.name || "Guest"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {order.userId?.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 font-bold text-gray-900 leading-none">
                    ₹{order.totalPrice.toLocaleString()}
                  </td>
                  <td className="py-5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.orderStatus === "delivered"
                          ? "bg-emerald-50 text-emerald-600"
                          : order.orderStatus === "cancelled"
                            ? "bg-rose-50 text-rose-600"
                            : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-5 text-gray-500 text-sm font-medium text-right">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
