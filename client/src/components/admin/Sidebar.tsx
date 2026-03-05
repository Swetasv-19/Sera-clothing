"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: "material-symbols:dashboard-outline",
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: "material-symbols:shopping-bag-outline",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: "material-symbols:group-outline",
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: "material-symbols:list-alt-outline",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/admin/login";
  };

  return (
    <div
      className="w-64 border-r flex flex-col h-screen sticky top-0"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--divider)",
      }}
    >
      <div className="p-6 border-b" style={{ borderColor: "var(--divider)" }}>
        <span
          className="text-2xl font-bold tracking-tight font-serif"
          style={{ color: "var(--foreground)" }}
        >
          SERA{" "}
          <span style={{ color: "var(--muted)", fontWeight: 400 }}>ADMIN</span>
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                isActive ? "shadow-md" : "hover:bg-[rgba(0,0,0,0.05)]"
              }`}
              style={{
                backgroundColor: isActive
                  ? "var(--accent-primary)"
                  : "transparent",
                color: isActive ? "var(--background)" : "var(--foreground)",
              }}
            >
              <Icon icon={item.icon} className="text-xl" />
              <span className="font-semibold text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: "var(--divider)" }}>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 w-full rounded-xl transition-colors duration-200"
          style={{ color: "var(--accent-secondary)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(56, 25, 50, 0.05)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <Icon icon="material-symbols:logout" className="text-xl" />
          <span className="font-bold text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
