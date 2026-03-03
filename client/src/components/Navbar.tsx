"use client";

import { useState, useEffect, useRef } from "react";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedCart = localStorage.getItem("cart");

    if (storedUser && storedToken) {
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
      if (e.key === "token" && !e.newValue) {
        setIsLoggedIn(false);
      }
    };

    window.addEventListener("storage", handleCartUpdate);
    return () => window.removeEventListener("storage", handleCartUpdate);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showUserDropdown]);

  const handleLogin = () => {
    router.push("/auth/login");
    setShowUserDropdown(false);
    setMobileMenuOpen(false);
  };

  const handleSignup = () => {
    router.push("/auth/signup");
    setShowUserDropdown(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowUserDropdown(false);
    setMobileMenuOpen(false);
    router.push("/");
  };

  const handleProfile = () => {
    router.push("/user");
    setShowUserDropdown(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300" style={{ backgroundColor: '#F0EDE5', borderBottom: '1px solid rgba(0, 70, 67, 0.2)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="group">
              <div className="flex items-center space-x-3 cursor-pointer transition-all duration-300 transform hover:scale-105">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:bg-opacity-90 transition-colors duration-300" style={{ backgroundColor: '#004643' }}>
                  <Icon
                    icon="mdi:clothing-store"
                    width="24"
                    height="24"
                    className="text-milk"
                  />
                </div>
                <span className="text-2xl font-bold font-serif group-hover:opacity-80 transition-colors duration-300" style={{ color: '#004643' }}>
                  Sera
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="font-medium hover:opacity-80 transition-colors duration-300 relative group px-2"
              style={{ color: '#004643' }}
            >
              Home
              <span
                className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                style={{ backgroundColor: '#381932' }}
              ></span>
            </Link>
            <Link
              href="/shop"
              className="font-medium hover:opacity-80 transition-colors duration-300 relative group px-2"
              style={{ color: '#004643' }}
            >
              Shop
              <span
                className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                style={{ backgroundColor: '#381932' }}
              ></span>
            </Link>
            <Link
              href="/collections"
              className="font-medium hover:opacity-80 transition-colors duration-300 relative group px-2"
              style={{ color: '#004643' }}
            >
              Collections
              <span
                className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                style={{ backgroundColor: '#381932' }}
              ></span>
            </Link>
            <Link
              href="/about"
              className="font-medium hover:opacity-80 transition-colors duration-300 relative group px-2"
              style={{ color: '#004643' }}
            >
              About
              <span
                className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                style={{ backgroundColor: '#381932' }}
              ></span>
            </Link>
            <Link
              href="/contact"
              className="font-medium hover:opacity-80 transition-colors duration-300 relative group px-2"
              style={{ color: '#004643' }}
            >
              Contact
              <span
                className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                style={{ backgroundColor: '#381932' }}
              ></span>
            </Link>
          </div>

          {/* Right Section - User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="transition-colors duration-300 p-2 rounded-lg hover:bg-opacity-50" style={{ color: '#004643' }}>
              <Icon icon="mdi:magnify" width="20" height="20" />
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="transition-colors duration-300 p-2 rounded-lg hover:bg-opacity-50"
                style={{ color: '#004643' }}
              >
                {isLoggedIn ? (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#381932' }}>
                    <Icon
                      icon="mdi:account"
                      width="18"
                      height="18"
                      className="text-white"
                    />
                  </div>
                ) : (
                  <Icon icon="mdi:account-circle" width="24" height="24" />
                )}
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl py-2 animate-fadeIn" style={{ backgroundColor: '#FFF3E6', border: '1px solid rgba(0, 70, 67, 0.2)' }}>
                  {isLoggedIn ? (
                    <>
                      <button
                        onClick={handleProfile}
                        className="w-full text-left px-4 py-3 transition-colors duration-200 flex items-center space-x-3 hover:bg-opacity-50"
                        style={{ color: '#004643' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0EDE5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Icon icon="mdi:account-outline" width="18" height="18" />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={() => router.push("/user")}
                        className="w-full text-left px-4 py-3 transition-colors duration-200 flex items-center space-x-3 hover:bg-opacity-50"
                        style={{ color: '#004643' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0EDE5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Icon icon="mdi:package-outline" width="18" height="18" />
                        <span>Orders</span>
                      </button>
                      <button
                        onClick={() => router.push("/user/settings")}
                        className="w-full text-left px-4 py-3 transition-colors duration-200 flex items-center space-x-3 hover:bg-opacity-50"
                        style={{ color: '#004643' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0EDE5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Icon icon="mdi:cog-outline" width="18" height="18" />
                        <span>Settings</span>
                      </button>
                      <hr style={{ borderColor: 'rgba(0, 70, 67, 0.2)' }} />
                      <button
                        onClick={toggleTheme}
                        className="w-full text-left px-4 py-3 transition-colors duration-200 flex items-center space-x-3 hover:bg-opacity-50"
                        style={{ color: '#004643' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0EDE5'}
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
                      <hr style={{ borderColor: 'rgba(0, 70, 67, 0.2)' }} />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 transition-colors duration-200 flex items-center space-x-3"
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
                        className="w-full text-left px-4 py-3 transition-colors duration-200 flex items-center space-x-3 hover:bg-opacity-50"
                        style={{ color: '#004643' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0EDE5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Icon icon="mdi:login" width="18" height="18" />
                        <span>Login</span>
                      </button>
                      <button
                        onClick={handleSignup}
                        className="w-full text-left px-4 py-3 transition-colors duration-200 flex items-center space-x-3 hover:bg-opacity-50"
                        style={{ color: '#004643' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0EDE5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Icon icon="mdi:account-plus" width="18" height="18" />
                        <span>Sign Up</span>
                      </button>
                      <hr style={{ borderColor: 'rgba(0, 70, 67, 0.2)' }} />
                      <button
                        onClick={toggleTheme}
                        className="w-full text-left px-4 py-3 transition-colors duration-200 flex items-center space-x-3 hover:bg-opacity-50"
                        style={{ color: '#004643' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0EDE5'}
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

            {/* Cart Icon */}
            <Link href="/user/cart" className="relative">
              <button className="transition-colors duration-300 p-2 rounded-lg hover:bg-opacity-50 relative" style={{ color: '#004643' }}>
                <Icon icon="mdi:shopping-cart" width="24" height="24" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse" style={{ backgroundColor: '#381932' }}>
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="transition-colors duration-300 p-2 rounded-lg hover:bg-opacity-50"
              style={{ color: '#004643' }}
            >
              <Icon
                icon={mobileMenuOpen ? "mdi:close" : "mdi:menu"}
                width="24"
                height="24"
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 animate-fadeIn" style={{ backgroundColor: '#FFF3E6', borderTop: '1px solid rgba(0, 70, 67, 0.2)' }}>
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="font-medium hover:opacity-80 transition-colors duration-300 px-4 py-2 rounded-lg"
                style={{ color: '#004643' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="font-medium hover:opacity-80 transition-colors duration-300 px-4 py-2 rounded-lg"
                style={{ color: '#004643' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/collections"
                className="font-medium hover:opacity-80 transition-colors duration-300 px-4 py-2 rounded-lg"
                style={{ color: '#004643' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Collections
              </Link>
              <Link
                href="/about"
                className="font-medium hover:opacity-80 transition-colors duration-300 px-4 py-2 rounded-lg"
                style={{ color: '#004643' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="font-medium hover:opacity-80 transition-colors duration-300 px-4 py-2 rounded-lg"
                style={{ color: '#004643' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
