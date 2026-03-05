"use client";

import React from "react";
import OrderTable from "@/components/admin/OrderTable";

const AdminOrders = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Order Management
          </h2>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Track and manage your customer orders
          </p>
        </div>
      </div>

      <OrderTable />
    </div>
  );
};

export default AdminOrders;
