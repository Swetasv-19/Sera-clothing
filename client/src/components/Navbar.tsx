"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useTheme } from "@/hooks/useTheme";

interface CartItem {
  id: string;
  quantity: number;
}

export default function Navbar() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
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
    <nav className="shadow-md sticky top-0 z-50 transition duration-300" style={{ backgroundColor: 'var(--navbar-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section - Top Left */}
          <div className="shrink-0">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition duration-300 transform hover:scale-105">
                <Icon
                  icon="mdi:clothing-store"
                  width="32"
                  height="32"
                  className="text-indigo-600"
                />
                <span className="text-xl font-bold" style={{ color: 'var(--navbar-text)' }}>
                  Sera
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Elements - Middle */}
          <div className="hidden md:flex space-x-1">
            <Link
              href="/"
              className="px-3 py-2 font-medium transition duration-300 relative group cursor-pointer"
              style={{ color: 'var(--navbar-text)' }}
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ backgroundColor: 'var(--navbar-hover)' }}></span>
            </Link>
            <Link
              href="/shop"
              className="px-3 py-2 font-medium transition duration-300 relative group cursor-pointer"
              style={{ color: 'var(--navbar-text)' }}
            >
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ backgroundColor: 'var(--navbar-hover)' }}></span>
            </Link>
            <Link
              href="/contact"
              className="px-3 py-2 font-medium transition duration-300 relative group cursor-pointer"
              style={{ color: 'var(--navbar-text)' }}
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ backgroundColor: 'var(--navbar-hover)' }}></span>
            </Link>
          </div>

          {/* Right Section - User Dropdown & Cart */}
          <div className="flex items-center space-x-6">
            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 focus:outline-none transition duration-300 p-2 rounded-lg cursor-pointer"
                style={{ 
                  color: 'var(--navbar-text)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--navbar-border)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 z-10 animate-fadeIn" style={{ backgroundColor: 'var(--navbar-bg)', border: `1px solid var(--navbar-border)` }}>
                  {isLoggedIn ? (
                    <>
                      <button
                        onClick={handleProfile}
                        className="w-full text-left px-4 py-2 transition text-sm flex items-center space-x-2 cursor-pointer"
                        style={{ color: 'var(--navbar-text)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--navbar-border)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
                        className="w-full text-left px-4 py-2 transition text-sm flex items-center space-x-2 cursor-pointer"
                        style={{ color: 'var(--navbar-text)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--navbar-border)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
                        className="w-full text-left px-4 py-2 transition text-sm flex items-center space-x-2 cursor-pointer"
                        style={{ color: 'var(--navbar-text)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--navbar-border)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Icon icon="mdi:cog-outline" width="18" height="18" />
                        <span>Settings</span>
                      </button>
                      <hr className="my-2" style={{ borderColor: 'var(--navbar-border)' }} />
                      <button
                        onClick={toggleTheme}
                        className="w-full text-left px-4 py-2 transition text-sm flex items-center space-x-2 cursor-pointer"
                        style={{ color: 'var(--navbar-text)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--navbar-border)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Icon
                          icon={
                            isDarkMode
                              ? "mdi:white-balance-sunny"
                              : "mdi:moon-waning-crescent"
                          }
                          width="18"
                          height="18"
                        />
                        <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                      </button>
                      <hr className="my-2" style={{ borderColor: 'var(--navbar-border)' }} />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 transition text-sm font-medium flex items-center space-x-2 cursor-pointer"
                        style={{ color: '#dc2626' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Icon icon="mdi:logout" width="18" height="18" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleLogin}
                        className="w-full text-left px-4 py-2 transition text-sm flex items-center space-x-2 cursor-pointer"
                        style={{ color: 'var(--navbar-text)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--navbar-border)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Icon icon="mdi:login" width="18" height="18" />
                        <span>Login</span>
                      </button>
                      <button
                        onClick={handleSignup}
                        className="w-full text-left px-4 py-2 transition text-sm flex items-center space-x-2 cursor-pointer"
                        style={{ color: 'var(--navbar-text)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--navbar-border)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Icon icon="mdi:account-plus" width="18" height="18" />
                        <span>Sign Up</span>
                      </button>
                      <hr className="my-2" style={{ borderColor: 'var(--navbar-border)' }} />
                      <button
                        onClick={toggleTheme}
                        className="w-full text-left px-4 py-2 transition text-sm flex items-center space-x-2 cursor-pointer"
                        style={{ color: 'var(--navbar-text)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--navbar-border)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Icon
                          icon={
                            isDarkMode
                              ? "mdi:white-balance-sunny"
                              : "mdi:moon-waning-crescent"
                          }
                          width="18"
                          height="18"
                        />
                        <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Icon - Top Right */}
            <Link href="/user/cart" className="relative">
              <button className="transition duration-300 p-2 rounded-lg relative group cursor-pointer"
                style={{ 
                  color: 'var(--navbar-text)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--navbar-border)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
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
