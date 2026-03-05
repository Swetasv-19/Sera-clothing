"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "next/navigation";
import ProfileDropdown, { DropdownItem } from "@/components/ui/ProfileDropdown";

const Navbar = ({ title }: { title: string }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  return (
    <header className="header-admin h-16 shrink-0 bg-[var(--navbar-bg)] border-b border-[var(--navbar-border)] flex items-center justify-between px-8 sticky top-0 z-10 w-full transition-colors duration-300">
      <h2 className="text-base font-semibold text-[var(--foreground)] tracking-tight">
        {title}
      </h2>

      <div className="flex items-center gap-1">
        <div className="relative flex items-center gap-3 py-1">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 bg-transparent border-none text-left cursor-pointer transition-colors hover:opacity-80 rounded-md p-1"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-[var(--foreground)] leading-tight">
                {user.name || "Admin"}
              </p>
              <p className="text-xs text-[var(--muted)] capitalize">
                {user.role || "Super Admin"}
              </p>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[var(--foreground)] border border-[var(--card-border)] transition-colors ${
                isProfileOpen
                  ? "bg-[var(--surface-hover)]"
                  : "bg-[var(--surface-alt)]"
              }`}
            >
              <Icon
                icon="material-symbols:person-outline"
                className="text-[18px]"
              />
            </div>
          </button>

          <ProfileDropdown
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            items={[
              {
                icon: isDarkMode
                  ? "mdi:white-balance-sunny"
                  : "mdi:moon-waning-crescent",
                label: "Switch Theme",
              },
              {
                icon: "material-symbols:notifications-outline",
                label: "Notifications",
              },
              "separator",
              {
                icon: "material-symbols:logout",
                label: "Logout",
                action: handleLogout,
                danger: true,
              },
            ]}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
