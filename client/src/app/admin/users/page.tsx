"use client";

import React from "react";
import UserTable from "@/components/admin/UserTable";

const AdminUsers = () => {
  return (
    <div className="space-y-6">
      {/* Page Header Card */}
      <div className="margin-top padding-around bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl px-8 py-6 shadow-sm">
        <h3 className="text-xl font-semibold text-[var(--foreground)] tracking-tight">
          User Management
        </h3>
        <p className="text-[var(--muted)] text-sm mt-1">
          View, search, and manage your customer accounts.
        </p>
      </div>

      {/* Content Card */}
      <UserTable />
    </div>
  );
};

export default AdminUsers;
