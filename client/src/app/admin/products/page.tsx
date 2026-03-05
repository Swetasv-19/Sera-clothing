"use client";

import React from "react";
import ProductTable from "@/components/admin/ProductTable";

const AdminProducts = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Products Inventory
          </h2>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Manage your catalog, prices, and stock levels
          </p>
        </div>
      </div>

      <ProductTable />
    </div>
  );
};

export default AdminProducts;
