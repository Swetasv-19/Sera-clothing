"use client";

import React from "react";
import UserTable from "@/components/admin/UserTable";

const AdminUsers = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            User Management
          </h2>
          <p className="text-gray-500 font-medium text-sm mt-1">
            View, search, and manage your customer accounts
          </p>
        </div>
      </div>

      <UserTable />
    </div>
  );
};

export default AdminUsers;
