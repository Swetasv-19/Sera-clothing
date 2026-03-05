import React, { useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";

export type DropdownItem = {
  icon: string;
  label: string;
  action?: () => void;
  href?: string;
  danger?: boolean;
};

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  items: (DropdownItem | "separator")[];
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="padding-around-s absolute right-0 top-[calc(100%+8px)] w-48 bg-[var(--card-bg)] border border-[var(--navbar-border)] rounded-lg shadow-lg overflow-hidden z-50 p-1 animate-fadeIn"
    >
      <div className="flex flex-col gap-1">
        {items.map((item, index) => {
          if (item === "separator") {
            return (
              <div
                key={`sep-${index}`}
                className="h-[1px] bg-[var(--navbar-border)] my-1 mx-3"
              />
            );
          }

          const isThemeToggle =
            item.label === "Switch Theme" ||
            item.label === "Light Mode" ||
            item.label === "Dark Mode";

          const iconToUse = isThemeToggle
            ? isDarkMode
              ? "mdi:white-balance-sunny"
              : "mdi:moon-waning-crescent"
            : item.icon;

          const labelToUse =
            isThemeToggle &&
            (item.label === "Light Mode" || item.label === "Dark Mode")
              ? isDarkMode
                ? "Light Mode"
                : "Dark Mode"
              : item.label;

          const baseClass = `padding-around-m flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all duration-200 ease-in-out group/item w-full text-left ${
            item.danger
              ? "text-red-500 hover:bg-red-500/10"
              : "text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
          }`;

          const iconClass = `text-[18px] shrink-0 w-4 h-4 opacity-80 group-hover/item:opacity-100 transition-opacity duration-200`;

          if (item.href) {
            return (
              <Link
                key={index}
                href={item.href}
                onClick={onClose}
                className={baseClass}
              >
                <Icon icon={iconToUse} className={iconClass} />
                {labelToUse}
              </Link>
            );
          }

          return (
            <button
              key={index}
              onClick={() => {
                if (isThemeToggle) {
                  toggleTheme();
                } else if (item.action) {
                  item.action();
                }
                if (!isThemeToggle) {
                  onClose();
                }
              }}
              className={baseClass}
            >
              <Icon icon={iconToUse} className={iconClass} />
              {labelToUse}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileDropdown;
