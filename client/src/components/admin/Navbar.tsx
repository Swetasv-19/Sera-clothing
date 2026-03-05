"use client";

import React from "react";
import { Icon } from "@iconify/react";

const Navbar = ({ title }: { title: string }) => {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  return (
    <header
      className="border-b h-16 flex items-center justify-between px-8 sticky top-0 z-10 w-full"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--divider)",
      }}
    >
      <h1
        className="text-xl font-bold font-serif"
        style={{ color: "var(--foreground)" }}
      >
        {title}
      </h1>

      <div className="flex items-center space-x-6">
        <button
          className="transition-colors"
          style={{ color: "var(--muted)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--foreground)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
        >
          <Icon
            icon="material-symbols:notifications-outline"
            className="text-2xl"
          />
        </button>

        <div
          className="flex items-center space-x-3 pl-6 border-l"
          style={{ borderColor: "var(--divider)" }}
        >
          <div className="text-right">
            <p
              className="text-sm font-bold"
              style={{ color: "var(--foreground)" }}
            >
              {user.name || "Admin"}
            </p>
            <p
              className="text-xs capitalize font-medium"
              style={{ color: "var(--muted)" }}
            >
              {user.role || "Super Admin"}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center border overflow-hidden"
            style={{
              backgroundColor: "var(--surface-alt)",
              borderColor: "var(--divider)",
              color: "var(--muted)",
            }}
          >
            <Icon icon="material-symbols:person-outline" className="text-2xl" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
