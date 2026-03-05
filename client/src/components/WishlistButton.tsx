"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "default" | "minimal" | "outline";
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  className = "",
  size = "md",
  showText = false,
  variant = "default",
}) => {
  const { isInWishlist, toggleWishlist, loading } = useWishlist();
  const { user } = useAuth();

  const isInWishlisted = isInWishlist(productId);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const variantClasses = {
    default: isInWishlisted
      ? "bg-transparent border border-red-400"
      : "bg-[var(--surface-alt)] border border-[var(--card-border)] hover:bg-[var(--surface)]",
    minimal: "hover:text-red-400",
    outline: `border-2 ${
      isInWishlisted
        ? "border-red-400 bg-transparent"
        : "border-[var(--card-border)] bg-transparent hover:border-[var(--foreground)]"
    }`,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast("Login to save items to your wishlist", {
        icon: "🤍",
        style: {
          background: "var(--surface)",
          color: "var(--foreground)",
          border: "1px solid var(--divider)",
        },
      });
      return;
    }
    if (!loading) {
      toggleWishlist(productId);
    }
  };

  const baseClasses =
    "flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer";

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      title={isInWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-label={isInWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Icon
        icon={isInWishlisted ? "mdi:heart" : "mdi:heart-outline"}
        className={iconSizes[size]}
        style={{
          color: isInWishlisted ? "#ef4444" : "var(--muted)",
          transition: "color 0.2s",
        }}
      />
      {showText && (
        <span className="ml-2 text-sm font-medium">
          {isInWishlisted ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;
