"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

interface CartItem {
  id: string;
  quantity: number;
}

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedCart = localStorage.getItem("cart");

    if (storedUser) {
      setIsLoggedIn(true);
    }

    if (storedCart) {
      try {
        const cart = JSON.parse(storedCart);
        setCartItems(cart);
        setCartCount(
          cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
        );
      } catch (e) {
        console.error("Error parsing cart:", e);
      }
    }
  }, []);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = (e: StorageEvent) => {
      if (e.key === "cart" && e.newValue) {
        try {
          const cart = JSON.parse(e.newValue);
          setCartItems(cart);
          setCartCount(
            cart.reduce(
              (sum: number, item: CartItem) => sum + item.quantity,
              0,
            ),
          );
        } catch (e) {
          console.error("Error parsing cart:", e);
        }
      }
      if (e.key === "user" && !e.newValue) {
        setIsLoggedIn(false);
      }
    };

    window.addEventListener("storage", handleCartUpdate);
    return () => window.removeEventListener("storage", handleCartUpdate);
  }, []);

  const handleAddToCart = () => {
    // Example function to update cart
    const newCart = [
      ...cartItems,
      { id: Math.random().toString(), quantity: 1 },
    ];
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartItems(newCart);
    setCartCount(
      newCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
    );
  };

  const handleLogin = () => {
    router.push("/auth/login");
    setShowUserDropdown(false);
  };

  const handleSignup = () => {
    router.push("/auth/signup");
    setShowUserDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setShowUserDropdown(false);
    router.push("/");
  };

  const handleProfile = () => {
    router.push("/user");
    setShowUserDropdown(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section - Top Left */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition duration-300 transform hover:scale-105">
                <Icon
                  icon="mdi:clothing-store"
                  width="32"
                  height="32"
                  className="text-indigo-600"
                />
                <span className="text-xl font-bold text-gray-800">Sera</span>
              </div>
            </Link>
          </div>

          {/* Navigation Elements - Middle */}
          <div className="hidden md:flex space-x-1">
            <Link
              href="/"
              className="px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium transition duration-300 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/shop"
              className="px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium transition duration-300 relative group"
            >
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/about"
              className="px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium transition duration-300 relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/contact"
              className="px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium transition duration-300 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Right Section - User Dropdown & Cart */}
          <div className="flex items-center space-x-6">
            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 focus:outline-none transition duration-300 p-2 hover:bg-gray-100 rounded-lg"
              >
                {isLoggedIn ? (
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                    <Icon
                      icon="mdi:account"
                      width="20"
                      height="20"
                      className="text-white"
                    />
                  </div>
                ) : (
                  <>
                    <Icon icon="mdi:account-circle" width="24" height="24" />
                    <span className="text-sm hidden sm:inline">Account</span>
                  </>
                )}
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 animate-fadeIn">
                  {isLoggedIn ? (
                    <>
                      <button
                        onClick={handleProfile}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition text-sm flex items-center space-x-2"
                      >
                        <Icon
                          icon="mdi:account-outline"
                          width="18"
                          height="18"
                        />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={() => router.push("/user")}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition text-sm flex items-center space-x-2"
                      >
                        <Icon
                          icon="mdi:package-outline"
                          width="18"
                          height="18"
                        />
                        <span>Orders</span>
                      </button>
                      <button
                        onClick={() => router.push("/user/settings")}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition text-sm flex items-center space-x-2"
                      >
                        <Icon icon="mdi:cog-outline" width="18" height="18" />
                        <span>Settings</span>
                      </button>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition text-sm font-medium flex items-center space-x-2"
                      >
                        <Icon icon="mdi:logout" width="18" height="18" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleLogin}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition text-sm flex items-center space-x-2"
                      >
                        <Icon icon="mdi:login" width="18" height="18" />
                        <span>Login</span>
                      </button>
                      <button
                        onClick={handleSignup}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition text-sm flex items-center space-x-2"
                      >
                        <Icon icon="mdi:account-plus" width="18" height="18" />
                        <span>Sign Up</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Icon - Top Right */}
            <Link href="/user/cart" className="relative">
              <button className="text-gray-700 hover:text-indigo-600 transition duration-300 p-2 hover:bg-gray-100 rounded-lg relative group">
                <Icon icon="mdi:shopping-cart" width="24" height="24" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md group-hover:scale-110 transition duration-300">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
