"use client";

import React from "react";
import ProductTable from "@/components/admin/ProductTable";

const AdminProducts = () => {
  return (
    <div className="space-y-6">
      {/* Page Header Card */}
      <div className="margin-top-lg padding-around bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl px-8 py-6 shadow-sm">
        <h3 className="text-xl font-semibold text-(--foreground) tracking-tight">
          Products Inventory
        </h3>
        <p className="text-[var(--muted)] text-sm mt-1">
          Manage your catalog, prices, and stock levels.
        </p>
      </div>

      {/* Content Card */}
      <ProductTable />
    </div>
  );
};

export default AdminProducts;
