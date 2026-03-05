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
    window.location.href = "/";
  };

  return (
    <aside className="w-60 shrink-0 h-screen flex flex-col border-r border-[var(--card-border)] bg-[var(--card-bg)] hidden md:flex transition-colors duration-300">
      {/* Logo */}
      <div className="h-16 shrink-0 flex items-center px-6 border-b border-[var(--card-border)]">
        <span className="text-big text-xl font-bold tracking-tight text-[var(--foreground)]">
          SERA{" "}
          <span className="text-[var(--accent-primary)] font-medium">
            ADMIN
          </span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`margin-top padding-around flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ease-in-out group ${
                isActive
                  ? "bg-[var(--surface-active)] text-[var(--foreground)] font-medium"
                  : "text-[var(--foreground)] opacity-70 hover:opacity-100 hover:bg-[var(--surface-hover)]"
              }`}
            >
              <Icon
                icon={item.icon}
                className={`text-[18px] shrink-0 w-4 h-4 transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"}`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[var(--card-border)]">
        <button
          onClick={handleLogout}
          className="margin-top-lg padding-around flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-[var(--muted)] hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-150 font-medium group"
        >
          <Icon
            icon="material-symbols:logout"
            className="text-[18px] shrink-0 group-hover:text-rose-500 transition-colors"
          />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
