"use client";

import React from "react";
import OrderTable from "@/components/admin/OrderTable";

const AdminOrders = () => {
  return (
    <div className="space-y-6">
      {/* Page Header Card */}
      <div className="margin-top padding-around bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl px-8 py-6 shadow-sm">
        <h3 className="text-xl font-semibold text-[var(--foreground)] tracking-tight">
          Order Management
        </h3>
        <p className="text-[var(--muted)] text-sm mt-1">
          Track and manage your customer orders.
        </p>
      </div>

      {/* Content Card */}
      <OrderTable />
    </div>
  );
};

export default AdminOrders;
